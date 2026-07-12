"use client";

import React from "react";
import Link from "next/link";

import FormInput from "@/components/form/FormInput";
import FormAlert from "@/components/form/FormAlert";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useForm } from "@/hooks/useForm";

import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/lib/validation/auth";

interface ForgotPasswordFormProps {
  initialEmail?: string;

  onSubmit: (
    values: ForgotPasswordValues
  ) => Promise<void>;
}

const emptyValues: ForgotPasswordValues = {
  email: "",
};
export default function ForgotPasswordForm({
 initialEmail = "",
 
  onSubmit,
}: ForgotPasswordFormProps) {
  const form = useForm(

  {
    ...emptyValues,
    email: initialEmail ?? "",
  },
  forgotPasswordSchema
);

  const email = form.controller("email");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.validateAll()) {
      return;
    }

    try {
      form.setLoading(true);

      form.setServerError("");

      await onSubmit(form.values);
    } catch (error) {
      form.setServerError(
        error instanceof Error
          ? error.message
          : "Unable to send reset email."
      );
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <div className="space-y-5">
              <FormInput
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"

          value={email.value}
          onChange={email.onChange}
          onBlur={email.onBlur}
          onFocus={email.onFocus}

          error={
            email.touched
              ? email.error
              : undefined
          }

          loading={form.loading}
        />

        {form.serverError && (
          <FormAlert variant="error">
            {form.serverError}
          </FormAlert>
        )}

        <Button
          type="submit"
          size="auth"
          disabled={form.loading}
        >
          {form.loading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}

        <Link
          href="/login"
          className="
            font-medium
            text-foreground
            transition-colors
            hover:text-primary
          "
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}