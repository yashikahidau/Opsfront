"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  deleteTicket,
  getTickets,
  Ticket,
  TicketFilters,
} from "@/lib/ticket";

import { toast } from "sonner";
import { useDeferredValue } from "react";

export function useTickets() {
  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filters, setFilters] =
    useState<TicketFilters>({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
    });

    const deferredSearch = useDeferredValue(
  filters.search
);

  const loadTickets =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getTickets(filters);

        setTickets(response.tickets);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load tickets."
        );
      } finally {
        setLoading(false);
      }
    }, [
  deferredSearch,
  filters.status,
  filters.priority,
  filters.category,
]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const removeTicket =
    async (id: string) => {
      try {
        await deleteTicket(id);

        setTickets((prev) =>
          prev.filter(
            (ticket) =>
              ticket._id !== id
          )
        );

        toast.success(
          "Ticket deleted."
        );
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Unable to delete ticket."
        );
      }
    };

  return {
    tickets,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadTickets,
    deleteTicket: removeTicket,
  };
}