"use client";

import { useParams, useRouter } from "next/navigation";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

import { apiRequest } from "@/lib/api";

import { ResetPasswordValues } from "@/lib/validation/auth";

import { toast } from "sonner";

type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();

  const params = useParams();

  const token = params.token as string;

  const handleResetPassword = async (
    values: ResetPasswordValues
  ) => {
    const response =
      await apiRequest<ResetPasswordResponse>(
        `/api/auth/reset-password/${token}`,
        {
          method: "POST",

          body: {
            password: values.password,
          },
        }
      );

    toast.success("Password updated", {
      description: response.message,
    });

    router.replace("/login");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,176,72,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,176,72,0.08),transparent_24%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8">

        <div className="w-full max-w-md">

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

          <div className="rounded-[32px] border border-border bg-card/45 p-7 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur">

            <div className="text-center">

              <p className="text-sm font-medium text-primary">
                Reset password
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Create a new password
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Choose a strong password for your Opsfront account.
              </p>

            </div>

            <div className="mt-8">

              <ResetPasswordForm
                onSubmit={handleResetPassword}
              />

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}