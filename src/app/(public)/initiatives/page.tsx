import { INITIATIVES } from '@/lib/constants'
import { Brain, Cog, GraduationCap, Building2, BarChart3, Rocket, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ICONS = {
  'faculty-ai-training': GraduationCap,
  'student-ai-readiness': Brain,
  'ai-for-operations': Cog,
  'ai-products': Rocket,
  'department-projects': Building2,
  'data-intelligence': BarChart3
} as const

export default function InitiativesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Work streams</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Six fronts. <span className="brand-text">One coordinated push.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            How the CoE AI&apos;s work is organised across the university.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          {INITIATIVES.map((i, idx) => {
            const Icon = (ICONS as any)[i.slug] ?? Sparkles
            return (
              <div key={i.slug} className="group relative rounded-2xl border bg-card p-8 card-hover overflow-hidden">
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative flex gap-5">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl brand-bg shadow-glow">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Initiative {String(idx + 1).padStart(2, '0')}</div>
                    <h3 className="font-semibold text-xl tracking-tight">{i.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{i.description}</p>
                    <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:gap-2 transition-all">
                      See related projects <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
