import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

export interface SlaPolicy {
  _id: string;
  name: string;
  priority: string;
  response: string;
  resolution: string;
  escalation: string;
  compliance: number;
  status: string;
}

export interface UpdatePolicyInput {
  response: string;
  resolution: string;
  escalation: string;
  status: string;
}

export function updatePolicy(
  id: string,
  data: UpdatePolicyInput
) {
  return apiRequest<{
    success: boolean;
    message: string;
    policy: SlaPolicy;
  }>(
    `/api/sla-policies/${id}`,
    {
      method: "PUT",
      body: data,
      token: getStoredToken() ?? undefined,
    }
  );
}

export interface SlaHealth {
  breachedToday: number;
  atRisk: number;
  avgFirstResponse: string;
}


export interface SlaDashboardResponse {
  success: boolean;
  policies: SlaPolicy[];
  health: SlaHealth;
  recommendations: string[];
}

export function getSlaDashboard() {
  return apiRequest<SlaDashboardResponse>(
    "/api/sla-policies",
    {
      token: getStoredToken() ?? undefined,
    }
  );
}

export async function exportPolicies() {
  const token = getStoredToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sla-policies/export`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export policies.");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "sla-policies.csv";

  document.body.appendChild(a);

  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);
}