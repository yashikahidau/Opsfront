"use client";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Filter,
  Search,
  ShieldAlert,
  Ticket,
} from "lucide-react";

import { useMemo } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import FormAlert from "@/components/form/FormAlert";

import CreateTicketDialog from "@/components/opsfront/dashboard/create-ticket-dialog";

import { useTickets } from "@/hooks/useTickets";

const ticketStats = [
  {
    label: "Open",
    value: "148",
    hint: "Active queue",
    tone: "default",
    icon: Ticket,
  },
  {
    label: "At Risk",
    value: "12",
    hint: "Need action",
    tone: "primary",
    icon: AlertTriangle,
  },
  {
    label: "Overdue",
    value: "3",
    hint: "Past SLA",
    tone: "destructive",
    icon: ShieldAlert,
  },
  {
    label: "Due Soon",
    value: "18",
    hint: "Within 4h",
    tone: "warning",
    icon: Clock3,
  },
] as const;


const statusFilters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Open",
    value: "open",
  },
  {
    label: "In Progress",
    value: "in-progress",
  },
  {
    label: "Waiting",
    value: "waiting",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "Closed",
    value: "closed",
  },
];

export default function TicketsPage() {

  const {
    tickets,
    loading,
    error,
    refresh,
    filters,
    setFilters,
  } = useTickets();

  const ticketStats = useMemo(() => {

    const open =
      tickets.filter(
        (t) => t.status === "open"
      ).length;

    const risk =
      tickets.filter(
        (t) => t.riskScore >= 70
      ).length;

    const overdue =
      tickets.filter(
        (t) => t.status === "waiting"
      ).length;

    const dueSoon =
      tickets.filter(
        (t) =>
          t.status ===
          "in-progress"
      ).length;

    return [
      {
        label: "Open",
        value: String(open),
        hint: "Active queue",
        tone: "default",
        icon: Ticket,
      },

      {
        label: "At Risk",
        value: String(risk),
        hint: "Need action",
        tone: "primary",
        icon: AlertTriangle,
      },

      {
        label: "Overdue",
        value: String(overdue),
        hint: "Past SLA",
        tone: "destructive",
        icon: ShieldAlert,
      },

      {
        label: "Due Soon",
        value: String(dueSoon),
        hint: "Within SLA",
        tone: "warning",
        icon: Clock3,
      },

    ];

  }, [tickets]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-6 py-4">
          <LoadingSpinner className="h-5 w-5 text-primary" />

          <span className="text-sm text-muted-foreground">
            Loading tickets...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <FormAlert variant="error">
        {error}
      </FormAlert>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Ticket operations
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Manage the queue without losing sight of risk.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Filter the support queue, track SLA windows, and quickly spot tickets
            drifting toward breach.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <CreateTicketDialog
            onCreated={refresh}
          />
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card hover:text-foreground">
            Export queue
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ticketStats.map((item) => {
          const Icon = item.icon;

          const toneClass =
            item.tone === "primary"
              ? "border-primary/20 bg-primary/[0.06]"
              : item.tone === "destructive"
                ? "border-destructive/20 bg-destructive/[0.06]"
                : item.tone === "warning"
                  ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/[0.06]"
                  : "border-border bg-card/40";

          const iconClass =
            item.tone === "primary"
              ? "text-primary"
              : item.tone === "destructive"
                ? "text-destructive"
                : item.tone === "warning"
                  ? "text-[color:var(--warning)]"
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

      {/* Filters / Search */}
      <section className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 lg:max-w-md">

                <Search className="size-4 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search ticket..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />

              </div>

              <div className="flex flex-wrap gap-2">
                <button className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  <Filter className="size-4" />
                  Filters
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  Priority
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  Status
                </button>
                <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                  SLA
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] px-4 py-3">
              <p className="text-xs text-muted-foreground">Queue snapshot</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {tickets.filter((t) => t.riskScore >= 70).length} at risk ·{" "}
                {tickets.filter((t) => t.status === "waiting").length} waiting ·{" "}
                {tickets.filter((t) => !t.assignedTo).length} unassigned
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    status: filter.value,
                  }))
                }
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all duration-200 ${filters.status === filter.value
                  ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.18)]"
                  : "border border-border bg-background/40 text-foreground hover:border-primary/20 hover:bg-card"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets Table */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card/30">
        {/* Desktop header */}
        <div className="hidden grid-cols-[0.9fr_2.2fr_1.2fr_0.95fr_0.95fr_1fr_0.9fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground lg:grid">
          <div>Ticket</div>
          <div>Issue</div>
          <div>Requester / Assignee</div>
          <div>Priority</div>
          <div>Status</div>
          <div>SLA</div>
          <div>Risk</div>
        </div>

        <div className="divide-y divide-border">
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              href={`/dashboard/tickets/${ticket._id}`}
              className="block cursor-pointer transition-all duration-200 hover:bg-background/35"
            >
              {/* Desktop row */}
              <div className="hidden grid-cols-[0.9fr_2.2fr_1.2fr_0.95fr_0.95fr_1fr_0.9fr] gap-4 px-6 py-5 lg:grid">
                <div>
                  <p className="font-mono text-sm font-medium text-primary">
                    #{ticket._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ticket.category.charAt(0).toUpperCase() +
                      ticket.category.slice(1)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {ticket.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-foreground">{ticket.createdBy.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ticket.assignedTo
                      ? ticket.assignedTo.name
                      : "Unassigned"}
                  </p>
                </div>

                <div className="flex items-start">
                  <PriorityBadge
                    priority={
                      ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)
                    }
                  />
                </div>

                <div className="flex items-start">
                  <StatusBadge
                    status={
                      ticket.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (c) =>
                          c.toUpperCase()
                        )
                    }
                  />
                </div>

                <div>
                  <p className="text-sm text-foreground">{ticket.slaDeadline
                    ? new Date(
                      ticket.slaDeadline
                    ).toLocaleString()
                    : "No SLA"}</p>
                </div>

                <div className="flex items-start">
                  <RiskBadge
                    tone={
                      ticket.riskScore >= 90
                        ? "overdue"
                        : ticket.riskScore >= 70
                          ? "risk"
                          : ticket.riskScore >= 40
                            ? "watch"
                            : "safe"
                    }
                    label={`${ticket.riskScore}%`}
                  />
                </div>
              </div>

              {/* Mobile / tablet */}
              <div className="space-y-4 px-5 py-5 lg:hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm font-medium text-primary">
                      {ticket._id}
                    </p>
                    <h3 className="mt-1 text-sm font-medium text-foreground">
                      {ticket.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ticket.category.charAt(0).toUpperCase() +
                        ticket.category.slice(1)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <RiskBadge
                      tone={
                        ticket.riskScore >= 90
                          ? "overdue"
                          : ticket.riskScore >= 70
                            ? "risk"
                            : ticket.riskScore >= 40
                              ? "watch"
                              : "safe"
                      }
                      label={`${ticket.riskScore}%`}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Requester
                    </p>
                    <p className="mt-1 text-sm text-foreground">{ticket.createdBy.name}</p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Assignee
                    </p>
                    <p className="mt-1 text-sm text-foreground">{ticket.assignedTo
                      ? ticket.assignedTo.name
                      : "Unassigned"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      SLA
                    </p>
                    <p className="mt-1 text-sm text-foreground">{ticket.slaDeadline
                      ? new Date(
                        ticket.slaDeadline
                      ).toLocaleString()
                      : "No SLA"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge
                        status={
                          ticket.status
                            .replace("-", " ")
                            .replace(/\b\w/g, (c) =>
                              c.toUpperCase()
                            )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <PriorityBadge
                    priority={
                      ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)
                    }
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {tickets.length}
            </span>{" "}
            tickets
            <span className="font-medium text-foreground">148</span> tickets
          </p>

          <div className="flex items-center gap-2">
            <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              Previous
            </button>
            <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              1
            </button>
            <button className="cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_18px_rgba(255,176,72,0.18)]">
              2
            </button>
            <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              3
            </button>
            <button className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              Next
              <ArrowUpRight className="size-4 rotate-45" />
            </button>
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
        : priority === "Medium"
          ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
          : "border-border bg-background/50 text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
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
        : status === "Open"
          ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
          : status === "Resolved"
            ? "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]"
            : "border-border bg-background/50 text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

function RiskBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  const styles =
    tone === "safe"
      ? "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]"
      : tone === "watch"
        ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
        : tone === "risk"
          ? "border-primary/20 bg-primary/10 text-primary"
          : "border-destructive/20 bg-destructive/10 text-destructive";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}