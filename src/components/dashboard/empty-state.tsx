import { Inbox } from 'lucide-react'

export function EmptyState({
  title, description, action, icon: Icon = Inbox
}: { title: string; description?: string; action?: React.ReactNode; icon?: any }) {
  return (
    <div className="border border-dashed border-border rounded-lg p-16 text-center bg-card">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground mb-4 bg-background">
        <Icon className="h-4 w-4 stroke-[1.5]" />
      </div>
      <h3 className="display text-lg">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
