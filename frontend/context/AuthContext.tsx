"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthUser,
  clearAuth,
  getStoredToken,
  getStoredUser,
  saveAuth,
} from "@/lib/auth";
import { apiRequest } from "@/lib/api";

type MeResponse = {
  success: boolean;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (!storedToken || !storedUser) {
      logout();
      setIsLoading(false);
      return;
    }

    try {
      setToken(storedToken);

      // show cached user instantly so refresh doesn't feel empty
      setUser(storedUser);

      const response = await apiRequest<MeResponse>("/api/auth/me", {
        method: "GET",
        token: storedToken,
      });

      setUser(response.user);
      saveAuth(storedToken, response.user);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      logout,
      refreshUser,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}