'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { MEETING_TYPES } from '@/lib/constants'
import type { Meeting } from '@/lib/db-types'

type Action = (state: unknown, fd: FormData) => Promise<{ error?: string; ok?: boolean } | void>

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>
}

export function MeetingForm({
  initial, action, projects, defaultProjectId, submitLabel = 'Save'
}: {
  initial?: Partial<Meeting>
  action: Action
  projects: { id: string; title: string }[]
  defaultProjectId?: string
  submitLabel?: string
}) {
  const [state, formAction] = useFormState(action, null as { error?: string; ok?: boolean } | null)
  const { toast } = useToast()
  const router = useRouter()
  useEffect(() => {
    if (state?.error) toast({ title: 'Error', description: state.error, variant: 'destructive' })
    if (state?.ok) { toast({ title: 'Saved' }); router.refresh() }
  }, [state, toast, router])

  return (
    <form action={formAction} className="space-y-4 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="mb-1.5 block">Title *</Label>
          <Input name="title" defaultValue={initial?.title ?? ''} required />
        </div>
        <div>
          <Label className="mb-1.5 block">Date *</Label>
          <Input type="date" name="meeting_date" defaultValue={initial?.meeting_date ?? new Date().toISOString().slice(0,10)} required />
        </div>
        <div>
          <Label className="mb-1.5 block">Type *</Label>
          <select name="meeting_type" defaultValue={initial?.meeting_type ?? 'Internal CoE Meeting'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            {MEETING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Linked project</Label>
          <select name="project_id" defaultValue={initial?.project_id ?? defaultProjectId ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            <option value="">— none —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Attendees</Label>
          <Input name="attendees" defaultValue={(initial?.attendees ?? []).join(', ')} placeholder="Comma-separated names" />
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Agenda</Label>
          <Textarea name="agenda" defaultValue={initial?.agenda ?? ''} rows={3} />
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Summary</Label>
          <Textarea name="summary" defaultValue={initial?.summary ?? ''} rows={3} />
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Key decisions</Label>
          <Textarea name="key_decisions" defaultValue={initial?.key_decisions ?? ''} rows={3} />
        </div>
        <div className="col-span-2">
          <Label className="mb-1.5 block">Next steps</Label>
          <Textarea name="next_steps" defaultValue={initial?.next_steps ?? ''} rows={2} />
        </div>
        <div>
          <Label className="mb-1.5 block">Next meeting date</Label>
          <Input type="date" name="next_meeting_date" defaultValue={initial?.next_meeting_date ?? ''} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
