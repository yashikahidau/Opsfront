"use client";
import { useDashboard } from "@/hooks/useDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateTicketDialog from "@/components/opsfront/dashboard/create-ticket-dialog";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  Ticket,
  TrendingUp,
} from "lucide-react";
import LiveTicketTable from "@/components/opsfront/dashboard/live-ticket-table";

const buildKPIs = (
  data: ReturnType<
    typeof useDashboard
  >["data"]
) => [
    {
      label: "Open tickets",
      value: String(
        data?.openTickets ?? 0
      ),
      hint: "Currently open support requests.",
      icon: Ticket,
      tone: "default",
    },

    {
      label: "At-risk tickets",
      value: String(
        data?.highRiskTickets ?? 0
      ),
      hint: "Risk score above 70.",
      icon: AlertTriangle,
      tone: "primary",
    },

    {
      label: "Critical tickets",
      value: String(
        data?.criticalTickets ?? 0
      ),
      hint: "Critical priority requests.",
      icon: ShieldAlert,
      tone: "destructive",
    },

    {
      label: "SLA compliance",
      value: `${data?.slaCompliance ?? 100}%`,
      hint: "Resolved within SLA.",
      icon: CheckCircle2,
      tone: "success",
    },

    {
      label: "In Progress",
      value: String(
        data?.inProgressTickets ?? 0
      ),
      hint: "Currently being worked on.",
      icon: Clock3,
      tone: "default",
    },

    {
      label: "Resolved",
      value: String(
        data?.resolvedTickets ?? 0
      ),
      hint: "Completed successfully.",
      icon: TrendingUp,
      tone: "primary",
    },
  ];


const activity = [
  "AI triage raised OPS-2481 from High to Critical based on stale inactivity and SLA proximity.",
  "Two tickets moved from Watch to At Risk in the access-management queue.",
  "SLA compliance improved 3.2 points week-over-week after reducing unassigned tickets.",
];

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useDashboard();

  const kpis = buildKPIs(data);

  const escalations =
    data?.latestTickets ?? [];

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-6 py-4">
          <LoadingSpinner className="h-5 w-5 text-primary" />

          <span className="text-sm text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
              Risk cockpit
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              See what needs attention before deadlines slip.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Opsfront helps internal teams manage support tickets, track SLA
              deadlines, and surface at-risk requests before they breach —
              through AI-assisted triage and a live support operations cockpit.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <CreateTicketDialog
              onCreated={refresh}
            />
            <button className="rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-card">
              Open ticket queue
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary/80">
            Live signal
          </p>
          <div className="mt-4">
            <p className="font-mono text-5xl font-semibold tracking-tight text-primary">
              94
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Current top risk score across all active tickets
            </p>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[94%] rounded-full bg-primary" />
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">Top exposure</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                VPN auth failing for finance team
              </p>
              <p className="mt-1 font-mono text-xs text-primary">
                OPS-2481 · breaching in 18m
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">Queue status</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                12 tickets under active risk watch
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                3 already overdue · 4 escalated in the last 24h
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => {
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
              className={`rounded-3xl border p-5 transition duration-200 hover:-translate-y-[1px] ${toneClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <h3 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.hint}
                  </p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                  <Icon className={`size-5 ${iconClass}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Live cockpit preview
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Risk-ranked queue, live SLA scan state, and active exposure tracking.
                </p>
              </div>
            </div>

            <LiveTicketTable
              tickets={data?.latestTickets ?? []}
            />

          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Recent escalations
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tickets currently requiring immediate attention
                </p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                Live
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {escalations.map((ticket) => (
                <div
                  key={ticket._id}
                  className="rounded-2xl border border-border bg-background/40 p-4 transition hover:border-primary/20"
                >
                  <p className="font-mono text-[11px] text-primary">
                    #{ticket._id.slice(-6).toUpperCase()}
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {ticket.title}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">

                    <span className="rounded-full border border-border px-2 py-0.5">
                      {ticket.priority}
                    </span>

                    <span className="rounded-full border border-border px-2 py-0.5">
                      {ticket.status}
                    </span>

                    <span>
                      {ticket.assignedTo
                        ? ticket.assignedTo.name
                        : "Unassigned"}
                    </span>

                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <p className="text-sm font-medium text-foreground">
              Ops insights
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Live movement across queue health and triage activity
            </p>

            <div className="mt-5 space-y-3">
              {activity.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-background/40 p-4 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}