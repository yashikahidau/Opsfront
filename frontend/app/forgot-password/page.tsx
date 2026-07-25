"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

import { apiRequest } from "@/lib/api";
import { ForgotPasswordValues } from "@/lib/validation/auth";

import { toast } from "sonner";

type ForgotPasswordResponse = {
     success: boolean;
     message: string;
};

function ForgotPasswordContent() {
     const router = useRouter();

     const searchParams = useSearchParams();

     const email =
          searchParams.get("email") ?? "";

     const handleForgotPassword = async (
          values: ForgotPasswordValues
     ) => {
          const response =
               await apiRequest<ForgotPasswordResponse>(
                    "/api/auth/forgot-password",
                    {
                         method: "POST",
                         body: {
                              email: values.email.trim(),
                         },
                    }
               );

          toast.success("Reset link sent", {
               description: response.message,
          });

          router.push("/login");
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
                                        Forgot password
                                   </p>

                                   <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                        Reset your password
                                   </h1>

                                   <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                        Enter your email and we'll send you a secure password reset link.
                                   </p>

                              </div>

                              <div className="mt-8">
                                   <ForgotPasswordForm
                                        initialEmail={email}
                                        onSubmit={handleForgotPassword}
                                   />

                              </div>

                         </div>

                    </div>

               </div>

          </main>
     );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}