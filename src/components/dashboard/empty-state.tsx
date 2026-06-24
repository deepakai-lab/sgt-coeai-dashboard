import { Sparkles } from 'lucide-react'

export function EmptyState({
  title, description, action, icon: Icon = Sparkles
}: { title: string; description?: string; action?: React.ReactNode; icon?: any }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
