import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/dashboard/empty-state'
import { DocVisibilityBadge } from '@/components/badges'
import { Plus } from 'lucide-react'
import { DOC_CATEGORIES, DOC_VISIBILITY } from '@/lib/constants'

export const dynamic = 'force-dynamic'

type SP = { category?: string; visibility?: string; q?: string; project?: string }

export default async function DocumentsPage({ searchParams }: { searchParams: SP }) {
  const supabase = createClient()
  let q = supabase.from('documents')
    .select('id, title, category, visibility, project_id, version, project:projects(title)')
    .is('deleted_at', null).order('updated_at', { ascending: false })
  if (searchParams.category) q = q.eq('category', searchParams.category)
  if (searchParams.visibility) q = q.eq('visibility', searchParams.visibility)
  if (searchParams.project) q = q.eq('project_id', searchParams.project)
  if (searchParams.q) q = q.ilike('title', `%${searchParams.q}%`)
  const { data: docs } = await q

  return (
    <>
      <PageHeader title="Documents" description="Internal and public-safe documents." action={
        <Button asChild><Link href="/dashboard/documents/new"><Plus className="h-4 w-4" /> Upload document</Link></Button>
      }/>
      <Card className="mb-4 p-3">
        <form className="flex flex-wrap gap-2">
          <Input name="q" placeholder="Search title…" defaultValue={searchParams.q ?? ''} className="max-w-xs" />
          <Sel name="category" value={searchParams.category} options={DOC_CATEGORIES} label="category" />
          <Sel name="visibility" value={searchParams.visibility} options={DOC_VISIBILITY} label="visibility" />
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </Card>
      {(!docs || docs.length === 0) ? (
        <EmptyState title="No documents yet" action={<Button asChild><Link href="/dashboard/documents/new">Upload first</Link></Button>} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Project</TableHead><TableHead>Version</TableHead><TableHead>Visibility</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {docs.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium"><Link href={`/dashboard/documents/${d.id}`} className="hover:underline">{d.title}</Link></TableCell>
                  <TableCell className="text-xs">{d.category}</TableCell>
                  <TableCell className="text-xs">{d.project_id ? <Link href={`/dashboard/projects/${d.project_id}`} className="hover:underline">{(d as any).project?.title}</Link> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs">{d.version}</TableCell>
                  <TableCell><DocVisibilityBadge value={d.visibility} /></TableCell>
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
