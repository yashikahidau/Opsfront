"use client"
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Filter,
  Flame,
  Search,
  ShieldAlert,
  Sparkles,
  TimerReset,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueue } from "@/hooks/useQueue";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

function getRisk(priority: string, status: string) {
  let score = 35;

  switch (priority) {
    case "critical":
      score = 95;
      break;

    case "high":
      score = 80;
      break;

    case "medium":
      score = 60;
      break;

    default:
      score = 35;
  }

  if (status === "waiting") {
    score += 5;
  }

  if (status === "resolved") {
    score = 0;
  }

  return Math.min(score, 100);
}

function getTone(priority: string) {
  switch (priority) {
    case "critical":
      return "critical";

    case "high":
      return "high";

    default:
      return "watch";
  }
}

function getSlaText(date?: string) {
  if (!date) return "No SLA";

  const diff = new Date(date).getTime() - Date.now();

  if (diff <= 0) {
    return "Breached";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${hours}h ${mins}m`;
}

export default function QueuePage() {
  const {
    tickets,
    stats,
    loading,
    refreshing,
    refresh,
  } = useQueue();

  const { users } = useUsers();


  const [showCriticalOnly, setShowCriticalOnly] =
    useState(false);

  const [search, setSearch] = useState("");

  const [priority, setPriority] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [assignee, setAssignee] = useState("");

  const [sort, setSort] =
    useState("newest");

  useEffect(() => {
    const timer = setTimeout(() => {
      refresh({
        search,
        priority,
        status,
        assignee,
        sort,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [
    search,
    priority,
    status,
    assignee,
    sort,
  ]);

  const visibleTickets = showCriticalOnly
    ? tickets.filter(
      (t) => t.priority === "critical"
    )
    : tickets;

  const queueLanes = [
    {
      title: "Critical",
      tone: "critical",
      items: tickets.filter(
        (t) => t.priority === "critical"
      ),
    },
    {
      title: "Unassigned",
      tone: "warning",
      items: tickets.filter(
        (t) => !t.assignedTo
      ),
    },
    {
      title: "Resolved",
      tone: "success",
      items: tickets.filter(
        (t) => t.status === "resolved"
      ),
    },
  ];

  const signals = [
    {
      label: "Total Tickets",
      value: tickets.length.toString(),
    },
    {
      label: "Critical Tickets",
      value: tickets
        .filter((t) => t.priority === "critical")
        .length.toString(),
    },
    {
      label: "Unassigned",
      value: tickets
        .filter((t) => !t.assignedTo)
        .length.toString(),
    },
    {
      label: "Resolved",
      value: tickets
        .filter((t) => t.status === "resolved")
        .length.toString(),
    },
  ];

  const aiSuggestions: string[] = [];

  if (
    tickets.some((t) => t.priority === "critical")
  ) {
    aiSuggestions.push(
      "Review all critical tickets immediately."
    );
  }

  if (
    tickets.some((t) => !t.assignedTo)
  ) {
    aiSuggestions.push(
      "Assign all unassigned tickets to available agents."
    );
  }

  if (
    tickets.filter((t) => t.status === "waiting").length > 3
  ) {
    aiSuggestions.push(
      "Multiple tickets are waiting for customer response."
    );
  }

  if (
    tickets.filter((t) => t.status === "open").length > 10
  ) {
    aiSuggestions.push(
      "Open ticket volume is increasing. Consider rebalancing workload."
    );
  }

  if (aiSuggestions.length === 0) {
    aiSuggestions.push(
      "Queue is healthy. No immediate action required."
    );
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-muted-foreground">
          Loading queue...
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Queue cockpit
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Watch the queue by risk, not just status.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Surface tickets drifting toward breach, spot ownership gaps early,
            and keep the highest-risk work moving before SLAs slip.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              refresh({
                search,
                priority,
                status,
                assignee,
                sort,
              })
            }
            className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card"
          >
            Refresh Queue
          </button>
          <button
            onClick={() =>
              setShowCriticalOnly((v) => !v)
            }
            className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
          >
            {showCriticalOnly
              ? "Show All"
              : "Show Critical"}
          </button>
        </div>
      </section>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats && [
          {
            label: "Open",
            value: stats.open,
            hint: "Open tickets",
            tone: "primary",
            icon: AlertTriangle,
          },
          {
            label: "Critical",
            value: stats.critical,
            hint: "Critical priority",
            tone: "destructive",
            icon: ShieldAlert,
          },
          {
            label: "Waiting",
            value: stats.waiting,
            hint: "Waiting response",
            tone: "warning",
            icon: Clock3,
          },
          {
            label: "Resolved",
            value: stats.resolved,
            hint: "Resolved tickets",
            tone: "success",
            icon: TimerReset,
          },
        ].map((item) => {
          const Icon = item.icon;

          const toneClass =
            item.tone === "primary"
              ? "border-primary/20 bg-primary/[0.06]"
              : item.tone === "destructive"
                ? "border-destructive/20 bg-destructive/[0.06]"
                : item.tone === "warning"
                  ? "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/[0.06]"
                  : "border-[color:var(--success)]/20 bg-[color:var(--success)]/[0.06]";

          const iconClass =
            item.tone === "primary"
              ? "text-primary"
              : item.tone === "destructive"
                ? "text-destructive"
                : item.tone === "warning"
                  ? "text-[color:var(--warning)]"
                  : "text-[color:var(--success)]";

          return (
            <div
              key={item.label}
              className={`rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-primary/15 ${toneClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <h3 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
                </div>

                <div className="grid size-11 place-items-center rounded-2xl border border-border bg-background/40">
                  <Icon className={`size-5 ${iconClass}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

     {/* Search / controls */}
<section className="rounded-3xl border border-border bg-card/30 p-6">
  <div className="space-y-6">

    {/* Search */}
    <div className="flex items-center gap-4">
      <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 transition-all duration-200 hover:border-primary/20 focus-within:border-primary/30">
        <Search className="size-5 shrink-0 text-muted-foreground" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            <X className="size-4" />
          </button>
        )}

        {refreshing && (
          <span className="text-xs text-primary animate-pulse">
            Updating...
          </span>
        )}
      </div>
    </div>

    {/* Filters */}
    <div className="flex flex-wrap items-center gap-3">

      <Select
        value={priority || "all"}
        onValueChange={(value) => {
          const newValue =
            value && value !== "all" ? value : "";

          setPriority(newValue);

          refresh({
            search,
            priority: newValue,
            status,
            assignee,
            sort,
          });
        }}
      >
        <SelectTrigger className="h-11 w-[190px] rounded-2xl bg-background/40">
          <SelectValue>
            {priority
              ? `Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`
              : "Priority: All"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status || "all"}
        onValueChange={(value) => {
          const newValue =
            value && value !== "all" ? value : "";

          setStatus(newValue);

          refresh({
            search,
            priority,
            status: newValue,
            assignee,
            sort,
          });
        }}
      >
        <SelectTrigger className="h-11 w-[180px] rounded-2xl bg-background/40">
          <SelectValue>
            {status
              ? `Status: ${status}`
              : "Status: All"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => {
          const newValue = value ?? "newest";

          setSort(newValue);

          refresh({
            search,
            priority,
            status,
            assignee,
            sort: newValue,
          });
        }}
      >
        <SelectTrigger className="h-11 w-[170px] rounded-2xl bg-background/40">
          <SelectValue>
            {`Sort: ${sort.charAt(0).toUpperCase() + sort.slice(1)}`}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={assignee || "all"}
        onValueChange={(value) => {
          const newValue =
            value && value !== "all" ? value : "";

          setAssignee(newValue);

          refresh({
            search,
            priority,
            status,
            assignee: newValue,
            sort,
          });
        }}
      >
        <SelectTrigger className="h-11 w-[220px] rounded-2xl bg-background/40">
          <SelectValue>
            {assignee
              ? `Assignee`
              : "Assignee: All"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-72">
          <SelectItem value="all">
            All Assignees
          </SelectItem>

          {users
            .filter((u) => u.role === "agent")
            .map((u) => (
              <SelectItem
                key={u._id}
                value={u._id}
              >
                {u.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <button
        onClick={() => {
          setSearch("");
          setPriority("");
          setStatus("");
          setAssignee("");
          setSort("newest");

          refresh({
            search: "",
            priority: "",
            status: "",
            assignee: "",
            sort: "newest",
          });
        }}
        className="ml-auto inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background/40 px-5 text-sm font-medium transition-all duration-200 hover:border-primary/20 hover:bg-card"
      >
        <Filter className="size-4" />
        Clear Filters
      </button>
    </div>

    {/* Live Queue */}
    <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] px-5 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Live Queue State
      </p>

      <p className="mt-2 text-sm font-semibold text-foreground">
        {stats
          ? `${stats.critical} Critical • ${stats.waiting} Waiting • ${stats.unassigned} Unassigned`
          : "Loading..."}
      </p>
    </div>

  </div>
</section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Left */}
        <div className="space-y-6">
          {/* Live queue table */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Live risk-ranked queue
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Highest-risk tickets sorted by exposure and SLA urgency
                </p>
              </div>

              <div className="flex items-center gap-3">
                {refreshing && (
                  <span className="text-xs font-medium text-primary animate-pulse">
                    Updating...
                  </span>
                )}

                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,176,72,0.8)]" />
                  Live
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {visibleTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Search className="mb-4 size-10 text-muted-foreground" />

                  <h3 className="text-lg font-semibold text-foreground">
                    No tickets found
                  </h3>

                  <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                    No tickets match your current search or filters.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setPriority("");
                      setStatus("");
                      setAssignee("");
                      setSort("newest");

                      refresh({
                        search: "",
                        priority: "",
                        status: "",
                        assignee: "",
                        sort: "newest",
                      });
                    }}
                    className="mt-6 rounded-2xl border border-border bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                visibleTickets.map((ticket) => {
                  const risk = getRisk(
                    ticket.priority,
                    ticket.status
                  );

                  const tone = getTone(ticket.priority);

                  return (
                    <Link
                      key={ticket._id}
                      href={`/dashboard/tickets/${ticket._id}`}
                      className="block cursor-pointer transition-all duration-200 hover:bg-background/35"
                    >

                      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-medium text-primary">
                                #{ticket._id.slice(-6).toUpperCase()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {ticket.category}
                              </span>
                            </div>

                            <h3 className="mt-2 text-base font-medium text-foreground sm:text-lg">
                              {ticket.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 xl:justify-end">
                            <PriorityBadge
                              priority={
                                ticket.priority.charAt(0).toUpperCase() +
                                ticket.priority.slice(1)
                              }
                            />
                            <StatusBadge
                              status={
                                ticket.status.charAt(0).toUpperCase() +
                                ticket.status.slice(1)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
                          <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                              Risk score
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-3">
                              <span
                                className={`font-mono text-2xl font-semibold ${tone === "critical"
                                  ? "text-destructive"
                                  : tone === "high"
                                    ? "text-primary"
                                    : "text-sky-300"
                                  }`}
                              >
                                {risk}
                              </span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full ${tone === "critical"
                                    ? "bg-destructive"
                                    : tone === "high"
                                      ? "bg-primary"
                                      : "bg-sky-400"
                                    }`}
                                  style={{
                                    width: `${risk}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                              SLA window
                            </p>
                            <p
                              className={`mt-2 text-sm font-medium ${ticket.slaStatus === "breached"
                                ? "text-destructive"
                                : ticket.slaStatus === "warning"
                                  ? "text-[color:var(--warning)]"
                                  : "text-[color:var(--success)]"
                                }`}
                            >
                              {getSlaText(ticket.slaDueAt)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Assigned to{" "}
                              {ticket.assignedTo?.name ??
                                "Unassigned"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-border bg-background/35 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                              Why this is risky
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Queue lanes */}
          <div className="rounded-3xl border border-border bg-card/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue lanes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A quick view of what needs attention across the queue
                </p>
              </div>

              <button className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card">
                View all lanes
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {queueLanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {lane.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${lane.tone === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : lane.tone === "warning"
                          ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
                          : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                        }`}
                    >
                      {lane.items.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {lane.items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                        No tickets
                      </div>
                    ) : (
                      lane.items.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          className="rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm leading-6 text-foreground"
                        >
                          <div>
                            <p className="font-medium">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.assignedTo?.name ??
                                "Unassigned"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Command card */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                <Flame className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Queue command view
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Opsfront keeps the queue sorted by forward-looking risk instead
                  of static status so the team can intervene before tickets miss
                  their SLA window.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SignalCard
                label="Critical Tickets"
                value={
                  tickets
                    .filter((t) => t.priority === "critical")
                    .length.toString()
                }
                tone="destructive"
              />

              <SignalCard
                label="Open Tickets"
                value={
                  tickets
                    .filter((t) => t.status === "open")
                    .length.toString()
                }
                tone="primary"
              />

              <SignalCard
                label="Unassigned"
                value={
                  tickets
                    .filter((t) => !t.assignedTo)
                    .length.toString()
                }
              />
            </div>
          </div>

          {/* Signal breakdown */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Queue signals
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Live operational metrics from the current queue
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {signals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI guidance */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  AI queue guidance
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Suggested next actions based on live queue state
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {aiSuggestions.map((text) => (
                <AiAction
                  key={text}
                  text={text}
                />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Quick actions
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Common queue interventions
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <QuickAction
                label={`Open Tickets (${stats?.open ?? 0})`}
              />

              <QuickAction
                label={`Critical Tickets (${stats?.critical ?? 0})`}
              />

              <QuickAction
                label={`Waiting Tickets (${stats?.waiting ?? 0})`}
              />

              <QuickAction
                label={`Resolved Tickets (${stats?.resolved ?? 0})`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized =
    priority.toLowerCase();

  let styles =
    "border-border bg-muted text-foreground";

  if (normalized === "critical") {
    styles =
      "border-destructive/20 bg-destructive/10 text-destructive";
  }

  if (normalized === "high") {
    styles =
      "border-primary/20 bg-primary/10 text-primary";
  }

  if (normalized === "medium") {
    styles =
      "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]";
  }

  if (normalized === "low") {
    styles =
      "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  let styles =
    "border-border bg-muted text-foreground";

  if (normalized === "open") {
    styles =
      "border-primary/20 bg-primary/10 text-primary";
  }

  if (normalized === "in-progress") {
    styles =
      "border-sky-500/20 bg-sky-500/10 text-sky-300";
  }

  if (normalized === "waiting") {
    styles =
      "border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]";
  }

  if (normalized === "resolved") {
    styles =
      "border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

function SignalCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "destructive";
}) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-2xl font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function AiAction({ text }: { text: string }) {
  return (
    <button className="flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card">
      <div className="mt-1 size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,176,72,0.8)]" />
      <span className="text-sm leading-6 text-foreground">{text}</span>
    </button>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-background/35 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card">
      <span className="text-sm text-foreground">{label}</span>
      <ArrowUpRight className="size-4 text-muted-foreground" />
    </button>
  );
}