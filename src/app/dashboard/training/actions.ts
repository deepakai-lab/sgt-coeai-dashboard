'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { IS_DEMO } from '@/lib/demo-data'
import { TRAINING_AUDIENCES, TRAINING_CATEGORIES, TRAINING_STATUSES, DOC_VISIBILITY } from '@/lib/constants'

const Schema = z.object({
  title: z.string().min(2).max(200),
  audience: z.enum(TRAINING_AUDIENCES),
  department: z.string().max(120).optional().nullable(),
  training_category: z.enum(TRAINING_CATEGORIES),
  description: z.string().optional().nullable(),
  status: z.enum(TRAINING_STATUSES),
  version: z.string().max(40).optional().nullable(),
  prepared_by: z.string().uuid().optional().nullable(),
  reviewed_by: z.string().uuid().optional().nullable(),
  delivery_date: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
  visibility: z.enum(DOC_VISIBILITY),
  notes: z.string().optional().nullable()
})

function fromFormData(fd: FormData) {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) obj[k] = v === '' || v === 'null' ? null : v
  return obj
}

export async function createTraining(_: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath('/dashboard/training'); redirect('/dashboard/training') }
  const supabase = createClient()
  const { data, error } = await supabase.from('training_modules').insert(parsed.data).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'training.created', 'training_module', data.id, data.title)
  revalidatePath('/dashboard/training')
  redirect(`/dashboard/training/${data.id}`)
}

export async function updateTraining(id: string, _: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath(`/dashboard/training/${id}`); return { ok: true } }
  const supabase = createClient()
  const { data, error } = await supabase.from('training_modules').update(parsed.data).eq('id', id).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'training.updated', 'training_module', data.id, data.title)
  revalidatePath('/dashboard/training')
  revalidatePath(`/dashboard/training/${id}`)
  return { ok: true }
}

export async function softDeleteTraining(id: string): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/training'); redirect('/dashboard/training') }
  const supabase = createClient()
  const { data, error } = await supabase.from('training_modules').update({ deleted_at: new Date().toISOString() }).eq('id', id).select('id, title').single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'training.deleted', 'training_module', data.id, data.title)
  revalidatePath('/dashboard/training')
  redirect('/dashboard/training')
}
