"use client";

import { Search, RotateCcw } from "lucide-react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { cn } from "@/lib/utils";

import type { TicketFilters as TicketFiltersType } from "@/lib/ticket";

interface TicketFiltersProps {
     filters: TicketFiltersType;

     setFilters: React.Dispatch<
          React.SetStateAction<TicketFiltersType>
     >;

     isFetching: boolean;
}

const statusFilters = [
     { label: "All", value: "all" },
     { label: "Open", value: "open" },
     { label: "In Progress", value: "in-progress" },
     { label: "Waiting", value: "waiting" },
     { label: "Resolved", value: "resolved" },
     { label: "Closed", value: "closed" },
];

const priorityFilters = [
     { label: "All", value: "all" },
     { label: "Critical", value: "critical" },
     { label: "High", value: "high" },
     { label: "Medium", value: "medium" },
     { label: "Low", value: "low" },
];

const categoryFilters = [
     { label: "All", value: "all" },
     { label: "Support", value: "support" },
     { label: "Bug", value: "bug" },
     { label: "Feature", value: "feature" },
     { label: "Billing", value: "billing" },
     { label: "Other", value: "other" },
];

function FilterChip({
     active,
     children,
     onClick,
}: {
     active: boolean;
     children: React.ReactNode;
     onClick: () => void;
}) {
     return (
          <button
               onClick={onClick}
               className={cn(
                    "cursor-pointer rounded-full px-4 py-2 text-sm transition-all duration-200",
                    active
                         ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,176,72,0.18)]"
                         : "border border-border bg-background/40 text-foreground hover:border-primary/20 hover:bg-card"
               )}
          >
               {children}
          </button>
     );
}

export default function TicketFilters({
     filters,
     setFilters,
     isFetching,
}: TicketFiltersProps) {
     const hasFilters =
          filters.search ||
          filters.status !== "all" ||
          filters.priority !== "all" ||
          filters.category !== "all";

     return (
          <section className="rounded-3xl border border-border bg-card/30 p-6">

               {/* SEARCH */}

               <div className="flex flex-col gap-4">

                    <div className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-background/40 px-4">

                         {isFetching ? (
                              <LoadingSpinner className="size-4 text-primary" />
                         ) : (
                              <Search className="size-4 text-muted-foreground" />
                         )}

                         <input
                              type="text"
                              placeholder="Search tickets..."
                              value={filters.search}
                              autoComplete="off"
                              onChange={(e) =>
                                   setFilters((prev) => ({
                                        ...prev,
                                        search: e.target.value,
                                   }))
                              }
                              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                         />

                    </div>

                    <p className="text-xs text-muted-foreground">
                         Search by title, description, priority,
                         status or category.
                    </p>

               </div>

               <div className="mt-8 space-y-7">

                    {/* STATUS */}

                    <div>

                         <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              Status
                         </h3>

                         <div className="flex flex-wrap gap-2">

                              {statusFilters.map((filter) => (

                                   <FilterChip
                                        key={filter.value}
                                        active={filters.status === filter.value}
                                        onClick={() =>
                                             setFilters((prev) => ({
                                                  ...prev,
                                                  status: filter.value,
                                             }))
                                        }
                                   >
                                        {filter.label}
                                   </FilterChip>

                              ))}

                         </div>

                    </div>

                    {/* PRIORITY */}

                    <div>

                         <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              Priority
                         </h3>

                         <div className="flex flex-wrap gap-2">

                              {priorityFilters.map((filter) => (

                                   <FilterChip
                                        key={filter.value}
                                        active={filters.priority === filter.value}
                                        onClick={() =>
                                             setFilters((prev) => ({
                                                  ...prev,
                                                  priority: filter.value,
                                             }))
                                        }
                                   >
                                        {filter.label}
                                   </FilterChip>

                              ))}

                         </div>

                    </div>

                    {/* CATEGORY */}

                    <div>

                         <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              Category
                         </h3>

                         <div className="flex flex-wrap gap-2">

                              {categoryFilters.map((filter) => (

                                   <FilterChip
                                        key={filter.value}
                                        active={filters.category === filter.value}
                                        onClick={() =>
                                             setFilters((prev) => ({
                                                  ...prev,
                                                  category: filter.value,
                                             }))
                                        }
                                   >
                                        {filter.label}
                                   </FilterChip>

                              ))}

                         </div>

                    </div>

               </div>

               {/* FOOTER */}

               <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                         <p className="text-sm font-medium text-foreground">
                              Refine your support queue
                         </p>

                         <p className="mt-1 text-sm text-muted-foreground">
                              Combine search with filters to quickly locate tickets.
                         </p>

                    </div>

                    {hasFilters && (
                         <button
                              onClick={() =>
                                   setFilters({
                                        search: "",
                                        status: "all",
                                        priority: "all",
                                        category: "all",
                                   })
                              }
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-3 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/20"
                         >
                              <RotateCcw className="size-4" />
                              Reset Filters
                         </button>
                    )}

               </div>

          </section>
     );
}