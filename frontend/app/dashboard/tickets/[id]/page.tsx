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

const activity = [
  {
    type: "status",
    title: "Status changed to Escalated",
    meta: "12 min ago · by D. Cho",
  },
  {
    type: "note",
    title: "Finance team confirmed the VPN failure is blocking month-end close work.",
    meta: "24 min ago · internal note by N. Patel",
  },
  {
    type: "assignment",
    title: "Assigned to D. Cho from triage queue",
    meta: "41 min ago · by Opsfront auto-routing",
  },
  {
    type: "triage",
    title: "AI triage raised priority from High to Critical",
    meta: "53 min ago · based on SLA proximity + requester impact",
  },
];

const comments = [
  {
    author: "Aman Verma",
    role: "Requester",
    time: "1h ago",
    body: "The finance team still can’t authenticate through VPN. This is blocking access to the reporting environment and payroll close tasks.",
  },
  {
    author: "D. Cho",
    role: "Agent",
    time: "38m ago",
    body: "Investigating the auth logs now. Looks tied to the latest policy sync. I’ve escalated to the access management queue and I’m validating whether the issue is isolated to the finance group.",
  },
];

const related = [
  "OPS-2479 · Production deploy access blocked for data team",
  "OPS-2468 · SSO invite loop for design team onboarding",
  "OPS-2441 · Okta group sync delay for contractors",
];

export default function TicketDetailPage() {
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
            OPS-2481
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Reassign
          </button>
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Add note
          </button>
          <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            Resolve ticket
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
                  Access Management
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  VPN auth failing for finance team
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                  Finance users are unable to authenticate through the company VPN
                  after the latest policy sync. The issue is blocking access to
                  internal reporting systems and payroll-close workflows.
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 p-2.5 text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card hover:text-foreground">
                <MoreHorizontal className="size-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="critical">Critical</Badge>
              <Badge tone="escalated">Escalated</Badge>
              <Badge tone="risk">At Risk</Badge>
              <Badge tone="watch">18m left</Badge>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
              <MetaCard label="Requester" value="Aman Verma" sub="Finance Ops" />
              <MetaCard label="Assigned to" value="D. Cho" sub="Access Management" />
              <MetaCard label="Created" value="Today, 9:14 AM" sub="P1 response SLA" />
              <MetaCard label="Last updated" value="12 min ago" sub="Escalated from queue" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary/80">
            Live risk signal
          </p>

          <div className="mt-4">
            <p className="font-mono text-5xl font-semibold tracking-tight text-primary">
              94
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Current risk score for this ticket
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[94%] rounded-full bg-primary" />
          </div>

          <div className="mt-6 space-y-3">
            <SignalRow label="Time to breach" value="18m" />
            <SignalRow label="Queue pressure" value="High" />
            <SignalRow label="Requester impact" value="Critical workflow blocked" />
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
                  Opsfront flagged this as high-risk because the requester belongs
                  to finance, the issue blocks payroll-close tasks, and the
                  ticket has already stalled once in the triage queue.
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
                  key={`${comment.author}-${comment.time}`}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {comment.author
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {comment.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comment.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">{comment.time}</p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment composer */}
            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
              <div className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30">
                Add an internal update or reply to the requester...
              </div>

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

                <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
                  Post update
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
              {activity.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex gap-4 rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    {item.type === "status" ? (
                      <ShieldAlert className="size-4" />
                    ) : item.type === "assignment" ? (
                      <UserPlus className="size-4" />
                    ) : item.type === "triage" ? (
                      <Sparkles className="size-4" />
                    ) : (
                      <MessageSquare className="size-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
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
              <ActionCard
                title="Change status"
                value="Escalated"
                helper="Move to waiting, in progress, or resolved"
              />
              <ActionCard
                title="Assigned owner"
                value="D. Cho"
                helper="Access management queue"
              />
              <ActionCard
                title="Priority"
                value="Critical"
                helper="Raised by AI triage"
              />
              <ActionCard
                title="Escalation state"
                value="Live"
                helper="Breaching in 18 minutes"
                danger
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
              <SlaRow label="Response target" value="10:00 AM today" />
              <SlaRow label="Resolution target" value="11:30 AM today" />
              <SlaRow label="Time remaining" value="18m" danger />
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
        className={`text-sm font-medium ${
          danger ? "text-destructive" : "text-foreground"
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
        className={`grid size-5 place-items-center rounded-full border ${
          done
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