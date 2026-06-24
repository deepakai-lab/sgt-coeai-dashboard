import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrainingStatusBadge, DocVisibilityBadge } from '@/components/badges'
import { formatDate } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { softDeleteTraining } from '../actions'

export const dynamic = 'force-dynamic'

export default async function TrainingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: t } = await supabase
    .from('training_modules')
    .select('*, prep:profiles!training_modules_prepared_by_fkey(full_name), rev:profiles!training_modules_reviewed_by_fkey(full_name)')
    .eq('id', params.id).is('deleted_at', null).single()
  if (!t) notFound()
  const del = softDeleteTraining.bind(null, t.id)
  return (
    <>
      <PageHeader title={t.title} description={`${t.audience} · ${t.training_category}`} action={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href={`/dashboard/training/${t.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link></Button>
          <form action={del}><Button type="submit" variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></form>
        </div>
      } />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3">
            {t.description && <p className="whitespace-pre-wrap">{t.description}</p>}
            {t.notes && <div className="pt-2 border-t"><div className="text-xs text-muted-foreground mb-1">Notes</div><p className="whitespace-pre-wrap">{t.notes}</p></div>}
            {t.file_url && <div className="pt-2 border-t"><a href={t.file_url} target="_blank" className="text-primary underline">Open file →</a></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Meta</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <Row label="Status"><TrainingStatusBadge value={t.status} /></Row>
            <Row label="Visibility"><DocVisibilityBadge value={t.visibility} /></Row>
            <Row label="Version">{t.version}</Row>
            <Row label="Department">{t.department || '—'}</Row>
            <Row label="Delivery">{formatDate(t.delivery_date)}</Row>
            <Row label="Prepared by">{(t as any).prep?.full_name ?? '—'}</Row>
            <Row label="Reviewed by">{(t as any).rev?.full_name ?? '—'}</Row>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><span>{children}</span></div>
}
