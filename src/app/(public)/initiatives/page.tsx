import { INITIATIVES } from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function InitiativesPage() {
  return (
    <>
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="container relative mx-auto px-4 pt-24 pb-20">
          <div className="eyebrow mb-6">Work streams</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.02] max-w-3xl">
            Six fronts.<br />
            <span className="text-muted-foreground">One coordinated push.</span>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            How CoE AI work is organised across the university.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border max-w-6xl">
          {INITIATIVES.map((i, idx) => (
            <div key={i.slug} className="border-r border-b border-border p-10 bg-card/30 group hover:bg-card transition-colors">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-mono text-xs text-muted-foreground tracking-wider">
                  Initiative {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="dot dot-info opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-medium tracking-tighter">{i.title}</h3>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{i.description}</p>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-6 group/link">
                Related projects <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
