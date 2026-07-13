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
import { useDebounce } from "@/hooks/useDebounce";

export function useTickets() {
  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalTickets: 0,
    totalPages: 1,
  });

  const [loading, setLoading] =
    useState(true);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [isFetching, setIsFetching] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filters, setFilters] =
    useState<TicketFilters>({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
    });

  const debouncedSearch =
    useDebounce(filters.search, 300);
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.category,
  ]);

  const loadTickets = useCallback(async () => {
    const requestFilters = {
      search: debouncedSearch,
      status: filters.status,
      priority: filters.priority,
      category: filters.category,
    };

    try {
      if (initialLoading) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      setError("");

      const response = await getTickets(
        requestFilters,
        {
          page,
          limit: pagination.limit,
        }
      );
      setTickets(response.tickets);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tickets."
      );
    } finally {
      setLoading(false);
      setIsFetching(false);
      setInitialLoading(false);
    }
  }, [
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.category,
    page,
    pagination.limit,
    initialLoading,
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
    isFetching,

    filters,
    setFilters,

    page,
    setPage,

    pagination,

    refresh: loadTickets,

    deleteTicket: removeTicket,
  };
}