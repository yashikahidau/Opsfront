"use client";

import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import {
  AuthResponse,
  saveAuth,
} from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useGoogleAuth() {
  const router = useRouter();

  const { refreshUser } = useAuth();

  async function login(
    credentialResponse: CredentialResponse
  ) {
    if (!credentialResponse.credential) {
      throw new Error(
        "Google authentication failed."
      );
    }

    const response =
      await apiRequest<AuthResponse>(
        "/api/auth/google",
        {
          method: "POST",
          body: {
            credential:
              credentialResponse.credential,
          },
        }
      );

    saveAuth(
      response.token,
      response.user
    );

    await refreshUser();

    toast.success(
      `Welcome, ${response.user.name}!`,
      {
        description: "Signed in with Google.",
      }
    );

    router.replace("/dashboard");

    router.refresh();
  }

  return {
    login,
  };
}