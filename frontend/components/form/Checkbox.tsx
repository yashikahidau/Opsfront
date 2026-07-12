"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  id?: string;
  name?: string;
  label: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Checkbox({
  id,
  name,
  label,
  checked,
  disabled = false,
  error,
  className,
  onCheckedChange,
}: CheckboxProps) {
  const inputId =
    id ??
    name ??
    Math.random().toString(36).slice(2);

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={cn(
          "group flex cursor-pointer items-start gap-3 rounded-2xl border bg-background/40 p-3 transition-all duration-200",

          error
            ? "border-destructive/50"
            : "border-border hover:border-primary/20 hover:bg-card",

          disabled &&
            "cursor-not-allowed opacity-60",

          className
        )}
      >
        <div className="relative mt-0.5">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) =>
              onCheckedChange?.(e.target.checked)
            }
            className="peer sr-only"
          />

          <div
            className="
              flex
              size-5
              items-center
              justify-center
              rounded-md
              border
              border-border
              bg-background
              transition-all
              duration-200
              peer-checked:border-primary
              peer-checked:bg-primary
            "
          >
            <Check
              className="
                size-3
                text-primary-foreground
                opacity-0
                transition-opacity
                duration-200
                peer-checked:opacity-100
              "
            />
          </div>
        </div>

        <span className="text-sm leading-6 text-muted-foreground">
          {label}
        </span>
      </label>

      <div className="min-h-[18px]">
        {error && (
          <p className="animate-in fade-in slide-in-from-top-1 text-xs text-destructive duration-200">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}