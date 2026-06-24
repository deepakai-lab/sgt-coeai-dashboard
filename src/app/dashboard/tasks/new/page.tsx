import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { TaskForm } from '../task-form'
import { createTask } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewTaskPage({ searchParams }: { searchParams: { project_id?: string } }) {
  const supabase = createClient()
  const [profilesRes, projectsRes] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email').order('full_name'),
    supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  ])
  return (
    <>
      <PageHeader title="New task" />
      <TaskForm
        action={createTask}
        profiles={profilesRes.data ?? []}
        projects={projectsRes.data ?? []}
        defaultProjectId={searchParams.project_id}
        submitLabel="Create task"
      />
    </>
  )
}
