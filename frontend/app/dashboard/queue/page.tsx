import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Filter,
  Flame,
  Search,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from "lucide-react";

const queueStats = [
  {
    label: "Under watch",
    value: "12",
    hint: "Actively monitored tickets",
    tone: "primary",
    icon: AlertTriangle,
  },
  {
    label: "Escalated",
    value: "4",
    hint: "Needs immediate action",
    tone: "destructive",
    icon: ShieldAlert,
  },
  {
    label: "Due in 1h",
    value: "9",
    hint: "Approaching SLA boundary",
    tone: "warning",
    icon: Clock3,
  },
  {
    label: "Recovered",
    value: "6",
    hint: "Risk lowered in last 24h",
    tone: "success",
    icon: TimerReset,
  },
] as const;

const liveQueue = [
  {
    id: "OPS-2481",
    title: "VPN auth failing for finance team",
    queue: "Access Management",
    assignee: "D. Cho",
    risk: 94,
    sla: "18m left",
    priority: "Critical",
    status: "Escalated",
    reason: "Finance payroll-close blocked · stalled once in triage",
    tone: "critical",
  },
  {
    id: "OPS-2468",
    title: "SSO invite loop for design team onboarding",
    queue: "Identity",
    assignee: "J. Kim",
    risk: 82,
    sla: "58m left",
    priority: "High",
    status: "In Progress",
    reason: "New joiner access blocked · repeated retry failures",
    tone: "high",
  },
  {
    id: "OPS-2479",
    title: "Production deploy access blocked for data team",
    queue: "Infra Access",
    assignee: "M. Ali",
    risk: 77,
    sla: "1h 12m left",
    priority: "High",
    status: "Watch",
    reason: "Release window today · dependency on admin approval",
    tone: "high",
  },
  {
    id: "OPS-2462",
    title: "Expense dashboard export failing in finance workspace",
    queue: "Finance Systems",
    assignee: "S. Gupta",
    risk: 61,
    sla: "3h 18m left",
    priority: "Medium",
    status: "Watch",
    reason: "End-of-day reporting dependency",
    tone: "watch",
  },
];

const queueLanes = [
  {
    title: "Critical now",
    count: 3,
    tone: "critical",
    items: [
      "VPN auth failing for finance team",
      "Email alias not syncing for support contractors",
      "Production deploy access blocked for data team",
    ],
  },
  {
    title: "Needs owner",
    count: 8,
    tone: "warning",
    items: [
      "New joiner device request missing approval",
      "Admin panel role mismatch after reset",
      "Finance export timeout on shared workspace",
    ],
  },
  {
    title: "Recently stabilized",
    count: 6,
    tone: "success",
    items: [
      "SSO invite loop partially recovered",
      "Device provisioning queue load reduced",
      "Workspace sync restored for design team",
    ],
  },
];

const signals = [
  {
    label: "Top risk concentration",
    value: "Access + Identity queues",
  },
  {
    label: "Most common trigger",
    value: "Unassigned ownership beyond 20m",
  },
  {
    label: "Highest impact team",
    value: "Finance Ops",
  },
];

export default function QueuePage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Queue cockpit
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Watch the queue by risk, not just status.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Surface tickets drifting toward breach, spot ownership gaps early,
            and keep the highest-risk work moving before SLAs slip.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Refresh queue
          </button>
          <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            Open escalations
          </button>
        </div>
      </section>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {queueStats.map((item) => {
          const Icon = item.icon;

          const toneClass =
            item.tone === "primary"
              ? "border-primary/20 bg-primary/[0.06]"
              : item.tone === "destructive"
              ? "border-destructive/20 bg-destructive/[0.06]"
              : item.tone === "warning"
              ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/[0.06]"
              : "border-[color:var(--success)]/20 bg-[color:var(--success)]/[0.06]";

          const iconClass =
            item.tone === "primary"
              ? "text-primary"
              : item.tone === "destructive"
              ? "text-destructive"
              : item.tone === "warning"
              ? "text-[color:var(--warning)]"
              : "text-[color:var(--success)]";

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

      {/* Search / controls */}
      <section className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30 lg:max-w-md">
                <Search className="size-4" />
                <span>Search by ticket, queue, or assignee...</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  <Filter className="size-4" />
                  Filters
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  Risk score
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  Queue
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  Assignee
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] px-4 py-3">
              <p className="text-xs text-muted-foreground">Live queue state</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                4 escalated · 9 due in 1h · 8 unassigned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Left */}
        <div className="space-y-6">
          {/* Live queue table */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Live risk-ranked queue
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Highest-risk tickets sorted by exposure and SLA urgency
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,176,72,0.8)]" />
                Live
              </span>
            </div>

            <div className="divide-y divide-border">
              {liveQueue.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="block cursor-pointer transition-all duration-200 hover:bg-background/35"
                >
                  <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {ticket.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {ticket.queue}
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-medium text-foreground sm:text-lg">
                          {ticket.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {ticket.reason}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
                      <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          Risk score
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span
                            className={`font-mono text-2xl font-semibold ${
                              ticket.tone === "critical"
                                ? "text-destructive"
                                : ticket.tone === "high"
                                ? "text-primary"
                                : "text-sky-300"
                            }`}
                          >
                            {ticket.risk}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                ticket.tone === "critical"
                                  ? "bg-destructive"
                                  : ticket.tone === "high"
                                  ? "bg-primary"
                                  : "bg-sky-400"
                              }`}
                              style={{ width: `${ticket.risk}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          SLA window
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">
                          {ticket.sla}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Assigned to {ticket.assignee}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          Why this is risky
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {ticket.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Queue lanes */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue lanes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A quick view of what needs attention across the queue
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                View all lanes
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {queueLanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {lane.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        lane.tone === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : lane.tone === "warning"
                          ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
                          : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                      }`}
                    >
                      {lane.count}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {lane.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm leading-6 text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Command card */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                <Flame className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue command view
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Opsfront keeps the queue sorted by forward-looking risk instead
                  of static status so the team can intervene before tickets miss
                  their SLA window.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SignalCard label="Top risk score" value="94" tone="primary" />
              <SignalCard label="Average at-risk SLA" value="46m" />
              <SignalCard label="Escalations in last 24h" value="7" tone="destructive" />
            </div>
          </div>

          {/* Signal breakdown */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Queue signals
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Patterns currently driving exposure in the queue
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {signals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI guidance */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  AI queue guidance
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Suggested next actions based on live queue state
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <AiAction text="Reassign OPS-2459 — currently unowned and approaching SLA watch state." />
              <AiAction text="Prioritize identity queue over finance systems in the next 30 minutes." />
              <AiAction text="Review stalled tickets escalated from triage in the last hour." />
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Quick actions
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Common queue interventions
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <QuickAction label="Open unassigned tickets" />
              <QuickAction label="Review overdue queue" />
              <QuickAction label="View high-priority escalations" />
              <QuickAction label="Rebalance agent ownership" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles =
    priority === "Critical"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : priority === "High"
      ? "border-primary/20 bg-primary/10 text-primary"
      : "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Escalated"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : status === "In Progress"
      ? "border-primary/20 bg-primary/10 text-primary"
      : "border-sky-500/20 bg-sky-500/10 text-sky-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
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
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-2xl font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function AiAction({ text }: { text: string }) {
  return (
    <button className="flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card">
      <div className="mt-1 size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,176,72,0.8)]" />
      <span className="text-sm leading-6 text-foreground">{text}</span>
    </button>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card">
      <span className="text-sm text-foreground">{label}</span>
      <ArrowUpRight className="size-4 text-muted-foreground" />
    </button>
  );
}