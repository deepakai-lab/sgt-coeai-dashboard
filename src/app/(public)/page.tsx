import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { INITIATIVES } from '@/lib/constants'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PublicHome() {
  const supabase = createClient()
  const [{ count: projectCount }, { data: featured }] = await Promise.all([
    supabase.from('public_projects').select('id', { count: 'exact', head: true }),
    supabase.from('public_projects').select('*').order('updated_at', { ascending: false }).limit(3)
  ])

  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-60" />
        <div className="container relative mx-auto px-4 pt-28 pb-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-10">
              <span className="dot dot-live" />
              <span className="font-mono tracking-wider uppercase">CoE AI</span>
              <span className="text-border">/</span>
              <span>SGT University</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[1.02] text-foreground">
              Practical AI,<br />
              <span className="text-muted-foreground">deployed across the university.</span>
            </h1>
            <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              We train faculty, build products, automate operations, and equip students with
              the AI skills they&apos;ll actually use. Not slideware — shipped work.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/initiatives">
                  View initiatives <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/feedback">
                  Collaborate <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 border-t border-border">
            <Stat label="Public projects" value={projectCount ?? 0} />
            <Stat label="Work streams" value={INITIATIVES.length} />
            <Stat label="Colleges served" value="19" />
            <Stat label="Status" value="Active" mono />
          </div>
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">§ 01 · Work streams</div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter max-w-xl">
              Six fronts of AI adoption at SGT.
            </h2>
          </div>
          <Link href="/initiatives" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            All initiatives <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {INITIATIVES.map((i, idx) => (
            <div key={i.slug} className="border-r border-b border-border p-8 bg-card/40 hover:bg-card transition-colors group">
              <div className="flex items-baseline justify-between mb-5">
                <span className="font-mono text-xs text-muted-foreground tracking-wider">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="dot dot-info opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-medium tracking-tight">{i.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{i.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featured && featured.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-3">§ 02 · Live work</div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter max-w-xl">
                Currently shipping.
              </h2>
            </div>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              All projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
            {featured.map((p: any) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="border-r border-b border-border p-8 bg-card/40 hover:bg-card transition-colors group">
                <div className="flex items-center justify-between mb-5 text-xs">
                  <span className="text-muted-foreground font-mono uppercase tracking-wider">{p.project_type}</span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className={`dot ${p.status === 'Live' ? 'dot-live' : p.status === 'In Progress' ? 'dot-progress' : 'dot-info'}`} />
                    {p.status}
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight group-hover:text-foreground">{p.title}</h3>
                {p.public_impact_statement && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{p.public_impact_statement}</p>
                )}
                <div className="mt-6 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">{formatDate(p.updated_at)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 border-t border-border">
        <div className="relative border border-border bg-card/40 overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-40" />
          <div className="relative p-10 md:p-16 grid md:grid-cols-2 gap-10 items-end">
            <div>
              <div className="eyebrow mb-4">§ 03 · Get in touch</div>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tighter max-w-xl leading-[1.05]">
                Suggest a project. Request training. Partner with us.
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
              <p className="text-sm text-muted-foreground max-w-md md:text-right">
                The CoE AI works with departments, faculty, students and external partners.
              </p>
              <Button asChild size="lg">
                <Link href="/feedback">
                  Open feedback form <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Stat({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="border-r border-b border-border p-6 last:border-r-0 md:border-b-0">
      <div className={`text-3xl md:text-4xl font-medium tracking-tighter text-foreground ${mono ? 'font-mono text-2xl md:text-3xl' : 'num'}`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-mono">{label}</div>
    </div>
  )
}
