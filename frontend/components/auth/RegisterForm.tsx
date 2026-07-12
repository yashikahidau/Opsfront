"use client";

import React from "react";
import Link from "next/link";

import FormInput from "@/components/form/FormInput";
import Checkbox from "@/components/form/Checkbox";
import FormAlert from "@/components/form/FormAlert";

import { useForm } from "@/hooks/useForm";
import {
  registerSchema,
  RegisterValues,
} from "@/lib/validation/auth";

import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/auth/GoogleButton";
import LoadingSpinner from "../ui/LoadingSpinner";

export type RegisterFormValues = RegisterValues;

interface RegisterFormProps {
  onSubmit: (
    values: RegisterFormValues
  ) => Promise<void>;
}

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  workspaceName: "",
  password: "",
  acceptedTerms: false,
};

export default function RegisterForm({
  onSubmit,
}: RegisterFormProps) {
  const form = useForm(
    initialValues,
    registerSchema
  );

  const name = form.controller("name");
  const email = form.controller("email");
  const workspace = form.controller("workspaceName");
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
          : "Unable to create account."
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
          label="Full name"
          placeholder="John Doe"
          autoComplete="name"
          value={name.value}
          onChange={name.onChange}
          onBlur={name.onBlur}
          onFocus={name.onFocus}
          error={
            form.touched.name
              ? form.errors.name
              : undefined
          }
          loading={form.loading}
        />

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
            form.touched.email
              ? form.errors.email
              : undefined
          }
          loading={form.loading}
        />

        <FormInput
          label="Workspace name"
          placeholder="Acme Inc."
          autoComplete="organization"
          value={workspace.value}
          onChange={workspace.onChange}
          onBlur={workspace.onBlur}
          onFocus={workspace.onFocus}
          error={
            form.touched.workspaceName
              ? form.errors.workspaceName
              : undefined
          }
          loading={form.loading}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password.value}
          onChange={password.onChange}
          onBlur={password.onBlur}
          onFocus={password.onFocus}
          error={
            form.touched.password
              ? form.errors.password
              : undefined
          }
          loading={form.loading}
        />

        <Checkbox
          label={
            <>
              I agree to the{" "}
              <span className="text-primary">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary">
                Privacy Policy
              </span>
            </>
          }
          checked={form.values.acceptedTerms}
          error={
            form.touched.acceptedTerms
              ? form.errors.acceptedTerms
              : undefined
          }
          onCheckedChange={(checked) =>
            form.setValue(
              "acceptedTerms",
              checked
            )
          }
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex justify-center">
          <GoogleButton />
        </div>
      </div>


      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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