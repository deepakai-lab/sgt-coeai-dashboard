'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { logActivity } from '@/lib/activity'
import { slugify } from '@/lib/utils'
import { IS_DEMO } from '@/lib/demo-data'
import {
  PROJECT_STATUSES, PROJECT_PRIORITIES, PROJECT_TYPES, PUBLIC_VISIBILITY
} from '@/lib/constants'

const Schema = z.object({
  title: z.string().min(2).max(200),
  short_code: z.string().max(20).optional().nullable(),
  internal_description: z.string().optional().nullable(),
  public_description: z.string().optional().nullable(),
  project_type: z.enum(PROJECT_TYPES),
  owner_id: z.string().uuid().optional().nullable(),
  department: z.string().max(120).optional().nullable(),
  status: z.enum(PROJECT_STATUSES),
  priority: z.enum(PROJECT_PRIORITIES),
  start_date: z.string().optional().nullable(),
  target_date: z.string().optional().nullable(),
  completion_date: z.string().optional().nullable(),
  current_blocker: z.string().optional().nullable(),
  latest_update: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
  public_visibility_status: z.enum(PUBLIC_VISIBILITY),
  public_impact_statement: z.string().optional().nullable()
})

function fromFormData(fd: FormData) {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) {
    if (v === '' || v === 'null') obj[k] = null
    else obj[k] = v
  }
  return obj
}

export async function createProject(_: unknown, formData: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath('/dashboard/projects'); redirect('/dashboard/projects') }

  const supabase = createClient()
  const baseSlug = slugify(parsed.data.title)
  let slug = baseSlug
  for (let i = 2; i < 50; i++) {
    const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).is('deleted_at', null).maybeSingle()
    if (!existing) break
    slug = `${baseSlug}-${i}`
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, slug, created_by: profile.id, updated_by: profile.id })
    .select('id, title')
    .single()
  if (error) return { error: error.message }

  await logActivity(profile, 'project.created', 'project', data.id, data.title)
  revalidatePath('/dashboard/projects')
  redirect(`/dashboard/projects/${data.id}`)
}

export async function updateProject(id: string, _: unknown, formData: FormData) {
  const profile = await requireProfile()
  const parsed = Schema.safeParse(fromFormData(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  if (IS_DEMO) { revalidatePath(`/dashboard/projects/${id}`); return { ok: true } }

  const supabase = createClient()
  const { data: prev } = await supabase
    .from('projects')
    .select('public_visibility_status, title')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('projects')
    .update({ ...parsed.data, updated_by: profile.id })
    .eq('id', id)
    .select('id, title, public_visibility_status')
    .single()
  if (error) return { error: error.message }

  await logActivity(profile, 'project.updated', 'project', data.id, data.title)
  if (prev && prev.public_visibility_status !== data.public_visibility_status) {
    if (data.public_visibility_status === 'Published')
      await logActivity(profile, 'project.published', 'project', data.id, data.title)
    if (data.public_visibility_status === 'Unpublished')
      await logActivity(profile, 'project.unpublished', 'project', data.id, data.title)
  }

  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${id}`)
  return { ok: true }
}

export async function softDeleteProject(id: string): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/projects'); redirect('/dashboard/projects') }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString(), updated_by: profile.id })
    .eq('id', id)
    .select('id, title')
    .single()
  if (error) throw new Error(error.message)
  await logActivity(profile, 'project.deleted', 'project', data.id, data.title)
  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function setProjectVisibility(id: string, status: typeof PUBLIC_VISIBILITY[number]): Promise<void> {
  const profile = await requireProfile()
  if (IS_DEMO) { revalidatePath(`/dashboard/projects/${id}`); return }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update({ public_visibility_status: status, updated_by: profile.id })
    .eq('id', id)
    .select('id, title')
    .single()
  if (error) throw new Error(error.message)
  await logActivity(profile, status === 'Published' ? 'project.published' : status === 'Unpublished' ? 'project.unpublished' : 'project.visibility_changed', 'project', data.id, data.title, { status })
  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${id}`)
}
