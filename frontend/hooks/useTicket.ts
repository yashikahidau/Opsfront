"use client";

import { useEffect, useState } from "react";

import {
  getTicket,
  updateTicketStatus,
  updateTicketPriority,
  Ticket,
  TicketStatus,
  TicketPriority,
} from "@/lib/ticket";

export function useTicket(id: string) {
  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function refresh() {
    try {
      setLoading(true);

      const response = await getTicket(id);

      setTicket(response.ticket);

      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      refresh();
    }
  }, [id]);

  async function changeStatus(
    status: TicketStatus
  ) {
    if (!ticket) return;

    const response =
      await updateTicketStatus(
        ticket._id,
        status
      );

    setTicket(response.ticket);
  }

  async function changePriority(
  priority: TicketPriority
) {
  const response =
    await updateTicketPriority(
      id,
      priority
    );

  setTicket(response.ticket);
}

  async function resolveTicket() {
  const response = await updateTicketStatus(
    id,
    "resolved"
  );

  setTicket(response.ticket);
}

  return {
  ticket,
  loading,
  error,
  refresh,
  changeStatus,
  changePriority,
  resolveTicket,
};
}