import { createClient } from '@/lib/supabase/server'
import { FileText, GraduationCap, ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const supabase = createClient()
  const { data: resources } = await supabase
    .from('public_resources')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-40" />
        <div className="container relative mx-auto px-4 pt-24 pb-20">
          <div className="section-mark mb-6"><span>§</span><span>Resources</span></div>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance max-w-4xl">
            Guides, training,<br />
            <em>things we&apos;ve published.</em>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Public material from the CoE AI — free to use, share, and reference.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        {(!resources || resources.length === 0) ? (
          <div className="border border-dashed border-border p-16 text-center max-w-2xl mx-auto bg-card">
            <p className="text-muted-foreground">Public resources will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border">
            {resources.map((r: any) => {
              const Icon = r.kind === 'training' ? GraduationCap : FileText
              return (
                <div key={`${r.kind}-${r.id}`} className="border-r border-b border-border p-8 bg-card hover:bg-accent/30 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                      <Icon className="h-4 w-4 text-muted-foreground stroke-[1.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="text-muted-foreground num uppercase tracking-wider">{r.kind}</span>
                        <span className="text-border">/</span>
                        <span className="text-muted-foreground">{r.category}</span>
                      </div>
                      <h3 className="display text-lg text-foreground">{r.title}</h3>
                      {r.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{r.description}</p>}
                      {r.file_url && (
                        <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary mt-4 group-hover:gap-2 transition-all">
                          Open <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
