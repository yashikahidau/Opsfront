"use client";

import React, { forwardRef, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      icon,
      loading = false,
      disabled,
      className,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const inputId =
      id ??
      props.name ??
      label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>

        {/* Input Container */}
        <div
          className={cn(
            "group relative flex h-12 items-center overflow-hidden rounded-2xl border bg-background/40 transition-all duration-200",

            error
              ? "border-destructive/50"
              : success
              ? "border-emerald-500/40"
              : "border-border hover:border-primary/20",

            "focus-within:border-primary/40",
            "focus-within:bg-card",
            "focus-within:shadow-[0_0_0_4px_rgba(255,176,72,0.06)]",

            disabled && "cursor-not-allowed opacity-60",

            className
          )}
        >
          {/* Left Icon */}
          {icon && (
            <div className="ml-4 flex items-center text-muted-foreground transition-colors duration-200 group-focus-within:text-primary">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || loading}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "h-full flex-1 bg-transparent text-sm outline-none",

              icon ? "pl-3" : "pl-4",

              type === "password" ||
                loading ||
                success
                ? "pr-12"
                : "pr-4",

              "placeholder:text-muted-foreground"
            )}
            {...props}
          />

          {/* Password Toggle */}
          {type === "password" && !loading && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="absolute right-3 rounded-lg p-1 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="absolute right-3">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          )}

          {/* Success */}
          {!loading &&
            success &&
            !error &&
            type !== "password" && (
              <div className="absolute right-3">
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
            )}
        </div>

        {/* Reserved Message Space */}
        <div className="min-h-[18px]">
          {error ? (
            <p
              id={`${inputId}-error`}
              className="animate-in fade-in slide-in-from-top-1 text-xs text-destructive duration-200"
            >
              {error}
            </p>
          ) : success ? (
            <p className="animate-in fade-in slide-in-from-top-1 text-xs text-emerald-500 duration-200">
              {success}
            </p>
          ) : helperText ? (
            <p className="text-xs text-muted-foreground">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;