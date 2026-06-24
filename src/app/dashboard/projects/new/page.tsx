import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { ProjectForm } from '../project-form'
import { createProject } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  const supabase = createClient()
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').order('full_name')
  return (
    <>
      <PageHeader title="New project" description="Internal-by-default. Add public fields and toggle visibility when you're ready to publish." />
      <div className="max-w-3xl">
        <ProjectForm action={createProject} profiles={profiles ?? []} submitLabel="Create project" />
      </div>
    </>
  )
}
