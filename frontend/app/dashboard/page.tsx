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
import { useAuth } from "@/context/AuthContext";


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

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useDashboard();

  const { user } = useAuth();

  const isCustomer =
    user?.userType === "customer";

  const kpis = isCustomer
    ? buildKPIs(data).filter((item) =>
      [
        "Open tickets",
        "In Progress",
        "Resolved",
      ].includes(item.label)
    )
    : buildKPIs(data);

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
      {isCustomer ? (
        <>
          <section className="rounded-3xl border border-border bg-card/30 p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
                Welcome
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Need help? We're here to assist.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Create a support ticket, track its progress, and receive updates from our
                support team—all in one place.
              </p>

              <div className="mt-6">
                <CreateTicketDialog onCreated={refresh} />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {kpis.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-3xl border border-border bg-card/40 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>

                      <h3 className="mt-3 font-mono text-3xl font-semibold text-foreground">
                        {item.value}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.hint}
                      </p>
                    </div>

                    <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                      <Icon className="size-5 text-primary" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                My Recent Tickets
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                View the latest status of your submitted support requests.
              </p>
            </div>

            <LiveTicketTable
              tickets={data?.latestTickets ?? []}
            />
          </section>
        </>
      ) : (
        <>
          <section className="max-w-6xl">
            <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
                  Operations Overview
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Monitor ticket activity, SLA compliance, and assigned support requests.
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
              </div>
            </div>

          </section>

          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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

          <section className="items-start grid gap-6 xl:grid-cols-[3fr_2fr]">
            <div className="h-full rounded-3xl border border-border bg-card/30 p-5">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Recent Tickets
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Recently created and updated tickets.
                    </p>
                  </div>
                </div>

                <LiveTicketTable
                  tickets={data?.latestTickets ?? []}
                />

              </div>
            </div>

            <div className="h-full rounded-3xl border border-border bg-card/30 p-5">

  <div>
    <p className="text-sm font-medium text-foreground">
      Recently Updated Tickets
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      Most recently modified support tickets.
    </p>
  </div>

  <div className="mt-5 space-y-3">
    {escalations.slice(0,4).map((ticket) => (
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
          </section>
        </>
      )}
    </div>
  );
}