import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import { Ticket } from "@/lib/ticket";

export interface DashboardOverview {
  totalTickets: number;

  openTickets: number;

  inProgressTickets: number;

  waitingTickets: number;

  resolvedTickets: number;

  criticalTickets: number;

  highRiskTickets: number;

  slaCompliance: number;

  latestTickets: Ticket[];
}

export interface DashboardResponse {
  success: boolean;

  overview: DashboardOverview;
}

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export function getDashboardOverview() {
  return apiRequest<DashboardResponse>(
    "/api/dashboard",
    {
      method: "GET",
      token: token(),
    }
  );
}