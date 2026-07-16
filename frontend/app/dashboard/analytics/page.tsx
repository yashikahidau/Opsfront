
"use client";
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
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState } from "react";
import { exportAnalytics } from "@/lib/analytics";
import RiskTrendChart from "@/components/analytics/RiskTrendChart";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {

  const {
    loading,
    stats,
    riskTrend,
    queueBreakdown,
    agentLoad,
    slaPolicies,
    insights,
    refresh,
  } = useAnalytics();

  const topStats = [
    {
      label: "Total Tickets",
      value: stats?.total ?? 0,
      hint: "Overall volume",
      tone: "primary",
      icon: Activity,
      url: "/dashboard/tickets",
    },
    {
      label: "Open",
      value: stats?.open ?? 0,
      hint: "Currently active",
      tone: "primary",
      icon: AlertTriangle,
      url: "/dashboard/queue?status=open",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      hint: "Successfully completed",
      tone: "success",
      icon: CheckCircle2,
      url: "/dashboard/queue?status=resolved",
    },
    {
      label: "Critical",
      value: stats?.critical ?? 0,
      hint: "Need immediate action",
      tone: "destructive",
      icon: ShieldAlert,
      url: "/dashboard/queue?priority=critical",
    },
    {
      label: "SLA Compliance",
      value: `${stats?.slaCompliance ?? 0}%`,
      hint: "Tickets within SLA",
      tone: "success",
      icon: Clock3,
      url: "/dashboard/queue",
    },
    {
      label: "Escalation Rate",
      value: `${stats?.escalationRate ?? 0}%`,
      hint: "Critical ratio",
      tone: "destructive",
      icon: TrendingUp,
      url: "/dashboard/queue",
    },
  ];

  const [days, setDays] = useState(30);
  const router = useRouter();

  useEffect(() => {
    refresh(days);

    const interval = setInterval(() => {
      refresh(days);
    }, 60000);

    return () => clearInterval(interval);
  }, [days]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-muted-foreground">
          Loading analytics...
        </p>
      </div>
    );
  }

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
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/40 p-1">

            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-full px-4 py-2 text-sm transition-all ${days === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {d} Days
              </button>
            ))}

          </div>
          <button
            onClick={async () => {
              try {
                await exportAnalytics();
              } catch (err) {
                console.error(err);
              }
            }}
            className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            Export report
          </button>
          <button
            onClick={() => refresh(days)}
            disabled={loading}
            className="cursor-pointer rounded-full border border-border bg-background/40 px-5 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
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
              onClick={() =>
                router.push(item.url)
              }
              className={`cursor-pointer rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-primary/20 ${toneClass}`}
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
                  Average queue risk movement over the past {days} days
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                Live Data
              </span>
            </div>

            <div className="mt-6 h-72">
              <RiskTrendChart
                data={riskTrend}
              />
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

              <button
                onClick={() => router.push("/dashboard/agents")}
                className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
              >
                View Team
              </button>
            </div>

            <div className="hidden grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
              <div>Agent</div>
              <div>Open</div>
              <div>At Risk</div>
              <div>Resolved</div>
            </div>

            <div className="divide-y divide-border">
              {agentLoad.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No agents found.
                </div>
              ) : (
                agentLoad.map((agent) => (
                  <div
                    key={agent.name}
                    onClick={() => router.push("/dashboard/agents")}
                    className="grid gap-4 px-5 py-5 transition-all duration-200 hover:bg-background/35 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] md:px-6 cursor-pointer
hover:border-primary/10"
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
                ))
              )}
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

              <button
                onClick={() =>
                  router.push("/dashboard/sla-policies")
                }
                className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
              >
                Open Policies
              </button>
            </div>

            <div className="hidden grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
              <div>Policy</div>
              <div>Response</div>
              <div>Resolution</div>
              <div>Compliance</div>
            </div>

            <div className="divide-y divide-border">
              {slaPolicies.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No SLA policies found.
                </div>
              ) : (

                slaPolicies.map((policy) => (
                  <div
                    key={policy.name}
                    onClick={() =>
                      router.push("/dashboard/sla-policies")
                    }
                    className="grid gap-4 px-5 py-5 transition-all duration-200 hover:bg-background/35 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] md:px-6 cursor-pointer
hover:border-primary/10"
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
                ))
              )}
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
              {queueBreakdown.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  No ticket data available.
                </div>
              ) : (

                queueBreakdown.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      router.push(
                        `/dashboard/queue?category=${item.label}`
                      )
                    }
                    className="w-full rounded-xl p-1 text-left transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="font-mono text-sm text-muted-foreground">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${item.tone}`}
                        style={{
                          width: `${stats?.total
                            ? (item.value / stats.total) * 100
                            : 0
                            }%`,
                        }}
                      />
                    </div>
                  </button>
                ))
              )}
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
              <SignalCard
                label="Critical tickets"
                value={String(stats?.critical ?? 0)}
                tone="destructive"
              />

              <SignalCard
                label="SLA Compliance"
                value={`${stats?.slaCompliance ?? 0}%`}
                tone="primary"
              />

              <SignalCard
                label="Escalation Rate"
                value={`${stats?.escalationRate ?? 0}%`}
              />
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
              <MiniMetric
                label="Active agents"
                value={String(agentLoad.length)}
              />

              <MiniMetric
                label="Avg open per agent"
                value={
                  agentLoad.length
                    ? (
                      agentLoad.reduce(
                        (sum, a) => sum + a.open,
                        0
                      ) / agentLoad.length
                    ).toFixed(1)
                    : "0"
                }
              />

              <MiniMetric
                label="Risk-owned tickets"
                value={String(
                  agentLoad.reduce(
                    (sum, a) => sum + a.risk,
                    0
                  )
                )}
              />
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
              {insights.length === 0 ? (
                <div className="rounded-2xl border border-border bg-background/35 p-6 text-center text-muted-foreground">
                  No insights available.
                </div>
              ) : (

                insights.map((insight) => (
                  <button
                    key={insight}
                    onClick={() => {
                      const text = insight.toLowerCase();

                      if (text.includes("critical")) {
                        router.push("/dashboard/queue?priority=critical");
                        return;
                      }

                      if (text.includes("waiting")) {
                        router.push("/dashboard/queue?status=waiting");
                        return;
                      }

                      if (text.includes("unassigned")) {
                        router.push("/dashboard/queue?assignee=unassigned");
                        return;
                      }

                      if (text.includes("sla")) {
                        router.push("/dashboard/sla-policies");
                        return;
                      }

                      router.push("/dashboard/queue");
                    }}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                  >
                    <span className="text-sm leading-6 text-foreground">
                      {insight}
                    </span>

                    <ArrowUpRight className="mt-1 size-4 text-muted-foreground" />
                  </button>
                ))
              )}
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