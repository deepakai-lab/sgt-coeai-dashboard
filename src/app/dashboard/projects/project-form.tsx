'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  PROJECT_STATUSES, PROJECT_PRIORITIES, PROJECT_TYPES, PUBLIC_VISIBILITY
} from '@/lib/constants'
import type { Project, ProfileLite } from '@/lib/db-types'

type Action = (state: unknown, formData: FormData) => Promise<{ error?: string; ok?: boolean } | void>

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>
}

export function ProjectForm({
  initial, action, profiles, submitLabel = 'Save'
}: {
  initial?: Partial<Project>
  action: Action
  profiles: ProfileLite[]
  submitLabel?: string
}) {
  const [state, formAction] = useFormState(action, null as { error?: string; ok?: boolean } | null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (state?.error) toast({ title: 'Could not save', description: state.error, variant: 'destructive' })
    if (state?.ok) { toast({ title: 'Saved' }); router.refresh() }
  }, [state, toast, router])

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
      )}

      <Section title="Basics">
        <Field label="Title *">
          <Input name="title" defaultValue={initial?.title ?? ''} required />
        </Field>
        <Field label="Short code">
          <Input name="short_code" defaultValue={initial?.short_code ?? ''} placeholder="e.g. FAT-01" />
        </Field>
        <Field label="Project type *">
          <select name="project_type" defaultValue={initial?.project_type ?? 'Internal Operations'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full" required>
            {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Owner">
          <select name="owner_id" defaultValue={initial?.owner_id ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            <option value="">— unassigned —</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </Field>
        <Field label="Department / College">
          <Input name="department" defaultValue={initial?.department ?? ''} />
        </Field>
      </Section>

      <Section title="Status">
        <Field label="Status *">
          <select name="status" defaultValue={initial?.status ?? 'Idea'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full" required>
            {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Priority *">
          <select name="priority" defaultValue={initial?.priority ?? 'Medium'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full" required>
            {PROJECT_PRIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Start date">
          <Input type="date" name="start_date" defaultValue={initial?.start_date ?? ''} />
        </Field>
        <Field label="Target date">
          <Input type="date" name="target_date" defaultValue={initial?.target_date ?? ''} />
        </Field>
        <Field label="Actual completion">
          <Input type="date" name="completion_date" defaultValue={initial?.completion_date ?? ''} />
        </Field>
      </Section>

      <Section title="Internal (never public)" className="bg-muted/40 border rounded-lg p-4">
        <Field label="Internal description" full>
          <Textarea name="internal_description" defaultValue={initial?.internal_description ?? ''} rows={3} />
        </Field>
        <Field label="Latest update" full>
          <Textarea name="latest_update" defaultValue={initial?.latest_update ?? ''} rows={2} placeholder="Shown on dashboard cards." />
        </Field>
        <Field label="Current blocker" full>
          <Textarea name="current_blocker" defaultValue={initial?.current_blocker ?? ''} rows={2} />
        </Field>
        <Field label="Internal notes" full>
          <Textarea name="internal_notes" defaultValue={initial?.internal_notes ?? ''} rows={3} placeholder="Confidential — vendor names, costs, sensitive context." />
        </Field>
      </Section>

      <Section title="Public surface" className="border rounded-lg p-4">
        <Field label="Public description" full>
          <Textarea name="public_description" defaultValue={initial?.public_description ?? ''} rows={3} placeholder="What outsiders should know. Do NOT reuse internal description." />
        </Field>
        <Field label="Public impact statement" full>
          <Textarea name="public_impact_statement" defaultValue={initial?.public_impact_statement ?? ''} rows={2} placeholder="One-line measurable outcome." />
        </Field>
        <Field label="Visibility status *">
          <select name="public_visibility_status" defaultValue={initial?.public_visibility_status ?? 'Private'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full" required>
            {PUBLIC_VISIBILITY.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Only &quot;Published&quot; appears on the public portal.</p>
        </Field>
      </Section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  )
}
