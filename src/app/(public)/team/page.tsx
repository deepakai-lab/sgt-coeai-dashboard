import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const supabase = createClient()
  const { data: members } = await supabase.from('public_team').select('*').order('full_name')

  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-40" />
        <div className="container relative mx-auto px-4 pt-24 pb-20">
          <div className="section-mark mb-6"><span>§</span><span>Team</span></div>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance max-w-4xl">
            The people<br />
            <em>behind the work.</em>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A small team, hands-on across every initiative.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        {(!members || members.length === 0) ? (
          <div className="border border-dashed border-border p-16 text-center max-w-2xl mx-auto bg-card">
            <p className="text-muted-foreground">Team profiles will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {members.map((m: any) => {
              const initials = (m.full_name || '').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
              return (
                <div key={m.id} className="border-r border-b border-border p-8 bg-card">
                  <Avatar className="h-16 w-16 mb-6 border border-border">
                    {m.public_photo_url && <AvatarImage src={m.public_photo_url} alt={m.full_name} />}
                    <AvatarFallback className="bg-accent text-accent-foreground display text-base">{initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="display text-xl text-foreground">{m.full_name}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 num">
                    {m.designation || 'Member'}{m.department && ` · ${m.department}`}
                  </p>
                  {m.public_bio && <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{m.public_bio}</p>}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
