import { Sparkles, Target, Compass, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="container relative mx-auto px-4 py-20 max-w-4xl">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">About</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05]">
            Built for <span className="brand-text">deployment</span>,<br />
            not for slideware.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            The Centre of Excellence for AI at SGT University was set up to bring practical AI
            capability into every part of the university — from how faculty teach, to how research
            is conducted, to how administrative operations run.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Block icon={Target} title="Why we exist">
            Most universities talk about AI. Our job is to actually deploy it. We run programmes,
            build products, train teams, and partner with departments to solve specific problems.
          </Block>
          <Block icon={Compass} title="Operating philosophy">
            Bias to action. Prefer shipped over perfect. Centralise discipline, decentralise
            execution. Boring reliability beats flashy demos.
          </Block>
          <Block icon={Rocket} title="What we ship">
            Training programmes that finish. Internal tools that get used. Department projects with
            owners and deadlines. Public products that students and faculty actually want.
          </Block>
          <Block icon={Sparkles} title="Where we focus">
            Faculty training, student AI readiness, university operations, AI products, department
            projects, and data intelligence.
          </Block>
        </div>
      </section>
    </>
  )
}

function Block({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 card-hover">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{children}</p>
    </div>
  )
}
