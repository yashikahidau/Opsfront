"use client";

import { Bell, Menu, } from "lucide-react";
import GlobalSearch from "./global-search";

interface TopHeaderProps {
  onMenuClick: () => void;

  search: string;

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export function TopHeader({
  onMenuClick,
  search,
  setSearch,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3">

          <button
            onClick={onMenuClick}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card/50 transition hover:bg-card lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Opsfront Workspace
            </p>

            <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Internal support operations
            </h1>
          </div>

        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <GlobalSearch
            value={search}
            onChange={setSearch}
          />
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card/50 text-muted-foreground transition hover:bg-card hover:text-foreground">
            <Bell className="size-4" />
            <span className="absolute right-3 top-3 size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,176,72,0.9)]" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 px-3 py-2.5">
            <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              YH
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-foreground">Yashika</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}