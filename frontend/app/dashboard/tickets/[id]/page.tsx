"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTicket } from "@/hooks/useTicket";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FormAlert from "@/components/form/FormAlert";
import { useComments } from "@/hooks/useComments";
import { useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  TicketStatus,
  TicketPriority,
} from "@/lib/ticket";

const statusOptions = [
  "open",
  "in-progress",
  "waiting",
  "resolved",
  "closed",
] as const;


function getTimeRemaining(
  slaDeadline: string | null
) {
  if (!slaDeadline) return "No SLA";

  const now = new Date();

  const deadline = new Date(slaDeadline);

  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return "Breached";

  const mins = Math.floor(diff / 60000);

  const hrs = Math.floor(mins / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }

  return `${mins}m`;
}


function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export default function TicketDetailPage() {

  const params = useParams();
  const { user } = useAuth();

  const {
    ticket,
    loading,
    error,
    changeStatus,
    changePriority,
    assign,
    resolveTicket,
  } = useTicket(params.id as string);

  const {
    comments,
    createComment,
  } = useComments(params.id as string);

  const {
    activities,
    loading: activitiesLoading,
    refresh: refreshActivities,
  } = useActivities(params.id as string);

  const { users } = useUsers();

  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";
  const isCustomer = user?.userType === "customer";

  const isAssignedAgent =
    isAgent &&
    ticket?.assignedTo?._id === user?.id;

  const canAssign = isOwner || isAdmin;

  const canChangePriority = isOwner || isAdmin;

  const canManageAssignedTicket =
    isOwner ||
    isAdmin ||
    isAssignedAgent;

  const canResolve = canManageAssignedTicket;

  const canChangeStatus = canManageAssignedTicket;

  const [newComment, setNewComment] = useState("");

  const [posting, setPosting] = useState(false);

  const [showAssignDialog, setShowAssignDialog] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState("");

  const commentRef =
    useRef<HTMLTextAreaElement>(null);

  async function handlePostComment() {
    if (!newComment.trim()) return;

    try {
      setPosting(true);

      await createComment(newComment);

      await refreshActivities();

      setNewComment("");
    } finally {
      setPosting(false);
    }
  }

  async function handleStatusChange(
    status: TicketStatus
  ) {
    await changeStatus(status);

    await refreshActivities();
  }

  async function handlePriorityChange(
    priority: TicketPriority
  ) {
    await changePriority(priority);

    await refreshActivities();
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-6 py-4">
          <LoadingSpinner className="h-5 w-5 text-primary" />

          <span className="text-sm text-muted-foreground">
            Loading ticket...
          </span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <FormAlert variant="error">
        {error || "Ticket not found."}
      </FormAlert>
    );
  }
  return (
    <div className="space-y-7">
      {/* Back / top actions */}
      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/tickets"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card"
          >
            <ArrowLeft className="size-4" />
            Back to tickets
          </Link>

          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            #{ticket._id.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isCustomer && canAssign && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedUser(ticket?.assignedTo?._id ?? "");
                setShowAssignDialog(true);
              }}
            >
              Reassign
            </Button>
          )}
          {!isCustomer && canResolve && (
            <button
              onClick={resolveTicket}
              disabled={ticket.status === "resolved"}
              className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ticket.status === "resolved"
                ? "Resolved"
                : "Resolve Ticket"}
            </button>
          )}
        </div>
      </section>

      {/* Hero ticket summary */}
      <section
        className={
          isCustomer
            ? "space-y-6"
            : "grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
        }
      >
        <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
                  {ticket.category.toUpperCase()}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {ticket.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                  {ticket.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Priority */}
              {!isCustomer && (
                <Badge
                  tone={
                    ticket.priority === "critical"
                      ? "critical"
                      : "watch"
                  }
                >
                  {ticket.priority.replace(/\b\w/g, (c: string) =>
                    c.toUpperCase()
                  )}
                </Badge>
              )}

              {/* Status */}
              <Badge
                tone={
                  ticket.status === "resolved"
                    ? "success"
                    : ticket.status === "closed"
                      ? "watch"
                      : "escalated"
                }
              >
                {ticket.status
                  .replace("-", " ")
                  .replace(/\b\w/g, (c: string) =>
                    c.toUpperCase()
                  )}
              </Badge>

              {/* Risk */}
              {!isCustomer && (
                <Badge
                  tone={
                    ticket.riskScore >= 70
                      ? "risk"
                      : "watch"
                  }
                >
                  {ticket.riskScore >= 70
                    ? "At Risk"
                    : "Healthy"}
                </Badge>
              )}

              {/* SLA */}
              {!isCustomer &&
                ticket.slaDeadline && (
                  <Badge
                    tone={
                      new Date(ticket.slaDeadline) < new Date()
                        ? "critical"
                        : "watch"
                    }
                  >
                    {new Date(ticket.slaDeadline).toLocaleString()}
                  </Badge>
                )}
            </div>

            <div
              className={`grid gap-4 pt-2 ${isCustomer
                ? "sm:grid-cols-3"
                : "sm:grid-cols-2 xl:grid-cols-4"
                }`}
            >
              <MetaCard
                label="Submitted By"
                value={ticket.createdBy.name}
                sub=""
              />
              {!isCustomer && (
                <MetaCard
                  label="Assigned to"
                  value={
                    ticket.assignedTo
                      ? ticket.assignedTo.name
                      : "Unassigned"
                  }
                  sub={
                    ticket.assignedTo
                      ? ticket.assignedTo.email
                      : "Waiting for assignment"
                  }
                />
              )}
              <MetaCard
                label="Created"
                value={formatDate(ticket.createdAt)}
                sub="Ticket created"
              />
              <MetaCard
                label="Last updated"
                value={formatDate(ticket.updatedAt)}
                sub="Latest activity"
              />
            </div>
          </div>
        </div>

        {!isCustomer && (
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary/80">
              Live risk signal
            </p>

            <div className="mt-4">
              <p className="font-mono text-5xl font-semibold tracking-tight text-primary">
                {ticket.riskScore}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Current risk score for this ticket
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${ticket.riskScore}%`,
                }}
              />
            </div>

            <div className="mt-6 space-y-3">
              <SignalRow
                label="Time to breach"
                value={
                  ticket.slaDeadline
                    ? formatDate(ticket.slaDeadline)
                    : "No SLA"
                }
              />
            </div>
          </div>
        )}
      </section>

      {/* Main content */}
      <section
        className={
          isCustomer
            ? "space-y-6"
            : "grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
        }
      >
        {/* LEFT */}
        <div className="space-y-6">

          {/* Conversation */}

          <div className="rounded-3xl border border-border bg-card/30 p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-foreground">
                  Conversation
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {isCustomer
                    ? "Chat directly with our support team regarding this ticket."
                    : "Request context and support updates"}
                </p>

              </div>

              <button
                onClick={() => commentRef.current?.focus()}
                className="cursor-pointer rounded-xl border border-border bg-background/40 px-3 py-1.5 text-sm transition hover:border-primary/20 hover:bg-card"
              >
                <>
                  Reply
                  <span className="hidden sm:inline"> →</span>
                </>
              </button>

            </div>

            <div className="mt-5 space-y-4">

              {comments.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-border bg-background/20 p-8 text-center">

                  <p className="text-sm font-medium">
                    No messages yet
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {isCustomer
                      ? "Your conversation with our support team will appear here."
                      : "Start the conversation by posting the first internal update."}
                  </p>

                </div>

              ) : (

                comments.map((comment) => (

                  <div
                    key={comment._id}
                    className="rounded-2xl border border-border bg-background/35 p-4"
                  >

                    <div className="flex items-start gap-3">

                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {comment.author.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-medium text-foreground">
                          {comment.author.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {comment.author.email}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>

                      </div>

                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {comment.message}
                    </p>

                  </div>

                ))

              )}

            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">

              <textarea
                ref={commentRef}
                disabled={posting}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder={
                  isCustomer
                    ? "Type your message to the support team..."
                    : "Write an update..."
                }
                className="w-full resize-none rounded-2xl border border-border bg-background/50 px-4 py-3"
              />

              <div className="mt-4 flex justify-end">

                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || posting}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                >
                  {posting
                    ? "Sending..."
                    : isCustomer
                      ? "Send Message"
                      : "Post Update"}
                </button>

              </div>

            </div>

          </div>

          {/* Activity */}

          <div className="rounded-3xl border border-border bg-card/30 p-6">

            <div>

              <p className="text-sm font-medium">
                Activity Timeline
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {isCustomer
                  ? "View the latest updates and progress on your support request."
                  : "Status changes, escalations and operational history."}
              </p>

            </div>

            <div className="mt-6 space-y-4">

              {activitiesLoading ? (

                <div className="flex items-center gap-3">

                  <LoadingSpinner className="h-4 w-4" />

                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>

                </div>

              ) : (

                activities.map((item) => (

                  <div
                    key={item._id}
                    className="flex gap-3 rounded-2xl border border-border bg-background/35 p-3"
                  >

                    <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">

                      {item.type === "status"
                        ? <ShieldAlert className="size-4" />
                        : item.type === "priority"
                          ? <Sparkles className="size-4" />
                          : <MessageSquare className="size-4" />}

                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-5">
                        {item.message}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.user.name} • {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                ))

              )}

            </div>

          </div>

        </div>

        {!isCustomer && (

          <div className="space-y-6">

            {/* Ticket Actions */}

            <div className="rounded-3xl border border-border bg-card/30 p-5">

              <div>

                <p className="text-sm font-medium text-foreground">
                  Ticket Actions
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update ownership, status and priority.
                </p>

              </div>

              <div className="mt-5 space-y-3">

                <div className="rounded-2xl border border-border bg-background/35 p-4">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-sm font-medium">
                        Change Status
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Update ticket progress
                      </p>

                    </div>

                    <select
                      disabled={!canChangeStatus}
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(
                          e.target.value as TicketStatus
                        )
                      }
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    >

                      {statusOptions.map(status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status
                            .replace("-", " ")
                            .replace(/\b\w/g, c => c.toUpperCase())}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>

                <ActionCard
                  title="Assigned Owner"
                  value={
                    ticket.assignedTo
                      ? ticket.assignedTo.name
                      : "Unassigned"
                  }
                  helper={
                    ticket.assignedTo
                      ? ticket.assignedTo.email
                      : "Waiting for assignment"
                  }
                />

                <div className="rounded-2xl border border-border bg-background/35 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium">
                        Priority
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Update ticket priority
                      </p>

                    </div>

                    <select
                      disabled={!canChangePriority}
                      value={ticket.priority}
                      onChange={(e) =>
                        handlePriorityChange(
                          e.target.value as TicketPriority
                        )
                      }
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    >

                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* SLA */}

            <div className="rounded-3xl border border-border bg-card/30 p-5">

              <div>

                <p className="text-sm font-medium">
                  SLA Status
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Response and resolution windows.
                </p>

              </div>

              <div className="mt-5 space-y-3">

                <SlaRow
                  label="SLA Deadline"
                  value={
                    ticket.slaDeadline
                      ? formatDate(ticket.slaDeadline)
                      : "No SLA"
                  }
                />

                <SlaRow
                  label="Time Remaining"
                  value={getTimeRemaining(ticket.slaDeadline)}
                  danger={
                    !!ticket.slaDeadline &&
                    new Date(ticket.slaDeadline) < new Date()
                  }
                />

              </div>

            </div>

          </div>

        )}

      </section>

      {canAssign && showAssignDialog && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6">

            <h3 className="text-xl font-semibold">
              Reassign Ticket
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose the user who should own this ticket.
            </p>

            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(e.target.value)
              }
              className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3"
            >

              <option value="">
                Unassigned
              </option>

              {users
                .filter((user) => user.userType === "internal")
                .map((user) => (

                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name}
                  </option>

                ))}

            </select>

            <div className="mt-6 flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setShowAssignDialog(false)
                }
              >
                Cancel
              </Button>

              <Button
                disabled={
                  selectedUser ===
                  (ticket.assignedTo?._id ?? "")
                }
                onClick={async () => {
                  await assign(selectedUser);

                  await refreshActivities();

                  setShowAssignDialog(false);
                }}
              >
                Save
              </Button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

function MetaCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
      {sub && (
        <p className="mt-1 text-xs text-muted-foreground">
          {sub}
        </p>
      )}
    </div>
  );
}

function SignalRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ActionCard({
  title,
  value,
  helper,
  danger = false,
}: {
  title: string;
  value: string;
  helper: string;
  danger?: boolean;
}) {
  return (
    <button className="flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </div>
      <span
        className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"
          }`}
      >
        {value}
      </span>
    </button>
  );
}

function SlaRow({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}


function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone:
  "critical"
  |
  "escalated"
  |
  "risk"
  |
  "watch"
  |
  "success"
}) {
  const styles =
    tone === "critical"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : tone === "escalated"
        ? "border-primary/20 bg-primary/10 text-primary"
        : tone === "risk"
          ? "border-primary/20 bg-primary/10 text-primary"
          : tone === "success"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-sky-500/20 bg-sky-500/10 text-sky-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}