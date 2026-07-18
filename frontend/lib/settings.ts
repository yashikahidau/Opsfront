import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

export interface WorkspaceSettings {
  _id: string;

  workspaceName: string;
  supportEmail: string;
  primaryTeam: string;
  timezone: string;

  notifications: {
    escalationAlerts: boolean;
    leadAlerts: boolean;
    dailySummary: boolean;
    slackDigest: boolean;
  };

  automation: {
    autoAssign: boolean;
    autoEscalation: boolean;
    queueFallback: string;
    riskInterval: string;
  };

  security: {
    twoFactor: boolean;
    googleLogin: boolean;
    sessionTimeout: boolean;
  };
}

export interface SettingsResponse {
  success: boolean;
  settings: WorkspaceSettings;
}

export function getSettings() {
  return apiRequest<SettingsResponse>(
    "/api/settings",
    {
      token: getStoredToken() ?? undefined,
    }
  );
}

export function updateSettings(
  settings: Partial<WorkspaceSettings>
) {
  return apiRequest<SettingsResponse>(
    "/api/settings",
    {
      method: "PUT",
      body: settings,
      token: getStoredToken() ?? undefined,
    }
  );
}