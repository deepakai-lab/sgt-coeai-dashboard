import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { MeetingForm } from '../meeting-form'
import { createMeeting } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewMeetingPage({ searchParams }: { searchParams: { project_id?: string } }) {
  const supabase = createClient()
  const { data: projects } = await supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  return (
    <>
      <PageHeader title="New MoM" />
      <MeetingForm action={createMeeting} projects={projects ?? []} defaultProjectId={searchParams.project_id} submitLabel="Create MoM" />
    </>
  )
}
