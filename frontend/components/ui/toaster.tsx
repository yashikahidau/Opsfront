"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={4}
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-2xl",
          title:
            "text-sm font-semibold text-foreground",
          description:
            "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground",
          cancelButton:
            "bg-muted text-foreground",
          closeButton:
            "border-border bg-background hover:bg-muted",
        },
      }}
    />
  );
}