export default function AboutPage() {
  return (
    <>
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="container relative mx-auto px-4 pt-24 pb-20 max-w-4xl">
          <div className="eyebrow mb-6">About</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.02]">
            Built for deployment,<br />
            <span className="text-muted-foreground">not for slideware.</span>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            The Centre of Excellence for AI at SGT University was set up to bring practical AI
            capability into every part of the university — from how faculty teach, to how research
            is conducted, to how administrative operations run.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border">
          <Block num="01" title="Why we exist">
            Most universities talk about AI. Our job is to actually deploy it. We run programmes,
            build products, train teams, and partner with departments to solve specific problems.
          </Block>
          <Block num="02" title="Operating philosophy">
            Bias to action. Prefer shipped over perfect. Centralise discipline, decentralise
            execution. Boring reliability beats flashy demos.
          </Block>
          <Block num="03" title="What we ship">
            Training programmes that finish. Internal tools that get used. Department projects
            with owners and deadlines. Public products that students and faculty actually want.
          </Block>
          <Block num="04" title="Where we focus">
            Faculty training, student AI readiness, university operations, AI products,
            department projects, and data intelligence.
          </Block>
        </div>
      </section>
    </>
  )
}

function Block({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-r border-b border-border p-8 bg-card/30">
      <span className="font-mono text-xs text-muted-foreground tracking-wider">{num}</span>
      <h3 className="font-medium tracking-tight text-lg mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{children}</p>
    </div>
  )
}
