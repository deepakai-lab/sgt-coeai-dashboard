import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { PageHeader } from '@/components/dashboard/page-header'
import Link from 'next/link'
import { formatDateTime, isOverdue } from '@/lib/utils'
import { PROJECT_STATUSES, TASK_STATUSES, PROJECT_PRIORITIES } from '@/lib/constants'
import {
  FolderKanban, CheckSquare, Sparkles, MessageSquare, GraduationCap,
  Activity, AlertTriangle, Eye, Zap, ArrowRight, TrendingUp
} from 'lucide-react'

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
  const activeProjects = projects.filter(p => ['Planned','In Progress','Testing'].includes(p.status)).length
  const liveProjects = projects.filter(p => p.status === 'Live').length
  const pausedProjects = projects.filter(p => p.status === 'Paused').length
  const publishedProjects = projects.filter(p => p.public_visibility_status === 'Published').length

  const pendingTasks = tasks.filter(t => t.status !== 'Done').length
  const overdueTasks = tasks.filter(t => isOverdue(t.due_date, t.status)).length
  const blockedTasks = tasks.filter(t => t.status === 'Blocked').length
  const myTasks = tasks.filter(t => t.assigned_to === profile.id && t.status !== 'Done').length

  const newFeedback = feedback.filter(f => f.status === 'New').length
  const finalTrainings = trainings.filter(t => t.status === 'Final' || t.status === 'Delivered').length

  const byProjStatus = Object.fromEntries(PROJECT_STATUSES.map(s => [s, projects.filter(p => p.status === s).length]))
  const byTaskStatus = Object.fromEntries(TASK_STATUSES.map(s => [s, tasks.filter(t => t.status === s).length]))
  const byPriority = Object.fromEntries(PROJECT_PRIORITIES.map(s => [s, projects.filter(p => p.priority === s).length]))

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <>
      {/* Greeting hero */}
      <div className="relative rounded-3xl border bg-card overflow-hidden mb-8">
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="relative p-8 md:p-10">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-2">CoE AI · Command Center</div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {greeting}, {profile.full_name.split(' ')[0]}.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            {myTasks > 0
              ? <>You have <span className="font-medium text-foreground">{myTasks}</span> open task{myTasks === 1 ? '' : 's'} assigned to you.</>
              : 'No open tasks assigned to you right now.'}
            {overdueTasks > 0 && <> · <span className="text-amber-700 font-medium">{overdueTasks} overdue</span> across the team.</>}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/dashboard/projects/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg brand-bg text-white text-sm font-medium shadow-glow hover:opacity-90 transition-opacity">
              <Sparkles className="h-3.5 w-3.5" /> New project
            </Link>
            <Link href="/dashboard/tasks?filter=mine" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors">
              My tasks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <StatCard icon={FolderKanban} label="Projects" value={totalProjects} sub={`${liveProjects} live · ${activeProjects} active`} href="/dashboard/projects" tone="primary" />
        <StatCard icon={CheckSquare} label="Open tasks" value={pendingTasks} sub={`${myTasks} mine`} href="/dashboard/tasks" tone="cyan" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdueTasks} sub={overdueTasks > 0 ? 'needs attention' : 'all clear'} href="/dashboard/tasks?filter=overdue" tone="amber" highlight={overdueTasks > 0} />
        <StatCard icon={Zap} label="Blocked" value={blockedTasks} sub="tasks stuck" href="/dashboard/tasks?status=Blocked" tone="rose" highlight={blockedTasks > 0} />
        <StatCard icon={MessageSquare} label="New feedback" value={newFeedback} sub="unreviewed" href="/dashboard/feedback?status=New" tone="violet" highlight={newFeedback > 0} />
        <StatCard icon={Eye} label="Published" value={publishedProjects} sub="public projects" href="/dashboard/projects?visibility=Published" tone="emerald" />
        <StatCard icon={GraduationCap} label="Training" value={finalTrainings} sub="final/delivered" href="/dashboard/training" tone="primary" />
        <StatCard icon={Activity} label="Paused" value={pausedProjects} sub="projects" href="/dashboard/projects?status=Paused" tone="muted" />
        <StatCard icon={TrendingUp} label="Recent activity" value={activity.length} sub="last 10 events" href="/dashboard/activity" tone="cyan" />
        <StatCard icon={Sparkles} label="Meetings" value={recentMeetings.length} sub="recent MoMs" href="/dashboard/meetings" tone="violet" />
      </div>

      {/* Three-column detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DistributionCard title="Project status" data={byProjStatus} href="/dashboard/projects" />
        <DistributionCard title="Task status" data={byTaskStatus} href="/dashboard/tasks" />

        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold tracking-tight text-sm">Activity feed</h3>
            <Link href="/dashboard/activity" className="text-xs text-muted-foreground hover:text-foreground">All</Link>
          </div>
          <div className="p-5 space-y-3">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activity.slice(0, 6).map(a => (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full brand-bg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="leading-snug">
                      <span className="font-medium">{a.user_email?.split('@')[0] ?? 'Someone'}</span>{' '}
                      <span className="text-muted-foreground">{a.action.replace(/\./g, ' ')}</span>{' '}
                      {a.entity_label && <span className="font-medium truncate">&quot;{a.entity_label}&quot;</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatDateTime(a.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Priority strip + recent meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold tracking-tight text-sm mb-4">Projects by priority</h3>
          <div className="grid grid-cols-3 gap-3">
            {PROJECT_PRIORITIES.map(p => (
              <div key={p} className="text-center">
                <div className={`text-2xl font-semibold tracking-tighter ${p === 'High' ? 'text-rose-600' : p === 'Medium' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {byPriority[p] ?? 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold tracking-tight text-sm">Recent meetings</h3>
            <Link href="/dashboard/meetings" className="text-xs text-muted-foreground hover:text-foreground">All</Link>
          </div>
          <div className="divide-y">
            {recentMeetings.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No meetings recorded yet.</p>
            ) : (
              recentMeetings.map(m => (
                <Link key={m.id} href={`/dashboard/meetings/${m.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-accent/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.meeting_type}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{m.meeting_date}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const TONE_CLASSES = {
  primary: 'from-violet-500/15 to-violet-500/0 text-violet-600 border-violet-500/15',
  cyan: 'from-cyan-500/15 to-cyan-500/0 text-cyan-600 border-cyan-500/15',
  amber: 'from-amber-500/15 to-amber-500/0 text-amber-700 border-amber-500/15',
  rose: 'from-rose-500/15 to-rose-500/0 text-rose-600 border-rose-500/15',
  violet: 'from-fuchsia-500/15 to-fuchsia-500/0 text-fuchsia-600 border-fuchsia-500/15',
  emerald: 'from-emerald-500/15 to-emerald-500/0 text-emerald-600 border-emerald-500/15',
  muted: 'from-slate-500/10 to-slate-500/0 text-slate-600 border-slate-500/10'
}

function StatCard({ icon: Icon, label, value, sub, href, tone, highlight }: {
  icon: any; label: string; value: number; sub?: string; href: string; tone: keyof typeof TONE_CLASSES; highlight?: boolean
}) {
  const cls = TONE_CLASSES[tone]
  return (
    <Link href={href} className={`group rounded-2xl border bg-card p-5 card-hover ${highlight ? 'ring-1 ring-primary/20' : ''}`}>
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border ${cls} mb-3`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-3xl font-semibold tracking-tighter">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
    </Link>
  )
}

function DistributionCard({ title, data, href }: { title: string; data: Record<string, number>; href: string }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold tracking-tight text-sm">{title}</h3>
        <Link href={href} className="text-xs text-muted-foreground hover:text-foreground">View</Link>
      </div>
      <div className="p-5 space-y-2.5">
        {Object.entries(data).map(([k, v]) => {
          const pct = Math.round((v / total) * 100)
          return (
            <div key={k}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full brand-bg" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
