"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  CheckCircle,
  ClipboardList,
  Clock,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Wallet,
  X,
  XCircle,
  Landmark,
  ExternalLink,
  Download,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import type { DashboardStats } from "@/lib/dashboard-types";
import { useMobileSidebar } from "@/context/mobile-sidebar-context";

type AdminSidebarProps = {
  connected: boolean;
  stats: DashboardStats | null;
  onLogout: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  count?: number;
  badge?: boolean;
  query?: string;
};

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const Icon = item.icon;

  const active = item.query
    ? pathname === item.href.split("?")[0] && searchParams.get("status") === item.query
    : item.exact
      ? pathname === item.href
      : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`adm-nav-link ${active ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
      title={collapsed ? item.label : undefined}
    >
      <span className="adm-nav-link-main">
        <Icon className="adm-nav-icon" strokeWidth={1.75} />
        <span className="adm-nav-label-text">{item.label}</span>
        {collapsed && <span className="adm-nav-tooltip">{item.label}</span>}
      </span>
      {!collapsed && (item.count !== undefined || item.badge) && (
        <span className="adm-nav-link-meta">
          {item.badge && <span className="adm-nav-badge">new</span>}
          {item.count !== undefined && <span className="adm-nav-count">{item.count}</span>}
        </span>
      )}
    </Link>
  );
}

function SidebarNav({
  collapsed,
  stats,
  onNavigate,
}: {
  collapsed: boolean;
  stats: DashboardStats | null;
  onNavigate?: () => void;
}) {
  const t = stats?.totals;
  const p = stats?.programme;

  const mainNav: NavItem[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/applications", label: "All Applications", icon: ClipboardList, count: t?.all },
    { href: "/admin/gates", label: "Gates of Influence", icon: Landmark },
    { href: "/admin/enrollment", label: "Enrollment Insights", icon: BarChart3 },
  ];

  const statusNav: NavItem[] = [
    { href: "/admin/applications?status=pending", label: "Pending Review", icon: Clock, count: t?.pending, badge: !!t?.pending, query: "pending" },
    { href: "/admin/applications?status=approved", label: "Approved", icon: CheckCircle, count: t?.approved, query: "approved" },
    { href: "/admin/applications?status=rejected", label: "Rejected", icon: XCircle, count: t?.rejected, query: "rejected" },
    { href: "/admin/applications", label: "Unpaid Fee", icon: Wallet, count: t?.unpaid, badge: !!t?.unpaid },
  ];

  return (
    <nav className="adm-sidebar-nav">
      {!collapsed && p && (
        <div className="adm-programme-pill adm-programme-pill-nav">
          <strong>{p.modules} modules · {p.gates} gates</strong>
          <span>{p.durationMonths} months · {p.location}</span>
        </div>
      )}

      <div className="adm-nav-group">
        {!collapsed && <div className="adm-nav-section-label">Dashboard</div>}
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="adm-nav-group">
        {!collapsed && <div className="adm-nav-section-label">Pipeline</div>}
        {statusNav.map((item) => (
          <NavLink key={item.label} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

function SidebarFooter({
  collapsed,
  connected,
  onLogout,
  compact,
}: {
  collapsed: boolean;
  connected: boolean;
  onLogout: () => void;
  compact?: boolean;
}) {
  const exportData = () => window.open("/api/admin/applications", "_blank");

  if (collapsed) {
    return (
      <div className={`adm-sidebar-footer collapsed ${compact ? "compact" : ""}`}>
        <div
          className={`adm-footer-status collapsed ${connected ? "on" : ""}`}
          title={connected ? "Live · PostgreSQL" : "Reconnecting…"}
        >
          <span className="adm-live-dot" />
        </div>
        <div className="adm-footer-icon-stack">
          <Link href="/" className="adm-footer-icon-btn" title="View public site">
            <ExternalLink size={16} strokeWidth={1.75} />
          </Link>
          <button type="button" className="adm-footer-icon-btn" onClick={exportData} title="Export applications">
            <Download size={16} strokeWidth={1.75} />
          </button>
          <button type="button" className="adm-footer-icon-btn danger" onClick={onLogout} title="Sign out">
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-sidebar-footer ${compact ? "compact" : ""}`}>
      <div className={`adm-footer-status ${connected ? "on" : ""}`}>
        <span className="adm-live-dot" />
        <div className="adm-footer-status-copy">
          <span className="adm-footer-status-title">
            {connected ? "Live connection" : "Reconnecting"}
          </span>
          <span className="adm-footer-status-sub">PostgreSQL · 4s sync</span>
        </div>
      </div>

      <div className="adm-footer-actions">
        <Link href="/" className="adm-footer-action">
          <ExternalLink size={15} strokeWidth={1.75} />
          <span>View site</span>
        </Link>
        <button type="button" className="adm-footer-action" onClick={exportData}>
          <Download size={15} strokeWidth={1.75} />
          <span>Export</span>
        </button>
      </div>

      <button type="button" className="adm-footer-signout" onClick={onLogout}>
        <LogOut size={15} strokeWidth={1.75} />
        <span>Sign out</span>
      </button>
    </div>
  );
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className={`adm-brand ${collapsed ? "collapsed" : ""}`}>
      <span className="adm-brand-mark">D</span>
      {!collapsed && (
        <span className="adm-brand-text">
          <span className="adm-wordmark">DASOM</span>
          <span className="adm-brand-sub">Admin Console</span>
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar({ connected, stats, onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: mobileOpen, close: closeMobile } = useMobileSidebar();

  return (
    <>
      {/* Desktop */}
      <aside className={`adm-sidebar-desktop ${collapsed ? "collapsed" : ""}`}>
        <div className="adm-sidebar-header">
          <SidebarBrand collapsed={collapsed} />
          <button
            type="button"
            className="adm-collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.75} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.75} />
            )}
          </button>
        </div>
        <SidebarNav collapsed={collapsed} stats={stats} />
        <SidebarFooter collapsed={collapsed} connected={connected} onLogout={onLogout} />
      </aside>

      {/* Mobile overlay */}
      <div
        className={`adm-sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={`adm-sidebar-drawer ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <div className="adm-sidebar-drawer-head">
          <SidebarBrand collapsed={false} />
          <button
            type="button"
            className="adm-mobile-menu-btn"
            onClick={closeMobile}
            aria-label="Close navigation"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <SidebarNav collapsed={false} stats={stats} onNavigate={closeMobile} />
        <SidebarFooter collapsed={false} connected={connected} onLogout={onLogout} compact />
      </aside>
    </>
  );
}
