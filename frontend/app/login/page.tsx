"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm, {
  LoginFormValues,
} from "@/components/auth/LoginForm";

import { apiRequest } from "@/lib/api";
import {
  AuthResponse,
  isAuthenticated,
  saveAuth,
} from "@/lib/auth";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshUser } = useAuth();

  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    if (user || isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setBootLoading(false);
  }, [user, router]);

  const handleLogin = async (
    values: LoginFormValues
  ) => {
    const response =
      await apiRequest<AuthResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: {
            email: values.email.trim(),
            password: values.password,
          },
        }
      );

    saveAuth(
      response.token,
      response.user
    );

    await refreshUser();

    toast.success(
      `Welcome back, ${response.user.name}!`,
      {
        description: "Successfully signed in.",
      }
    );

    router.replace("/dashboard");

    router.refresh();
  };

  if (bootLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background">
        <div className="rounded-full border border-border bg-card/40 px-5 py-2 text-sm text-muted-foreground">
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,176,72,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,176,72,0.08),transparent_24%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:items-center sm:px-5 sm:py-8">

        <div className="w-full max-w-[430px]">

          <div className="mb-8 flex justify-center">

            <div className="flex items-center gap-3 rounded-full border border-border bg-card/40 px-5 py-3">

              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                O
              </div>

              <span className="font-semibold tracking-tight">
                Opsfront
              </span>

            </div>

          </div>

          <div className="rounded-[28px] border border-border bg-card/45 p-4 sm:p-7 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur sm:rounded-[32px] sm:p-7">

            <div className="text-center">

              <p className="text-sm font-medium text-primary">
                Sign in
              </p>

              <h1 className="mt-2 text-[1.6rem] font-semibold leading-tight tracking-tight sm:text-3xl">
                Access your workspace
              </h1>

              <p className="mt-3 hidden text-sm leading-6 text-muted-foreground sm:block">
                Monitor tickets, queues, SLAs, agents and analytics from one workspace.
              </p>

            </div>

            <div className="mt-5 sm:mt-8">

              <LoginForm
                onSubmit={handleLogin}
              />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}