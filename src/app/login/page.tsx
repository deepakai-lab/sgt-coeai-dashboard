'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight } from 'lucide-react'

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
    if (IS_DEMO) { router.push(next); return }
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
    <div className="w-full max-w-sm">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-12 group">
        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" /> Back
      </Link>

      <div className="flex items-center gap-2.5 mb-10">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card">
          <span className="font-mono text-xs font-medium tracking-tighter">CoE</span>
        </span>
        <div className="leading-none">
          <div className="text-sm font-medium tracking-tight">Centre of Excellence for AI</div>
          <div className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">SGT University</div>
        </div>
      </div>

      <h1 className="text-2xl font-medium tracking-tighter">
        {IS_DEMO ? 'Preview the dashboard' : 'Sign in'}
      </h1>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
        {IS_DEMO ? (
          <>You&apos;re viewing the CoE AI Command Center in preview mode. Sample data, no writes persisted.</>
        ) : (
          <>Access restricted to <span className="font-mono text-foreground">@{ALLOWED_DOMAIN}</span> Google accounts.</>
        )}
      </p>

      {error === 'domain' && (
        <div className="mt-6 border-l-2 border-destructive pl-3 py-1 text-sm text-destructive">
          That Google account isn&apos;t a <span className="font-mono">@{ALLOWED_DOMAIN}</span> address.
        </div>
      )}
      {error === 'oauth' && (
        <div className="mt-6 border-l-2 border-destructive pl-3 py-1 text-sm text-destructive">
          Sign-in didn&apos;t complete. Try again.
        </div>
      )}

      <Button onClick={signIn} disabled={busy} className="w-full mt-8" size="lg">
        {busy ? 'Loading…' : IS_DEMO ? (
          <>Enter dashboard <ArrowRight className="h-4 w-4" /></>
        ) : (
          <><GoogleIcon /> Continue with Google</>
        )}
      </Button>

      <div className="hairline my-10" />

      <p className="text-xs text-muted-foreground text-center">
        Not staff? Browse the <Link href="/" className="text-foreground hover:underline">public site</Link>.
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M21.8 10.5H12v3.9h5.6c-.5 2.5-2.5 3.6-5.6 3.6-3.4 0-6.1-2.7-6.1-6.1S8.6 5.8 12 5.8c1.5 0 2.8.5 3.8 1.4l2.9-2.9C16.9 2.7 14.6 1.8 12 1.8 6.4 1.8 1.8 6.4 1.8 12s4.6 10.2 10.2 10.2c5.1 0 9.7-3.7 9.7-10.2 0-.6-.1-1.1-.1-1.5z" opacity=".95"/>
    </svg>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 line-grid opacity-50" />
      <div className="relative">
        <Suspense fallback={<div className="w-full max-w-sm">Loading…</div>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  )
}
