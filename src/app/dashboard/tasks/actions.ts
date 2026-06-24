'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { IS_DEMO } from '@/lib/demo-data'
import { TASK_STATUSES, PROJECT_PRIORITIES } from '@/lib/constants'

const Schema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PROJECT_PRIORITIES),
  due_date: z.string().optional().nullable(),
  completion_date: z.string().optional().nullable(),
  blocker: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  attachment_url: z.string().url().optional().nullable().or(z.literal(''))
})

function fromFormData(fd: FormData) {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) obj[k] = v === '' || v === 'null' ? null : v
  return obj
}

export async function createTask(_: unknown, formData: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath('/dashboard/tasks'); redirect('/dashboard/tasks') }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...parsed.data, attachment_url: parsed.data.attachment_url || null, created_by: profile.id })
    .select('id, title')
    .single()
  if (error) return { error: error.message }
  await logActivity(profile, 'task.created', 'task', data.id, data.title)
  revalidatePath('/dashboard/tasks')
  redirect(`/dashboard/tasks/${data.id}`)
}

export async function updateTask(id: string, _: unknown, formData: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath(`/dashboard/tasks/${id}`); return { ok: true } }
  const supabase = createClient()
  const { data: prev } = await supabase.from('tasks').select('status').eq('id', id).single()
  const { data, error } = await supabase
    .from('tasks').update({ ...parsed.data, attachment_url: parsed.data.attachment_url || null })
    .eq('id', id).select('id, title, status').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'task.updated', 'task', data.id, data.title)
  if (prev && prev.status !== data.status)
    await logActivity(profile, 'task.status_changed', 'task', data.id, data.title, { from: prev.status, to: data.status })
  revalidatePath('/dashboard/tasks')
  revalidatePath(`/dashboard/tasks/${id}`)
  return { ok: true }
}

export async function quickUpdateTaskStatus(id: string, status: typeof TASK_STATUSES[number]): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/tasks/${id}`); return }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks').update({ status, completion_date: status === 'Done' ? new Date().toISOString().slice(0,10) : null })
    .eq('id', id).select('id, title').single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'task.status_changed', 'task', data.id, data.title, { to: status })
  revalidatePath('/dashboard/tasks')
  revalidatePath(`/dashboard/tasks/${id}`)
}

export async function softDeleteTask(id: string): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/tasks'); redirect('/dashboard/tasks') }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks').update({ deleted_at: new Date().toISOString() })
    .eq('id', id).select('id, title').single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'task.deleted', 'task', data.id, data.title)
  revalidatePath('/dashboard/tasks')
  redirect('/dashboard/tasks')
}
