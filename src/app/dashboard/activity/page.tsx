import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/dashboard/empty-state'

export const dynamic = 'force-dynamic'

export default async function ActivityLogPage({ searchParams }: { searchParams: { type?: string } }) {
  const supabase = createClient()
  let q = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(200)
  if (searchParams.type) q = q.eq('entity_type', searchParams.type)
  const { data: rows } = await q

  return (
    <>
      <PageHeader title="Activity log" description="Recent system events. Last 200 entries shown." />
      <Card className="mb-4 p-3">
        <form className="flex gap-2">
          <select name="type" defaultValue={searchParams.type ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All entities</option>
            {['project','task','meeting','document','training_module','feedback'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button type="submit" className="h-9 rounded-md border bg-secondary px-3 text-sm">Filter</button>
        </form>
      </Card>
      {(!rows || rows.length === 0) ? (
        <EmptyState title="No activity yet" description="Activity will appear as you create projects, tasks, MoMs, etc." />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow>
              <TableHead>When</TableHead><TableHead>Who</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Details</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="text-xs">{formatDateTime(a.created_at)}</TableCell>
                  <TableCell className="text-xs">{a.user_email?.split('@')[0] ?? '—'}</TableCell>
                  <TableCell className="text-xs"><code className="bg-muted px-1.5 py-0.5 rounded">{a.action}</code></TableCell>
                  <TableCell className="text-xs">
                    {a.entity_type}{a.entity_label && <> · <span className="font-medium">{a.entity_label}</span></>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {a.metadata && Object.keys(a.metadata).length > 0 ? JSON.stringify(a.metadata) : ''}
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
