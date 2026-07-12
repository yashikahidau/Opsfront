import {
  ValidationResult,
  checkbox,
  email,
  minLength,
  ok,
  required,
} from "./common";

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  name: string;
  email: string;
  workspaceName: string;
  password: string;
  acceptedTerms: boolean;
};

export const loginSchema = {
  email(value: string): ValidationResult {
    return email(value);
  },

  password(value: string): ValidationResult {
    const requiredResult = required(value, "Password");
    if (!requiredResult.valid) return requiredResult;

    return minLength(value, 6, "Password");
  },
};

export const registerSchema = {
  name(value: string): ValidationResult {
    const requiredResult = required(value, "Full name");
    if (!requiredResult.valid) return requiredResult;

    return minLength(value, 2, "Full name");
  },

  email(value: string): ValidationResult {
    return email(value);
  },

  workspaceName(value: string): ValidationResult {
    const requiredResult = required(value, "Workspace name");
    if (!requiredResult.valid) return requiredResult;

    return minLength(value, 2, "Workspace name");
  },

  password(value: string): ValidationResult {
    const requiredResult = required(value, "Password");
    if (!requiredResult.valid) return requiredResult;

    return minLength(value, 6, "Password");
  },

  acceptedTerms(value: boolean): ValidationResult {
    return checkbox(
      value,
      "You must accept the Terms and Privacy Policy"
    );
  },
};


export type ForgotPasswordValues = {
  email: string;
};

export const forgotPasswordSchema = {
  email(value: string): ValidationResult {
    return email(value);
  },
};

export type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};

export const resetPasswordSchema = {
  password(value: string): ValidationResult {
    const requiredResult = required(
      value,
      "Password"
    );

    if (!requiredResult.valid) {
      return requiredResult;
    }

    return minLength(
      value,
      6,
      "Password"
    );
  },

  confirmPassword(value: string): ValidationResult {
    const requiredResult = required(
      value,
      "Confirm password"
    );

    if (!requiredResult.valid) {
      return requiredResult;
    }

    return ok();
  },
};