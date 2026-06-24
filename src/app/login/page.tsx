'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, ArrowLeft } from 'lucide-react'

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || 'sgtuniversity.org'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

function LoginCard() {
  const params = useSearchParams()
  const router = useRouter()
  const error = params.get('error')
  const next = params.get('next') || '/dashboard'
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setBusy(true)
    if (IS_DEMO) {
      router.push(next)
      return
    }
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { hd: ALLOWED_DOMAIN, prompt: 'select_account' }
      }
    })
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-0.5 brand-bg rounded-3xl opacity-20 blur-xl" />
      <div className="relative rounded-3xl border bg-card overflow-hidden">
        <div className="h-1 brand-bg" />
        <div className="p-8 md:p-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8 group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" /> Back to public site
          </Link>

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-bg shadow-glow mb-6">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {IS_DEMO ? 'Preview the dashboard' : 'Welcome back'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {IS_DEMO ? (
              <>You&apos;re viewing the CoE AI Command Center in <span className="font-medium text-foreground">demo mode</span>. All data is sample data — perfect for previewing the product.</>
            ) : (
              <>Sign in to the CoE AI Command Center.<br />Only <span className="font-medium text-foreground">@{ALLOWED_DOMAIN}</span> Google accounts allowed.</>
            )}
          </p>

          {error === 'domain' && (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              That Google account isn&apos;t a <span className="font-medium">@{ALLOWED_DOMAIN}</span> address.
            </div>
          )}
          {error === 'oauth' && (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Sign-in didn&apos;t complete. Please try again.
            </div>
          )}

          <Button onClick={signIn} disabled={busy} className="w-full h-12 mt-8 shadow-glow text-base">
            {busy ? 'Loading…' : IS_DEMO ? (
              <><Sparkles className="h-4 w-4" /> Enter demo dashboard</>
            ) : (
              <><GoogleIcon /> Continue with Google</>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Not staff? You can browse the <Link href="/" className="text-primary hover:underline">public CoE AI site</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.2 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.8 6.6-14.9 0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative">
        <Suspense fallback={<div className="w-full max-w-md p-8 rounded-3xl border bg-card">Loading…</div>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  )
}
