"use client";

interface BadgeProps {
  className: string;
  children: React.ReactNode;
}

function Badge({
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const styles =
    priority === "Critical"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : priority === "High"
      ? "border-primary/20 bg-primary/10 text-primary"
      : priority === "Medium"
      ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
      : "border-border bg-background/50 text-muted-foreground";

  return (
    <Badge className={styles}>
      {priority}
    </Badge>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "Escalated"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : status === "In Progress"
      ? "border-primary/20 bg-primary/10 text-primary"
      : status === "Open"
      ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
      : status === "Resolved"
      ? "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]"
      : "border-border bg-background/50 text-muted-foreground";

  return (
    <Badge className={styles}>
      {status}
    </Badge>
  );
}

export function RiskBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  const styles =
    tone === "safe"
      ? "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]"
      : tone === "watch"
      ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
      : tone === "risk"
      ? "border-primary/20 bg-primary/10 text-primary"
      : "border-destructive/20 bg-destructive/10 text-destructive";

  return (
    <Badge className={styles}>
      {label}
    </Badge>
  );
}