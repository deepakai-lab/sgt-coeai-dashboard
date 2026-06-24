'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from './actions'
import { FEEDBACK_CATEGORIES } from '@/lib/constants'

export function FeedbackForm() {
  const [state, setState] = useState<{ status: 'idle' | 'submitting' | 'ok' | 'error'; message?: string }>({ status: 'idle' })

  async function action(formData: FormData) {
    setState({ status: 'submitting' })
    const res = await submitFeedback(formData)
    if (res.ok) setState({ status: 'ok' })
    else setState({ status: 'error', message: res.error })
  }

  if (state.status === 'ok') {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border mb-5">
          <span className="dot dot-live" />
        </div>
        <p className="font-medium tracking-tight">Received.</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Thank you. We&apos;ll get back to you if a response is needed.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Name *</Label>
          <Input name="name" required maxLength={120} />
        </div>
        <div>
          <Label className="mb-1.5 block">Email *</Label>
          <Input name="email" type="email" required maxLength={200} />
        </div>
        <div>
          <Label className="mb-1.5 block">Role</Label>
          <Input name="role" maxLength={80} placeholder="Student, Faculty, Visitor…" />
        </div>
        <div>
          <Label className="mb-1.5 block">Department / Organization</Label>
          <Input name="department_or_org" maxLength={120} />
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Category *</Label>
        <select name="category" defaultValue="General Feedback" required className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
          {FEEDBACK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <Label className="mb-1.5 block">Message *</Label>
        <Textarea name="message" required rows={5} maxLength={5000} />
      </div>

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>I consent to the CoE AI storing this message to respond to my feedback.</span>
      </label>

      {state.status === 'error' && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{state.message}</div>
      )}

      <Button type="submit" disabled={state.status === 'submitting'}>
        {state.status === 'submitting' ? 'Sending…' : 'Send feedback'}
      </Button>
    </form>
  )
}
