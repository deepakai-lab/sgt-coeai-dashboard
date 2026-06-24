import { cn } from '@/lib/utils'

// Flat status chips — dot + label, no fills, restrained typography.
// Inspired by Vercel deployments / Linear statuses.

const baseChip = 'inline-flex items-center gap-1.5 text-xs text-foreground/80 font-medium'

const PROJECT_STATUS: Record<string, string> = {
  'Idea':        'dot dot-muted',
  'Planned':     'dot dot-info',
  'In Progress': 'dot dot-progress',
  'Testing':     'dot dot-info',
  'Live':        'dot dot-live',
  'Paused':      'dot dot-pending',
  'Closed':      'dot dot-muted'
}

const TASK_STATUS: Record<string, string> = {
  'To Do':   'dot dot-pending',
  'Doing':   'dot dot-info',
  'Review':  'dot dot-progress',
  'Blocked': 'dot dot-blocked',
  'Done':    'dot dot-done'
}

const PRIORITY: Record<string, { dot: string; text: string }> = {
  'High':   { dot: 'dot dot-blocked',  text: 'text-foreground' },
  'Medium': { dot: 'dot dot-progress', text: 'text-foreground/80' },
  'Low':    { dot: 'dot dot-muted',    text: 'text-muted-foreground' }
}

const VISIBILITY: Record<string, string> = {
  'Private':          'dot dot-muted',
  'Public Draft':     'dot dot-pending',
  'Pending Approval': 'dot dot-progress',
  'Published':        'dot dot-live',
  'Unpublished':      'dot dot-muted'
}

const TRAINING_STATUS: Record<string, string> = {
  'Draft':        'dot dot-pending',
  'Under Review': 'dot dot-progress',
  'Final':        'dot dot-info',
  'Delivered':    'dot dot-live',
  'Archived':     'dot dot-muted'
}

const FEEDBACK_STATUS: Record<string, string> = {
  'New':         'dot dot-info',
  'Reviewed':    'dot dot-pending',
  'In Progress': 'dot dot-progress',
  'Resolved':    'dot dot-live',
  'Ignored':     'dot dot-muted'
}

const DOC_VISIBILITY: Record<string, string> = {
  'Internal Only': 'dot dot-pending',
  'Public':        'dot dot-live',
  'Restricted':    'dot dot-progress'
}

export const StatusBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={PROJECT_STATUS[value] ?? 'dot dot-muted'} />{value}</span>

export const TaskStatusBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={TASK_STATUS[value] ?? 'dot dot-muted'} />{value}</span>

export const PriorityBadge = ({ value }: { value: string }) => {
  const p = PRIORITY[value] ?? { dot: 'dot dot-muted', text: 'text-muted-foreground' }
  return <span className={cn(baseChip, p.text)}><span className={p.dot} />{value}</span>
}

export const VisibilityBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={VISIBILITY[value] ?? 'dot dot-muted'} />{value}</span>

export const TrainingStatusBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={TRAINING_STATUS[value] ?? 'dot dot-muted'} />{value}</span>

export const FeedbackStatusBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={FEEDBACK_STATUS[value] ?? 'dot dot-muted'} />{value}</span>

export const DocVisibilityBadge = ({ value }: { value: string }) =>
  <span className={baseChip}><span className={DOC_VISIBILITY[value] ?? 'dot dot-muted'} />{value}</span>
