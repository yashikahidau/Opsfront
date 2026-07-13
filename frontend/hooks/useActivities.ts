"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  getActivities,
} from "@/lib/activity";

export function useActivities(
  ticketId: string
) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function refresh() {
    try {
      const response =
        await getActivities(ticketId);

      setActivities(response.activities);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticketId) {
      refresh();
    }
  }, [ticketId]);

  return {
    activities,
    loading,
    refresh,
  };
}