import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/dashboard/empty-state'
import { TaskStatusBadge, PriorityBadge } from '@/components/badges'
import { formatDate, isOverdue, cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

type SearchParams = { status?: string; priority?: string; project?: string; assigned?: string; q?: string; filter?: 'mine' | 'overdue' }

export default async function TasksListPage({ searchParams }: { searchParams: SearchParams }) {
  const profile = await requireProfile()
  const supabase = createClient()
  let query = supabase.from('tasks')
    .select('id, title, status, priority, due_date, assigned_to, project_id, assignee:profiles!tasks_assigned_to_fkey(full_name), project:projects(title)')
    .is('deleted_at', null)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.priority) query = query.eq('priority', searchParams.priority)
  if (searchParams.project) query = query.eq('project_id', searchParams.project)
  if (searchParams.assigned) query = query.eq('assigned_to', searchParams.assigned)
  if (searchParams.filter === 'mine') query = query.eq('assigned_to', profile.id)
  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)

  let { data: tasks } = await query
  if (searchParams.filter === 'overdue') {
    tasks = (tasks ?? []).filter(t => isOverdue(t.due_date, t.status))
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Execution layer — every task linked or standalone."
        action={
          <Button asChild>
            <Link href="/dashboard/tasks/new"><Plus className="h-4 w-4" /> New task</Link>
          </Button>
        }
      />

      <div className="flex gap-2 mb-4">
        <Button asChild variant={!searchParams.filter ? 'secondary' : 'ghost'} size="sm">
          <Link href="/dashboard/tasks">All tasks</Link>
        </Button>
        <Button asChild variant={searchParams.filter === 'mine' ? 'secondary' : 'ghost'} size="sm">
          <Link href="/dashboard/tasks?filter=mine">My tasks</Link>
        </Button>
        <Button asChild variant={searchParams.filter === 'overdue' ? 'secondary' : 'ghost'} size="sm">
          <Link href="/dashboard/tasks?filter=overdue">Overdue</Link>
        </Button>
      </div>

      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          {searchParams.filter && <input type="hidden" name="filter" value={searchParams.filter} />}
          <Input name="q" placeholder="Search by title…" defaultValue={searchParams.q ?? ''} className="max-w-xs" />
          <select name="status" defaultValue={searchParams.status ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All status</option>
            {['To Do','Doing','Review','Blocked','Done'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="priority" defaultValue={searchParams.priority ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All priority</option>
            {['High','Medium','Low'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </Card>

      {(!tasks || tasks.length === 0) ? (
        <EmptyState
          title="No tasks"
          description={searchParams.filter === 'mine' ? 'Nothing assigned to you yet.' : searchParams.filter === 'overdue' ? 'No overdue tasks.' : 'Create the first task.'}
          action={<Button asChild><Link href="/dashboard/tasks/new">New task</Link></Button>}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(t => {
                const overdue = isOverdue(t.due_date, t.status)
                return (
                  <TableRow key={t.id} className={cn(overdue && 'bg-amber-50/40')}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/tasks/${t.id}`} className="hover:underline">{t.title}</Link>
                      {overdue && <span className="ml-2 text-xs text-destructive">overdue</span>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {t.project_id ? <Link href={`/dashboard/projects/${t.project_id}`} className="hover:underline">{(t as any).project?.title ?? '—'}</Link> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-xs">{(t as any).assignee?.full_name ?? <span className="text-muted-foreground">unassigned</span>}</TableCell>
                    <TableCell className="text-xs">{formatDate(t.due_date)}</TableCell>
                    <TableCell><PriorityBadge value={t.priority} /></TableCell>
                    <TableCell><TaskStatusBadge value={t.status} /></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
