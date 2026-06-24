import { cn } from '@/lib/utils'

const baseChip = 'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium border'

const dot = (color: string) => <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', color)} />

const PROJECT_STATUS: Record<string, { cls: string; dot: string }> = {
  'Idea':        { cls: 'border-slate-300/60 bg-slate-50 text-slate-700',           dot: 'bg-slate-400' },
  'Planned':     { cls: 'border-sky-300/50 bg-sky-50 text-sky-700',                 dot: 'bg-sky-500' },
  'In Progress': { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',           dot: 'bg-amber-500' },
  'Testing':     { cls: 'border-violet-300/50 bg-violet-50 text-violet-700',        dot: 'bg-violet-500' },
  'Live':        { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700',     dot: 'bg-emerald-500' },
  'Paused':      { cls: 'border-zinc-300/60 bg-zinc-50 text-zinc-600',              dot: 'bg-zinc-400' },
  'Closed':      { cls: 'border-slate-300/60 bg-slate-50 text-slate-500',           dot: 'bg-slate-400' }
}

const TASK_STATUS: Record<string, { cls: string; dot: string }> = {
  'To Do':   { cls: 'border-slate-300/60 bg-slate-50 text-slate-700',   dot: 'bg-slate-400' },
  'Doing':   { cls: 'border-sky-300/50 bg-sky-50 text-sky-700',         dot: 'bg-sky-500' },
  'Review':  { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',   dot: 'bg-amber-500' },
  'Blocked': { cls: 'border-rose-300/50 bg-rose-50 text-rose-700',      dot: 'bg-rose-500' },
  'Done':    { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' }
}

const PRIORITY: Record<string, { cls: string; dot: string }> = {
  'High':   { cls: 'border-rose-300/50 bg-rose-50 text-rose-700',     dot: 'bg-rose-500' },
  'Medium': { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',  dot: 'bg-amber-500' },
  'Low':    { cls: 'border-slate-300/60 bg-slate-50 text-slate-600',  dot: 'bg-slate-400' }
}

const VISIBILITY: Record<string, { cls: string; dot: string }> = {
  'Private':          { cls: 'border-slate-300/60 bg-slate-50 text-slate-600',   dot: 'bg-slate-400' },
  'Public Draft':     { cls: 'border-zinc-300/60 bg-zinc-50 text-zinc-700',      dot: 'bg-zinc-400' },
  'Pending Approval': { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',   dot: 'bg-amber-500' },
  'Published':        { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  'Unpublished':      { cls: 'border-slate-300/60 bg-slate-50 text-slate-500',   dot: 'bg-slate-400' }
}

const TRAINING_STATUS: Record<string, { cls: string; dot: string }> = {
  'Draft':        { cls: 'border-slate-300/60 bg-slate-50 text-slate-700',         dot: 'bg-slate-400' },
  'Under Review': { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',         dot: 'bg-amber-500' },
  'Final':        { cls: 'border-sky-300/50 bg-sky-50 text-sky-700',               dot: 'bg-sky-500' },
  'Delivered':    { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700',   dot: 'bg-emerald-500' },
  'Archived':     { cls: 'border-zinc-300/60 bg-zinc-50 text-zinc-500',            dot: 'bg-zinc-400' }
}

const FEEDBACK_STATUS: Record<string, { cls: string; dot: string }> = {
  'New':         { cls: 'border-sky-300/50 bg-sky-50 text-sky-700',                dot: 'bg-sky-500' },
  'Reviewed':    { cls: 'border-zinc-300/60 bg-zinc-50 text-zinc-700',             dot: 'bg-zinc-400' },
  'In Progress': { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',          dot: 'bg-amber-500' },
  'Resolved':    { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700',    dot: 'bg-emerald-500' },
  'Ignored':     { cls: 'border-slate-300/60 bg-slate-50 text-slate-500',          dot: 'bg-slate-400' }
}

const DOC_VISIBILITY: Record<string, { cls: string; dot: string }> = {
  'Internal Only': { cls: 'border-slate-300/60 bg-slate-50 text-slate-700',        dot: 'bg-slate-400' },
  'Public':        { cls: 'border-emerald-300/50 bg-emerald-50 text-emerald-700',  dot: 'bg-emerald-500' },
  'Restricted':    { cls: 'border-amber-300/50 bg-amber-50 text-amber-800',        dot: 'bg-amber-500' }
}

function pick(map: any, value: string) {
  return map[value] ?? { cls: 'border-slate-300/60 bg-slate-50 text-slate-600', dot: 'bg-slate-400' }
}

export const StatusBadge = ({ value }: { value: string }) => {
  const s = pick(PROJECT_STATUS, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const TaskStatusBadge = ({ value }: { value: string }) => {
  const s = pick(TASK_STATUS, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const PriorityBadge = ({ value }: { value: string }) => {
  const s = pick(PRIORITY, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const VisibilityBadge = ({ value }: { value: string }) => {
  const s = pick(VISIBILITY, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const TrainingStatusBadge = ({ value }: { value: string }) => {
  const s = pick(TRAINING_STATUS, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const FeedbackStatusBadge = ({ value }: { value: string }) => {
  const s = pick(FEEDBACK_STATUS, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
export const DocVisibilityBadge = ({ value }: { value: string }) => {
  const s = pick(DOC_VISIBILITY, value)
  return <span className={cn(baseChip, s.cls)}>{dot(s.dot)}{value}</span>
}
