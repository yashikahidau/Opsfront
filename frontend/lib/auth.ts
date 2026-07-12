export type AuthUser = {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
  role: "admin" | "agent";
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
};

const TOKEN_KEY = "opsfront_token";
const USER_KEY = "opsfront_user";

export function saveAuth(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getStoredToken();
}