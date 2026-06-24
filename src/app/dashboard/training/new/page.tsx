import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { TrainingForm } from '../training-form'
import { createTraining } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewTrainingPage() {
  const supabase = createClient()
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').order('full_name')
  return (
    <>
      <PageHeader title="New training module" />
      <TrainingForm action={createTraining} profiles={profiles ?? []} submitLabel="Create module" />
    </>
  )
}
