import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  ShieldAlert,
  Sparkles,
  Users,
  UserRoundPlus,
} from "lucide-react";

const teamStats = [
  {
    label: "Active agents",
    value: "14",
    tone: "default",
    icon: Users,
  },
  {
    label: "At-risk owned",
    value: "12",
    tone: "primary",
    icon: AlertTriangle,
  },
  {
    label: "Escalated",
    value: "4",
    tone: "destructive",
    icon: ShieldAlert,
  },
  {
    label: "Avg resolution",
    value: "3h 42m",
    tone: "success",
    icon: CheckCircle2,
  },
] as const;

const agents = [
  {
    name: "D. Cho",
    role: "Access Management",
    status: "Online",
    open: 18,
    risk: 4,
    resolved: 26,
    load: 86,
    tone: "high",
  },
  {
    name: "M. Ali",
    role: "Infra Access",
    status: "Online",
    open: 14,
    risk: 3,
    resolved: 22,
    load: 72,
    tone: "watch",
  },
  {
    name: "J. Kim",
    role: "Identity",
    status: "Focus mode",
    open: 11,
    risk: 2,
    resolved: 19,
    load: 58,
    tone: "stable",
  },
  {
    name: "S. Gupta",
    role: "Finance Systems",
    status: "Online",
    open: 9,
    risk: 1,
    resolved: 17,
    load: 44,
    tone: "stable",
  },
  {
    name: "R. Mehta",
    role: "IT Ops",
    status: "Online",
    open: 8,
    risk: 1,
    resolved: 15,
    load: 39,
    tone: "stable",
  },
];

const reassignments = [
  "Move 1 high-risk access ticket away from D. Cho",
  "Assign one unowned finance request to S. Gupta",
  "Route new identity tickets to J. Kim for the next hour",
];

const insights = [
  {
    label: "Highest load",
    value: "D. Cho · 86%",
  },
  {
    label: "Best resolution output",
    value: "D. Cho · 26 resolved",
  },
  {
    label: "Most available capacity",
    value: "R. Mehta · 39% load",
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Team operations
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Keep workload balanced across the support team.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Track who owns risky work, who has capacity, and where reassignment is
            needed before queue pressure builds.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Team filters
          </button>
          <button className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            <UserRoundPlus className="size-4" />
            Add agent
          </button>
        </div>
      </section>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teamStats.map((item) => {
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
                </div>

                <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                  <Icon className={`size-5 ${iconClass}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        {/* Left side */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
          <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Agent roster</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ownership, load, and risky ticket pressure by agent
              </p>
            </div>

            <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              View all queues
            </button>
          </div>

          <div className="divide-y divide-border">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="px-5 py-5 transition-all duration-200 hover:bg-background/35 sm:px-6"
              >
                <div className="rounded-3xl border border-border bg-background/[0.28] p-4 sm:p-5">
                  {/* Row 1 */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Identity */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {agent.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-foreground">
                          {agent.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {agent.role}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span
                            className={`text-sm ${
                              agent.status === "Online"
                                ? "text-[color:var(--success)]"
                                : "text-primary"
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right top controls */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:min-w-[330px]">
                      <div className="min-w-[180px] flex-1 rounded-2xl border border-border bg-card/50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            Load
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              agent.tone === "high"
                                ? "text-destructive"
                                : agent.tone === "watch"
                                ? "text-primary"
                                : "text-[color:var(--success)]"
                            }`}
                          >
                            {agent.load}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              agent.tone === "high"
                                ? "bg-destructive"
                                : agent.tone === "watch"
                                ? "bg-primary"
                                : "bg-[color:var(--success)]"
                            }`}
                            style={{ width: `${agent.load}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                          Reassign
                        </button>
                        <button className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <AgentMetric label="Open tickets" value={String(agent.open)} />
                    <AgentMetric
                      label="At risk"
                      value={String(agent.risk)}
                      tone="primary"
                    />
                    <AgentMetric
                      label="Resolved"
                      value={String(agent.resolved)}
                      tone="success"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Snapshot */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Team snapshot
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current ownership pressure across the support team
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <MiniMetric label="Average load" value="59%" />
              <MiniMetric label="Agents under watch" value="2" tone="primary" />
              <MiniMetric label="Escalated ownership" value="4" tone="destructive" />
            </div>
          </div>

          {/* Insights */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Team insights</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fast read on current team performance
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {insights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested reassignments */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Suggested reassignments
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recommended moves based on load and risk
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {reassignments.map((item) => (
                <button
                  key={item}
                  className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <span className="text-sm leading-6 text-foreground">
                    {item}
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

function AgentMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "success";
}) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
      ? "text-[color:var(--success)]"
      : "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-3 transition-all duration-200 hover:border-primary/10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-lg font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
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
      <p className={`mt-2 font-mono text-xl font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}