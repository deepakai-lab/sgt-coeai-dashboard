import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FeedbackStatusBadge } from '@/components/badges'
import { formatDateTime } from '@/lib/utils'
import { EmptyState } from '@/components/dashboard/empty-state'
import { FeedbackRow } from './row'
import { FEEDBACK_STATUSES, FEEDBACK_CATEGORIES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

type SP = { status?: string; category?: string; assigned?: string }

export default async function FeedbackInboxPage({ searchParams }: { searchParams: SP }) {
  const supabase = createClient()
  let q = supabase.from('feedback').select('*').order('created_at', { ascending: false })
  if (searchParams.status) q = q.eq('status', searchParams.status)
  if (searchParams.category) q = q.eq('category', searchParams.category)
  if (searchParams.assigned) q = q.eq('assigned_to', searchParams.assigned)
  const { data: rows } = await q
  const { data: profiles } = await supabase.from('profiles').select('id, full_name').order('full_name')

  return (
    <>
      <PageHeader title="Feedback inbox" description="Submissions from the public feedback form." />

      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          <select name="status" defaultValue={searchParams.status ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All status</option>
            {FEEDBACK_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select name="category" defaultValue={searchParams.category ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
            <option value="">All categories</option>
            {FEEDBACK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="h-9 rounded-md border bg-secondary px-3 text-sm" type="submit">Filter</button>
        </form>
      </Card>

      {(!rows || rows.length === 0) ? (
        <EmptyState title="No feedback yet" description="Submissions from the public Feedback form will appear here." />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow>
              <TableHead>From</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(f => <FeedbackRow key={f.id} f={f} profiles={profiles ?? []} />)}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
