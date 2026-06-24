import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DocVisibilityBadge } from '@/components/badges'
import { Pencil, Trash2 } from 'lucide-react'
import { softDeleteDocument } from '../actions'

export const dynamic = 'force-dynamic'

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: d } = await supabase
    .from('documents')
    .select('*, project:projects(id, title), uploader:profiles!documents_uploaded_by_fkey(full_name)')
    .eq('id', params.id).is('deleted_at', null).single()
  if (!d) notFound()
  const del = softDeleteDocument.bind(null, d.id)
  return (
    <>
      <PageHeader title={d.title} description={d.category} action={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href={`/dashboard/documents/${d.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link></Button>
          <form action={del}><Button type="submit" variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></form>
        </div>
      }/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3">
            {d.description && <p className="whitespace-pre-wrap">{d.description}</p>}
            {d.file_url && <div className="pt-2 border-t"><a href={d.file_url} target="_blank" className="text-primary underline">Open file →</a></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Meta</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <Row label="Category">{d.category}</Row>
            <Row label="Visibility"><DocVisibilityBadge value={d.visibility} /></Row>
            <Row label="Version">{d.version}</Row>
            <Row label="Project">{(d as any).project ? <Link className="hover:underline" href={`/dashboard/projects/${(d as any).project.id}`}>{(d as any).project.title}</Link> : '—'}</Row>
            <Row label="Uploaded by">{(d as any).uploader?.full_name ?? '—'}</Row>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><span>{children}</span></div>
}
