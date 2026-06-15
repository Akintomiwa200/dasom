"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileSidebarTrigger } from "@/components/admin/mobile-sidebar-trigger";
import type { DashboardStats } from "@/lib/dashboard-types";

type DashboardShellProps = {
  children: React.ReactNode;
  connected: boolean;
  stats: DashboardStats | null;
  onLogout: () => void;
};

export function DashboardShell({ children, connected, stats, onLogout }: DashboardShellProps) {
  return (
    <div className="adm-dash adm-shell">
      <AdminSidebar connected={connected} stats={stats} onLogout={onLogout} />

      <div className="adm-main-wrap">
        <header className="adm-mobile-topbar">
          <MobileSidebarTrigger />
          <div className="adm-mobile-topbar-title">
            <span className="adm-mobile-wordmark">DASOM</span>
            <span className="adm-mobile-sub">Enrollment Admin</span>
          </div>
          <div className={`adm-live-pill ${connected ? "on" : ""}`}>
            <span className="adm-live-dot" />
          </div>
        </header>
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}
