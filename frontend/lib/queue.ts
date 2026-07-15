import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

export interface QueueTicket {
  _id: string;
  title: string;
  description: string;

  status: string;
  priority: string;
  category: string;
  slaDueAt?: string;
  slaStatus?: string;

  createdAt: string;

  assignedTo: {
    _id: string;
    name: string;
  } | null;

  createdBy: {
    _id: string;
    name: string;
  };
}

export interface QueueStats {
  total: number;
  open: number;
  inProgress: number;
  waiting: number;
  resolved: number;
  high: number;
  critical: number;
  unassigned: number;
}

export function getQueue(params?: {
  search?: string;
  priority?: string;
  status?: string;
  assignee?: string;
  category?: string;
  sort?: string;
}) {
  const query = new URLSearchParams();

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.priority) {
    query.set("priority", params.priority);
  }

  if (params?.status) {
    query.set("status", params.status);
  }

  if (params?.assignee) {
    query.set("assignee", params.assignee);
  }

  if (params?.category) {
    query.set("category", params.category);
  }
  if (params?.sort) {
    query.set("sort", params.sort);
  }

  const url = query.toString()
    ? `/api/queue?${query.toString()}`
    : "/api/queue";

  return apiRequest<{
    success: boolean;
    stats: QueueStats;
    tickets: QueueTicket[];
  }>(url, {
    token: getStoredToken() ?? undefined,
  });
}