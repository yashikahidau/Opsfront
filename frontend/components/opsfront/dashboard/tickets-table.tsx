"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import {
  PriorityBadge,
  RiskBadge,
  StatusBadge,
} from "./ticket-badges";

import type { Ticket } from "@/lib/ticket";

interface TicketsTableProps {
  tickets: Ticket[];

  page: number;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  pagination: {
    page: number;
    limit: number;
    totalTickets: number;
    totalPages: number;
  };
}

export default function TicketsTable({
  tickets,
  page,
  setPage,
  pagination,
}: TicketsTableProps) {
  return (
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
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <Search className="mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-semibold text-foreground">
              No matching tickets
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try another keyword or clear your filters to see all tickets.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
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
                        .replace(/\b\w/g, (c: string) =>
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
                            .replace(/\b\w/g, (c: string) =>
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
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>
          {" - "}
          <span className="font-medium text-foreground">
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalTickets
            )}
          </span>
          {" of "}
          <span className="font-medium text-foreground">
            {pagination.totalTickets}
          </span>{" "}
          tickets
        </p>

        <div className="flex items-center gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-primary/20 hover:bg-card"
          >
            Previous
          </button>

          {Array.from(
            { length: pagination.totalPages },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setPage(index + 1)}
                className={
                  page === index + 1
                    ? "cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_18px_rgba(255,176,72,0.18)]"
                    : "cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
                }
              >
                {index + 1}
              </button>
            )
          )}

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-primary/20 hover:bg-card"
          >
            Next
            <ArrowUpRight className="size-4 rotate-45" />
          </button>

        </div>
      </div>
    </section>
  );
}