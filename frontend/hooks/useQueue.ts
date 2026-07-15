"use client";

import { useEffect, useState } from "react";

import {
  getQueue,
  QueueStats,
  QueueTicket,
} from "@/lib/queue";

export function useQueue() {
  const [tickets, setTickets] =
    useState<QueueTicket[]>([]);

  const [stats, setStats] =
    useState<QueueStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  async function refresh(filters?: {
    search?: string;
    priority?: string;
    status?: string;
    assignee?: string;
    category?: string;
    sort?: string;
  }) {
    try {
      if (!initialized) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response =
        await getQueue(filters);

      setTickets(response.tickets);

      setStats(response.stats);
    } finally {
      setInitialized(true);

      setLoading(false);

      setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    tickets,
    stats,
    loading,
    refreshing,
    refresh,
  };
}