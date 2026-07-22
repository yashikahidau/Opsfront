"use client";

import { useState, useEffect } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import FormAlert from "@/components/form/FormAlert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { createTicket } from "@/lib/ticket";
import { useAuth } from "@/context/AuthContext";

interface CreateTicketDialogProps {
  onCreated?: () => void;
}

export default function CreateTicketDialog({
  onCreated,
}: CreateTicketDialogProps) {

  const { user } = useAuth();

  const isCustomer = user?.userType === "customer";

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [category, setCategory] =
    useState("support");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Description is required."
      );
      return;
    }

    try {
      setLoading(true);

      setError("");

      await createTicket({
        title,
        description,
        priority: priority as any,
        category: category as any,
      });

      toast.success(
        "Ticket created successfully.",
        {
          description:
            "Your support request has been added to the queue.",
        }
      );

      setTitle("");

      setDescription("");

      setPriority("medium");

      setCategory("support");

      setOpen(false);

      onCreated?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 size-4" />
        {isCustomer ? "New Support Request" : "Create Ticket"}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-8">

              <h2 className="text-2xl font-semibold">
                {isCustomer ? "New Support Request" : "Create Ticket"}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {isCustomer
                  ? "Tell us what's wrong and our support team will help you."
                  : "Create a new support request."}
              </p>

            </div>

            <form
              onSubmit={handleCreate}
              className="space-y-5"
            >
              <FormInput
                label="Title"
                placeholder="Brief ticket title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                onFocus={() => setError("")}
              />

              <FormInput
                label="Description"
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                onFocus={() => setError("")}
              />

              <div
                className={`grid gap-4 ${isCustomer ? "grid-cols-1" : "grid-cols-2"
                  }`}
              >



                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
                  >
                    <option value="support">
                      Support
                    </option>

                    <option value="bug">
                      Bug
                    </option>

                    <option value="feature">
                      Feature
                    </option>

                    <option value="billing">
                      Billing
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

                {!isCustomer && (
                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value)
                      }
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
                    >
                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>

                      <option value="critical">
                        Critical
                      </option>

                    </select>

                  </div>
                )}

              </div>

              {error && (
                <FormAlert variant="error">
                  {error}
                </FormAlert>
              )}

              <div className="flex justify-end gap-3 pt-4">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setOpen(false)
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    isCustomer
                      ? "Submit Request"
                      : "Create Ticket"
                  )}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}