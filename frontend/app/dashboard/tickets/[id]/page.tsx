"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  ShieldAlert,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { useParams } from "next/navigation";

import { useTicket } from "@/hooks/useTicket";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import FormAlert from "@/components/form/FormAlert";

import { useComments } from "@/hooks/useComments";

import { useState } from "react";

import { useActivities } from "@/hooks/useActivities";

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



const related = [
  "OPS-2479 · Production deploy access blocked for data team",
  "OPS-2468 · SSO invite loop for design team onboarding",
  "OPS-2441 · Okta group sync delay for contractors",
];

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

export default function TicketDetailPage() {

  const params = useParams();

  const {
    ticket,
    loading,
    error,
    changeStatus,
    changePriority,
    resolveTicket,
  } = useTicket(params.id as string);

  const {
    comments,
    loading: commentsLoading,
    createComment,
  } = useComments(params.id as string);

  const {
    activities,
    loading: activitiesLoading,
    refresh: refreshActivities,
  } = useActivities(params.id as string);

  const [newComment, setNewComment] = useState("");

  const [posting, setPosting] = useState(false);

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
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Reassign
          </button>
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Add note
          </button>
          <button
            onClick={resolveTicket}
            disabled={ticket.status === "resolved"}
            className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ticket.status === "resolved"
              ? "Resolved"
              : "Resolve ticket"}
          </button>
        </div>
      </section>

      {/* Hero ticket summary */}
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
                  {ticket.category.toUpperCase()}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {ticket.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                  {ticket.description}
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 p-2.5 text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card hover:text-foreground">
                <MoreHorizontal className="size-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Priority */}
              <Badge
                tone={
                  ticket.priority === "critical"
                    ? "critical"
                    : "watch"
                }
              >
                {ticket.priority
                  .replace(/\b\w/g, (c: string) =>
                    c.toUpperCase()
                  )}
              </Badge>

              {/* Status */}
              <Badge
                tone={
                  ticket.status === "resolved"
                    ? "watch"
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

              {/* SLA */}
              {ticket.slaDeadline && (
                <Badge
                  tone={
                    new Date(ticket.slaDeadline) <
                      new Date()
                      ? "critical"
                      : "watch"
                  }
                >
                  {new Date(
                    ticket.slaDeadline
                  ).toLocaleString()}
                </Badge>
              )}
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
              <MetaCard
                label="Requester"
                value={ticket.createdBy.name}
                sub={ticket.createdBy.email}
              />
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
              <MetaCard
                label="Created"
                value={new Date(ticket.createdAt).toLocaleString()}
                sub="Ticket created"
              />
              <MetaCard
                label="Last updated"
                value={new Date(ticket.updatedAt).toLocaleString()}
                sub="Latest activity"
              />
            </div>
          </div>
        </div>

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
                  ? new Date(ticket.slaDeadline).toLocaleString()
                  : "No SLA"
              }
            />
            <SignalRow
              label="Queue pressure"
              value={
                ticket.riskScore >= 70
                  ? "High"
                  : ticket.riskScore >= 40
                    ? "Medium"
                    : "Low"
              }
            />
            <SignalRow
              label="Requester impact"
              value={ticket.priority.toUpperCase()}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card/50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  AI triage summary
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {ticket.riskScore >= 90
                    ? "This ticket is in a critical state and requires immediate attention because the risk score is extremely high."
                    : ticket.riskScore >= 70
                      ? "This ticket has elevated operational risk and should be prioritized to avoid SLA breach."
                      : ticket.riskScore >= 40
                        ? "This ticket should be monitored closely. Current indicators suggest moderate operational risk."
                        : "This ticket is currently healthy with no significant operational risk indicators."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Conversation */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Conversation
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Request context and support updates
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                Reply
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {comment.author.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {comment.author.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {comment.author.email}
                        </p>
                      </div>

                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>

                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {comment.message}
                  </p>

                </div>
              ))}
            </div>

            {/* Comment composer */}
            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add an internal update or reply to the requester..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary/20"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                    <Paperclip className="size-4" />
                    Attach
                  </button>
                  <button className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                    <Bot className="size-4" />
                    AI draft
                  </button>
                </div>

                <button
                  onClick={handlePostComment}
                  disabled={posting || !newComment.trim()}
                  className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post update"}
                </button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Activity timeline
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Status changes, escalations, and internal ops history
              </p>
            </div>

            <div className="mt-6 space-y-4">

              {activitiesLoading ? (

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/35 p-4">
                  <LoadingSpinner className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Loading activity...
                  </span>
                </div>

              ) : activities.length === 0 ? (

                <div className="rounded-2xl border border-border bg-background/35 p-4 text-sm text-muted-foreground">
                  No activity yet.
                </div>

              ) : (

                activities.map((item) => (

                  <div
                    key={item._id}
                    className="flex gap-4 rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                  >

                    <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">

                      {item.type === "status" ? (

                        <ShieldAlert className="size-4" />

                      ) : item.type === "priority" ? (

                        <Sparkles className="size-4" />

                      ) : item.type === "comment" ? (

                        <MessageSquare className="size-4" />

                      ) : (

                        <Clock3 className="size-4" />

                      )}

                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-medium text-foreground">
                        {item.message}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.user.name}
                        {" • "}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Ticket actions */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Ticket actions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Update ownership, status, and escalation state
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border bg-background/35 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Change status
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Update the current ticket status
                    </p>
                  </div>

                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value as typeof ticket.status
                      )
                    }
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status
                          .replace("-", " ")
                          .replace(/\b\w/g, (c: string) =>
                            c.toUpperCase()
                          )}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ActionCard
                title="Assigned owner"
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Priority
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Update ticket priority
                    </p>
                  </div>

                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      handlePriorityChange(
                        e.target.value as typeof ticket.priority
                      )
                    }
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <ActionCard
                title="Escalation state"
                value={
                  ticket.riskScore >= 90
                    ? "Critical"
                    : ticket.riskScore >= 70
                      ? "At Risk"
                      : ticket.riskScore >= 40
                        ? "Watch"
                        : "Healthy"
                }
                helper={
                  ticket.slaDeadline
                    ? `SLA: ${new Date(
                      ticket.slaDeadline
                    ).toLocaleString()}`
                    : "No SLA assigned"
                }
                danger={ticket.riskScore >= 70}
              />

            </div>
          </div>

          {/* SLA block */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">SLA status</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Response and resolution windows for this request
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <SlaRow
                label="SLA Deadline"
                value={
                  ticket.slaDeadline
                    ? new Date(
                      ticket.slaDeadline
                    ).toLocaleString()
                    : "No SLA"
                }
              />

              <SlaRow
                label="Created"
                value={new Date(
                  ticket.createdAt
                ).toLocaleString()}
              />

              <SlaRow
                label="Time Remaining"
                value={getTimeRemaining(
                  ticket.slaDeadline
                )}
                danger={
                  !!ticket.slaDeadline &&
                  new Date(ticket.slaDeadline) <
                  new Date()
                }
              />
            </div>
          </div>

          {/* Related tickets */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Related tickets
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Similar identity and access incidents
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {related.map((item) => (
                <button
                  key={item}
                  className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <span className="text-sm leading-6 text-foreground">{item}</span>
                  <ArrowLeft className="mt-1 size-4 rotate-180 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Resolution checklist */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Resolution checklist
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Suggested next actions before closing
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <ChecklistItem label="Confirm VPN auth fix with finance team" done={false} />
              <ChecklistItem label="Validate access to reporting environment" done={false} />
              <ChecklistItem label="Capture root-cause note in internal timeline" done={true} />
            </div>
          </div>
        </div>
      </section>
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
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
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

function ChecklistItem({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/35 px-4 py-3">
      <div
        className={`grid size-5 place-items-center rounded-full border ${done
          ? "border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]"
          : "border-border bg-background/50 text-muted-foreground"
          }`}
      >
        {done ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "critical" | "escalated" | "risk" | "watch";
}) {
  const styles =
    tone === "critical"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : tone === "escalated"
        ? "border-primary/20 bg-primary/10 text-primary"
        : tone === "risk"
          ? "border-primary/20 bg-primary/10 text-primary"
          : "border-sky-500/20 bg-sky-500/10 text-sky-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}