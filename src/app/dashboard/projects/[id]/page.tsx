import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  StatusBadge, PriorityBadge, VisibilityBadge, TaskStatusBadge,
  DocVisibilityBadge, TrainingStatusBadge
} from '@/components/badges'
import { formatDate, formatDateTime, isOverdue } from '@/lib/utils'
import { ExternalLink, Pencil, EyeOff, Eye, Trash2 } from 'lucide-react'
import { softDeleteProject, setProjectVisibility } from '../actions'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*, owner:profiles!projects_owner_id_fkey(full_name, email)')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (!project) notFound()

  const [tasksRes, meetingsRes, docsRes, trainingsRes, activityRes] = await Promise.all([
    supabase.from('tasks').select('id, title, status, priority, due_date, assigned_to').eq('project_id', params.id).is('deleted_at', null).order('updated_at', { ascending: false }),
    supabase.from('meetings').select('id, title, meeting_date, meeting_type').eq('project_id', params.id).is('deleted_at', null).order('meeting_date', { ascending: false }),
    supabase.from('documents').select('id, title, category, visibility').eq('project_id', params.id).is('deleted_at', null),
    supabase.from('training_modules').select('id, title, status, visibility').is('deleted_at', null).limit(5),
    supabase.from('activity_logs').select('*').eq('entity_type', 'project').eq('entity_id', params.id).order('created_at', { ascending: false }).limit(10)
  ])

  const tasks = tasksRes.data ?? []
  const meetings = meetingsRes.data ?? []
  const docs = docsRes.data ?? []
  const trainings = trainingsRes.data ?? []
  const activity = activityRes.data ?? []

  const isPublished = project.public_visibility_status === 'Published'
  const togglePublish = setProjectVisibility.bind(null, project.id, isPublished ? 'Unpublished' : 'Published')
  const deleteAction = softDeleteProject.bind(null, project.id)

  return (
    <>
      <PageHeader
        title={project.title}
        description={project.short_code ? `Short code: ${project.short_code}` : undefined}
        action={
          <div className="flex gap-2 items-center">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/projects/${project.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
            </Button>
            <form action={togglePublish}>
              <Button type="submit" variant={isPublished ? 'outline' : 'default'} size="sm">
                {isPublished ? <><EyeOff className="h-4 w-4" /> Unpublish</> : <><Eye className="h-4 w-4" /> Publish</>}
              </Button>
            </form>
            <form action={deleteAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Internal details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status"><StatusBadge value={project.status} /></Row>
              <Row label="Priority"><PriorityBadge value={project.priority} /></Row>
              <Row label="Type">{project.project_type}</Row>
              <Row label="Owner">{(project as any).owner?.full_name ?? '—'}</Row>
              <Row label="Department">{project.department || '—'}</Row>
              <Row label="Start">{formatDate(project.start_date)}</Row>
              <Row label="Target">{formatDate(project.target_date)}</Row>
              <Row label="Completion">{formatDate(project.completion_date)}</Row>
              {project.latest_update && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Latest update</div>
                  <p className="whitespace-pre-wrap">{project.latest_update}</p>
                </div>
              )}
              {project.current_blocker && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Current blocker</div>
                  <p className="whitespace-pre-wrap text-amber-900">{project.current_blocker}</p>
                </div>
              )}
              {project.internal_description && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Internal description</div>
                  <p className="whitespace-pre-wrap">{project.internal_description}</p>
                </div>
              )}
              {project.internal_notes && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Internal notes (never public)</div>
                  <p className="whitespace-pre-wrap text-muted-foreground">{project.internal_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-sm">Linked tasks ({tasks.length})</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/tasks/new?project_id=${project.id}`}>+ Add task</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground">No tasks yet.</p>
              ) : (
                <ul className="divide-y">
                  {tasks.map(t => (
                    <li key={t.id} className="py-2 flex items-center justify-between text-sm">
                      <Link href={`/dashboard/tasks/${t.id}`} className="hover:underline flex-1">
                        {t.title}
                        {isOverdue(t.due_date, t.status) && <span className="ml-2 text-xs text-destructive">overdue</span>}
                      </Link>
                      <div className="flex gap-2 items-center text-xs">
                        <span className="text-muted-foreground">{formatDate(t.due_date)}</span>
                        <PriorityBadge value={t.priority} />
                        <TaskStatusBadge value={t.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-sm">Linked meetings ({meetings.length})</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/meetings/new?project_id=${project.id}`}>+ Add meeting</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {meetings.length === 0 ? (
                <p className="text-xs text-muted-foreground">No meetings linked.</p>
              ) : (
                <ul className="divide-y">
                  {meetings.map(m => (
                    <li key={m.id} className="py-2 flex justify-between text-sm">
                      <Link href={`/dashboard/meetings/${m.id}`} className="hover:underline">{m.title}</Link>
                      <span className="text-xs text-muted-foreground">{m.meeting_date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Documents</CardTitle></CardHeader>
            <CardContent>
              {docs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No documents linked.</p>
              ) : (
                <ul className="divide-y">
                  {docs.map(d => (
                    <li key={d.id} className="py-2 flex justify-between text-sm">
                      <Link href={`/dashboard/documents/${d.id}`} className="hover:underline">{d.title}</Link>
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground">{d.category}</span>
                        <DocVisibilityBadge value={d.visibility} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Public surface</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <Row label="Visibility"><VisibilityBadge value={project.public_visibility_status} /></Row>
              {isPublished && (
                <Row label="Public URL">
                  <Link href={`/projects/${project.slug}`} target="_blank" className="text-primary inline-flex items-center gap-1 hover:underline text-xs">
                    /projects/{project.slug} <ExternalLink className="h-3 w-3" />
                  </Link>
                </Row>
              )}
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Public description</div>
                <p className="whitespace-pre-wrap">{project.public_description || <span className="text-muted-foreground italic">— not set —</span>}</p>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Public impact</div>
                <p className="whitespace-pre-wrap">{project.public_impact_statement || <span className="text-muted-foreground italic">— not set —</span>}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Activity</CardTitle></CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity yet.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {activity.map(a => (
                    <li key={a.id}>
                      <div>
                        <span className="font-medium">{a.user_email?.split('@')[0] ?? 'Someone'}</span>{' '}
                        <span className="text-muted-foreground">{a.action.replace(/\./g, ' ')}</span>
                      </div>
                      <div className="text-muted-foreground">{formatDateTime(a.created_at)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  )
}
