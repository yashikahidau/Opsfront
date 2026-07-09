import { Clock, MessageSquare, Sparkles, User } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const TIMELINE = [
  { time: '09:02', text: 'Request created by requester', tone: 'muted' },
  { time: '09:02', text: 'AI triage: Access · Priority High', tone: 'primary' },
  { time: '09:05', text: 'Assigned to D. Cho', tone: 'muted' },
  { time: '09:41', text: 'Risk threshold crossed → escalated', tone: 'destructive' },
]

export function DeepDive() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="Product deep-dive"
        title="Every ticket, with the context to act"
        description="Ownership, SLA state, AI reasoning, and a complete history — in one calm, layered view."
      />

      <Reveal delay={100} className="mt-12">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.4fr_1fr]">
            {/* detail panel */}
            <div className="rounded-xl border border-border bg-background/40 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">OPS-2481</span>
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive ring-1 ring-destructive/30">
                      Critical
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-foreground">
                    VPN auth failing for finance team
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    SLA breach in
                  </span>
                  <span className="font-mono text-xl font-semibold text-destructive tabular-nums">
                    00:18:04
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field icon={User} label="Owner" value="D. Cho" />
                <Field icon={Clock} label="Opened" value="09:02 · 41m ago" />
                <Field icon={MessageSquare} label="Updates" value="6 activity events" />
              </div>

              <div className="mt-5 rounded-lg border border-primary/25 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  <span className="text-xs font-medium">AI triage summary</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Authentication outage affecting a full team during business hours. Categorized
                  as <span className="text-foreground">Access · Network</span>, flagged
                  high-priority with a suggested escalation to the infrastructure on-call.
                </p>
              </div>
            </div>

            {/* activity timeline */}
            <div className="rounded-xl border border-border bg-background/40 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Activity history
              </p>
              <ol className="mt-4 space-y-4">
                {TIMELINE.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          t.tone === 'destructive'
                            ? 'size-2 rounded-full bg-destructive'
                            : t.tone === 'primary'
                              ? 'size-2 rounded-full bg-primary'
                              : 'size-2 rounded-full bg-muted-foreground/40'
                        }
                      />
                      {i !== TIMELINE.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="-mt-1 pb-1">
                      <p className="font-mono text-[10px] text-muted-foreground">{t.time}</p>
                      <p className="text-sm text-foreground">{t.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm text-foreground">{value}</p>
    </div>
  )
}
