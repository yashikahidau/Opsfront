"use client";
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
import { useSettings } from "@/hooks/useSettings";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

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
  const {
    loading,
    saving,
    settings,
    saveSettings,
  } = useSettings();

  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const isInternal = user?.userType === "internal";
  const isCustomer = user?.userType === "customer";

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        user: AuthUser;
      }>("/api/auth/profile", {
        method: "PATCH",
        body: {
          name: profileForm.name,
          email: profileForm.email,
        },
      });

      toast.success(response.message);

      await refreshUser();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    }
  };

  const [form, setForm] = useState({
    workspaceName: "",
    supportEmail: "",
    primaryTeam: "",
    timezone: "",
    autoAssign: true,
    autoEscalation: true,
    queueFallback: "",
    riskInterval: "",
  });

  useEffect(() => {
    if (!settings) return;

    setForm({
      workspaceName: settings.workspaceName,
      supportEmail: settings.supportEmail,
      primaryTeam: settings.primaryTeam,
      timezone: settings.timezone,
      autoAssign: settings.automation.autoAssign,
      autoEscalation: settings.automation.autoEscalation,
      queueFallback: settings.automation.queueFallback,
      riskInterval: settings.automation.riskInterval,
    });
  }, [settings]);

  const hasChanges = useMemo(() => {
    if (!settings) return false;

    return (
      form.workspaceName !== settings.workspaceName ||
      form.supportEmail !== settings.supportEmail ||
      form.primaryTeam !== settings.primaryTeam ||
      form.timezone !== settings.timezone ||

      form.autoAssign !== settings.automation.autoAssign ||
      form.autoEscalation !== settings.automation.autoEscalation ||
      form.queueFallback !== settings.automation.queueFallback ||
      form.riskInterval !== settings.automation.riskInterval
    );
  }, [form, settings]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }
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

        <button
          onClick={async () => {
            try {
              await saveSettings({
                workspaceName: form.workspaceName,
                supportEmail: form.supportEmail,
                primaryTeam: form.primaryTeam,
                timezone: form.timezone,
                automation: {
                  autoAssign: form.autoAssign,
                  autoEscalation: form.autoEscalation,
                  queueFallback: form.queueFallback,
                  riskInterval: form.riskInterval,
                },
              });

              toast.success("Settings saved successfully.");
            } catch {
              toast.error("Failed to save settings.");
            }
          }}
          disabled={saving || !hasChanges}
          className={`inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 ${saving || !hasChanges
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:-translate-y-0.5 hover:opacity-95"
            }`}
        >
          <Save className="size-4" />
          {saving
            ? "Saving..."
            : hasChanges
              ? "Save changes"
              : "Saved"}
        </button>
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        {/* Left side */}
        <div className="space-y-6">

          {/* My Profile */}
          <div
            id="my-profile"
            className="rounded-3xl border border-border bg-card/30 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground">
                  My Profile
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your personal account information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Name
                </label>

                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </label>

                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>

              <CompactInfo
                label="Role"
                value={
                  user?.userType === "customer"
                    ? "Customer"
                    : (user?.role ?? "-")
                }
              />

              <CompactInfo
                label="Workspace"
                value={user?.workspaceName ?? "-"}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  router.push(
                    `/forgot-password?email=${encodeURIComponent(user?.email ?? "")}`
                  )
                }
                className="rounded-full border border-border bg-background/40 px-5 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
              >
                Send Password Reset Link
              </button>

              <button
                onClick={handleProfileSave}
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>

          {isInternal && (
            <>
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
                  <Field
                    label="Workspace name"
                    value={form.workspaceName}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        workspaceName: value,
                      }))
                    }
                  />

                  <Field
                    label="Support email"
                    value={form.supportEmail}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        supportEmail: value,
                      }))
                    }
                  />

                  <Field
                    label="Primary team"
                    value={form.primaryTeam}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        primaryTeam: value,
                      }))
                    }
                  />

                  <Field
                    label="Timezone"
                    value={form.timezone}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

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
              {settings && (
                <>
                  <ToggleRow
                    label="Send escalation alerts to assigned agents"
                    enabled={settings.notifications.escalationAlerts}
                    onToggle={() => {
                      saveSettings({
                        notifications: {
                          ...settings.notifications,
                          escalationAlerts:
                            !settings.notifications.escalationAlerts,
                        },
                      });
                    }}
                  />

                  <ToggleRow
                    label="Notify leads when a ticket crosses risk threshold"
                    enabled={settings.notifications.leadAlerts}
                    onToggle={() => {
                      saveSettings({
                        notifications: {
                          ...settings.notifications,
                          leadAlerts:
                            !settings.notifications.leadAlerts,
                        },
                      });
                    }}
                  />

                  <ToggleRow
                    label="Daily queue summary email"
                    enabled={settings.notifications.dailySummary}
                    onToggle={() => {
                      saveSettings({
                        notifications: {
                          ...settings.notifications,
                          dailySummary:
                            !settings.notifications.dailySummary,
                        },
                      });
                    }}
                  />

                  <ToggleRow
                    label="Slack / Teams digest delivery"
                    enabled={settings.notifications.slackDigest}
                    onToggle={() => {
                      saveSettings({
                        notifications: {
                          ...settings.notifications,
                          slackDigest:
                            !settings.notifications.slackDigest,
                        },
                      });
                    }}
                  />
                </>
              )}
            </div>

          </div>

          {isInternal && (
            <>
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

                <div className="mt-5 space-y-5">
                  <div className="space-y-3">
                    <ToggleRow
                      label="Auto assign incoming tickets"
                      enabled={form.autoAssign}
                      onToggle={() =>
                        setForm((prev) => ({
                          ...prev,
                          autoAssign: !prev.autoAssign,
                        }))
                      }
                    />

                    <ToggleRow
                      label="Auto escalate overdue tickets"
                      enabled={form.autoEscalation}
                      onToggle={() =>
                        setForm((prev) => ({
                          ...prev,
                          autoEscalation: !prev.autoEscalation,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Risk recalculation interval"
                      value={form.riskInterval}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          riskInterval: value,
                        }))
                      }
                    />

                    <Field
                      label="Default queue fallback"
                      value={form.queueFallback}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          queueFallback: value,
                        }))
                      }
                    />
                  </div>
                </div>

              </div>
            </>
          )}

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
              {isInternal ? (
                settings && (
                  <>
                    <ToggleRow
                      label="Require two-factor authentication for admins"
                      enabled={settings.security.twoFactor}
                      onToggle={() => {
                        saveSettings({
                          security: {
                            ...settings.security,
                            twoFactor: !settings.security.twoFactor,
                          },
                        });
                      }}
                    />

                    <ToggleRow
                      label="Allow SSO / Google sign-in"
                      enabled={settings.security.googleLogin}
                      onToggle={() => {
                        saveSettings({
                          security: {
                            ...settings.security,
                            googleLogin: !settings.security.googleLogin,
                          },
                        });
                      }}
                    />

                    <ToggleRow
                      label="Session timeout after inactivity"
                      enabled={settings.security.sessionTimeout}
                      onToggle={() => {
                        saveSettings({
                          security: {
                            ...settings.security,
                            sessionTimeout: !settings.security.sessionTimeout,
                          },
                        });
                      }}
                    />
                  </>
                )
              ) : (
                <div className="rounded-2xl border border-border bg-background/35 p-5">
                  <p className="text-sm font-medium text-foreground">
                    Account Security
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    You can reset your password anytime from the <span className="font-medium text-foreground">My Profile</span> section above.
                  </p>
                </div>
              )}
            </div>
            {isInternal && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CompactInfo
                  label="Session timeout"
                  value={
                    settings?.security.sessionTimeout
                      ? "30 minutes"
                      : "Disabled"
                  }
                />

                <CompactInfo
                  label="Admin role approval"
                  value="Required"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        {isInternal && (
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
        )}
      </section>

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary"
      />
    </div>
  );
}

function CompactInfo({
  label,
  value,
  editable = false,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>

      {editable ? (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-card/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      ) : (
        <p className="mt-2 text-sm font-medium text-foreground">
          {value}
        </p>
      )}
    </div>
  );
}


function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 transition-all duration-200 hover:border-primary/10"
    >
      <span className="pr-4 text-left text-sm text-foreground">
        {label}
      </span>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all ${enabled ? "bg-primary" : "bg-muted"
          }`}
      >
        <div
          className={`absolute top-1 size-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"
            }`}
        />
      </div>
    </button>
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