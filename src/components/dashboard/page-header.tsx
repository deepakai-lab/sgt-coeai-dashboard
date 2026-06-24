export function PageHeader({
  title, description, action, eyebrow
}: { title: string; description?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        {eyebrow && <div className="text-xs uppercase tracking-widest text-primary font-medium mb-2">{eyebrow}</div>}
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
