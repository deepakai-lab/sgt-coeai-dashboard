import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PublicProjectsPage() {
  const supabase = createClient()
  const { data: projects } = await supabase
    .from('public_projects')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Live work</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Projects we&apos;ve <span className="brand-text">approved for public visibility.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            A curated view of CoE AI work. The full operating dashboard is internal.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {(!projects || projects.length === 0) ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground">Public projects will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
            {projects.map((p: any) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group relative rounded-2xl border bg-card overflow-hidden card-hover flex flex-col"
              >
                <div className="h-1 brand-bg" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-medium">{p.project_type}</span>
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <span className={`status-dot ${p.status === 'Live' ? 'bg-emerald-500 animate-pulse' : p.status === 'In Progress' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                  {p.public_impact_statement && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{p.public_impact_statement}</p>
                  )}
                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Updated {formatDate(p.updated_at)}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
