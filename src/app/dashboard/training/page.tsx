import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/dashboard/empty-state'
import { TrainingStatusBadge, DocVisibilityBadge } from '@/components/badges'
import { Plus } from 'lucide-react'
import { TRAINING_STATUSES, TRAINING_AUDIENCES, TRAINING_CATEGORIES, DOC_VISIBILITY } from '@/lib/constants'

export const dynamic = 'force-dynamic'

type SP = { status?: string; audience?: string; category?: string; visibility?: string; q?: string }

export default async function TrainingPage({ searchParams }: { searchParams: SP }) {
  const supabase = createClient()
  let q = supabase.from('training_modules').select('id, title, audience, training_category, status, visibility, version, delivery_date').is('deleted_at', null).order('updated_at', { ascending: false })
  if (searchParams.status) q = q.eq('status', searchParams.status)
  if (searchParams.audience) q = q.eq('audience', searchParams.audience)
  if (searchParams.category) q = q.eq('training_category', searchParams.category)
  if (searchParams.visibility) q = q.eq('visibility', searchParams.visibility)
  if (searchParams.q) q = q.ilike('title', `%${searchParams.q}%`)
  const { data: rows } = await q

  return (
    <>
      <PageHeader title="Training modules" description="Reusable training material." action={
        <Button asChild><Link href="/dashboard/training/new"><Plus className="h-4 w-4" /> New module</Link></Button>
      }/>
      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          <Input name="q" placeholder="Search title…" defaultValue={searchParams.q ?? ''} className="max-w-xs" />
          <Sel name="status" value={searchParams.status} options={TRAINING_STATUSES} label="status" />
          <Sel name="audience" value={searchParams.audience} options={TRAINING_AUDIENCES} label="audience" />
          <Sel name="category" value={searchParams.category} options={TRAINING_CATEGORIES} label="category" />
          <Sel name="visibility" value={searchParams.visibility} options={DOC_VISIBILITY} label="visibility" />
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </Card>
      {(!rows || rows.length === 0) ? (
        <EmptyState title="No training modules yet" action={<Button asChild><Link href="/dashboard/training/new">Add module</Link></Button>} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Audience</TableHead><TableHead>Category</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead>Visibility</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium"><Link href={`/dashboard/training/${t.id}`} className="hover:underline">{t.title}</Link></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.audience}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.training_category}</TableCell>
                  <TableCell className="text-xs">{t.version}</TableCell>
                  <TableCell><TrainingStatusBadge value={t.status} /></TableCell>
                  <TableCell><DocVisibilityBadge value={t.visibility} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}

function Sel({ name, value, options, label }: { name: string; value?: string; options: readonly string[]; label: string }) {
  return (
    <select name={name} defaultValue={value ?? ''} className="h-9 rounded-md border bg-transparent px-2 text-sm">
      <option value="">All {label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
