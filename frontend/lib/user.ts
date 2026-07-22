import { apiRequest } from "./api";
import { getStoredToken } from "./auth";

function token() {
  const authToken = getStoredToken();

  if (!authToken) {
    throw new Error("Not authenticated.");
  }

  return authToken;
}

export interface User {
  _id: string;
  name: string;
  email: string;

  userType: "internal" | "customer";

  role: "owner" | "admin" | "agent" | null;

  isActive: boolean;

  assignedTickets: number;
  openTickets: number;
  resolvedTickets: number;
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface AssignedTicket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;

  createdBy: {
    name: string;
  };

  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  workspaceName: string;
  password: string;
  role: "admin" | "agent";
}

export function getUsers() {
  return apiRequest<UsersResponse>(
    "/api/users",
    {
      token: token(),
    }
  );
}

export function getAgents() {
  return apiRequest<UsersResponse>(
    "/api/users/agents",
    {
      token: token(),
    }
  );
}

export function updateRole(
  id: string,
  role: User["role"]
) {
  return apiRequest<{
    success: boolean;
    user: User;
  }>(
    `/api/users/${id}/role`,
    {
      method: "PATCH",
      token: token(),
      body: {
        role,
      },
    }
  );
}

export function getAssignedTickets(
  id: string
) {
  return apiRequest<{
    success: boolean;
    tickets: AssignedTicket[];
  }>(
    `/api/users/${id}/tickets`,
    {
      token: token(),
    }
  );
}

export function reassignTickets(
  fromUserId: string,
  toUserId: string
) {
  return apiRequest<{
    success: boolean;
    modified: number;
  }>("/api/users/reassign", {
    method: "PATCH",
    token: token(),
    body: {
      fromUserId,
      toUserId,
    },
  });
}
export function createUser(
  data: CreateUserInput
) {
  return apiRequest<{
    success: boolean;
    user: User;
  }>("/api/users", {
    method: "POST",
    token: token(),
    body: data,
  });
}