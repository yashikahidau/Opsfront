"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DashboardOverview,
  getDashboardOverview,
} from "@/lib/dashboard";

export function useDashboard() {
  const [data, setData] =
    useState<DashboardOverview | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getDashboardOverview();

      setData(response.overview);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    loading,
    error,
    refresh: loadDashboard,
  };
}