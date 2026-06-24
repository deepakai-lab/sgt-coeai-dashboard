import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, Building2, Activity } from 'lucide-react'
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
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-16 max-w-4xl">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> All projects
          </Link>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium">{project.project_type}</span>
            <span className="px-2.5 py-1 rounded-md border text-xs font-medium inline-flex items-center gap-1.5">
              <span className={`status-dot ${project.status === 'Live' ? 'bg-emerald-500 animate-pulse' : project.status === 'In Progress' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05]">
            {project.title}
          </h1>
          {project.public_impact_statement && (
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {project.public_impact_statement}
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {project.public_description ? (
              <article className="prose prose-neutral max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed">{project.public_description}</p>
              </article>
            ) : (
              <p className="text-muted-foreground italic">More details coming soon.</p>
            )}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 space-y-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Details</div>
              <Row icon={Activity} label="Status">{project.status}</Row>
              <Row icon={Building2} label="Type">{project.project_type}</Row>
              {project.department && <Row icon={Building2} label="Department">{project.department}</Row>}
              {project.target_date && <Row icon={Calendar} label="Target">{formatDate(project.target_date)}</Row>}
              <Row icon={Calendar} label="Updated">{formatDate(project.updated_at)}</Row>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{children}</div>
      </div>
    </div>
  )
}
