"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardStats } from "@/lib/dashboard-types";

type DashboardShellProps = {
  children: React.ReactNode;
  connected: boolean;
  stats: DashboardStats | null;
  onLogout: () => void;
};

export function DashboardShell({ children, connected, stats, onLogout }: DashboardShellProps) {
  const pathname = usePathname();
  const t = stats?.totals;
  const p = stats?.programme;

  const mainNav = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/applications", label: "All Applications" },
    { href: "/admin/gates", label: "Gates of Influence" },
    { href: "/admin/enrollment", label: "Enrollment Insights" },
    { href: "/admin/site", label: "Site & API Map" },
  ];

  const statusNav = [
    { href: "/admin/applications?status=pending", label: "Pending Review", count: t?.pending, badge: t?.pending ? true : false },
    { href: "/admin/applications?status=approved", label: "Approved", count: t?.approved },
    { href: "/admin/applications?status=rejected", label: "Rejected", count: t?.rejected },
    { href: "/admin/applications", label: "Unpaid Fee", count: t?.unpaid, badge: t?.unpaid ? true : false },
  ];

  return (
    <div className="adm-dash adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-wordmark">DASOM</div>
          <div className="adm-brand-sub">Admin · Davidic School of Ministry</div>
          {p && (
            <div className="adm-programme-pill">
              {p.modules} modules · {p.gates} gates · {p.durationMonths} months
              <br />
              <span style={{ color: "var(--muted)" }}>{p.location}</span>
            </div>
          )}
        </div>

        <div className="adm-nav-group">
          <div className="adm-nav-label">Dashboard</div>
          {mainNav.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`adm-nav-link ${active ? "active" : ""}`}>
                {label}
              </Link>
            );
          })}
        </div>

        <div className="adm-nav-group">
          <div className="adm-nav-label">Application Status</div>
          {statusNav.map(({ href, label, count, badge }) => (
            <Link key={href} href={href} className="adm-nav-link">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {label}
                {badge && <span className="adm-nav-badge">new</span>}
              </span>
              <span className="adm-nav-count">{count ?? 0}</span>
            </Link>
          ))}
        </div>

        <div className="adm-sidebar-footer">
          <div className={`adm-live ${connected ? "on" : ""}`}>
            <span className="adm-live-dot" />
            {connected ? "Live · PostgreSQL" : "Reconnecting…"}
          </div>
          <Link href="/" className="btn-secondary btn-sm" style={{ width: "100%", marginBottom: 8, justifyContent: "center" }}>
            View Public Site
          </Link>
          <button className="btn-ghost btn-sm" style={{ width: "100%", marginBottom: 8 }} onClick={onLogout}>
            Sign Out
          </button>
          <button
            className="btn-primary btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => window.open("/api/admin/applications", "_blank")}
          >
            Export Applications
          </button>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
