import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { ProjectForm } from '../../project-form'
import { updateProject } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: project }, { data: profiles }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('profiles').select('id, full_name, email').order('full_name')
  ])
  if (!project) notFound()

  const bound = updateProject.bind(null, params.id)
  return (
    <>
      <PageHeader title={`Edit: ${project.title}`} />
      <div className="max-w-3xl">
        <ProjectForm action={bound} initial={project} profiles={profiles ?? []} submitLabel="Save changes" />
      </div>
    </>
  )
}
