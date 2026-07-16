"use client"
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { useSlaPolicies } from "@/hooks/useSlaPolicies";
import { SlaPolicy } from "@/lib/slaPolicies";
import { exportPolicies } from "@/lib/slaPolicies";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import EditPolicyDialog from "@/components/dashboard/sla/EditPolicyDialog";
import { useState } from "react";

export default function SlaPoliciesPage() {
  const {
    loading,
    policies,
    health,
    recommendations,
    refresh,
    editPolicy,
  } = useSlaPolicies();
  const router = useRouter();

  const [selectedPolicy, setSelectedPolicy] =
    useState<SlaPolicy | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner className="h-8 w-8 text-primary" />

        <p className="text-sm text-muted-foreground">
          Loading SLA Dashboard...
        </p>
      </div>
    );
  }
  return (

    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            SLA policies
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Define support targets and escalation rules.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Configure response windows, resolution deadlines, and breach thresholds
            across your support priority tiers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              try {
                await exportPolicies();
              } catch (err) {
                console.error(err);
              }
            }}
            className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card"
          >
            Export Policies
          </button>
          <button
  disabled
  title="Custom SLA policies will be available in a future update."
  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-primary/60 px-5 py-2 text-sm font-medium text-primary-foreground opacity-60"
>
  <Plus className="size-4" />
  New Policy
</button>
        </div>
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        {/* Left: policies table/list */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
          <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Policy rules</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Response, resolution, and escalation thresholds by priority tier
              </p>
            </div>

            <button
              onClick={refresh}
              className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
            >
              Refresh
            </button>
          </div>

          {/* Desktop header */}
          <div className="hidden grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_0.9fr_0.7fr] gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground lg:grid">
            <div>Policy</div>
            <div>Response</div>
            <div>Resolution</div>
            <div>Escalate</div>
            <div>Compliance</div>
            <div></div>
          </div>

          <div className="divide-y divide-border">
            {policies.map((policy) => (
              <div
                key={policy._id}
                className="px-5 py-5 transition-all duration-200 hover:bg-background/35 sm:px-6"
              >
                {/* Desktop row */}
                <div className="hidden items-center gap-4 lg:grid lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_0.9fr_0.7fr]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${policy.priority === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : policy.priority === "high"
                            ? "bg-primary/10 text-primary"
                            : policy.priority === "medium"
                              ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
                              : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                          }`}
                      >
                        {policy.name}
                      </span>

                      <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-2.5 py-1 text-[11px] font-medium text-[color:var(--success)]">
                        {policy.status}
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-sm text-foreground">
                    {policy.response}
                  </div>
                  <div className="font-mono text-sm text-foreground">
                    {policy.resolution}
                  </div>
                  <div className="font-mono text-sm text-foreground">
                    {policy.escalation}
                  </div>
                  <div className="font-mono text-sm text-foreground">
                    {policy.compliance}%
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setEditOpen(true);
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/40 px-3.5 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                      Edit
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile / tablet card row */}
                <div className="lg:hidden rounded-3xl border border-border bg-background/[0.28] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${policy.priority === "critical"
                            ? "bg-destructive/10 text-destructive"
                            : policy.priority === "high"
                              ? "bg-primary/10 text-primary"
                              : policy.priority === "medium"
                                ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
                                : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                            }`}
                        >
                          {policy.name}
                        </span>

                        <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-2.5 py-1 text-[11px] font-medium text-[color:var(--success)]">
                          {policy.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setEditOpen(true);
                      }}
                      className="w-fit cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
                    >
                      Edit Policy
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <PolicyMetric label="First response" value={policy.response} />
                    <PolicyMetric label="Resolution" value={policy.resolution} />
                    <PolicyMetric label="Escalation" value={policy.escalation} />
                    <PolicyMetric label="Compliance" value={`${policy.compliance}%`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Default rule settings */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Default breach settings
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Workspace-wide SLA behavior
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <SettingRow label="Business hours only" enabled />
              <SettingRow label="Count weekends in SLA" enabled={false} />
              <SettingRow label="Auto-escalate on breach" enabled />
              <SettingRow label="Pause timer on waiting state" enabled />
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Default warning threshold
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
                <span className="font-mono text-sm text-foreground">78%</span>
              </div>
            </div>
          </div>

          {/* Policy health */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Policy health
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current SLA pressure across active queues
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="space-y-3">

                <HealthCard
                  icon={ShieldAlert}
                  label="Breached Today"
                  value={health?.breachedToday ?? 0}
                  tone="destructive"
                />

                <HealthCard
                  icon={AlertTriangle}
                  label="At Risk"
                  value={health?.atRisk ?? 0}
                  tone="primary"
                />

                <HealthCard
                  icon={Clock3}
                  label="Avg Response"
                  value={health?.avgFirstResponse ?? "-"}
                  tone="success"
                />

              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Recommendations
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Suggested policy adjustments
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {recommendations.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const text = item.toLowerCase();

                    if (text.includes("breach")) {
  router.push(
    "/dashboard/queue?status=warning"
  );
  return;
}

                    if (text.includes("risk")) {
                      router.push("/dashboard/queue");
                      return;
                    }

                    router.push(
  "/dashboard/analytics"
);
                  }}
                  className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                >
                  <span className="text-sm leading-6 text-foreground">
                    {item}
                  </span>

                  <ArrowUpRight className="mt-1 size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditPolicyDialog
        open={editOpen}
        policy={selectedPolicy}
        onClose={() => {
          setEditOpen(false);
          setSelectedPolicy(null);
        }}
        onSave={editPolicy}
      />

    </div>
  );
}

function PolicyMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-3 transition-all duration-200 hover:border-primary/10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-base font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function SettingRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      title="Workspace setting. Editable from the Settings page."
      className="flex items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 opacity-80"
    >
      <span className="text-sm text-foreground">
        {label}
      </span>

      <div
        className={`relative h-6 w-11 rounded-full ${
          enabled
            ? "bg-primary"
            : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-1 size-4 rounded-full bg-white ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </div>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string | number;
  tone: "primary" | "destructive" | "success";
}) {

  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : "text-[color:var(--success)]";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 transition-all duration-200 hover:border-primary/10">

      <div className="flex items-center gap-3">

        <div className="grid size-9 place-items-center rounded-2xl border border-border bg-background/35 text-muted-foreground">

          <Icon className="size-4" />

        </div>

        <span className="text-sm text-foreground">
          {label}
        </span>

      </div>

      <span
        className={`font-mono text-lg font-semibold ${valueClass}`}
      >
        {value}
      </span>

    </div>
  );
}