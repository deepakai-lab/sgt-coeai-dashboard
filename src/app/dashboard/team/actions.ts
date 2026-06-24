'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { IS_DEMO } from '@/lib/demo-data'

const Schema = z.object({
  full_name: z.string().min(1).max(120),
  department: z.string().max(120).optional().nullable(),
  designation: z.string().max(120).optional().nullable(),
  show_on_public_team: z.string().optional().nullable(),
  public_bio: z.string().max(1000).optional().nullable(),
  public_photo_url: z.string().optional().nullable(),
  is_active: z.string().optional().nullable()
})

export async function updateProfile(id: string, fd: FormData) {
  await requireProfile()
  if (IS_DEMO) { revalidatePath('/dashboard/team'); return { ok: true } }
  const raw: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) raw[k] = v === '' ? null : v
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid input' }
  const supabase = createClient()
  const { error } = await supabase.from('profiles').update({
    full_name: parsed.data.full_name,
    department: parsed.data.department,
    designation: parsed.data.designation,
    show_on_public_team: parsed.data.show_on_public_team === 'on',
    public_bio: parsed.data.public_bio,
    public_photo_url: parsed.data.public_photo_url,
    is_active: parsed.data.is_active === 'on'
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/team')
  return { ok: true }
}
