import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { TrainingForm } from '../../training-form'
import { updateTraining } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditTrainingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: t }, { data: profiles }] = await Promise.all([
    supabase.from('training_modules').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('profiles').select('id, full_name, email').order('full_name')
  ])
  if (!t) notFound()
  const bound = updateTraining.bind(null, params.id)
  return <><PageHeader title={`Edit: ${t.title}`} /><TrainingForm action={bound} initial={t} profiles={profiles ?? []} submitLabel="Save changes" /></>
}
