import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export type TicketStatus =
  | "open"
  | "in-progress"
  | "waiting"
  | "resolved"
  | "closed";

export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TicketCategory =
  | "bug"
  | "feature"
  | "billing"
  | "support"
  | "other";

export interface TicketUser {
  _id: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id: string;

  title: string;

  description: string;

  status: TicketStatus;

  priority: TicketPriority;

  category: TicketCategory;

  riskScore: number;

  slaDeadline: string | null;

  createdBy: TicketUser;

  assignedTo: TicketUser | null;

  tags: string[];

  createdAt: string;

  updatedAt: string;
}

export interface TicketResponse {
  success: boolean;
  ticket: Ticket;
}

export interface TicketsResponse {
  success: boolean;

  tickets: Ticket[];

  pagination: {
    page: number;
    limit: number;
    totalTickets: number;
    totalPages: number;
  };
}

export interface CreateTicketPayload {
  title: string;

  description: string;

  priority?: TicketPriority;

  category?: TicketCategory;

  assignedTo?: string;

  tags?: string[];
}


export interface TicketFilters {
  search?: string;

  status?: string;

  priority?: string;

  category?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export function createTicket(
  payload: CreateTicketPayload
) {
  return apiRequest<TicketResponse>(
    "/api/tickets",
    {
      method: "POST",
      token: token(),
      body: payload,
    }
  );
}


export function getTickets(
  filters?: TicketFilters,
  pagination?: PaginationParams
) {
  const params = new URLSearchParams();
  if (pagination?.page) {
    params.append(
      "page",
      pagination.page.toString()
    );
  }

  if (pagination?.limit) {
    params.append(
      "limit",
      pagination.limit.toString()
    );
  }

  if (filters?.search) {
    params.append(
      "search",
      filters.search
    );
  }

  if (filters?.status) {
    params.append(
      "status",
      filters.status
    );
  }

  if (filters?.priority) {
    params.append(
      "priority",
      filters.priority
    );
  }

  if (filters?.category) {
    params.append(
      "category",
      filters.category
    );
  }

  const query =
    params.toString().length > 0
      ? `?${params.toString()}`
      : "";

  return apiRequest<TicketsResponse>(
    `/api/tickets${query}`,
    {
      method: "GET",
      token: token(),
    }
  );
}

export function getTicket(
  id: string
) {
  return apiRequest<TicketResponse>(
    `/api/tickets/${id}`,
    {
      method: "GET",
      token: token(),
    }
  );
}

export function updateTicket(
  id: string,
  payload: Partial<CreateTicketPayload>
) {
  return apiRequest<TicketResponse>(
    `/api/tickets/${id}`,
    {
      method: "PATCH",
      token: token(),
      body: payload,
    }
  );
}

export function updateTicketStatus(
  id: string,
  status: TicketStatus
) {
  return apiRequest<TicketResponse>(
    `/api/tickets/${id}/status`,
    {
      method: "PATCH",
      token: token(),
      body: { status },
    }
  );
}

export function updateTicketPriority(
  id: string,
  priority: TicketPriority
) {
  return apiRequest<TicketResponse>(
    `/api/tickets/${id}/priority`,
    {
      method: "PATCH",
      token: token(),
      body: { priority },
    }
  );
}

export function deleteTicket(
  id: string
) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/api/tickets/${id}`,
    {
      method: "DELETE",
      token: token(),
    }
  );
}