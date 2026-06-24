export function PageHeader({
  title, description, action, eyebrow
}: { title: string; description?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap pb-6 border-b border-border">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-medium tracking-tighter">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
