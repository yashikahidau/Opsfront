"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/opsfront/dashboard/app-sidebar";
import { TopHeader } from "@/components/opsfront/dashboard/top-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { SearchContext } from "@/context/SearchContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const adminRestrictedRoutes = [
    "/dashboard/settings",
  ];

  const agentAllowedRoutes = [
    "/dashboard",
    "/dashboard/tickets",
    "/dashboard/queue",
  ];

  const customerAllowedRoutes = [
    "/dashboard",
    "/dashboard/tickets",
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!user) return;

    // Customer
    if (user.userType === "customer") {
      const allowed = customerAllowedRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith(route + "/")
      );

      if (!allowed) {
        router.replace("/dashboard");
      }

      return;
    }

    // Agent
    if (user.role === "agent") {
      const allowed = agentAllowedRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith(route + "/")
      );

      if (!allowed) {
        router.replace("/dashboard");
      }

      return;
    }

    // Admin
    if (user.role === "admin") {
      if (adminRestrictedRoutes.includes(pathname)) {
        router.replace("/dashboard");
      }

      return;
    }

    // Owner
    if (user.role === "owner") {
      return;
    }
  }, [
    pathname,
    user,
    isAuthenticated,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/70 px-6 py-4">
          <LoadingSpinner className="h-5 w-5" />

          <span className="text-sm text-muted-foreground">
            Loading workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <TopHeader
            onMenuClick={() => setSidebarOpen(true)}
            search={globalSearch}
            setSearch={setGlobalSearch}
          />

          <div className="border-b border-border px-4 py-3 sm:px-6 lg:px-8">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    {user?.userType !== "customer" ? (
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Workspace
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {user?.workspaceName || "Opsfront Workspace"}
          </h2>

          <span className="rounded-full border border-border bg-card/70 px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground">
            {user?.role}
          </span>
        </div>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          Signed in as {user?.name} · {user?.email}
        </p>
      </div>
    ) : (
      <div>
        <h2 className="text-base font-semibold text-foreground sm:text-lg">
          My Support
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>
    )}

    <Button
      variant="outline"
      className="group w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card"
      onClick={handleLogout}
    >
      <LogOut className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      Logout
    </Button>

  </div>
</div>

          <SearchContext.Provider
            value={{
              search: globalSearch,
              setSearch: setGlobalSearch,
            }}
          >
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </SearchContext.Provider>
        </div>
      </div>
    </div>
  );
}