import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createDemoClient } from './demo-client'
import { IS_DEMO } from '@/lib/demo-data'

export function createClient(): any {
  if (IS_DEMO) return createDemoClient()
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        }
      }
    }
  )
}

// Service-role client — bypasses RLS. Use ONLY in trusted server-side actions
// (e.g. writing to activity_logs from a verified session). Never expose to client.
import { createClient as createJsClient } from '@supabase/supabase-js'
export function createServiceClient(): any {
  if (IS_DEMO) return createDemoClient()
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
