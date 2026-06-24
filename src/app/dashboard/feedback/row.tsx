'use client'
import { useState, useTransition } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FeedbackStatusBadge } from '@/components/badges'
import { formatDateTime } from '@/lib/utils'
import { FEEDBACK_STATUSES } from '@/lib/constants'
import { updateFeedback } from './actions'
import { useToast } from '@/components/ui/use-toast'
import type { Feedback } from '@/lib/db-types'

export function FeedbackRow({ f, profiles }: { f: Feedback; profiles: { id: string; full_name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, start] = useTransition()
  const { toast } = useToast()

  async function save(fd: FormData) {
    start(async () => {
      const r = await updateFeedback(f.id, fd)
      if (r?.error) toast({ title: 'Error', description: r.error, variant: 'destructive' })
      else toast({ title: 'Updated' })
    })
  }

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen(o => !o)}>
        <TableCell>
          <div className="font-medium">{f.name}</div>
          <div className="text-xs text-muted-foreground">{f.email}{f.role && ` · ${f.role}`}</div>
        </TableCell>
        <TableCell><Badge variant="muted">{f.category}</Badge></TableCell>
        <TableCell className="max-w-md"><p className="text-sm line-clamp-2">{f.message}</p></TableCell>
        <TableCell className="text-xs">{formatDateTime(f.created_at)}</TableCell>
        <TableCell><FeedbackStatusBadge value={f.status} /></TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30">
            <form action={save} className="space-y-3 py-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Full message</div>
                <p className="whitespace-pre-wrap text-sm">{f.message}</p>
                {f.department_or_org && <p className="text-xs text-muted-foreground mt-1">From: {f.department_or_org}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-xs block mb-1">Status</label>
                  <select name="status" defaultValue={f.status} className="h-9 rounded-md border bg-background px-2 text-sm">
                    {FEEDBACK_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1">Assign to</label>
                  <select name="assigned_to" defaultValue={f.assigned_to ?? ''} className="h-9 rounded-md border bg-background px-2 text-sm">
                    <option value="">— unassigned —</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs block mb-1">Admin notes (internal)</label>
                <Textarea name="admin_notes" defaultValue={f.admin_notes ?? ''} rows={2} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</Button>
              </div>
            </form>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
