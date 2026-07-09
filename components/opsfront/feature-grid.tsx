import {
  BrainCircuit,
  Timer,
  LayoutDashboard,
  ShieldCheck,
  History,
  BarChart3,
  UserCheck,
} from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI-assisted triage',
    body: 'Automatic categorization, priority suggestions, and owner routing on every new request.',
    span: 'md:col-span-2',
  },
  {
    icon: Timer,
    title: 'SLA deadline tracking',
    body: 'Per-policy timers with proactive alerts as tickets approach breach.',
  },
  {
    icon: LayoutDashboard,
    title: 'Risk cockpit dashboard',
    body: 'The prioritized command center for at-risk work.',
  },
  {
    icon: UserCheck,
    title: 'Role-based workflows',
    body: 'Distinct requester, agent, and admin permissions and views.',
  },
  {
    icon: History,
    title: 'Audit trail & activity history',
    body: 'Every status change, reassignment, and escalation recorded automatically for accountability.',
    span: 'md:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Analytics & compliance',
    body: 'SLA compliance, resolution time, and load visibility for leads.',
  },
  {
    icon: ShieldCheck,
    title: 'Ownership & assignment',
    body: 'Clear accountability for who holds every ticket at any moment.',
  },
]

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 border-y border-border bg-card/20"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <SectionHeading
          eyebrow="Capabilities"
          title="A complete operations toolkit"
          description="Purpose-built for internal support — no chat widgets, no customer portals, no clutter."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 70} className={cn(f.span)}>
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <f.icon className="size-4 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-medium text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
