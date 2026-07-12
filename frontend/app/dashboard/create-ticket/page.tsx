import Link from "next/link";
import {
  ArrowLeft,
  Bot,
 CalendarClock,
  ChevronDown,
  Paperclip,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react";

const categories = [
  "Access Management",
  "IT Ops",
  "Identity",
  "Infra Access",
  "Finance Systems",
  "Workspace",
];

const templates = [
  {
    title: "Access issue",
    desc: "VPN, SSO, permission or account access request",
  },
  {
    title: "Hardware / IT request",
    desc: "Laptop, device setup, onboarding or replacement",
  },
  {
    title: "Internal tool incident",
    desc: "Broken dashboard, export failure, system outage or bug",
  },
];

export default function CreateTicketPage() {
  return (
    <div className="space-y-7">
      {/* Top bar */}
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
            New request
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card">
            Save draft
          </button>
          <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
            Submit ticket
          </button>
        </div>
      </section>

      {/* Hero */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Create ticket
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Capture the issue clearly, route it fast, and protect the SLA clock.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Create internal support requests with the right category, impact, and
            context so Opsfront can route, score, and escalate them correctly.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>AI-assisted triage</Pill>
            <Pill>Internal support workflow</Pill>
            <Pill>SLA-aware intake</Pill>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                What Opsfront will do after submission
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The ticket will be classified, assigned an initial priority,
                checked against SLA policy, and routed into the correct ops queue.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <InfoRow label="Auto-triage" value="Category + priority suggestion" />
            <InfoRow label="Risk signal" value="Initial SLA risk baseline" />
            <InfoRow label="Routing" value="Queue + assignee recommendation" />
          </div>
        </div>
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT — FORM */}
        <div className="space-y-6">
          {/* Quick templates */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div>
              <p className="text-sm font-medium text-foreground">
                Start from a template
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use a common request pattern to speed up ticket creation.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {templates.map((template) => (
                <button
                  key={template.title}
                  className="cursor-pointer rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <p className="text-sm font-medium text-foreground">
                    {template.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {template.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main form */}
          <div className="rounded-3xl border border-border bg-card/30 p-6 sm:p-7">
            <div>
              <p className="text-sm font-medium text-foreground">
                Ticket details
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the issue summary, owner context, and support metadata.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {/* Subject */}
              <FieldGroup label="Subject" helper="A clear one-line summary of the request">
                <InputLike placeholder="e.g. VPN auth failing for finance team" />
              </FieldGroup>

              {/* Description */}
              <FieldGroup
                label="Description"
                helper="Include what broke, who is impacted, and any urgency context"
              >
                <TextAreaLike placeholder="Describe the issue, expected behavior, affected team, and any steps already tried..." />
              </FieldGroup>

              {/* Two column row */}
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Category" helper="Used for routing and SLA policy">
                  <SelectLike value="Select category" />
                </FieldGroup>

                <FieldGroup label="Priority" helper="Initial urgency before AI triage adjusts it">
                  <SelectLike value="Select priority" />
                </FieldGroup>
              </div>

              {/* Second row */}
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Requester" helper="Who raised or owns this request">
                  <InputWithIcon
                    icon={<UserRound className="size-4" />}
                    placeholder="e.g. Aman Verma"
                  />
                </FieldGroup>

                <FieldGroup label="Assignee" helper="Optional initial owner">
                  <SelectLike value="Assign later or choose agent" />
                </FieldGroup>
              </div>

              {/* Third row */}
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Affected team" helper="Helps route internal issues faster">
                  <InputLike placeholder="e.g. Finance Ops" />
                </FieldGroup>

                <FieldGroup label="SLA policy" helper="Attach a matching response / resolution target">
                  <SelectLike value="Select SLA policy" />
                </FieldGroup>
              </div>

              {/* Tags / attachments */}
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Tags" helper="Optional labels for grouping or reporting">
                  <InputLike placeholder="e.g. vpn, finance, access" />
                </FieldGroup>

                <FieldGroup label="Attachments" helper="Screenshots, logs, or relevant files">
                  <button className="flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-background/40 px-4 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Paperclip className="size-4" />
                      Add attachment
                    </span>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </button>
                </FieldGroup>
              </div>

              {/* Internal note */}
              <FieldGroup
                label="Internal intake note"
                helper="Optional note visible only to agents and admins"
              >
                <TextAreaLike placeholder="Add internal routing context, escalation hints, or known dependencies..." />
              </FieldGroup>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Ticket will enter the queue immediately after submission.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                    Save draft
                  </button>
                  <button className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
                    Submit ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — SIDEBAR PANELS */}
        <div className="space-y-6">
          {/* AI triage preview */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Bot className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  AI triage preview
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on the details you enter, Opsfront can suggest category,
                  urgency, and escalation risk.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <PreviewCard label="Suggested category" value="Access Management" />
              <PreviewCard label="Suggested priority" value="High" />
              <PreviewCard label="Initial risk flag" value="Watch" />
            </div>
          </div>

          {/* SLA guidance */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <CalendarClock className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  SLA guidance
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Higher-impact requests can be tied to faster response windows.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow label="P1 response target" value="15m" />
              <InfoRow label="P2 response target" value="1h" />
              <InfoRow label="P3 response target" value="4h" />
            </div>
          </div>

          {/* Queue routing */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <ShieldAlert className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue routing
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Opsfront uses category, impact, and ownership context to place
                  tickets into the right operational lane.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <span className="text-sm text-foreground">{category}</span>
                  <ChevronDown className="size-4 rotate-[-90deg] text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Submission checklist */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Before you submit
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                A strong intake ticket makes triage and escalation cleaner.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <Checklist label="Clear issue summary" />
              <Checklist label="Who is impacted" />
              <Checklist label="Priority / urgency context" />
              <Checklist label="Any logs, screenshots, or attachments" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FieldGroup({
  label,
  helper,
  children,
}: {
  label: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
      </div>
      {children}
    </div>
  );
}

function InputLike({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-12 items-center rounded-2xl border border-border bg-background/40 px-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30">
      {placeholder}
    </div>
  );
}

function InputWithIcon({
  icon,
  placeholder,
}: {
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30">
      <span className="text-muted-foreground">{icon}</span>
      {placeholder}
    </div>
  );
}

function TextAreaLike({ placeholder }: { placeholder: string }) {
  return (
    <div className="min-h-[140px] rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm leading-7 text-muted-foreground transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30">
      {placeholder}
    </div>
  );
}

function SelectLike({ value }: { value: string }) {
  return (
    <button className="flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-background/40 px-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
      <span>{value}</span>
      <ChevronDown className="size-4" />
    </button>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function PreviewCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function Checklist({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/35 px-4 py-3">
      <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,176,72,0.9)]" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}