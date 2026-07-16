import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

export interface AnalyticsStats {
  total: number;
  open: number;
  waiting: number;
  resolved: number;
  critical: number;
  slaCompliance: number;
  escalationRate: number;
  medianResolution: string;
}

export interface RiskTrend {
  day: string;
  value: number;
}

export interface QueueBreakdown {
  label: string;
  value: number;
  tone: string;
}

export interface AgentLoad {
  name: string;
  open: number;
  risk: number;
  resolved: number;
}

export interface SlaPolicy {
  name: string;
  response: string;
  resolution: string;
  compliance: string;
}

export function getAnalytics(
  days = 30
) {
  return apiRequest<{
    success: boolean;
    stats: AnalyticsStats;
    riskTrend: RiskTrend[];
    queueBreakdown: QueueBreakdown[];
    agentLoad: AgentLoad[];
    slaPolicies: SlaPolicy[];
    insights: string[];
  }>(
    `/api/analytics?days=${days}`,
    {
      token:
        getStoredToken() ??
        undefined,
    }
  );
}

export async function exportAnalytics() {
  const token = getStoredToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/export`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export report.");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "analytics-report.csv";

  document.body.appendChild(a);

  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);
}
