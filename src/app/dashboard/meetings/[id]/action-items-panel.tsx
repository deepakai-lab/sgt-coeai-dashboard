'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Check, Trash2, ArrowRight } from 'lucide-react'
import {
  addActionItem, updateActionItemStatus, deleteActionItem, convertActionItemToTask
} from '../actions'
import { ACTION_ITEM_STATUSES } from '@/lib/constants'
import type { MeetingActionItem, ProfileLite } from '@/lib/db-types'
import { formatDate } from '@/lib/utils'

type AIWithOwner = MeetingActionItem & { owner?: { full_name: string } | null }

export function ActionItemsPanel({
  meetingId, items, profiles
}: { meetingId: string; items: AIWithOwner[]; profiles: ProfileLite[] }) {
  const { toast } = useToast()
  const [isPending, start] = useTransition()
  const [open, setOpen] = useState(false)

  async function handleAdd(fd: FormData) {
    start(async () => {
      const res = await addActionItem(meetingId, fd)
      if (res?.error) toast({ title: 'Error', description: res.error, variant: 'destructive' })
      else { toast({ title: 'Added' }); setOpen(false) }
    })
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground">No action items yet.</p>}

      <ul className="divide-y">
        {items.map(it => (
          <li key={it.id} className="py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{it.action_item}</div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                {it.owner?.full_name && <span>Owner: {it.owner.full_name}</span>}
                {it.due_date && <span>Due {formatDate(it.due_date)}</span>}
                <Badge variant={it.status === 'Done' ? 'success' : it.status === 'In Progress' ? 'warning' : it.status === 'Cancelled' ? 'muted' : 'info'}>
                  {it.status}
                </Badge>
                {it.task_id && (
                  <Link href={`/dashboard/tasks/${it.task_id}`} className="text-primary hover:underline">→ task</Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!it.task_id && (
                <Button size="sm" variant="outline" disabled={isPending}
                  onClick={() => start(async () => {
                    const r = await convertActionItemToTask(it.id, meetingId)
                    if (r?.error) toast({ title: 'Error', description: r.error, variant: 'destructive' })
                    else toast({ title: 'Created task' })
                  })}>
                  <ArrowRight className="h-3.5 w-3.5" /> Convert to task
                </Button>
              )}
              <select
                className="h-7 text-xs rounded-md border bg-transparent px-1"
                value={it.status}
                disabled={isPending}
                onChange={e => start(async () => {
                  await updateActionItemStatus(it.id, e.target.value as any, meetingId)
                })}
              >
                {ACTION_ITEM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Button size="icon" variant="ghost" disabled={isPending}
                onClick={() => start(() => deleteActionItem(it.id, meetingId))}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!open ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>+ Add action item</Button>
      ) : (
        <form action={handleAdd} className="rounded-md border p-3 space-y-2">
          <div>
            <Label className="mb-1 block">Action item</Label>
            <Input name="action_item" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-1 block text-xs">Owner</Label>
              <select name="owner_id" className="h-9 w-full rounded-md border bg-transparent px-2 text-sm">
                <option value="">— unassigned —</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-1 block text-xs">Due date</Label>
              <Input type="date" name="due_date" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>
              <Check className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
