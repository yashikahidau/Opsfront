"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { AppSidebar } from "@/components/opsfront/dashboard/app-sidebar";
import { TopHeader } from "@/components/opsfront/dashboard/top-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { SearchContext } from "@/context/SearchContext";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="rounded-full border border-border bg-card/60 px-5 py-2 text-sm text-muted-foreground">
          Loading workspace…
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
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Workspace
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-foreground sm:text-lg">
                    {user?.workspaceName || "Opsfront Workspace"}
                  </h2>
                  <span className="rounded-full border border-border bg-card/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {user?.role || "admin"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  Signed in as {user?.name} · {user?.email}
                </p>
              </div>

              <Button
                variant="outline"
                className="group w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:cursor-pointer"
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