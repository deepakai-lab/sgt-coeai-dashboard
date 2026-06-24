'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { IS_DEMO } from '@/lib/demo-data'
import { DOC_CATEGORIES, DOC_VISIBILITY } from '@/lib/constants'

const Schema = z.object({
  title: z.string().min(2).max(200),
  category: z.enum(DOC_CATEGORIES),
  project_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
  visibility: z.enum(DOC_VISIBILITY),
  version: z.string().max(40).optional().nullable()
})

function fromFormData(fd: FormData) {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) obj[k] = v === '' || v === 'null' ? null : v
  return obj
}

export async function createDocument(_: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath('/dashboard/documents'); redirect('/dashboard/documents') }
  const supabase = createClient()
  const { data, error } = await supabase.from('documents').insert({ ...parsed.data, uploaded_by: profile.id }).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'document.uploaded', 'document', data.id, data.title)
  revalidatePath('/dashboard/documents')
  redirect(`/dashboard/documents/${data.id}`)
}

export async function updateDocument(id: string, _: unknown, fd: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(fd))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath(`/dashboard/documents/${id}`); return { ok: true } }
  const supabase = createClient()
  const { data, error } = await supabase.from('documents').update(parsed.data).eq('id', id).select('id, title').single()
  if (error) return { error: error.message }
  await logActivity(profile, 'document.updated', 'document', data.id, data.title)
  revalidatePath('/dashboard/documents')
  revalidatePath(`/dashboard/documents/${id}`)
  return { ok: true }
}

export async function softDeleteDocument(id: string): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/documents'); redirect('/dashboard/documents') }
  const supabase = createClient()
  const { data, error } = await supabase.from('documents').update({ deleted_at: new Date().toISOString() }).eq('id', id).select('id, title').single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'document.deleted', 'document', data.id, data.title)
  revalidatePath('/dashboard/documents')
  redirect('/dashboard/documents')
}
