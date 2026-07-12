import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const BARS = [
  { d: 'Mon', v: 58 },
  { d: 'Tue', v: 72 },
  { d: 'Wed', v: 64 },
  { d: 'Thu', v: 88 },
  { d: 'Fri', v: 76 },
  { d: 'Sat', v: 40 },
  { d: 'Sun', v: 32 },
]

export function AnalyticsSection() {
  const compliance = 96
  const circumference = 2 * Math.PI * 46
  const dash = (compliance / 100) * circumference

  return (
    <section id="analytics" className="scroll-mt-20 border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <SectionHeading
          eyebrow="Operational visibility"
          title="The lead and admin view"
          description="Calm, high-signal reporting on the health of your support operation — no dashboard noise."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* SLA compliance gauge */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-medium text-foreground">SLA compliance rate</p>
              <p className="mt-1 text-xs text-muted-foreground">Rolling 30 days</p>
              <div className="relative mx-auto mt-4 grid place-items-center">
                <svg viewBox="0 0 100 100" className="size-40 -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-3xl font-semibold text-foreground tabular-nums">
                    {compliance}%
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[color:var(--success)]">
                    <ArrowUpRight className="size-3" /> +3.2 pts
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Ticket load bars */}
          <Reveal delay={90}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-medium text-foreground">Ticket load</p>
              <p className="mt-1 text-xs text-muted-foreground">Resolved vs. incoming</p>
              <div className="mt-6 flex flex-1 items-end justify-between gap-2">
                {BARS.map((b) => (
                  <div key={b.d} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={cn(
                          'w-full rounded-t-md',
                          b.v > 80 ? 'bg-primary' : 'bg-muted-foreground/25',
                        )}
                        style={{ height: `${b.v}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* KPI stack */}
          <Reveal delay={180}>
            <div className="flex h-full flex-col gap-4">
              <Kpi
                label="Median resolution time"
                value="3h 42m"
                delta="-18%"
                positive
              />
              <Kpi label="Open escalations" value="7" delta="+2" positive={false} />
              <div className="flex-1 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="size-4" />
                  <span className="text-xs font-medium">Risk distribution</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <Dist label="Critical" pct={12} tone="bg-destructive" />
                  <Dist label="High" pct={26} tone="bg-primary" />
                  <Dist label="Medium" pct={34} tone="bg-[color:var(--warning)]" />
                  <Dist label="Low" pct={28} tone="bg-[color:var(--success)]" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Kpi({
  label,
  value,
  delta,
  positive,
}: {
  label: string
  value: string
  delta: string
  positive: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
          {value}
        </span>
        <span
          className={cn(
            'flex items-center gap-0.5 text-xs',
            positive ? 'text-[color:var(--success)]' : 'text-destructive',
          )}
        >
          {positive ? (
            <ArrowDownRight className="size-3" />
          ) : (
            <ArrowUpRight className="size-3" />
          )}
          {delta}
        </span>
      </div>
    </div>
  )
}

function Dist({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
        {pct}%
      </span>
    </div>
  )
}
