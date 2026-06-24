import { FeedbackForm } from './form'

export default function PublicFeedbackPage() {
  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 line-grid opacity-40" />
        <div className="container relative mx-auto px-4 pt-24 pb-20 max-w-3xl">
          <div className="section-mark mb-6"><span>§</span><span>Get in touch</span></div>
          <h1 className="display text-4xl md:text-6xl leading-[1.05] text-balance">
            Tell us what<br />
            <em>you&apos;re thinking.</em>
          </h1>
          <p className="mt-10 text-base md:text-lg text-muted-foreground leading-relaxed">
            Suggestions, collaboration ideas, training requests, or issues — we read everything.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="border border-border bg-card p-8 md:p-10 panel">
          <FeedbackForm />
        </div>
      </section>
    </>
  )
}
