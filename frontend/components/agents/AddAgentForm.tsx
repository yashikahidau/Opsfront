"use client";

import React from "react";

import FormInput from "@/components/form/FormInput";
import FormAlert from "@/components/form/FormAlert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";

import { useForm } from "@/hooks/useForm";

import {
  addAgentSchema,
  AddAgentValues,
} from "@/lib/validation/addAgent";

type Props = {
  onSubmit: (
    values: AddAgentValues
  ) => Promise<void>;

  onCancel: () => void;
};

const initialValues: AddAgentValues = {
  name: "",
  email: "",
  workspaceName: "",
  password: "",
  role: "agent",
};

export default function AddAgentForm({
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm(
    initialValues,
    addAgentSchema
  );

  const name = form.controller("name");
  const email = form.controller("email");
  const workspace =
    form.controller("workspaceName");
  const password =
    form.controller("password");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.validateAll()) return;

    try {
      form.setLoading(true);

      form.setServerError("");

      await onSubmit(form.values);

      form.reset();
    } catch (err) {
      form.setServerError(
        err instanceof Error
          ? err.message
          : `Unable to create ${form.values.role === "admin"
            ? "admin"
            : "agent"
          }.`
      );
    } finally {
      form.setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <FormInput
        label="Name"
        value={name.value}
        onChange={name.onChange}
        onBlur={name.onBlur}
        onFocus={name.onFocus}
        error={
          name.touched
            ? name.error
            : undefined
        }
        loading={form.loading}
      />

      <FormInput
        label="Email"
        type="email"
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
        label="Workspace"
        value={workspace.value}
        onChange={workspace.onChange}
        onBlur={workspace.onBlur}
        onFocus={workspace.onFocus}
        error={
          workspace.touched
            ? workspace.error
            : undefined
        }
        loading={form.loading}
      />

      <FormInput
        label="Temporary Password"
        type="password"
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Role
        </label>

        <select
          value={form.values.role}
          onChange={(e) =>
            form.setValue(
              "role",
              e.target.value as
              | "admin"
              | "agent"
            )
          }
          className="h-11 w-full rounded-xl border border-border bg-background px-4"
        >
          <option value="agent">
            Agent
          </option>

          <option value="admin">
            Admin
          </option>
        </select>
      </div>

      {form.serverError && (
        <FormAlert variant="error">
          {form.serverError}
        </FormAlert>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="flex-1"
          disabled={form.loading}
        >
          {form.loading ? (
            <>
              <LoadingSpinner className="mr-2" />
              `Creating ${
                form.values.role === "admin"
                  ? "Admin"
                  : "Agent"
              }...`
            </>
          ) : (
            `Create ${form.values.role === "admin"
              ? "Admin"
              : "Agent"
            }`
          )}
        </Button>
      </div>
    </form>
  );
}