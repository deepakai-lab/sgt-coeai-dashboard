import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'sgtuniversity.org'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) return NextResponse.redirect(`${origin}/login?error=oauth`)

  const supabase = createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) return NextResponse.redirect(`${origin}/login?error=oauth`)

  const email = data.user.email?.toLowerCase() ?? ''
  if (!email.endsWith('@' + ALLOWED_DOMAIN)) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/login?error=domain`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
