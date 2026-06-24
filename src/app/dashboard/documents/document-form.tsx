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
import { DOC_CATEGORIES, DOC_VISIBILITY } from '@/lib/constants'
import type { Document, DocVisibility } from '@/lib/db-types'

type Action = (state: unknown, fd: FormData) => Promise<{ error?: string; ok?: boolean } | void>
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>
}

export function DocumentForm({ initial, action, projects, submitLabel = 'Save' }:
  { initial?: Partial<Document>; action: Action; projects: { id: string; title: string }[]; submitLabel?: string }) {
  const [state, formAction] = useFormState(action, null as { error?: string; ok?: boolean } | null)
  const [visibility, setVisibility] = useState<DocVisibility>(initial?.visibility ?? 'Internal Only')
  const { toast } = useToast()
  const router = useRouter()
  useEffect(() => {
    if (state?.error) toast({ title: 'Error', description: state.error, variant: 'destructive' })
    if (state?.ok) { toast({ title: 'Saved' }); router.refresh() }
  }, [state, toast, router])

  const bucket = visibility === 'Public' ? 'documents-public' : 'documents-private'

  return (
    <form action={formAction} className="space-y-4 max-w-3xl">
      <div>
        <Label className="mb-1.5 block">Title *</Label>
        <Input name="title" defaultValue={initial?.title ?? ''} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">Category *</Label>
          <select name="category" defaultValue={initial?.category ?? 'Other'} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            {DOC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Visibility *</Label>
          <select name="visibility" value={visibility} onChange={e => setVisibility(e.target.value as DocVisibility)} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            {DOC_VISIBILITY.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Linked project</Label>
          <select name="project_id" defaultValue={initial?.project_id ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm w-full">
            <option value="">— none —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block">Version</Label>
          <Input name="version" defaultValue={initial?.version ?? 'v1'} />
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block">Description</Label>
        <Textarea name="description" defaultValue={initial?.description ?? ''} rows={3} />
      </div>
      <div>
        <Label className="mb-1.5 block">File</Label>
        <FileUpload name="file_url" bucket={bucket} defaultUrl={initial?.file_url ?? null} />
        <p className="text-xs text-muted-foreground mt-1">Public documents are stored in a public bucket. Internal/Restricted documents use signed URLs.</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
