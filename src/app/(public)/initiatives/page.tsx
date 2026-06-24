import { INITIATIVES } from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function InitiativesPage() {
  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-40" />
        <div className="container relative mx-auto px-4 pt-24 pb-20">
          <div className="section-mark mb-6"><span>§</span><span>Work streams</span></div>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance max-w-4xl">
            Six fronts.<br />
            <em>One coordinated push.</em>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            How CoE AI work is organised across the university.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border max-w-6xl">
          {INITIATIVES.map((i, idx) => (
            <div key={i.slug} className="border-r border-b border-border p-10 bg-card group hover:bg-accent/30 transition-colors">
              <div className="flex items-baseline justify-between mb-6">
                <span className="num text-xs text-muted-foreground tracking-wider">
                  Initiative {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="dot dot-muted group-hover:dot-info transition-colors" />
              </div>
              <h3 className="display text-2xl md:text-3xl text-foreground">{i.title}</h3>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{i.description}</p>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary mt-6 hover:gap-2 transition-all">
                Related projects <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
