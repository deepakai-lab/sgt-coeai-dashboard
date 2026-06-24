const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function DemoBanner() {
  if (!IS_DEMO) return null
  return (
    <div className="relative z-50 border-b border-border bg-accent/40">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2.5 text-[11px] text-muted-foreground">
        <span className="dot dot-info" />
        <span className="num">
          <span className="text-foreground font-medium">Preview build</span>
          <span className="mx-2 text-border">·</span>
          <span>Sample data — writes are not persisted</span>
          <span className="mx-2 text-border">·</span>
          <span>v1.0 Beta</span>
        </span>
      </div>
    </div>
  )
}
