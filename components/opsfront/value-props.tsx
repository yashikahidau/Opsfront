import { AlertTriangle, GitBranch, Users, Timer } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const VALUES = [
  {
    icon: AlertTriangle,
    title: 'Surface at-risk tickets before they breach',
    body: 'A live risk score ranks every open request by urgency and SLA proximity, so the queue reorders itself around what actually matters right now.',
  },
  {
    icon: GitBranch,
    title: 'Route and prioritize faster with AI triage',
    body: 'Incoming requests are auto-categorized and assigned a suggested priority and owner — agents start from a decision, not a blank ticket.',
  },
  {
    icon: Users,
    title: 'Keep ownership visible end to end',
    body: 'Requesters, agents, and admins share one accountable view. Everyone sees who holds each ticket and what happens next.',
  },
  {
    icon: Timer,
    title: 'Turn SLA tracking into a workflow',
    body: 'SLA deadlines drive real-time alerts and escalation paths — not a monthly postmortem report you read after the damage is done.',
  },
]

export function ValueProps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="Why Opsfront"
        title="Operations visibility, not guesswork"
        description="Everything is built around one idea: know what needs attention before a deadline slips."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:-translate-y-0.5">
                <v.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
