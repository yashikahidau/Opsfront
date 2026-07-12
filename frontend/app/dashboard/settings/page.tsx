import {
  Bell,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Save,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const workspaceHealth = [
  { label: "Policies active", value: "4" },
  { label: "Agents onboarded", value: "14" },
  { label: "Automation rules", value: "6" },
];

const slaDefaults = [
  { label: "Default warning threshold", value: "78%" },
  { label: "Auto-escalation", value: "Enabled" },
  { label: "Business-hours SLA", value: "Enabled" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Workspace settings
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Configure how Opsfront behaves for your team.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Manage workspace details, notifications, automations, and security
            preferences from one place.
          </p>
        </div>

        <button className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95">
          <Save className="size-4" />
          Save changes
        </button>
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        {/* Left side */}
        <div className="space-y-6">
          {/* Workspace profile */}
          <div className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border bg-background/35 p-2 text-muted-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Workspace profile
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basic workspace identity and support contact information
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Workspace name" value="Opsfront" />
              <Field label="Support email" value="support@opsfront.app" />
              <Field label="Primary team" value="Internal IT Operations" />
              <Field label="Timezone" value="UTC +05:30" />
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border bg-background/35 p-2 text-muted-foreground">
                <Bell className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notifications
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Control when leads and agents receive operational alerts
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <ToggleRow label="Send escalation alerts to assigned agents" enabled />
              <ToggleRow label="Notify leads when a ticket crosses risk threshold" enabled />
              <ToggleRow label="Daily queue summary email" enabled={false} />
              <ToggleRow label="Slack / Teams digest delivery" enabled />
            </div>
          </div>

          {/* Automations */}
          <div className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border bg-background/35 p-2 text-muted-foreground">
                <Workflow className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Automation defaults
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set workspace-wide automation behavior for triage and escalation
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CompactInfo label="Auto-assign on intake" value="Enabled" />
              <CompactInfo label="Risk recalculation interval" value="Every 10 min" />
              <CompactInfo label="Auto-escalation" value="Enabled" />
              <CompactInfo label="Default queue fallback" value="Ops triage" />
            </div>
          </div>

          {/* Security */}
          <div className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border bg-background/35 p-2 text-muted-foreground">
                <LockKeyhole className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Security & access
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Access control and authentication preferences
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <ToggleRow label="Require two-factor authentication for admins" enabled />
              <ToggleRow label="Allow SSO / Google sign-in" enabled />
              <ToggleRow label="Session timeout after inactivity" enabled />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CompactInfo label="Session timeout" value="30 minutes" />
              <CompactInfo label="Admin role approval" value="Required" />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Workspace health */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Workspace health
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quick snapshot of current configuration coverage
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {workspaceHealth.map((item) => (
                <MetricRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {/* SLA defaults summary */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                SLA defaults
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current workspace-wide SLA behavior
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {slaDefaults.map((item) => (
                <MetricRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            <button className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              Open SLA policies
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Billing / plan */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border bg-background/35 p-2 text-muted-foreground">
                <CreditCard className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Billing & workspace plan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current internal workspace plan details
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Current plan
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Internal Ops Pro
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                20 agents · automation enabled · SLA analytics included
              </p>
            </div>

            <button className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
              Manage plan
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Danger zone */}
          <div className="rounded-3xl border border-destructive/20 bg-destructive/[0.04] p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Danger zone</p>
              <p className="mt-1 text-sm text-muted-foreground">
                High-impact workspace actions
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <DangerAction
                title="Reset automation defaults"
                description="Revert automation rules back to workspace defaults."
              />
              <DangerAction
                title="Archive workspace"
                description="Disable access and move this workspace into archived state."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
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
      <div className="mt-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}

function CompactInfo({
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

function ToggleRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 transition-all duration-200 hover:border-primary/10">
      <span className="pr-4 text-sm text-foreground">{label}</span>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-1 size-4 rounded-full bg-white transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 transition-all duration-200 hover:border-primary/10">
      <span className="text-sm text-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  );
}

function DangerAction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-destructive/20 bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-destructive/35">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}