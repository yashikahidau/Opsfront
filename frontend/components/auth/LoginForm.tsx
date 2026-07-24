"use client";

import React from "react";
import Link from "next/link";

import FormInput from "@/components/form/FormInput";
import FormAlert from "@/components/form/FormAlert";

import { useForm } from "@/hooks/useForm";
import { loginSchema } from "@/lib/validation/auth";

import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/auth/GoogleButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export type LoginFormValues = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: (
    values: LoginFormValues
  ) => Promise<void>;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const schema = loginSchema;

export default function LoginForm({
  onSubmit,
}: LoginFormProps) {
  const form = useForm(initialValues, schema);

  const email = form.controller("email");
  const password = form.controller("password");

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
          : "Unable to sign in."
      );
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-4 sm:space-y-5">

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

        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"

          value={password.value}

          onChange={password.onChange}

          onBlur={password.onBlur}

          onFocus={password.onFocus}

          error={
            password.touched
              ? password.error
              : undefined
          }

          loading={form.loading}
        />

      <div className="flex justify-center
      ">

          <Link
            href={
              form.values.email.trim()
                ? `/forgot-password?email=${encodeURIComponent(
                  form.values.email.trim()
                )}`
                : "/forgot-password"
            }
            className="
    text-sm
    text-primary
    transition-colors
    hover:opacity-80
  "
          >
            Forgot password?
          </Link>


        </div>

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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>


      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex justify-center">
          <GoogleButton />
        </div>
      </div>

      <p className="text-center text-xs sm:text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="
            font-medium
            text-foreground
            transition-colors
            hover:text-primary
          "
        >
          Create one
        </Link>
      </p>
    </form>
  );
}