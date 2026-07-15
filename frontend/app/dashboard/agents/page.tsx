"use client";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useState } from "react";
import AddAgentDialog from "@/components/agents/AddAgentDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Clock3,
  MoreHorizontal,
  Sparkles,
  UserRoundPlus,
  ChevronDown,
  Copy,
} from "lucide-react";


export default function AgentsPage() {

  const {
    users,
    tickets,
    loading,
    changeRole,
    loadTickets,
    reassign,
    addUser,
  } = useUsers();

  const [updatingUser, setUpdatingUser] =
    useState<string | null>(null);

  const [selectedUser, setSelectedUser] =
    useState<typeof users[number] | null>(
      null
    );
  const [reassignUser, setReassignUser] =
    useState<typeof users[number] | null>(null);

  const [targetAgent, setTargetAgent] =
    useState("");

  const [selectedRole, setSelectedRole] =
    useState<
      "admin" | "agent" | "requester"
    >("agent");

  const [filter, setFilter] = useState<
    "all" | "admin" | "agent" | "requester"
  >("all");

  const [search, setSearch] = useState("");
  const [showAddAgent, setShowAddAgent] =
    useState(false);

  const router = useRouter();

  useEffect(() => {
    const hasModal =
      !!selectedUser ||
      !!reassignUser ||
      showAddAgent;

    document.body.style.overflow =
      hasModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    selectedUser,
    reassignUser,
    showAddAgent,
  ]);

  const teamStats = [
    {
      label: "Admins",
      value: users.filter(
        (u) => u.role === "admin"
      ).length,
      hint: "Workspace administrators",
    },
    {
      label: "Agents",
      value: users.filter(
        (u) => u.role === "agent"
      ).length,
      hint: "Support engineers",
    },
    {
      label: "Requesters",
      value: users.filter(
        (u) => u.role === "requester"
      ).length,
      hint: "Ticket creators",
    },
    {
      label: "Assigned Tickets",
      value: users.reduce(
        (sum, user) =>
          sum + user.assignedTickets,
        0
      ),
      hint: "Across all agents",
    },
  ];


  const averageLoad =
    users.length === 0
      ? 0
      : Math.round(
        users.reduce(
          (sum, user) =>
            sum + user.assignedTickets,
          0
        ) / users.length
      );

  const highestLoad =
    users.length > 0
      ? users.reduce((a, b) =>
        a.assignedTickets >
          b.assignedTickets
          ? a
          : b
      )
      : null;

  const bestResolver =
    users.length > 0
      ? users.reduce((a, b) =>
        a.resolvedTickets >
          b.resolvedTickets
          ? a
          : b
      )
      : null;

  const mostAvailable =
    users.length > 0
      ? users.reduce((a, b) =>
        a.assignedTickets <
          b.assignedTickets
          ? a
          : b
      )
      : null;

  const insights = [
    {
      label: "Highest workload",
      value: highestLoad
        ? `${highestLoad.name} · ${highestLoad.assignedTickets} tickets`
        : "-",
    },
    {
      label: "Most resolved",
      value: bestResolver
        ? `${bestResolver.name} · ${bestResolver.resolvedTickets} resolved`
        : "-",
    },
    {
      label: "Most available",
      value: mostAvailable
        ? `${mostAvailable.name} · ${mostAvailable.assignedTickets} tickets`
        : "-",
    },
  ];

  const agentsUnderWatch =
    users.filter(
      (user) =>
        user.role === "agent" &&
        user.assignedTickets >= 3
    ).length;

  const overloadedAgents =
    users.filter(
      (user) =>
        user.role === "agent" &&
        user.assignedTickets >= 5
    ).length;

  const reassignments = users
    .filter(
      (u) =>
        u.role === "agent" &&
        u.assignedTickets >= 5
    )
    .map(
      (u) =>
        `${u.name} currently has ${u.assignedTickets} assigned tickets.`
    );

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      filter === "all" || user.role === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary/80">
            Team operations
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Keep workload balanced across the support team.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Track who owns risky work, who has capacity, and where reassignment is
            needed before queue pressure builds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or email..."
            className="
      h-11
      w-[260px]
      rounded-full
      border
      border-border
      bg-card/40
      px-5
      text-sm
      text-foreground
      placeholder:text-muted-foreground
      outline-none
      transition-all
      duration-200
      hover:border-primary/20
      focus:border-primary
      focus:ring-2
      focus:ring-primary/20
    "
          />

          <div className="relative w-[170px]">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as
                  | "all"
                  | "admin"
                  | "agent"
                  | "requester"
                )
              }
              className="
        h-11
        w-full
        cursor-pointer
        appearance-none
        rounded-full
        border
        border-border
        bg-card/40
        px-5
        pr-11
        text-sm
        font-medium
        text-foreground
        outline-none
        transition-all
        duration-200
        hover:border-primary/20
        hover:bg-card
        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
      "
            >
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="agent">Agents</option>
              <option value="requester">Requesters</option>
            </select>

            <ChevronDown
              className="
        pointer-events-none
        absolute
        right-4
        top-1/2
        h-4
        w-4
        -translate-y-1/2
        text-muted-foreground
      "
            />
          </div>

          <button
            onClick={() =>
              setShowAddAgent(true)
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
          >
            <UserRoundPlus className="size-4" />
            Add agent
          </button>

        </div>
      </section>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teamStats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-border bg-card/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15"
          >
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>

            <h3 className="mt-3 text-3xl font-semibold text-foreground">
              {item.value}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {item.hint}
            </p>
          </div>
        ))}
      </section>

      {/* Main layout */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        {/* Left side */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card/30">
          <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Agent roster</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ownership, load, and risky ticket pressure by agent
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/dashboard/queue")
              }
              className="cursor-pointer rounded-2xl border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
            >
              View All Queues
            </button>
          </div>



          <div className="divide-y divide-border">
            {filteredUsers.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                No users found.
              </div>
            )}
            {filteredUsers.map((agent) => (
              <div
                key={agent._id}
                className="px-5 py-5 transition-all duration-200 hover:bg-background/35 sm:px-6"
              >
                <div className="rounded-3xl border border-border bg-background/[0.28] p-4 sm:p-5">
                  {/* Row 1 */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Identity */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {agent.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-foreground">
                          {agent.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {agent.role}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span
                            className={`text-sm ${agent.role === "agent"
                              ? "text-[color:var(--success)]"
                              : agent.role === "admin"
                                ? "text-primary"
                                : "text-muted-foreground"
                              }`}
                          >
                            {agent.role === "admin"
                              ? "Admin"
                              : agent.role === "agent"
                                ? "Agent"
                                : "Requester"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right top controls */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:min-w-[330px]">
                      <div className="min-w-[180px] flex-1 rounded-2xl border border-border bg-card/50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            Load
                          </span>
                          <span
                            className={`text-sm font-medium ${agent.assignedTickets >= 5
                              ? "text-destructive"
                              : agent.assignedTickets >= 3
                                ? "text-primary"
                                : "text-[color:var(--success)]"
                              }`}
                          >
                            {Math.min(agent.assignedTickets * 20, 100)}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${agent.assignedTickets >= 5
                              ? "bg-destructive"
                              : agent.assignedTickets >= 3
                                ? "bg-primary"
                                : "bg-[color:var(--success)]"
                              }`}
                            style={{
                              width: `${Math.min(
                                agent.assignedTickets * 20,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReassignUser(agent);
                            setTargetAgent("");
                          }}
                          className="cursor-pointer rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card"
                        >
                          Reassign
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(agent);

                            setSelectedRole(agent.role);

                            loadTickets(agent._id);
                          }}
                          className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-card hover:text-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <AgentMetric label="Open tickets" value={String(agent.openTickets)} />
                    <AgentMetric
                      label="At risk"
                      value={String(
                        Math.max(
                          0,
                          agent.assignedTickets -
                          agent.resolvedTickets
                        )
                      )}
                      tone="primary"
                    />
                    <AgentMetric
                      label="Resolved"
                      value={String(agent.resolvedTickets)}
                      tone="success"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Snapshot */}
          <div className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Team snapshot
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current ownership pressure across the support team
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <MiniMetric
                label="Average load"
                value={`${averageLoad} tickets`}
              />
              <MiniMetric
                label="Agents under watch"
                value={String(agentsUnderWatch)}
                tone="primary"
              />
              <MiniMetric
                label="High workload"
                value={String(overloadedAgents)}
                tone="destructive"
              />
            </div>
          </div>

          {/* Insights */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">Team insights</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fast read on current team performance
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {insights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background/35 p-4 transition-all duration-200 hover:border-primary/10"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested reassignments */}
          <div className="rounded-3xl border border-border bg-card/30 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2 text-primary">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Suggested reassignments
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recommended moves based on load and risk
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {reassignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No workload balancing recommendations.
                </p>
              ) : (
                reassignments.map((item) => (
                  <button
                    key={item}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-border bg-background/35 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:bg-card"
                  >
                    <span className="text-sm leading-6 text-foreground">
                      {item}
                    </span>
                    <ArrowUpRight className="mt-1 size-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <AddAgentDialog
        open={showAddAgent}
        onClose={() =>
          setShowAddAgent(false)
        }
        onSubmit={async (values) => {
          await addUser(values);

          toast.success("Agent created.");

          setShowAddAgent(false);
        }}
      />

      {reassignUser && (
        <div
          onClick={() => setReassignUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6"
          >
            <h2 className="text-xl font-semibold">
              Reassign Tickets
            </h2>

            <p className="mt-2 text-muted-foreground">
              Move all tickets from{" "}
              <strong>{reassignUser.name}</strong>
            </p>

            <select
              value={targetAgent}
              onChange={(e) =>
                setTargetAgent(e.target.value)
              }
              className="mt-6 w-full rounded-xl border border-border bg-background p-3"
            >
              <option value="">
                Select new agent
              </option>

              {users
                .filter(
                  (u) =>
                    u.role === "agent" &&
                    u._id !== reassignUser._id
                )
                .map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                  >
                    {u.name} • {u.assignedTickets} tickets
                  </option>
                ))}
            </select>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setReassignUser(null)
                }
                className="flex-1 rounded-xl border border-border p-3"
              >
                Cancel
              </button>

              <button
                disabled={!targetAgent}
                onClick={async () => {
                  try {
                    await reassign(
                      reassignUser._id,
                      targetAgent
                    );

                    toast.success("Tickets reassigned.");

                    setReassignUser(null);
                  } finally {
                    setTargetAgent("");
                  }
                }}
                className="flex-1 rounded-xl bg-primary p-3 text-primary-foreground disabled:opacity-50"
              >
                Reassign
              </button>

            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6"
          >

            <h2 className="text-xl font-semibold">
              Agent Actions
            </h2>

            <p className="mt-2 text-muted-foreground">
              {selectedUser.name}
            </p>

            <div className="mt-6 space-y-3">


              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">

                {tickets.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                    No assigned tickets.
                  </div>

                ) : (

                  tickets.map((ticket) => (

                    <div
                      key={ticket._id}
                      className="rounded-xl border border-border bg-background/40 p-4"
                    >
                      <div className="flex items-center justify-between">

                        <h4 className="font-medium">
                          {ticket.title}
                        </h4>

                        <span className="text-xs text-primary">
                          {ticket.priority}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {ticket.description}
                      </p>

                      <div className="mt-3 flex justify-between text-xs text-muted-foreground">

                        <span>
                          {ticket.category}
                        </span>

                        <span>
                          {ticket.status}
                        </span>

                      </div>
                    </div>

                  ))

                )}

              </div>

              <div className="space-y-3">

                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(
                      e.target.value as
                      | "admin"
                      | "agent"
                      | "requester"
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background p-3"
                >
                  <option value="admin">
                    Admin
                  </option>

                  <option value="agent">
                    Agent
                  </option>

                  <option value="requester">
                    Requester
                  </option>
                </select>

                <button
                  disabled={
                    updatingUser === selectedUser._id ||
                    selectedRole === selectedUser.role
                  }
                  onClick={async () => {

                    try {
                      setUpdatingUser(selectedUser._id);

                      await changeRole(
                        selectedUser._id,
                        selectedRole
                      );

                      toast.success("Role updated.");

                      setSelectedUser(null);

                    } finally {
                      setUpdatingUser(null);
                    }
                  }}
                  className="w-full rounded-xl bg-primary p-3 text-primary-foreground"
                >
                  {updatingUser === selectedUser._id
                    ? "Saving..."
                    : "Save Role"}
                </button>

              </div>

              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    selectedUser.email
                  );

                  toast.success("Email copied.");
                }}
                className="
    flex
    w-full
    items-center
    gap-3
    rounded-2xl
    border
    border-border
    bg-background/40
    px-4
    py-3
    text-left
    text-sm
    font-medium
    text-foreground
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:border-primary/20
    hover:bg-card
  "
              >
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-2">
                  <Copy className="size-4 text-primary" />
                </div>

                <div>
                  <p className="font-medium">Copy Email</p>
                  <p className="text-xs text-muted-foreground">
                    Copy this user's email address
                  </p>
                </div>
              </button>

            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-xl bg-primary p-3 text-primary-foreground"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

function AgentMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "success";
}) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
        ? "text-[color:var(--success)]"
        : "text-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-3 transition-all duration-200 hover:border-primary/10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-lg font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
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
    <div className="rounded-2xl border border-border bg-card/50 p-4 transition-all duration-200 hover:border-primary/10">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-xl font-semibold ${valueClass}`}>
        {value}
      </p>

    </div>
  );
}