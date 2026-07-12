export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export const ok = (): ValidationResult => ({
  valid: true,
});

export const fail = (message: string): ValidationResult => ({
  valid: false,
  message,
});

export const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function required(
  value: string,
  label: string
): ValidationResult {
  if (!value.trim()) {
    return fail(`${label} is required`);
  }

  return ok();
}

export function minLength(
  value: string,
  length: number,
  label: string
): ValidationResult {
  if (value.trim().length < length) {
    return fail(`${label} must be at least ${length} characters`);
  }

  return ok();
}

export function email(
  value: string
): ValidationResult {
  if (!value.trim()) {
    return fail("Email is required");
  }

  if (!EMAIL_REGEX.test(value.trim())) {
    return fail("Enter a valid email address");
  }

  return ok();
}

export function checkbox(
  checked: boolean,
  message: string
): ValidationResult {
  if (!checked) {
    return fail(message);
  }

  return ok();
}