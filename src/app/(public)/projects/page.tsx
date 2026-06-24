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
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="container relative mx-auto px-4 pt-24 pb-20">
          <div className="eyebrow mb-6">Projects</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.02] max-w-3xl">
            Work approved for<br />
            <span className="text-muted-foreground">public visibility.</span>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A curated view of CoE AI work. The full operating dashboard is internal.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {(!projects || projects.length === 0) ? (
          <div className="border border-dashed border-border p-16 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground">Public projects will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border max-w-7xl">
            {projects.map((p: any) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="border-r border-b border-border p-8 bg-card/30 hover:bg-card transition-colors group flex flex-col"
              >
                <div className="flex items-center justify-between mb-5 text-xs">
                  <span className="text-muted-foreground font-mono uppercase tracking-wider">{p.project_type}</span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className={`dot ${p.status === 'Live' ? 'dot-live' : p.status === 'In Progress' ? 'dot-progress' : p.status === 'Testing' ? 'dot-info' : 'dot-muted'}`} />
                    {p.status}
                  </span>
                </div>
                <h3 className="text-lg font-medium tracking-tight group-hover:text-foreground flex-1">{p.title}</h3>
                {p.public_impact_statement && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{p.public_impact_statement}</p>
                )}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">{formatDate(p.updated_at)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
