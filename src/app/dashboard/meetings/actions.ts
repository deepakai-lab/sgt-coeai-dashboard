'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { IS_DEMO } from '@/lib/demo-data'
import { MEETING_TYPES, ACTION_ITEM_STATUSES } from '@/lib/constants'

const MeetingSchema = z.object({
  title: z.string().min(2).max(200),
  meeting_date: z.string().min(1),
  meeting_type: z.enum(MEETING_TYPES),
  project_id: z.string().uuid().optional().nullable(),
  attendees: z.string().optional().nullable(),
  agenda: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  key_decisions: z.string().optional().nullable(),
  next_steps: z.string().optional().nullable(),
  next_meeting_date: z.string().optional().nullable()
})

function parseAttendees(s: string | null | undefined): string[] {
  if (!s) return []
  return s.split(/[,\n]/).map(x => x.trim()).filter(Boolean)
}

function fromFormData(fd: FormData) {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) obj[k] = v === '' || v === 'null' ? null : v
  return obj
}

export async function createMeeting(_: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = MeetingSchema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath('/dashboard/meetings'); redirect('/dashboard/meetings') }
  const supabase = createClient()
  const { data, error } = await supabase.from('meetings').insert({
    ...parsed.data,
    attendees: parseAttendees(parsed.data.attendees),
    created_by: profile.id
  }).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'meeting.created', 'meeting', data.id, data.title)
  revalidatePath('/dashboard/meetings')
  redirect(`/dashboard/meetings/${data.id}`)
}

export async function updateMeeting(id: string, _: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = MeetingSchema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath(`/dashboard/meetings/${id}`); return { ok: true } }
  const supabase = createClient()
  const { data, error } = await supabase.from('meetings').update({
    ...parsed.data,
    attendees: parseAttendees(parsed.data.attendees)
  }).eq('id', id).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'meeting.updated', 'meeting', data.id, data.title)
  revalidatePath('/dashboard/meetings')
  revalidatePath(`/dashboard/meetings/${id}`)
  return { ok: true }
}

export async function softDeleteMeeting(id: string): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/meetings'); redirect('/dashboard/meetings') }
  const supabase = createClient()
  const { data, error } = await supabase.from('meetings').update({ deleted_at: new Date().toISOString() }).eq('id', id).select('id, title').single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'meeting.deleted', 'meeting', data.id, data.title)
  revalidatePath('/dashboard/meetings')
  redirect('/dashboard/meetings')
}

// Action items ----------------------------------------------------------------
const ActionItemSchema = z.object({
  meeting_id: z.string().uuid(),
  action_item: z.string().min(2).max(500),
  owner_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
  status: z.enum(ACTION_ITEM_STATUSES).optional()
})

export async function addActionItem(meetingId: string, fd: FormData) {
  await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/meetings/${meetingId}`); return { ok: true } }
  const parsed = ActionItemSchema.safeParse({
    meeting_id: meetingId,
    action_item: fd.get('action_item'),
    owner_id: (fd.get('owner_id') || null) as string | null || null,
    due_date: (fd.get('due_date') || null) as string | null || null
  })
  if (!parsed.success) return { error: 'Invalid input' }
  const supabase = createClient()
  const { error } = await supabase.from('meeting_action_items').insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/meetings/${meetingId}`)
  return { ok: true }
}

export async function updateActionItemStatus(id: string, status: typeof ACTION_ITEM_STATUSES[number], meetingId: string) {
  await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/meetings/${meetingId}`); return { ok: true } }
  const supabase = createClient()
  const { error } = await supabase.from('meeting_action_items').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/meetings/${meetingId}`)
  return { ok: true }
}

export async function deleteActionItem(id: string, meetingId: string) {
  await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/meetings/${meetingId}`); return }
  const supabase = createClient()
  await supabase.from('meeting_action_items').delete().eq('id', id)
  revalidatePath(`/dashboard/meetings/${meetingId}`)
}

// Convert an action item to a task. Idempotent: if task_id already set, no-op.
export async function convertActionItemToTask(actionItemId: string, meetingId: string) {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/meetings/${meetingId}`); return { ok: true, taskId: 'demo-task' } }
  const supabase = createClient()

  // Atomic guard: read current state, only create if unconverted
  const { data: ai } = await supabase
    .from('meeting_action_items')
    .select('id, task_id, action_item, owner_id, due_date, meeting_id, meeting:meetings(title, project_id)')
    .eq('id', actionItemId).single()
  if (!ai) return { error: 'Action item not found' }
  if (ai.task_id) return { ok: true, taskId: ai.task_id }

  const meeting = (ai as any).meeting as { title: string; project_id: string | null } | null
  const { data: task, error: taskErr } = await supabase.from('tasks').insert({
    title: ai.action_item.slice(0, 200),
    description: `Auto-created from MoM: ${meeting?.title ?? ''}`,
    project_id: meeting?.project_id ?? null,
    assigned_to: ai.owner_id,
    due_date: ai.due_date,
    status: 'To Do',
    priority: 'Medium',
    created_by: profile.id
  }).select('id, title').single()
  if (taskErr || !task) return { error: taskErr?.message ?? 'Could not create task' }

  // Link back, guarded against concurrent conversions
  const { error: linkErr } = await supabase
    .from('meeting_action_items')
    .update({ task_id: task.id })
    .eq('id', actionItemId)
    .is('task_id', null) // <— prevents double-creation race
  if (linkErr) return { error: linkErr.message }

  await logActivity(profile, 'task.created_from_mom', 'task', task.id, task.title, { from_action_item: actionItemId })
  revalidatePath(`/dashboard/meetings/${meetingId}`)
  return { ok: true, taskId: task.id }
}
