"use client";

import { useEffect, useState } from "react";

import {
  getAnalytics,
  AnalyticsStats,
  RiskTrend,
  QueueBreakdown,
  AgentLoad,
  SlaPolicy,
} from "@/lib/analytics";

export function useAnalytics() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<AnalyticsStats | null>(null);

  const [riskTrend, setRiskTrend] =
    useState<RiskTrend[]>([]);

  const [queueBreakdown, setQueueBreakdown] =
    useState<QueueBreakdown[]>([]);

  const [agentLoad, setAgentLoad] =
    useState<AgentLoad[]>([]);

  const [slaPolicies, setSlaPolicies] =
    useState<SlaPolicy[]>([]);

  const [insights, setInsights] =
    useState<string[]>([]);

async function refresh(
  days = 30
) {
    try {
      setLoading(true);

      const response =
       await getAnalytics(days);

      setStats(response.stats);

      setRiskTrend(response.riskTrend);

      setQueueBreakdown(
        response.queueBreakdown
      );

      setAgentLoad(
        response.agentLoad
      );

      setSlaPolicies(
        response.slaPolicies
      );

      setInsights(
        response.insights
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    loading,
    stats,
    riskTrend,
    queueBreakdown,
    agentLoad,
    slaPolicies,
    insights,
    refresh,
  };
}