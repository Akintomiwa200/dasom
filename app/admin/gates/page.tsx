"use client";

import Link from "next/link";
import { AdminPageHead } from "@/components/admin/admin-page-head";
import { useDashboardLive } from "@/hooks/use-dashboard-live";

export default function AdminGatesPage() {
  const { stats } = useDashboardLive(true);
  const maxCount = Math.max(...(stats?.gateClusters?.map((g) => g.count) ?? [0]), 1);
  const largest = stats?.gateClusters?.reduce(
    (a, b) => (b.count > a.count ? b : a),
    { name: "—", count: 0, desc: "", pending: 0, approved: 0, fill: "" }
  );

  return (
    <>
      <AdminPageHead
        title="Gates of Influence"
        description="All 12 DASOM clusters — live applicant counts per gate. Students select their gate during enrollment."
        updatedAt={stats?.updatedAt}
        action={<Link href="/admin/applications" className="btn-secondary">Filter by Gate</Link>}
      />

      <div className="adm-body">
        <div className="adm-stat-row" style={{ marginBottom: 24, gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="adm-stat">
            <div className="adm-stat-label">Active Gates</div>
            <div className="adm-stat-value">{stats?.byGate.length ?? 0}</div>
            <div className="adm-stat-hint">Gates with applicants</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Largest Cluster</div>
            <div className="adm-stat-value" style={{ fontSize: 20 }}>{largest?.name}</div>
            <div className="adm-stat-hint">{largest?.count ?? 0} applicants</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Pending Across Gates</div>
            <div className="adm-stat-value">{stats?.totals.pending ?? 0}</div>
            <div className="adm-stat-hint">Need review</div>
          </div>
        </div>

        <div className="adm-gate-grid">
          {(stats?.gateClusters ?? []).map((gate) => (
            <div
              key={gate.name}
              className="adm-gate-card"
              style={{ "--gate-accent": gate.fill } as React.CSSProperties}
            >
              <div className="adm-gate-name">{gate.name}</div>
              <p className="adm-gate-desc">{gate.desc}</p>
              <div className="adm-gate-stats">
                <span><strong>{gate.count}</strong> total</span>
                <span><strong>{gate.pending}</strong> pending</span>
                <span><strong>{gate.approved}</strong> approved</span>
              </div>
              <div className="adm-gate-bar">
                <div className="adm-gate-bar-fill" style={{ width: `${(gate.count / maxCount) * 100}%`, background: gate.fill }} />
              </div>
              {gate.count > 0 && (
                <Link
                  href={`/admin/applications`}
                  className="link-read-more"
                  style={{ display: "inline-block", marginTop: 12, fontSize: 13 }}
                >
                  View applicants →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
