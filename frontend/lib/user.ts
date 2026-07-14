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
  role: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

export function getUsers() {
  return apiRequest<UsersResponse>(
    "/api/users",
    {
      token: token(),
    }
  );
}