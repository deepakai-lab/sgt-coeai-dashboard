import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/dashboard/empty-state'
import { StatusBadge, PriorityBadge, VisibilityBadge } from '@/components/badges'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

type SearchParams = { status?: string; priority?: string; type?: string; q?: string; visibility?: string }

export default async function ProjectsListPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient()
  let query = supabase.from('projects')
    .select('id, title, slug, status, priority, project_type, owner_id, target_date, public_visibility_status, latest_update, updated_at, owner:profiles!projects_owner_id_fkey(full_name)')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.priority) query = query.eq('priority', searchParams.priority)
  if (searchParams.type) query = query.eq('project_type', searchParams.type)
  if (searchParams.visibility) query = query.eq('public_visibility_status', searchParams.visibility)
  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)

  const { data: projects } = await query

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every CoE AI project in one place. Internal-by-default."
        action={
          <Button asChild>
            <Link href="/dashboard/projects/new"><Plus className="h-4 w-4" /> New project</Link>
          </Button>
        }
      />

      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          <Input
            name="q"
            placeholder="Search by title…"
            defaultValue={searchParams.q ?? ''}
            className="max-w-xs"
          />
          <select name="status" defaultValue={searchParams.status ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All status</option>
            {['Idea','Planned','In Progress','Testing','Live','Paused','Closed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="priority" defaultValue={searchParams.priority ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All priority</option>
            {['High','Medium','Low'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="visibility" defaultValue={searchParams.visibility ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All visibility</option>
            {['Private','Public Draft','Pending Approval','Published','Unpublished'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
          {(searchParams.q || searchParams.status || searchParams.priority || searchParams.visibility) && (
            <Button asChild variant="ghost"><Link href="/dashboard/projects">Reset</Link></Button>
          )}
        </form>
      </Card>

      {(!projects || projects.length === 0) ? (
        <EmptyState
          title="No projects yet"
          description="Create the first project to start tracking CoE AI work."
          action={<Button asChild><Link href="/dashboard/projects/new">Create project</Link></Button>}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/projects/${p.id}`} className="hover:underline">{p.title}</Link>
                    {p.latest_update && <div className="text-xs text-muted-foreground line-clamp-1">{p.latest_update}</div>}
                  </TableCell>
                  <TableCell><StatusBadge value={p.status} /></TableCell>
                  <TableCell><PriorityBadge value={p.priority} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.project_type}</TableCell>
                  <TableCell className="text-xs">{(p as any).owner?.full_name ?? '—'}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.target_date)}</TableCell>
                  <TableCell><VisibilityBadge value={p.public_visibility_status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
