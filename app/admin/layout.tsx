"use client";

import "./admin.css";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useDashboardLive } from "@/hooks/use-dashboard-live";
import { MobileSidebarProvider } from "@/context/mobile-sidebar-context";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { authed, loading, login, logout } = useAdminSession();
  const { stats, connected } = useDashboardLive(authed);

  if (loading) {
    return (
      <div className="adm-dash adm-login-wrap">
        <p className="body-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <DashboardShell connected={connected} stats={stats} onLogout={logout}>
      {children}
    </DashboardShell>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarProvider>
      <Suspense fallback={
        <div className="adm-dash adm-login-wrap">
          <p className="body-sm text-muted">Loading…</p>
        </div>
      }>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </MobileSidebarProvider>
  );
}
