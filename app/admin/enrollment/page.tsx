"use client";

import { ModeBarChart, StateBarChart, WeeklyBarChart } from "@/components/admin/dashboard-charts";
import { AdminPageHead } from "@/components/admin/admin-page-head";
import { useDashboardLive } from "@/hooks/use-dashboard-live";
import { formatNaira, REGISTRATION_FEE_NGN } from "@/lib/payment";

export default function AdminEnrollmentPage() {
  const { stats } = useDashboardLive(true);
  const t = stats?.totals;
  const physicalPct = t?.all ? Math.round((t.physical / t.all) * 100) : 0;
  const virtualPct = t?.all ? Math.round((t.virtual / t.all) * 100) : 0;

  return (
    <>
      <AdminPageHead
        title="Enrollment Insights"
        description="Physical vs virtual intake, geographic spread, and submission patterns for the 8-month DASOM programme."
        updatedAt={stats?.updatedAt}
      />

      <div className="adm-body">
        <div className="adm-stat-row" style={{ marginBottom: 24 }}>
          <div className="adm-stat featured">
            <div className="adm-stat-label">Physical (Ago-Iwoye)</div>
            <div className="adm-stat-value">{t?.physical ?? 0}</div>
            <div className="adm-stat-hint">{physicalPct}% of all applications</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Virtual</div>
            <div className="adm-stat-value">{t?.virtual ?? 0}</div>
            <div className="adm-stat-hint">{virtualPct}% outside Ago-Iwoye</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">This Week</div>
            <div className="adm-stat-value">{t?.last7d ?? 0}</div>
            <div className="adm-stat-hint">New submissions</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Today</div>
            <div className="adm-stat-value">{t?.last24h ?? 0}</div>
            <div className="adm-stat-hint">Last 24 hours</div>
          </div>
        </div>

        <div className="adm-charts-2" style={{ marginBottom: 20 }}>
          {stats && <ModeBarChart data={stats.byMode} />}
          {stats && <StateBarChart data={stats.byState} />}
        </div>

        {stats && <WeeklyBarChart data={stats.byWeekday} />}

        <div className="adm-card" style={{ marginTop: 20 }}>
          <div className="adm-card-title">Demographics</div>
          {!stats?.byGender.length ? (
            <p className="body-sm text-muted">Gender breakdown appears as applications are submitted.</p>
          ) : (
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {stats.byGender.map((g) => (
                <div key={g.gender} style={{ textAlign: "center", minWidth: 80 }}>
                  <div className="adm-stat-value" style={{ fontSize: 28 }}>{g.count}</div>
                  <div className="caption">{g.gender}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="adm-card" style={{ marginTop: 20 }}>
          <div className="adm-card-title">Enrollment Requirements (from programme)</div>
          <ul style={{ listStyle: "none", fontSize: 14, color: "var(--body)", lineHeight: 2 }}>
            <li>— 75% minimum attendance; 4 consecutive absences = withdrawal</li>
            <li>— Physical: Ago-Iwoye, Ogun State only</li>
            <li>— Virtual: for applicants outside Ago-Iwoye</li>
            <li>— Registration fee {formatNaira(REGISTRATION_FEE_NGN)} paid via Selar during enrollment</li>
            <li>— 100% tuition-free; all materials provided</li>
          </ul>
        </div>
      </div>
    </>
  );
}
