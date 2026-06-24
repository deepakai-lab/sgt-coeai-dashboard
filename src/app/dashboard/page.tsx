import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import Link from 'next/link'
import { formatDateTime, isOverdue } from '@/lib/utils'
import { PROJECT_STATUSES, TASK_STATUSES, PROJECT_PRIORITIES } from '@/lib/constants'
import { ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardHome() {
  const profile = await requireProfile()
  const supabase = createClient()

  const [projectsRes, tasksRes, feedbackRes, activityRes, meetingsRes, trainingsRes] = await Promise.all([
    supabase.from('projects').select('status, priority, latest_update, updated_at, public_visibility_status, title, id').is('deleted_at', null),
    supabase.from('tasks').select('id, status, priority, due_date, assigned_to, title').is('deleted_at', null),
    supabase.from('feedback').select('id, status'),
    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('meetings').select('id, title, meeting_date, meeting_type').is('deleted_at', null).order('meeting_date', { ascending: false }).limit(5),
    supabase.from('training_modules').select('id, status').is('deleted_at', null)
  ])

  const projects = projectsRes.data ?? []
  const tasks = tasksRes.data ?? []
  const feedback = feedbackRes.data ?? []
  const activity = activityRes.data ?? []
  const recentMeetings = meetingsRes.data ?? []
  const trainings = trainingsRes.data ?? []

  const totalProjects = projects.length
  const activeProjects = projects.filter((p: any) => ['Planned','In Progress','Testing'].includes(p.status)).length
  const liveProjects = projects.filter((p: any) => p.status === 'Live').length
  const pausedProjects = projects.filter((p: any) => p.status === 'Paused').length
  const publishedProjects = projects.filter((p: any) => p.public_visibility_status === 'Published').length

  const pendingTasks = tasks.filter((t: any) => t.status !== 'Done').length
  const overdueTasks = tasks.filter((t: any) => isOverdue(t.due_date, t.status)).length
  const blockedTasks = tasks.filter((t: any) => t.status === 'Blocked').length
  const myTasks = tasks.filter((t: any) => t.assigned_to === profile.id && t.status !== 'Done').length

  const newFeedback = feedback.filter((f: any) => f.status === 'New').length
  const finalTrainings = trainings.filter((t: any) => t.status === 'Final' || t.status === 'Delivered').length

  const byProjStatus = Object.fromEntries(PROJECT_STATUSES.map(s => [s, projects.filter((p: any) => p.status === s).length]))
  const byTaskStatus = Object.fromEntries(TASK_STATUSES.map(s => [s, tasks.filter((t: any) => t.status === s).length]))
  const byPriority = Object.fromEntries(PROJECT_PRIORITIES.map(s => [s, projects.filter((p: any) => p.priority === s).length]))

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Header */}
      <div className="pb-10 mb-10 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="eyebrow">Overview</div>
          <div className="eyebrow">{today}</div>
        </div>
        <h1 className="display text-3xl md:text-5xl text-foreground leading-tight">
          {greeting}, <em>{profile.full_name.split(' ')[0]}.</em>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {myTasks > 0
            ? <>You have <span className="num text-foreground">{myTasks}</span> open task{myTasks === 1 ? '' : 's'} assigned to you.</>
            : 'No open tasks assigned to you right now.'}
          {overdueTasks > 0 && <> <span className="mx-1 text-border">·</span> <span className="text-foreground"><span className="num">{overdueTasks}</span> overdue across the team</span>.</>}
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-border mb-10">
        <Stat label="Total projects" value={totalProjects} sub={`${activeProjects} active`} href="/dashboard/projects" />
        <Stat label="Live" value={liveProjects} sub="in production" href="/dashboard/projects?status=Live" />
        <Stat label="Published" value={publishedProjects} sub="public" href="/dashboard/projects?visibility=Published" />
        <Stat label="Open tasks" value={pendingTasks} sub={`${myTasks} mine`} href="/dashboard/tasks" />
        <Stat label="Overdue" value={overdueTasks} sub={overdueTasks ? 'needs attention' : 'clear'} href="/dashboard/tasks?filter=overdue" alert={overdueTasks > 0} />
        <Stat label="Blocked" value={blockedTasks} sub="stuck" href="/dashboard/tasks?status=Blocked" alert={blockedTasks > 0} />
        <Stat label="New feedback" value={newFeedback} sub="unreviewed" href="/dashboard/feedback?status=New" alert={newFeedback > 0} />
        <Stat label="Trainings" value={finalTrainings} sub="final/delivered" href="/dashboard/training" />
        <Stat label="Paused" value={pausedProjects} sub="projects" href="/dashboard/projects?status=Paused" />
        <Stat label="Activity" value={activity.length} sub="last events" href="/dashboard/activity" />
      </div>

      {/* Distribution + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Distribution title="Project status" data={byProjStatus} href="/dashboard/projects" />
        <Distribution title="Task status" data={byTaskStatus} href="/dashboard/tasks" />

        <div className="panel overflow-hidden">
          <div className="px-5 h-12 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-tight">Activity</h3>
            <Link href="/dashboard/activity" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5 space-y-3.5">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activity.slice(0, 6).map((a: any) => (
                <div key={a.id} className="flex items-start gap-3 text-xs">
                  <span className="dot dot-muted mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="leading-snug">
                      <span className="text-foreground font-medium">{a.user_email?.split('@')[0] ?? 'system'}</span>
                      <span className="text-muted-foreground"> {a.action.replace(/\./g, ' ')}</span>
                      {a.entity_label && <span className="text-foreground"> · {a.entity_label}</span>}
                    </div>
                    <div className="text-muted-foreground num mt-0.5 text-[10px]">{formatDateTime(a.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Priority + Recent meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium tracking-tight">Priority mix</h3>
            <span className="text-xs text-muted-foreground num">projects</span>
          </div>
          <div className="space-y-3">
            {PROJECT_PRIORITIES.map(p => {
              const total = projects.length || 1
              const v = byPriority[p] ?? 0
              const pct = Math.round((v / total) * 100)
              return (
                <div key={p}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="inline-flex items-center gap-2">
                      <span className={`dot ${p === 'High' ? 'dot-blocked' : p === 'Medium' ? 'dot-progress' : 'dot-muted'}`} />
                      <span className="text-foreground/80">{p}</span>
                    </span>
                    <span className="num text-foreground">{v}</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="panel lg:col-span-2 overflow-hidden">
          <div className="px-5 h-12 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-tight">Recent meetings</h3>
            <Link href="/dashboard/meetings" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentMeetings.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No meetings recorded yet.</p>
            ) : (
              recentMeetings.map((m: any) => (
                <Link key={m.id} href={`/dashboard/meetings/${m.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-accent/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate group-hover:text-primary transition-colors">{m.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.meeting_type}</div>
                  </div>
                  <div className="text-xs text-muted-foreground num shrink-0">{m.meeting_date}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, sub, href, alert }: {
  label: string; value: number; sub?: string; href: string; alert?: boolean
}) {
  return (
    <Link href={href} className="group border-r border-b border-border p-5 bg-card hover:bg-accent/30 transition-colors block">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider num">{label}</div>
        {alert && <span className="dot dot-blocked" />}
      </div>
      <div className="text-3xl num font-medium text-foreground tabular">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-2 num">{sub}</div>}
    </Link>
  )
}

function Distribution({ title, data, href }: { title: string; data: Record<string, number>; href: string }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1
  return (
    <div className="panel overflow-hidden">
      <div className="px-5 h-12 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <Link href={href} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          View <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="p-5 space-y-3">
        {Object.entries(data).map(([k, v]) => {
          const pct = Math.round((v / total) * 100)
          return (
            <div key={k}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-foreground/80">{k}</span>
                <span className="num text-foreground">{v}</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
