'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { useToast } from '@/components/ui/use-toast'
import { TRAINING_AUDIENCES, TRAINING_CATEGORIES, TRAINING_STATUSES, DOC_VISIBILITY } from '@/lib/constants'
import type { TrainingModule, ProfileLite, DocVisibility } from '@/lib/db-types'

type Action = (state: unknown, fd: FormData) => Promise<{ error?: string; ok?: boolean } | void>
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>
}

export function TrainingForm({ initial, action, profiles, submitLabel = 'Save' }:
  { initial?: Partial<TrainingModule>; action: Action; profiles: ProfileLite[]; submitLabel?: string }) {
  const [state, formAction] = useFormState(action, null as { error?: string; ok?: boolean } | null)
  const [visibility, setVisibility] = useState<DocVisibility>(initial?.visibility ?? 'Internal Only')
  const { toast } = useToast()
  const router = useRouter()
  useEffect(() => {
    if (state?.error) toast({ title: 'Error', description: state.error, variant: 'destructive' })
    if (state?.ok) { toast({ title: 'Saved' }); router.refresh() }
  }, [state, toast, router])

  const bucket = visibility === 'Public' ? 'training-public' : 'training-private'

  return (
    <form action={formAction} className="space-y-4 max-w-3xl">
      <div>
        <Label className="mb-1.5 block">Title *</Label>
        <Input name="title" defaultValue={initial?.title ?? ''} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Audience *"><select name="audience" defaultValue={initial?.audience ?? 'Faculty'} className={sel}>{TRAINING_AUDIENCES.map(a => <option key={a}>{a}</option>)}</select></Field>
        <Field label="Department"><Input name="department" defaultValue={initial?.department ?? ''} /></Field>
        <Field label="Category *"><select name="training_category" defaultValue={initial?.training_category ?? 'AI Basics'} className={sel}>{TRAINING_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Status *"><select name="status" defaultValue={initial?.status ?? 'Draft'} className={sel}>{TRAINING_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Version"><Input name="version" defaultValue={initial?.version ?? 'v1'} /></Field>
        <Field label="Delivery date"><Input type="date" name="delivery_date" defaultValue={initial?.delivery_date ?? ''} /></Field>
        <Field label="Prepared by">
          <select name="prepared_by" defaultValue={initial?.prepared_by ?? ''} className={sel}>
            <option value="">—</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </Field>
        <Field label="Reviewed by">
          <select name="reviewed_by" defaultValue={initial?.reviewed_by ?? ''} className={sel}>
            <option value="">—</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Description"><Textarea name="description" defaultValue={initial?.description ?? ''} rows={3} /></Field>
      <Field label="Visibility *">
        <select name="visibility" value={visibility} onChange={e => setVisibility(e.target.value as DocVisibility)} className={sel}>
          {DOC_VISIBILITY.map(v => <option key={v}>{v}</option>)}
        </select>
        <p className="text-xs text-muted-foreground mt-1">Public modules with status Final/Delivered appear on the public Resources page.</p>
      </Field>
      <Field label="File (PDF, slides, doc)">
        <FileUpload name="file_url" bucket={bucket} defaultUrl={initial?.file_url ?? null} accept=".pdf,.ppt,.pptx,.doc,.docx" />
      </Field>
      <Field label="Notes"><Textarea name="notes" defaultValue={initial?.notes ?? ''} rows={2} /></Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}

const sel = 'h-9 rounded-md border bg-transparent px-2 text-sm w-full'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block">{label}</Label>{children}</div>
}
