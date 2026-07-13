import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import type { Ticket } from "@/lib/ticket";

interface SearchResponse {
  success: boolean;
  tickets: Ticket[];
}

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export async function searchWorkspace(query: string) {
  return apiRequest<SearchResponse>(
    `/api/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      token: token(),
    }
  );
}