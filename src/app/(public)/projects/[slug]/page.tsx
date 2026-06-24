import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PublicProjectDetail({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: project } = await supabase
    .from('public_projects')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!project) notFound()

  return (
    <>
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="container relative mx-auto px-4 pt-16 pb-20 max-w-4xl">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-12 group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> All projects
          </Link>
          <div className="flex items-center gap-4 text-xs mb-6">
            <span className="font-mono uppercase tracking-wider text-muted-foreground">{project.project_type}</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className={`dot ${project.status === 'Live' ? 'dot-live' : project.status === 'In Progress' ? 'dot-progress' : 'dot-info'}`} />
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.02]">
            {project.title}
          </h1>
          {project.public_impact_statement && (
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {project.public_impact_statement}
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {project.public_description ? (
              <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">{project.public_description}</p>
            ) : (
              <p className="text-muted-foreground italic">More details coming soon.</p>
            )}
          </div>
          <aside className="space-y-6 text-sm">
            <div>
              <div className="eyebrow mb-3">Details</div>
              <Row label="Status">{project.status}</Row>
              <Row label="Type">{project.project_type}</Row>
              {project.department && <Row label="Department">{project.department}</Row>}
              {project.target_date && <Row label="Target" mono>{formatDate(project.target_date)}</Row>}
              <Row label="Updated" mono>{formatDate(project.updated_at)}</Row>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function Row({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border last:border-b-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : ''}`}>{children}</span>
    </div>
  )
}
