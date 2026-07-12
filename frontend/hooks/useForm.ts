import { useMemo, useState } from "react";
import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
} from "react";
import type { ValidationResult } from "@/lib/validation/common";

type Schema<T> = {
  [K in keyof T]: (value: T[K]) => ValidationResult;
};

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  schema: Schema<T>
) {
  const [values, setValues] = useState(initialValues);

  const [errors, setErrors] = useState<Errors<T>>({});

  const [touched, setTouched] = useState<Touched<T>>({});

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");

  function validateField<K extends keyof T>(
    field: K,
    value?: T[K]
  ) {
    const fieldValue =
      value === undefined ? values[field] : value;

    const result = schema[field](fieldValue);

    setErrors((prev) => ({
      ...prev,
      [field]: result.valid ? undefined : result.message,
    }));

    return result.valid;
  }

  function validateAll() {
    let valid = true;

    const nextErrors: Errors<T> = {};

    (Object.keys(schema) as (keyof T)[]).forEach((field) => {
      const result = schema[field](values[field]);

      if (!result.valid) {
        valid = false;
        nextErrors[field] = result.message;
      }
    });

    setErrors(nextErrors);

    return valid;
  }

  function setValue<K extends keyof T>(
  field: K,
  value: T[K]
) {
  setValues((prev) => ({
    ...prev,
    [field]: value,
  }));

  // remove stale field error
  setErrors((prev) => ({
    ...prev,
    [field]: undefined,
  }));

  // remove server/API error
  setServerError("");
}

  function getController<K extends keyof T>(field: K) {
    return {
      value: values[field],

      error: errors[field],

      touched: touched[field],

      onFocus() {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));

        setServerError("");
      },

      onChange(
        e: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement
        >
      ) {
        const nextValue =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        setValues((prev) => ({
          ...prev,
          [field]: nextValue,
        }));

        // remove stale error while typing
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));

        // remove API error
        setServerError("");
      },

      onBlur(
        e: FocusEvent<
          HTMLInputElement | HTMLTextAreaElement
        >
      ) {
        setTouched((prev) => ({
          ...prev,
          [field]: true,
        }));

        validateField(field, e.target.value as T[K]);
      },
    };
  }

  function input<K extends keyof T>(
    field: K
  ): InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
  } {
    const controller = getController(field);

    return {
      name: String(field),

      value: controller.value,

      onChange: controller.onChange,

      onBlur: controller.onBlur,

      onFocus: controller.onFocus,

      "aria-invalid": !!controller.error,

      "aria-describedby": controller.error
        ? `${String(field)}-error`
        : undefined,

      error: controller.error,
    };
  }

  function reset(nextValues: T = initialValues) {
  setValues(nextValues);

  setErrors({});

  setTouched({});

  setLoading(false);

  setServerError("");
}


  function submit(
    action: () => Promise<void>
) {
    return async () => {
        try {
            setLoading(true);
            setServerError("");

            await action();
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };
}

  return useMemo(
    () => ({
      values,

      errors,

      touched,

      loading,

      serverError,

      setLoading,

      setServerError,

      validateField,

      validateAll,

      setValue,

      controller: getController,

      input,

      reset,

      submit,
    }),
    [
      values,
      errors,
      touched,
      loading,
      serverError,
    ]
  );
}

