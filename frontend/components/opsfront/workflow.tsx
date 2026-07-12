import { Inbox, Sparkles, Radar, CheckCircle2 } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const STEPS = [
  {
    icon: Inbox,
    step: '01',
    title: 'Intake',
    body: 'Employees file support requests through a simple form, Slack, or email — captured in one structured queue.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Triage',
    body: 'AI suggests a category, priority, and owner in seconds, so nothing sits unclassified in the backlog.',
  },
  {
    icon: Radar,
    step: '03',
    title: 'Monitor',
    body: 'Every ticket is scored against its SLA deadline and risk signals, and surfaced the moment it trends toward a breach.',
  },
  {
    icon: CheckCircle2,
    step: '04',
    title: 'Act',
    body: 'Agents and admins resolve, escalate, and reassign — with a full audit trail kept automatically behind them.',
  },
]

export function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="How it works"
        title="From request to resolution, accountable at every step"
        description="A single operational loop that keeps intake, triage, monitoring, and action connected."
      />

      <div className="relative mt-14 grid gap-4 md:grid-cols-4">
        <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {STEPS.map((s, i) => (
          <Reveal key={s.step} delay={i * 90}>
            <div className="relative h-full rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-background ring-1 ring-border">
                  <s.icon className="size-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{s.step}</span>
              </div>
              <h3 className="mt-4 text-base font-medium text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
