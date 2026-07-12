"use client";

import React from "react";

import FormInput from "@/components/form/FormInput";
import FormAlert from "@/components/form/FormAlert";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useForm } from "@/hooks/useForm";

import {
  ResetPasswordValues,
  resetPasswordSchema,
} from "@/lib/validation/auth";

interface ResetPasswordFormProps {
  onSubmit: (
    values: ResetPasswordValues
  ) => Promise<void>;
}

const initialValues: ResetPasswordValues = {
  password: "",
  confirmPassword: "",
};

export default function ResetPasswordForm({
  onSubmit,
}: ResetPasswordFormProps) {
  const form = useForm(
    initialValues,
    resetPasswordSchema
  );

  const password = form.controller("password");

  const confirmPassword =
    form.controller("confirmPassword");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.validateAll()) {
      return;
    }

    if (
      form.values.password !==
      form.values.confirmPassword
    ) {
      form.setServerError(
        "Passwords do not match."
      );
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
          : "Unable to reset password."
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
          label="New password"
          type="password"
          placeholder="Create a new password"
          autoComplete="new-password"

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

        <FormInput
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"

          value={confirmPassword.value}
          onChange={confirmPassword.onChange}
          onBlur={confirmPassword.onBlur}
          onFocus={confirmPassword.onFocus}

          error={
            confirmPassword.touched
              ? confirmPassword.error
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
              Updating password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </div>
    </form>
  );
}