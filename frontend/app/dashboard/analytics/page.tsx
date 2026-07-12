import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";

const topStats = [
  {
    label: "SLA compliance",
    value: "96%",
    hint: "Rolling 30 days",
    tone: "success",
    icon: CheckCircle2,
  },
  {
    label: "At-risk tickets",
    value: "12",
    hint: "Live queue exposure",
    tone: "primary",
    icon: AlertTriangle,
  },
  {
    label: "Median resolution",
    value: "3h 42m",
    hint: "Across resolved tickets",
    tone: "default",
    icon: Clock3,
  },
  {
    label: "Escalation rate",
    value: "8.4%",
    hint: "Share of tickets escalated",
    tone: "destructive",
    icon: ShieldAlert,
  },
] as const;

const queueBreakdown = [
  { label: "Access Management", value: 34, tone: "bg-primary" },
  { label: "Identity", value: 24, tone: "bg-sky-400" },
  { label: "IT Ops", value: 18, tone: "bg-[color:var(--warning)]" },
  { label: "Finance Systems", value: 14, tone: "bg-[color:var(--success)]" },
  { label: "Workspace", value: 10, tone: "bg-muted-foreground/40" },
];

const riskTrend = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 51 },
  { day: "Wed", value: 47 },
  { day: "Thu", value: 64 },
  { day: "Fri", value: 58 },
  { day: "Sat", value: 36 },
  { day: "Sun", value: 40 },
];

const agentLoad = [
  { name: "D. Cho", open: 18, risk: 4, resolved: 26 },
  { name: "M. Ali", open: 14, risk: 3, resolved: 22 },
  { name: "J. Kim", open: 11, risk: 2, resolved: 19 },
  { name: "S. Gupta", open: 9, risk: 1, resolved: 17 },
];

const slaPolicies = [
  {
    name: "P1 Critical",
    response: "15m",
    resolution: "2h",
    compliance: "91%",
  },
  {
    name: "P2 High",
    response: "1h",
    resolution: "8h",
    compliance: "96%",
  },
  {
    name: "P3 Medium",
    response: "4h",
    resolution: "24h",
    compliance: "98%",
  },
  {
    name: "P4 Low",
    response: "8h",
    resolution: "48h",
    compliance: "99%",
  },
];

const insights = [
  "Access and identity queues are driving most of the current SLA exposure.",
  "Unassigned tickets older than 20 minutes remain the biggest escalation trigger.",
  "Finance-related requests have the highest average risk score this week.",
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Ops analytics
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Understand queue health, SLA drift, and team performance in one view.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Track operational performance across support queues, risk movement,
            resolution speed, and escalation pressure.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Last 30 days
          </button>
          <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            Export report
          </button>
        </div>
      </section>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((item) => {
          const Icon = item.icon;

          const toneClass =
            item.tone === "primary"
              ? "border-primary/20 bg-primary/[0.06]"
              : item.tone === "destructive"
              ? "border-destructive/20 bg-destructive/[0.06]"
              : item.tone === "success"
              ? "border-[color:var(--success)]/20 bg-[color:var(--success)]/[0.06]"
              : "border-border bg-card/40";

          const iconClass =
            item.tone === "primary"
              ? "text-primary"
              : item.tone === "destructive"
              ? "text-destructive"
              : item.tone === "success"
              ? "text-[color:var(--success)]"
              : "text-foreground";

          return (
            <div
              key={item.label}
              className={`rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-primary/15 ${toneClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <h3 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                  <Icon className={`size-5 ${iconClass}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main analytics layout */}
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Risk trend */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Risk trend
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average queue risk movement over the past 7 days
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <TrendingUp className="size-3.5" />
                +8% this week
              </span>
            </div>

            <div className="mt-6 flex h-[280px] items-end justify-between gap-3">
              {riskTrend.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-primary/85 transition-all duration-200 hover:bg-primary"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent load table */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Agent workload
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open volume, at-risk ownership, and recent resolution output
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                View team
              </button>
            </div>

            <div className="hidden grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
              <div>Agent</div>
              <div>Open</div>
              <div>At Risk</div>
              <div>Resolved</div>
            </div>

            <div className="divide-y divide-border">
              {agentLoad.map((agent) => (
                <div
                  key={agent.name}
                  className="grid gap-4 px-5 py-5 transition-all duration-200 hover:bg-background/35 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] md:px-6"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {agent.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Support operations
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-xs text-muted-foreground md:hidden">
                      Open:
                    </span>
                    <span className="font-mono text-sm text-foreground">
                      {agent.open}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-xs text-muted-foreground md:hidden">
                      At Risk:
                    </span>
                    <span className="font-mono text-sm text-primary">
                      {agent.risk}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-xs text-muted-foreground md:hidden">
                      Resolved:
                    </span>
                    <span className="font-mono text-sm text-[color:var(--success)]">
                      {agent.resolved}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA policy table */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  SLA policy performance
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compliance by policy tier and target window
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                Open policies
              </button>
            </div>

            <div className="hidden grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
              <div>Policy</div>
              <div>Response</div>
              <div>Resolution</div>
              <div>Compliance</div>
            </div>

            <div className="divide-y divide-border">
              {slaPolicies.map((policy) => (
                <div
                  key={policy.name}
                  className="grid gap-4 px-5 py-5 transition-all duration-200 hover:bg-background/35 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] md:px-6"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {policy.name}
                    </p>
                  </div>
                  <div className="text-sm text-foreground">{policy.response}</div>
                  <div className="text-sm text-foreground">{policy.resolution}</div>
                  <div className="font-mono text-sm text-[color:var(--success)]">
                    {policy.compliance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Queue distribution */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <BarChart3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue distribution
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Share of active ticket volume by queue
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {queueBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.tone}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation pressure */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Escalation pressure
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current exposure across high-priority work
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <SignalCard label="Critical tickets" value="3" tone="destructive" />
              <SignalCard label="High-risk queue avg." value="74" tone="primary" />
              <SignalCard label="Escalated in 24h" value="7" />
            </div>
          </div>

          {/* Team snapshot */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Team snapshot
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current operational team load
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MiniMetric label="Active agents" value="14" />
              <MiniMetric label="Avg open per agent" value="10.6" />
              <MiniMetric label="Risk-owned tickets" value="12" />
            </div>
          </div>

          {/* Ops insights */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Ops insights
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current performance patterns worth watching
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {insights.map((insight) => (
                <button
                  key={insight}
                  className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <span className="text-sm leading-6 text-foreground">
                    {insight}
                  </span>
                  <ArrowUpRight className="mt-1 size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignalCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "destructive";
}) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
      ? "text-destructive"
      : "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-2xl font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}