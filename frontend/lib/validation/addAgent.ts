import {
  ValidationResult,
  email,
  minLength,
  required,
} from "./common";

export type AddAgentValues = {
  name: string;
  email: string;
  workspaceName: string;
  password: string;
  role: "admin" | "agent";
};

export const addAgentSchema = {
  name(value: string): ValidationResult {
    const result = required(
      value,
      "Name"
    );

    if (!result.valid) return result;

    return minLength(value, 2, "Name");
  },

  email(value: string): ValidationResult {
    return email(value);
  },

  workspaceName(
    value: string
  ): ValidationResult {
    const result = required(
      value,
      "Workspace"
    );

    if (!result.valid) return result;

    return minLength(
      value,
      2,
      "Workspace"
    );
  },

  password(
    value: string
  ): ValidationResult {
    const result = required(
      value,
      "Password"
    );

    if (!result.valid) return result;

    return minLength(
      value,
      6,
      "Password"
    );
  },

  role() {
    return {
      valid: true,
    };
  },
};