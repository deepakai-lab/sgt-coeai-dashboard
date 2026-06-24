import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { DocumentForm } from '../document-form'
import { createDocument } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewDocumentPage() {
  const supabase = createClient()
  const { data: projects } = await supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  return <><PageHeader title="Upload document" /><DocumentForm action={createDocument} projects={projects ?? []} submitLabel="Save document" /></>
}
