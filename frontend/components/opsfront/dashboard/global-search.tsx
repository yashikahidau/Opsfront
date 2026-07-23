"use client";

import {
     Loader2,
     Search,
} from "lucide-react";

import Link from "next/link";

import {
     useEffect,
     useRef,
     useState,
} from "react";

import { useRouter } from "next/navigation";

import { searchWorkspace } from "@/lib/search";

import type { Ticket } from "@/lib/ticket";

import { useAuth } from "@/context/AuthContext";

interface GlobalSearchProps {
     value: string;
     onChange: (value: string) => void;
}

export default function GlobalSearch({
     value,
     onChange,
}: GlobalSearchProps) {

     const [results, setResults] =
          useState<Ticket[]>([]);

     const [loading, setLoading] =
          useState(false);

     const [open, setOpen] =
          useState(false);

     const [selectedIndex, setSelectedIndex] =
          useState(-1);

     const containerRef =
          useRef<HTMLDivElement>(null);

     const router = useRouter();

     const { user } = useAuth();

const placeholder =
  user?.userType === "customer"
    ? "Search my tickets..."
    : user?.role === "agent"
      ? "Search assigned tickets..."
      : "Search tickets, agents, or requesters...";

     useEffect(() => {
          if (!value.trim()) {
               setResults([]);
               setOpen(false);
               return;
          }

          const timer = setTimeout(async () => {
               try {
                    setLoading(true);

                    const data =
                         await searchWorkspace(value);

                    setResults(data.tickets);

                    setOpen(true);
               } catch (err) {
                    console.error(err);
               } finally {
                    setLoading(false);
               }
          }, 300);

          return () =>
               clearTimeout(timer);
     }, [value]);

     useEffect(() => {
          setSelectedIndex(-1);
     }, [results]);

     useEffect(() => {
          function handleClickOutside(
               event: MouseEvent
          ) {
               if (
                    containerRef.current &&
                    !containerRef.current.contains(
                         event.target as Node
                    )
               ) {
                    setOpen(false);
               }
          }

          document.addEventListener(
               "mousedown",
               handleClickOutside
          );

          return () => {
               document.removeEventListener(
                    "mousedown",
                    handleClickOutside
               );
          };
     }, []);

     return (
          <div
               ref={containerRef}
               className="relative flex-1 lg:flex-none lg:w-[380px]"
          >
               {loading ? (
                    <Loader2 className="absolute left-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
               ) : (
                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
               )}

               <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => {
                         if (results.length > 0) {
                              setOpen(true);
                         }
                    }}

                    onKeyDown={(e) => {
                         if (!open || results.length === 0) return;

                         if (e.key === "ArrowDown") {
                              e.preventDefault();

                              setSelectedIndex((prev) =>
                                   prev < results.length - 1 ? prev + 1 : 0
                              );
                         }

                         if (e.key === "ArrowUp") {
                              e.preventDefault();

                              setSelectedIndex((prev) =>
                                   prev > 0 ? prev - 1 : results.length - 1
                              );
                         }

                         if (e.key === "Escape") {
                              setOpen(false);
                              return;
                         }

                         if (
                              e.key === "Enter" &&
                              selectedIndex >= 0
                         ) {
                              router.push(
                                   `/dashboard/tickets/${results[selectedIndex]._id}`
                              );

                              setOpen(false);

                              onChange("");

                              setSelectedIndex(-1);
                         }
                    }}
                    placeholder={placeholder}
                    className="h-10 lg:h-11 w-full rounded-2xl border border-border bg-card/50 pl-11 pr-4 text-sm outline-none transition focus:border-primary/20"
               />

               {open && (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

                         {results.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                   No results found
                              </div>
                         ) : (
                              <>
                                   <div className="border-b border-border px-4 py-2">
                                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                             Tickets
                                        </p>
                                   </div>

                                   {results.map((ticket, index) => (
                                        <Link
                                             key={ticket._id}
                                             href={`/dashboard/tickets/${ticket._id}`}
                                             onClick={() => {
                                                  setOpen(false);
                                                  onChange("");
                                             }}
                                             className={`block border-b border-border/50 px-4 py-3 transition last:border-none ${selectedIndex === index
                                                  ? "bg-primary/10"
                                                  : "hover:bg-background/60"
                                                  }`}
                                        >
                                             <p className="text-sm font-medium text-foreground">
                                                  {ticket.title}
                                             </p>

                                             <p className="mt-1 text-xs text-muted-foreground">
                                                  {ticket.category} • {ticket.priority} • {ticket.status}
                                             </p>
                                        </Link>
                                   ))}
                              </>
                         )}

                    </div>
               )}
          </div>
     );
}