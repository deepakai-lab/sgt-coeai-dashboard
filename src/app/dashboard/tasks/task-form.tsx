'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { TASK_STATUSES, PROJECT_PRIORITIES } from '@/lib/constants'
import type { Task, ProfileLite } from '@/lib/db-types'

type Action = (state: unknown, fd: FormData) => Promise<{ error?: string; ok?: boolean } | void>

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>
}

export function TaskForm({
  initial, action, profiles, projects, defaultProjectId, submitLabel = 'Save'
}: {
  initial?: Partial<Task>
  action: Action
  profiles: ProfileLite[]
  projects: { id: string; title: string }[]
  defaultProjectId?: string
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
    <form action={formAction} className="space-y-4 max-w-2xl">
      <div>
        <Label className="mb-1.5 block">Title *</Label>
        <Input name="title" defaultValue={initial?.title ?? ''} required />
      </div>
      <div>
        <Label className="mb-1.5 block">Description</Label>
        <Textarea name="description" defaultValue={initial?.description ?? ''} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Project</Label>
          <select name="project_id" defaultValue={initial?.project_id ?? defaultProjectId ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            <option value="">— none —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Assignee</Label>
          <select name="assigned_to" defaultValue={initial?.assigned_to ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            <option value="">— unassigned —</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Status *</Label>
          <select name="status" defaultValue={initial?.status ?? 'To Do'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Priority *</Label>
          <select name="priority" defaultValue={initial?.priority ?? 'Medium'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            {PROJECT_PRIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Due date</Label>
          <Input type="date" name="due_date" defaultValue={initial?.due_date ?? ''} />
        </div>
        <div>
          <Label className="mb-1.5 block">Completion date</Label>
          <Input type="date" name="completion_date" defaultValue={initial?.completion_date ?? ''} />
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block">Blocker</Label>
        <Textarea name="blocker" defaultValue={initial?.blocker ?? ''} rows={2} />
      </div>
      <div>
        <Label className="mb-1.5 block">Remarks</Label>
        <Textarea name="remarks" defaultValue={initial?.remarks ?? ''} rows={2} />
      </div>
      <div>
        <Label className="mb-1.5 block">Attachment URL</Label>
        <Input name="attachment_url" type="url" defaultValue={initial?.attachment_url ?? ''} placeholder="https://..." />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
