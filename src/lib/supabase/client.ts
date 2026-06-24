import { createBrowserClient } from '@supabase/ssr'
import { createDemoClient } from './demo-client'

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function createClient(): any {
  if (IS_DEMO) return createDemoClient()
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
