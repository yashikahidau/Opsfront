"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Clock3,
  LayoutDashboard,
  PlusSquare,
  Settings,
  ShieldAlert,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { label: "Create Ticket", href: "/dashboard/create-ticket", icon: PlusSquare },
  { label: "Queue", href: "/dashboard/queue", icon: Clock3 },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Agents", href: "/dashboard/agents", icon: Users },
  { label: "SLA Policies", href: "/dashboard/sla-policies", icon: ShieldAlert },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({
  open,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-[270px] border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:flex lg:translate-x-0 lg:flex-col",
        open
          ? "translate-x-0"
          : "-translate-x-full"
      )}
    >
      <div className="border-b border-border px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl border border-primary/20 bg-primary/10 font-mono text-sm font-semibold text-primary shadow-[0_0_25px_rgba(255,176,72,0.12)]">
            OF
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Opsfront</p>
            <p className="text-xs text-muted-foreground">Support operations</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Workspace
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "border-primary/20 bg-primary/10 text-foreground shadow-[0_0_30px_rgba(255,176,72,0.08)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Ops health</p>
            <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-2 py-1 text-[10px] font-medium text-[color:var(--success)]">
              Stable
            </span>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            96% SLA compliance this week with 12 active risk-tracked tickets.
          </p>
        </div>
      </div>
    </aside>
  );
}