import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { softDeleteMeeting } from '../actions'
import { ActionItemsPanel } from './action-items-panel'

export const dynamic = 'force-dynamic'

export default async function MeetingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: meeting }, { data: items }, { data: profiles }] = await Promise.all([
    supabase.from('meetings')
      .select('*, project:projects(id, title), creator:profiles!meetings_created_by_fkey(full_name)')
      .eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('meeting_action_items')
      .select('*, owner:profiles!meeting_action_items_owner_id_fkey(full_name)')
      .eq('meeting_id', params.id).order('created_at'),
    supabase.from('profiles').select('id, full_name, email').order('full_name')
  ])
  if (!meeting) notFound()

  const deleteAction = softDeleteMeeting.bind(null, meeting.id)

  return (
    <>
      <PageHeader
        title={meeting.title}
        description={`${meeting.meeting_date} · ${meeting.meeting_type}`}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/meetings/${meeting.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
            </Button>
            <form action={deleteAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </form>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {meeting.agenda && <Section title="Agenda">{meeting.agenda}</Section>}
          {meeting.summary && <Section title="Summary">{meeting.summary}</Section>}
          {meeting.key_decisions && <Section title="Key decisions">{meeting.key_decisions}</Section>}
          {meeting.next_steps && <Section title="Next steps">{meeting.next_steps}</Section>}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Action items</CardTitle></CardHeader>
            <CardContent>
              <ActionItemsPanel meetingId={meeting.id} items={items ?? []} profiles={profiles ?? []} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Meta</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <Row label="Date">{formatDate(meeting.meeting_date)}</Row>
              <Row label="Type"><Badge variant="muted">{meeting.meeting_type}</Badge></Row>
              <Row label="Project">
                {(meeting as any).project ? <Link className="hover:underline" href={`/dashboard/projects/${(meeting as any).project.id}`}>{(meeting as any).project.title}</Link> : <span className="text-muted-foreground">—</span>}
              </Row>
              <Row label="Next meeting">{formatDate(meeting.next_meeting_date)}</Row>
              <Row label="Created by">{(meeting as any).creator?.full_name ?? '—'}</Row>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Attendees</div>
                <div className="flex flex-wrap gap-1">
                  {meeting.attendees?.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                  {meeting.attendees?.map((a: string) => <Badge key={a} variant="secondary">{a}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent><p className="whitespace-pre-wrap text-sm">{children}</p></CardContent>
    </Card>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><span>{children}</span></div>
}
