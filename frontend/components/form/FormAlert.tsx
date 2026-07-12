"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "error" | "success" | "warning" | "info";

interface FormAlertProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants = {
  error: {
    icon: AlertCircle,
    wrapper:
      "border-destructive/25 bg-destructive/8 text-destructive",
  },

  success: {
    icon: CheckCircle2,
    wrapper:
      "border-emerald-500/25 bg-emerald-500/8 text-emerald-500",
  },

  warning: {
    icon: TriangleAlert,
    wrapper:
      "border-yellow-500/25 bg-yellow-500/8 text-yellow-500",
  },

  info: {
    icon: Info,
    wrapper:
      "border-primary/20 bg-primary/8 text-primary",
  },
};

export default function FormAlert({
  variant = "error",
  children,
  className,
}: FormAlertProps) {
  const Icon = variants[variant].icon;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm duration-200",
        variants[variant].wrapper,
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />

      <div className="leading-6">
        {children}
      </div>
    </div>
  );
}