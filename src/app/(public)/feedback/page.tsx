import { FeedbackForm } from './form'

export default function PublicFeedbackPage() {
  return (
    <>
      <section className="relative border-b border-border">
        <div className="absolute inset-0 line-grid opacity-50" />
        <div className="container relative mx-auto px-4 pt-24 pb-20 max-w-3xl">
          <div className="eyebrow mb-6">Get in touch</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.02]">
            Tell us what<br />
            <span className="text-muted-foreground">you&apos;re thinking.</span>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground leading-relaxed">
            Suggestions, collaboration ideas, training requests, or issues — we read everything.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="border border-border bg-card/30 p-8 md:p-10">
          <FeedbackForm />
        </div>
      </section>
    </>
  )
}
