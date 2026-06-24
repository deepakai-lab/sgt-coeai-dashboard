import { MessagesSquare } from 'lucide-react'
import { FeedbackForm } from './form'

export default function PublicFeedbackPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container relative mx-auto px-4 py-20 max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Get in touch</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.05]">
            Tell us <span className="brand-text">what you&apos;re thinking.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Suggestions, collaboration ideas, training requests, or issues — we read everything.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="rounded-3xl border bg-card overflow-hidden">
          <div className="h-1 brand-bg" />
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <MessagesSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight">Share feedback</h2>
                <p className="text-xs text-muted-foreground">We respond when a response is needed.</p>
              </div>
            </div>
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  )
}
