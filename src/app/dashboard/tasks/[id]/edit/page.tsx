import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { TaskForm } from '../../task-form'
import { updateTask } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: task }, { data: profiles }, { data: projects }] = await Promise.all([
    supabase.from('tasks').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('profiles').select('id, full_name, email').order('full_name'),
    supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  ])
  if (!task) notFound()
  const bound = updateTask.bind(null, params.id)
  return (
    <>
      <PageHeader title={`Edit: ${task.title}`} />
      <TaskForm action={bound} initial={task} profiles={profiles ?? []} projects={projects ?? []} submitLabel="Save changes" />
    </>
  )
}
