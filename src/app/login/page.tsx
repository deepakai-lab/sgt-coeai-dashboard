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
    <div className="w-full max-w-md">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-12 group">
        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" /> Back to public site
      </Link>

      <div className="flex items-center gap-3 mb-12">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="display text-lg">C</span>
        </span>
        <div className="leading-tight">
          <div className="text-sm font-medium tracking-tight">Centre of Excellence for AI</div>
          <div className="text-[10px] text-muted-foreground mt-1 num uppercase tracking-wider">SGT University</div>
        </div>
      </div>

      <h1 className="display text-3xl md:text-4xl text-foreground leading-tight">
        {IS_DEMO ? <>Preview the <em>dashboard.</em></> : <>Sign in to <em>continue.</em></>}
      </h1>
      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
        {IS_DEMO ? (
          <>You&apos;re viewing the CoE AI Command Center in preview mode. Sample data, no writes persisted.</>
        ) : (
          <>Access restricted to <span className="num text-foreground">@{ALLOWED_DOMAIN}</span> Google accounts.</>
        )}
      </p>

      {error === 'domain' && (
        <div className="mt-6 border-l-2 border-destructive pl-3 py-1 text-sm text-destructive">
          That Google account isn&apos;t a <span className="num">@{ALLOWED_DOMAIN}</span> address.
        </div>
      )}
      {error === 'oauth' && (
        <div className="mt-6 border-l-2 border-destructive pl-3 py-1 text-sm text-destructive">
          Sign-in didn&apos;t complete. Try again.
        </div>
      )}

      <Button onClick={signIn} disabled={busy} className="w-full mt-10" size="lg">
        {busy ? 'Loading…' : IS_DEMO ? (
          <>Enter dashboard <ArrowRight className="h-4 w-4" /></>
        ) : (
          <><GoogleIcon /> Continue with Google</>
        )}
      </Button>

      <div className="hairline my-10" />

      <p className="text-xs text-muted-foreground text-center">
        Not staff? Browse the <Link href="/" className="text-primary hover:underline">public site</Link>.
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#FFC107" d="M21.8 12.2c0-.6-.1-1.3-.2-1.9H12v3.7h5.5c-.2 1.2-1 2.3-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z"/>
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2.1 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H2.9v2.6C4.6 19.9 8 22 12 22z"/>
      <path fill="#FBBC05" d="M6.3 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H2.9C2.3 8.9 2 10.4 2 12s.3 3.1.9 4.5l3.4-2.6z"/>
      <path fill="#EA4335" d="M12 5.8c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8 2 4.6 4.1 2.9 7.5l3.4 2.6C7.1 7.6 9.3 5.8 12 5.8z"/>
    </svg>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-background">
      <div className="absolute inset-0 line-grid opacity-40" />
      <div className="relative">
        <Suspense fallback={<div className="w-full max-w-md">Loading…</div>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  )
}
