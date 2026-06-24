import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { INITIATIVES } from '@/lib/constants'
import {
  ArrowRight, Sparkles, Brain, GraduationCap, Cog, FlaskConical,
  Building2, BarChart3, Rocket, MessagesSquare, ArrowUpRight, Zap
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const INITIATIVE_ICONS = {
  'faculty-ai-training': GraduationCap,
  'student-ai-readiness': Brain,
  'ai-for-operations': Cog,
  'ai-products': Rocket,
  'department-projects': Building2,
  'data-intelligence': BarChart3
} as const

export default async function PublicHome() {
  const supabase = createClient()
  const [{ count: projectCount }, { data: featured }] = await Promise.all([
    supabase.from('public_projects').select('id', { count: 'exact', head: true }),
    supabase.from('public_projects').select('*').order('updated_at', { ascending: false }).limit(3)
  ])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 pt-24 pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-8 animate-pulse-glow">
              <span className="status-dot bg-primary animate-pulse" />
              Centre of Excellence for AI · SGT University
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05]">
              Practical AI,<br />
              <span className="brand-text">deployed across the university.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              We don&apos;t just talk about AI. We train faculty, build products, automate operations,
              and equip students with the skills they&apos;ll actually use.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-glow">
                <Link href="/initiatives">
                  Explore initiatives <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link href="/feedback">
                  Collaborate with us <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Quick stats strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border">
              <Stat label="Live projects" value={projectCount ?? 0} />
              <Stat label="Focus areas" value={INITIATIVES.length} />
              <Stat label="Faculty colleges" value="19" />
              <Stat label="Operating mode" value="Always on" small />
            </div>
          </div>
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium mb-3">What we work on</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Key initiatives</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Six work streams that cover the full surface area of AI adoption at SGT.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-sm">
            <Link href="/initiatives">All initiatives <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIATIVES.map((i, idx) => {
            const Icon = (INITIATIVE_ICONS as any)[i.slug] ?? Sparkles
            return (
              <div
                key={i.slug}
                className="group relative rounded-2xl border bg-card p-6 card-hover overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base tracking-tight">{i.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{i.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featured && featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Shipping</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Live projects</h2>
              <p className="text-muted-foreground mt-2">A look at what&apos;s currently in motion.</p>
            </div>
            <Button asChild variant="ghost"><Link href="/projects">All projects <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((p: any) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group relative rounded-2xl border bg-card overflow-hidden card-hover">
                <div className="h-1 brand-bg" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-medium">{p.project_type}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{p.status}</span>
                  </div>
                  <h3 className="font-semibold tracking-tight text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                  {p.public_impact_statement && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.public_impact_statement}</p>
                  )}
                  <div className="mt-5 flex items-center gap-1 text-sm text-primary font-medium">
                    Read more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="relative rounded-3xl border overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-60" />
          <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-primary mb-4">
                <Zap className="h-3.5 w-3.5" /> Have an idea?
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
                Suggest a project, request training, or partner with us.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl">
                The CoE AI works with departments, faculty, students and external partners.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button asChild size="lg" className="h-12 px-6 shadow-glow">
                <Link href="/feedback"><MessagesSquare className="h-4 w-4" /> Share feedback</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="bg-card p-5">
      <div className={`font-semibold tracking-tighter ${small ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
        {typeof value === 'number' ? value : <span className="brand-text">{value}</span>}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
