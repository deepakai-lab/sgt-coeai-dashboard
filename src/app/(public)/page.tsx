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
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="container relative mx-auto px-4 pt-24 pb-28">
          <div className="max-w-4xl">
            <div className="section-mark mb-10">
              <span className="dot dot-live" />
              <span>CoE AI / SGT University / Est. 2024</span>
            </div>

            <h1 className="display text-5xl md:text-7xl text-balance leading-[1.05] text-foreground">
              Practical AI,<br />
              <em className="text-primary">deployed across the university.</em>
            </h1>

            <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              The Centre of Excellence for AI trains faculty, builds products, automates
              operations, and equips students with the AI skills they&apos;ll actually use —
              not slideware, shipped work.
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

          {/* Statline */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 border-t border-border">
            <Stat label="Public projects" value={projectCount ?? 0} />
            <Stat label="Work streams" value={INITIATIVES.length} />
            <Stat label="Colleges served" value="19" />
            <Stat label="Status" value="Active" word />
          </div>
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
          <div className="md:col-span-7">
            <div className="section-mark mb-5">
              <span>§ 01</span><span className="text-border">/</span><span>Work streams</span>
            </div>
            <h2 className="display text-3xl md:text-5xl text-balance leading-[1.1]">
              Six fronts of <em>AI adoption</em> at SGT.
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 text-muted-foreground leading-relaxed">
            Each initiative has a clear owner, a defined audience, and concrete outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {INITIATIVES.map((i, idx) => (
            <div key={i.slug} className="border-r border-b border-border p-8 bg-card hover:bg-accent/30 transition-colors group">
              <div className="flex items-baseline justify-between mb-6">
                <span className="num text-xs text-muted-foreground tracking-wider">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="dot dot-muted group-hover:dot-info transition-colors" />
              </div>
              <h3 className="display text-xl text-foreground">{i.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{i.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featured && featured.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
            <div className="md:col-span-7">
              <div className="section-mark mb-5">
                <span>§ 02</span><span className="text-border">/</span><span>Live work</span>
              </div>
              <h2 className="display text-3xl md:text-5xl text-balance leading-[1.1]">
                What we&apos;re <em>currently shipping.</em>
              </h2>
            </div>
            <Link href="/projects" className="md:col-span-4 md:col-start-9 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-end">
              All projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
            {featured.map((p: any) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="border-r border-b border-border p-8 bg-card hover:bg-accent/30 transition-colors group flex flex-col">
                <div className="flex items-center justify-between mb-5 text-xs">
                  <span className="text-muted-foreground num uppercase tracking-wider">{p.project_type}</span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className={`dot ${p.status === 'Live' ? 'dot-live' : p.status === 'In Progress' ? 'dot-progress' : 'dot-info'}`} />
                    {p.status}
                  </span>
                </div>
                <h3 className="display text-xl text-foreground">{p.title}</h3>
                {p.public_impact_statement && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed flex-1">{p.public_impact_statement}</p>
                )}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground num">{formatDate(p.updated_at)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 border-t border-border">
        <div className="relative border border-border bg-secondary/40 overflow-hidden">
          <div className="relative p-10 md:p-16 grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <div className="section-mark mb-5">
                <span>§ 03</span><span className="text-border">/</span><span>Get involved</span>
              </div>
              <h2 className="display text-3xl md:text-5xl text-balance leading-[1.05]">
                Suggest a project. Request training. <em>Partner with us.</em>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex flex-col gap-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The CoE AI works with departments, faculty, students and external partners across SGT.
              </p>
              <Button asChild size="lg" className="self-start">
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

function Stat({ label, value, word }: { label: string; value: string | number; word?: boolean }) {
  return (
    <div className="border-r border-b border-border last:border-r-0 md:border-b-0 p-6">
      <div className={word ? 'display text-3xl md:text-4xl text-foreground' : 'num text-3xl md:text-4xl font-medium text-foreground tabular'}>
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wider num">{label}</div>
    </div>
  )
}
