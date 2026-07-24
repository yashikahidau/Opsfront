"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RegisterForm, {
  RegisterFormValues,
} from "@/components/auth/RegisterForm";

import { apiRequest } from "@/lib/api";

import {
  AuthResponse,
  isAuthenticated,
  saveAuth,
} from "@/lib/auth";

import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshUser } = useAuth();
  const [bootLoading, setBootLoading] =
    useState(true);

  useEffect(() => {
    if (user || isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setBootLoading(false);
  }, [user, router]);

  const handleRegister = async (
    values: RegisterFormValues
  ) => {
    const response =
      await apiRequest<AuthResponse>(
        "/api/auth/register",
        {
          method: "POST",
          body: {
            name: values.name.trim(),
            email: values.email.trim(),
            workspaceName:
              values.workspaceName.trim(),
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
      `Welcome to Opsfront, ${response.user.name}!`,
      {
        description: "Workspace created successfully.",
      }
    );

    router.replace("/dashboard");

    router.refresh();
  };

  if (bootLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4">
        <div className="rounded-full border border-border bg-card/40 px-5 py-2 text-sm text-muted-foreground">
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Background Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,176,72,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,176,72,0.08),transparent_24%)]" />

      {/* Grid */}

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      <div className="absolute left-1/2 top-0 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8">

        <div className="w-full max-w-md">

          {/* Logo */}

          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-2.5 sm:px-5 sm:py-3">

              <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-primary/10 font-semibold text-primary text-sm sm:text-base">
                O
              </div>

              <span className="font-semibold tracking-tight text-sm sm:text-base">
                Opsfront
              </span>

            </div>
          </div>

          {/* Card */}

          <div className="rounded-2xl sm:rounded-[32px] border border-border bg-card/45 p-5 sm:p-7 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur">

            <div className="text-center">

              <p className="text-xs sm:text-sm font-medium text-primary">
                Create account
              </p>

              <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                Start your workspace
              </h1>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-muted-foreground">
                Create your Opsfront workspace and start
                managing tickets, SLAs and teams from
                one modern dashboard.
              </p>

            </div>

            <div className="mt-6 sm:mt-8">

              <RegisterForm
                onSubmit={handleRegister}
              />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}