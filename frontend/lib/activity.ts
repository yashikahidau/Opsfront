import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export interface Activity {
  _id: string;

  type:
    | "created"
    | "status"
    | "priority"
    | "comment"
    | "assigned"
    | "resolved"
    | "updated";

  message: string;

  createdAt: string;

  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ActivityResponse {
  success: boolean;
  activities: Activity[];
}

export function getActivities(
  ticketId: string
) {
  return apiRequest<ActivityResponse>(
    `/api/activities/${ticketId}`,
    {
      token: token(),
    }
  );
}