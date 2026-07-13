"use client";

import {
  AlertTriangle,
  Clock3,
  ShieldAlert,
  Ticket,
} from "lucide-react";

import { Ticket as TicketType } from "@/lib/ticket";

interface Props {
  tickets: TicketType[];
}

export default function TicketStats({
  tickets,
}: Props) {
  const stats = [
    {
      label: "Open",
      value: tickets.filter(
        (t) => t.status === "open"
      ).length,
      hint: "Active queue",
      tone: "default",
      icon: Ticket,
    },
    {
      label: "At Risk",
      value: tickets.filter(
        (t) => t.riskScore >= 70
      ).length,
      hint: "Need action",
      tone: "primary",
      icon: AlertTriangle,
    },
    {
      label: "Overdue",
      value: tickets.filter(
        (t) => t.status === "waiting"
      ).length,
      hint: "Past SLA",
      tone: "destructive",
      icon: ShieldAlert,
    },
    {
      label: "Due Soon",
      value: tickets.filter(
        (t) => t.status === "in-progress"
      ).length,
      hint: "Within SLA",
      tone: "warning",
      icon: Clock3,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        const toneClass =
          item.tone === "primary"
            ? "border-primary/20 bg-primary/[0.06]"
            : item.tone === "destructive"
            ? "border-destructive/20 bg-destructive/[0.06]"
            : item.tone === "warning"
            ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/[0.06]"
            : "border-border bg-card/40";

        const iconClass =
          item.tone === "primary"
            ? "text-primary"
            : item.tone === "destructive"
            ? "text-destructive"
            : item.tone === "warning"
            ? "text-[color:var(--warning)]"
            : "text-foreground";

        return (
          <div
            key={item.label}
            className={`rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-primary/15 ${toneClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>

                <h3 className="mt-3 font-mono text-3xl font-semibold text-foreground">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.hint}
                </p>
              </div>

              <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                <Icon className={`size-5 ${iconClass}`} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}