import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IS_DEMO, DEMO_USER } from '@/lib/demo-data'

export type Profile = {
  id: string
  full_name: string
  email: string
  department: string | null
  designation: string | null
  is_active: boolean
  show_on_public_team: boolean
  public_bio: string | null
  public_photo_url: string | null
}

export async function getSessionProfile(): Promise<Profile | null> {
  if (IS_DEMO) return DEMO_USER as Profile
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return profile as Profile | null
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getSessionProfile()
  if (!profile) redirect('/login')
  return profile
}
