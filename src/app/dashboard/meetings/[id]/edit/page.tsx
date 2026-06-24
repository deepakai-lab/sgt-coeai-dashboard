import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { MeetingForm } from '../../meeting-form'
import { updateMeeting } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: meeting }, { data: projects }] = await Promise.all([
    supabase.from('meetings').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('projects').select('id, title').is('deleted_at', null).order('title')
  ])
  if (!meeting) notFound()
  const bound = updateMeeting.bind(null, params.id)
  return (
    <>
      <PageHeader title={`Edit: ${meeting.title}`} />
      <MeetingForm action={bound} initial={meeting} projects={projects ?? []} submitLabel="Save changes" />
    </>
  )
}
