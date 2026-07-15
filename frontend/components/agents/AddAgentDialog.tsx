"use client";

import AddAgentForm from "./AddAgentForm";
import { AddAgentValues } from "@/lib/validation/addAgent";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: AddAgentValues
  ) => Promise<void>;
};

export default function AddAgentDialog({
  open,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-border bg-card p-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Add Agent
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create a new team member.
          </p>
        </div>

        <AddAgentForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}