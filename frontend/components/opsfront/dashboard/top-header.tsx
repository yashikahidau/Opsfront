"use client";

import { Menu } from "lucide-react";

import GlobalSearch from "./global-search";
import NotificationPopover from "./common/NotificationPopover";
import ProfileDropdown from "./common/ProfileDropdown";

import { useAuth } from "@/context/AuthContext";

interface TopHeaderProps {
  onMenuClick: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export function TopHeader({
  onMenuClick,
  search,
  setSearch,
}: TopHeaderProps) {

  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:justify-between lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card/50 transition hover:bg-card lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden lg:block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {user?.userType === "customer"
                ? "Customer Portal"
                : "Opsfront Workspace"}
            </p>

            <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {user?.userType === "customer"
                ? "Support Center"
                : "Internal Support Operations"}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <GlobalSearch value={search} onChange={setSearch} />

          <NotificationPopover />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}