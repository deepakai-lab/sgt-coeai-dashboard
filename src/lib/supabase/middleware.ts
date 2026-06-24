import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'sgtuniversity.org'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function updateSession(request: NextRequest) {
  // Demo mode: skip all auth, let everyone into /dashboard
  if (IS_DEMO) return NextResponse.next({ request: { headers: request.headers } })

  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isDashboard = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')

  // Domain enforcement — defense in depth on top of Google "hosted domain" hint
  if (user?.email && !user.email.toLowerCase().endsWith('@' + ALLOWED_DOMAIN)) {
    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'domain')
    return NextResponse.redirect(url)
  }

  if (isDashboard && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}
