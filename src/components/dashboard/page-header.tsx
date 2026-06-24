export function PageHeader({
  title, description, action, eyebrow
}: { title: string; description?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="flex items-start justify-between mb-10 gap-4 flex-wrap pb-6 border-b border-border">
      <div>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h1 className="display text-3xl md:text-4xl text-foreground leading-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
