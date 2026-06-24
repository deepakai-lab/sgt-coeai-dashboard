const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function DemoBanner() {
  if (!IS_DEMO) return null
  return (
    <div className="relative z-50 border-b border-border bg-background">
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <span className="dot dot-info" />
        <span className="tabular">
          <span className="text-foreground font-medium">Preview</span>
          <span className="mx-2 text-border">·</span>
          <span>Sample data, no writes persisted</span>
          <span className="mx-2 text-border">·</span>
          <span>v1.0 Beta</span>
        </span>
      </div>
    </div>
  )
}
