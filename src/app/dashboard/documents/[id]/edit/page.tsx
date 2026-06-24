import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { DocumentForm } from '../../document-form'
import { updateDocument } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: d }, { data: projects }] = await Promise.all([
    supabase.from('documents').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  ])
  if (!d) notFound()
  const bound = updateDocument.bind(null, params.id)
  return <><PageHeader title={`Edit: ${d.title}`} /><DocumentForm action={bound} initial={d} projects={projects ?? []} submitLabel="Save changes" /></>
}
