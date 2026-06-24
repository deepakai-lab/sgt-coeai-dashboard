import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { MEETING_TYPES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

type SP = { type?: string; project?: string; q?: string }

export default async function MeetingsPage({ searchParams }: { searchParams: SP }) {
  const supabase = createClient()
  let q = supabase.from('meetings')
    .select('id, title, meeting_date, meeting_type, project_id, project:projects(title)')
    .is('deleted_at', null)
    .order('meeting_date', { ascending: false })
  if (searchParams.type) q = q.eq('meeting_type', searchParams.type)
  if (searchParams.project) q = q.eq('project_id', searchParams.project)
  if (searchParams.q) q = q.ilike('title', `%${searchParams.q}%`)
  const { data: meetings } = await q

  return (
    <>
      <PageHeader title="Meetings (MoM)" description="Decisions documented, action items tracked." action={
        <Button asChild><Link href="/dashboard/meetings/new"><Plus className="h-4 w-4" /> New MoM</Link></Button>
      } />
      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          <Input name="q" placeholder="Search by title…" defaultValue={searchParams.q ?? ''} className="max-w-xs" />
          <select name="type" defaultValue={searchParams.type ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All types</option>
            {MEETING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </Card>
      {(!meetings || meetings.length === 0) ? (
        <EmptyState title="No meetings recorded" action={<Button asChild><Link href="/dashboard/meetings/new">Add first MoM</Link></Button>} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {meetings.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/meetings/${m.id}`} className="hover:underline">{m.title}</Link>
                  </TableCell>
                  <TableCell className="text-xs">{m.meeting_date}</TableCell>
                  <TableCell><Badge variant="muted">{m.meeting_type}</Badge></TableCell>
                  <TableCell className="text-xs">
                    {m.project_id ? <Link href={`/dashboard/projects/${m.project_id}`} className="hover:underline">{(m as any).project?.title}</Link> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
