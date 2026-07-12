"use client";

import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { Ticket } from "@/lib/ticket";

interface LiveTicketTableProps {
  tickets: Ticket[];
}

export default function LiveTicketTable({
  tickets,
}: LiveTicketTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/30">

      <div className="border-b border-border px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold text-foreground">
              Live Ticket Queue
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Real-time support operations.
            </p>

          </div>

          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tickets.length} Active
          </span>

        </div>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b border-border text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">

            <th className="px-6 py-4">
              Ticket
            </th>

            <th className="px-6 py-4">
              Priority
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4">
              Assignee
            </th>

            <th className="px-6 py-4">
              Risk
            </th>

          </tr>

        </thead>

        

        <tbody>

  {tickets.length === 0 ? (

    <tr>

      <td
        colSpan={5}
        className="px-6 py-20 text-center"
      >

        <div className="mx-auto max-w-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">

            <AlertTriangle className="h-6 w-6 text-muted-foreground" />

          </div>

          <h3 className="mt-5 text-lg font-semibold text-foreground">
            No tickets yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Your support queue is empty.
            Create your first ticket to start tracking
            operations.
          </p>

        </div>

      </td>

    </tr>

  ) : (

    tickets.map((ticket) => (

            <tr
              key={ticket._id}
              className="border-b border-border/50 transition hover:bg-background/40"
            >

              <td className="px-6 py-5">

                <Link
                  href={`/dashboard/tickets/${ticket._id}`}
                  className="block"
                >

                  <p className="font-medium text-foreground">
                    {ticket.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    #{ticket._id.slice(-6).toUpperCase()}
                  </p>

                </Link>

              </td>

              <td className="px-6 py-5">

                <span className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                  {ticket.priority}
                </span>

              </td>

              <td className="px-6 py-5">

                <span className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                  {ticket.status}
                </span>

              </td>

              <td className="px-6 py-5 text-sm text-muted-foreground">

                {ticket.assignedTo
                  ? ticket.assignedTo.name
                  : "Unassigned"}

              </td>

              <td className="px-6 py-5">

                <div className="flex items-center gap-2">

                  <AlertTriangle className="size-4 text-primary" />

                  <span className="font-mono text-sm">
                    {ticket.riskScore}
                  </span>

                </div>

              </td>

            </tr>

          ))
     )}

        </tbody>

      </table>

    </div>
  );
}