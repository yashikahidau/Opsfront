import { ArrowRight, ShieldCheck } from 'lucide-react'
import { CockpitMockup } from './cockpit-mockup'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              AI-assisted triage · SLA risk cockpit
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              See what needs attention before{' '}
              <span className="text-gradient-amber">deadlines slip.</span>
            </h1>

            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Opsfront helps internal teams manage support tickets, track SLA deadlines, and
              surface at-risk requests before they slip — with AI-assisted triage and a live
              risk cockpit.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                Request demo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Explore the cockpit
              </a>
            </div>

            <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-[color:var(--success)]" />
              Role-based workflows · Full audit trail · No customer data required
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
            <CockpitMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
