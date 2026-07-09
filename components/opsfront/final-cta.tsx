import { ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'

export function FinalCta() {
  return (
    <section id="cta" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid-sm opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              See what needs attention before it becomes a problem
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
              Bring your internal support operation into one accountable view — with AI triage,
              SLA-aware workflows, and a live risk cockpit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                Request a demo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Talk to the team
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card required · SOC 2-ready architecture
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
