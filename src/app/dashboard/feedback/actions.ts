'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { IS_DEMO } from '@/lib/demo-data'
import { FEEDBACK_STATUSES } from '@/lib/constants'

export async function updateFeedback(id: string, fd: FormData) {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/feedback'); return { ok: true } }
  const status = fd.get('status') as typeof FEEDBACK_STATUSES[number] | null
  const assigned_to = (fd.get('assigned_to') as string | null) || null
  const admin_notes = (fd.get('admin_notes') as string | null) || null
  const update: Record<string, unknown> = { admin_notes, assigned_to: assigned_to || null }
  if (status) update.status = status
  const supabase = createClient()
  const { data, error } = await supabase.from('feedback').update(update).eq('id', id).select('id, name').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'feedback.updated', 'feedback', data.id, data.name, { status })
  revalidatePath('/dashboard/feedback')
  return { ok: true }
}
