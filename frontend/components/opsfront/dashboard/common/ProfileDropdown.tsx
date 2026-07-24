"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const displayRole =
    user?.userType === "customer"
      ? "Customer"
      : user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <>
          {/* Desktop */}
          <div className="hidden cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card/50 px-3 py-2.5 transition hover:bg-card lg:flex">
            <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>

            <div className="leading-tight text-left">
  <p className="text-sm font-medium text-foreground">
    {user?.name}
  </p>

  <p className="text-xs text-muted-foreground">
    {displayRole}
  </p>

  <p className="text-[11px] text-muted-foreground/70">
    {user?.workspaceName}
  </p>
</div>
          </div>

          {/* Mobile */}
          <div className="grid size-10 cursor-pointer place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary lg:hidden">
            {initials}
          </div>
        </>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl"
      >
        <div className="px-3 py-3">
  <p className="font-medium text-foreground">
    {user?.name}
  </p>

  <p className="mt-1 text-xs text-muted-foreground">
    {user?.email}
  </p>

  <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-card/40 px-3 py-2">
    <div>
      <p className="text-xs font-medium text-foreground">
        {displayRole}
      </p>

      <p className="text-[11px] text-muted-foreground">
        {user?.workspaceName}
      </p>
    </div>
  </div>
</div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push("/dashboard/settings#my-profile")
          }
        >
          <User className="mr-2 size-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="mr-2 size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-red-500"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}