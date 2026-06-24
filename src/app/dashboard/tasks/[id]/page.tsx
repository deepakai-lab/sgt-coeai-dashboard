import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TaskStatusBadge, PriorityBadge } from '@/components/badges'
import { formatDate, isOverdue } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { softDeleteTask, quickUpdateTaskStatus } from '../actions'
import { TASK_STATUSES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: task } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!tasks_assigned_to_fkey(full_name), creator:profiles!tasks_created_by_fkey(full_name), project:projects(id, title)')
    .eq('id', params.id).is('deleted_at', null).single()
  if (!task) notFound()

  const overdue = isOverdue(task.due_date, task.status)
  const deleteAction = softDeleteTask.bind(null, task.id)

  return (
    <>
      <PageHeader
        title={task.title}
        description={(task as any).project ? `Linked to project: ${(task as any).project.title}` : 'Standalone task'}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/tasks/${task.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
            </Button>
            <form action={deleteAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </form>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3">
            {task.description && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Description</div>
                <p className="whitespace-pre-wrap">{task.description}</p>
              </div>
            )}
            {task.blocker && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Blocker</div>
                <p className="whitespace-pre-wrap text-amber-900">{task.blocker}</p>
              </div>
            )}
            {task.remarks && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Remarks</div>
                <p className="whitespace-pre-wrap">{task.remarks}</p>
              </div>
            )}
            {task.attachment_url && (
              <div className="pt-2 border-t">
                <a href={task.attachment_url} target="_blank" className="text-primary underline text-sm">Open attachment →</a>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quick status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Row label="Status"><TaskStatusBadge value={task.status} /></Row>
              <Row label="Priority"><PriorityBadge value={task.priority} /></Row>
              <Row label="Due">{formatDate(task.due_date)}{overdue && <span className="ml-2 text-xs text-destructive">overdue</span>}</Row>
              <Row label="Completion">{formatDate(task.completion_date)}</Row>
              <Row label="Assignee">{(task as any).assignee?.full_name ?? '—'}</Row>
              <Row label="Created by">{(task as any).creator?.full_name ?? '—'}</Row>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-2">Move to</div>
                <div className="flex flex-wrap gap-1.5">
                  {TASK_STATUSES.filter(s => s !== task.status).map(s => {
                    const action = quickUpdateTaskStatus.bind(null, task.id, s)
                    return (
                      <form key={s} action={action}>
                        <Button type="submit" size="sm" variant="outline">{s}</Button>
                      </form>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  )
}
