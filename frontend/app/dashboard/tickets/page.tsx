"use client";

import TicketsTable from "@/components/opsfront/dashboard/tickets-table";
import TicketStats from "@/components/opsfront/dashboard/ticket-stats";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import FormAlert from "@/components/form/FormAlert";

import CreateTicketDialog from "@/components/opsfront/dashboard/create-ticket-dialog";
import TicketFilters from "@/components/opsfront/dashboard/ticket-filters";

import { useTickets } from "@/hooks/useTickets";

import { exportTicketsToCSV } from "@/lib/exportTickets";

import { useAuth } from "@/context/AuthContext";

export default function TicketsPage() {

  const {
    tickets,
    loading,
    isFetching,
    error,
    refresh,
    filters,
    setFilters,
    page,
    setPage,
    pagination,
  } = useTickets();
  const { user } = useAuth();

  const isCustomer =
    user?.userType === "customer";


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
            {isCustomer ? "Support Center" : "Ticket Operations"}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {isCustomer
              ? "My Support Tickets"
              : "Manage the queue without losing sight of risk."}
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">

            {isCustomer
              ? "Track your requests, reply to conversations, and create new support tickets whenever you need assistance."
              : "Filter the support queue, track SLA windows, and quickly spot tickets drifting toward breach."}

          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <CreateTicketDialog
            onCreated={refresh}
          />

          {!isCustomer && (

            <button
              onClick={() => exportTicketsToCSV(tickets)}
              disabled={tickets.length === 0}
              className="cursor-pointer rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/20 hover:bg-card disabled:opacity-50"
            >
              Export Queue
            </button>

          )}

        </div>

      </section>

      {/* Stats */}
      {!isCustomer && (
        <TicketStats tickets={tickets} />
      )}

      {/* Filters / Search */}
      <TicketFilters
        filters={filters}
        setFilters={setFilters}
        isFetching={isFetching}
      />

      {!isCustomer && (

        <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] px-4 py-3">

          <p className="text-xs text-muted-foreground">
            Queue Snapshot
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">

            {tickets.filter((t) => t.riskScore >= 70).length}
            {" "}at risk ·{" "}

            {tickets.filter((t) => t.status === "waiting").length}
            {" "}waiting ·{" "}

            {tickets.filter((t) => !t.assignedTo).length}
            {" "}unassigned

          </p>

        </div>

      )}

      {/* Tickets Table */}
      <TicketsTable
  tickets={tickets}
  page={page}
  setPage={setPage}
  pagination={pagination}
  isCustomer={isCustomer}
/>
    </div>
  );
}
