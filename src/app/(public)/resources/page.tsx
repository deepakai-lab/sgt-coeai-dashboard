import { createClient } from '@/lib/supabase/server'
import { FileText, GraduationCap, Download, ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const supabase = createClient()
  const { data: resources } = await supabase
    .from('public_resources')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Resources</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Guides, training, and <span className="brand-text">things we&apos;ve published.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Public material from the CoE AI — free to use, share, and reference.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        {(!resources || resources.length === 0) ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground">Public resources will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resources.map((r: any) => {
              const Icon = r.kind === 'training' ? GraduationCap : FileText
              return (
                <div key={`${r.kind}-${r.id}`} className="group rounded-2xl border bg-card p-6 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">{r.category}</span>
                        <span className="text-muted-foreground capitalize">{r.kind}</span>
                      </div>
                      <h3 className="font-semibold tracking-tight">{r.title}</h3>
                      {r.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.description}</p>}
                      {r.file_url && (
                        <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:gap-2 transition-all">
                          Open file <ArrowUpRight className="h-3.5 w-3.5" />
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
