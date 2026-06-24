import { Sparkles } from 'lucide-react'

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export function DemoBanner() {
  if (!IS_DEMO) return null
  return (
    <div className="relative z-50">
      <div className="brand-bg text-white text-center text-xs font-medium py-2 px-4 flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5" />
        <span>
          <span className="font-semibold">Live demo</span> — sample data, changes aren&apos;t saved.
          Built per the CoE AI v1.0 Beta PRD.
        </span>
      </div>
    </div>
  )
}
