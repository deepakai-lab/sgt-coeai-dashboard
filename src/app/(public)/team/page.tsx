import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const supabase = createClient()
  const { data: members } = await supabase.from('public_team').select('*').order('full_name')

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Team</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            The people <span className="brand-text">behind the CoE AI.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            A small team, hands-on across every initiative.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        {(!members || members.length === 0) ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground">Team profiles will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((m: any) => {
              const initials = (m.full_name || '').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
              return (
                <div key={m.id} className="rounded-2xl border bg-card p-6 card-hover">
                  <Avatar className="h-16 w-16 mb-4 ring-2 ring-primary/10">
                    {m.public_photo_url && <AvatarImage src={m.public_photo_url} alt={m.full_name} />}
                    <AvatarFallback className="brand-bg text-white font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold tracking-tight">{m.full_name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.designation || 'Member'}{m.department && ` · ${m.department}`}
                  </p>
                  {m.public_bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{m.public_bio}</p>}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
