import { Activity, Gauge, ListFilter } from 'lucide-react'
import { CockpitMockup } from './cockpit-mockup'
import { Reveal } from './reveal'

const MINI = [
  {
    icon: Gauge,
    title: 'Composite risk score',
    body: 'SLA proximity, priority, stale time, and reopens combined into one ranked signal.',
  },
  {
    icon: ListFilter,
    title: 'Self-sorting queue',
    body: 'The list reorders continuously so the top row is always the most urgent request.',
  },
  {
    icon: Activity,
    title: 'Live escalation feed',
    body: 'At-risk tickets flow into a side panel the moment they cross a threshold.',
  },
]

export function CockpitShowcase() {
  return (
    <section id="product" className="relative scroll-mt-20 border-y border-border bg-card/20">
      <div className="pointer-events-none absolute inset-0 bg-grid-sm opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-primary">
              Risk Cockpit
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Tickets aren&apos;t just listed. They&apos;re ranked by risk.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              The cockpit continuously scores every open request against its SLA deadline and
              context, then puts the requests most likely to breach at the top — before anyone
              has to go looking for them.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              {MINI.map((m, i) => (
                <Reveal key={m.title} delay={i * 90}>
                  <div className="flex gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                      <m.icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{m.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <CockpitMockup />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
