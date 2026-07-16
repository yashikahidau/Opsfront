"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  SlaPolicy,
  UpdatePolicyInput,
} from "@/lib/slaPolicies";


interface EditPolicyDialogProps {
  open: boolean;
  policy: SlaPolicy | null;
  onClose: () => void;
  onSave: (
    id: string,
    data: UpdatePolicyInput
  ) => Promise<void>;
}

export default function EditPolicyDialog({
  open,
  policy,
  onClose,
  onSave,
}: EditPolicyDialogProps) {
  const [response, setResponse] =
    useState("");

  const [resolution, setResolution] =
    useState("");

  const [escalation, setEscalation] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!policy) return;

    setResponse(policy.response);
    setResolution(policy.resolution);
    setEscalation(policy.escalation);
    setStatus(policy.status);
  }, [policy]);

  if (!open || !policy) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6">

        <h3 className="text-xl font-semibold">
          Edit SLA Policy
        </h3>

        <div className="mt-6 space-y-4">

          <input
            value={response}
            maxLength={5}
            onChange={(e) =>
              setResponse(e.target.value)
            }
            placeholder="Response"
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />

          <input
            value={resolution}
            maxLength={5}
            onChange={(e) =>
              setResolution(e.target.value)
            }
            placeholder="Resolution"
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />

          <input
            value={escalation}
            maxLength={4}
            onChange={(e) =>
              setEscalation(e.target.value)
            }
            placeholder="Escalation"
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={async () => {
              try {
                setSaving(true);

                const durationRegex =
                  /^(\d+)(m|h|d)$/i;

                if (
                  !durationRegex.test(response) ||
                  !durationRegex.test(resolution)
                ) {
                  toast.error(
                    "Use formats like 15m, 1h or 2d."
                  );
                  return;
                }

                await onSave(policy._id, {
                  response,
                  resolution,
                  escalation,
                  status,
                });

                toast.success(
                  "SLA policy updated successfully."
                );

                onClose();
              } catch (err) {
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Failed to update SLA policy."
                );
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-xl bg-primary px-4 py-2 text-primary-foreground"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}