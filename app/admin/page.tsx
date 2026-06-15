"use client";

import Link from "next/link";
import {
  GateDonutChart,
  StatusDonutChart,
  SubmittedVsApprovedChart,
  TrendAreaChart,
  WeeklyBarChart,
} from "@/components/admin/dashboard-charts";
import { AdminPageHead } from "@/components/admin/admin-page-head";
import { useDashboardLive } from "@/hooks/use-dashboard-live";

export default function AdminOverviewPage() {
  const { stats, connected } = useDashboardLive(true);
  const t = stats?.totals;

  return (
    <>
      <AdminPageHead
        title="Enrollment Command Center"
        description="Real-time overview of DASOM applications — Cave of Adullam intake, gate clusters, and review pipeline."
        updatedAt={stats?.updatedAt}
        action={
          <Link href="/admin/applications" className="btn-primary">
            Review Applications{t?.pending ? ` (${t.pending})` : ""}
          </Link>
        }
      />

      <div className="adm-body">
        <div className="adm-grid-2">
          <div className="adm-grid-main">
            <div className="adm-stat-row">
              <div className="adm-stat featured">
                <div className="adm-stat-label">Total Applications</div>
                <div className="adm-stat-value">{t?.all ?? "—"}</div>
                <div className="adm-stat-hint">All enrollment submissions</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-label">Pending Review</div>
                <div className="adm-stat-value">{t?.pending ?? "—"}</div>
                <div className="adm-stat-hint">Awaiting admin action</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-label">Approved</div>
                <div className="adm-stat-value" style={{ color: "var(--semantic-success)" }}>{t?.approved ?? "—"}</div>
                <div className="adm-stat-hint">{t?.approvalRate ?? 0}% approval rate</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-label">Rejected</div>
                <div className="adm-stat-value" style={{ color: "var(--semantic-error)" }}>{t?.rejected ?? "—"}</div>
                <div className="adm-stat-hint">Not proceeding</div>
              </div>
            </div>

            <div className="adm-stat-row-6">
              {[
                ["Paid", t?.paid],
                ["Unpaid", t?.unpaid],
                ["Physical", t?.physical],
                ["Virtual", t?.virtual],
                ["Last 24h", t?.last24h],
                ["Payment rate", `${t?.paymentRate ?? 0}%`],
              ].map(([label, val]) => (
                <div key={String(label)} className="adm-stat adm-stat-sm">
                  <div className="adm-stat-label">{label}</div>
                  <div className="adm-stat-value">{val ?? "—"}</div>
                </div>
              ))}
            </div>

            {stats && <SubmittedVsApprovedChart data={stats.byMonth} />}

            <div className="adm-charts-2">
              {stats && <GateDonutChart data={stats.byGate} />}
              {stats && <StatusDonutChart data={stats.byStatus} total={t?.all ?? 0} />}
            </div>

            <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)" }}>
                <div className="adm-card-title" style={{ marginBottom: 0 }}>Recent Applications</div>
              </div>
              {!stats?.recent?.length ? (
                <p className="body-sm text-muted" style={{ padding: 32 }}>No applications yet. New enrollments from /enroll appear here instantly.</p>
              ) : (
                <table className="adm-table">
                  <thead>
                    <tr>
                      {["Applicant", "Gate", "Mode", "Payment", "Status", "Submitted"].map((h) => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((app) => (
                      <tr key={app.id}>
                        <td>{app.firstName} {app.surname}</td>
                        <td><span className="adm-pill">{app.gateOfInfluence}</span></td>
                        <td className="body-sm">{app.modeOfEnrollment}</td>
                        <td><span className={`adm-tag ${app.paymentStatus}`}>{app.paymentStatus}</span></td>
                        <td><span className={`adm-tag ${app.status}`}>{app.status}</span></td>
                        <td className="caption">{new Date(app.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="adm-grid-side">
            <div className="adm-card">
              <div className="adm-card-title">Live Activity</div>
              <div className="adm-activity">
                {!stats?.activity?.length ? (
                  <p className="body-sm text-muted">Waiting for first enrollment…</p>
                ) : (
                  stats.activity.map((item) => (
                    <div key={item.id} className="adm-activity-item">
                      <span className={`adm-activity-dot ${item.kind === "payment" ? "paid" : item.status}`} />
                      <div>
                        <div className="adm-activity-text">{item.message}</div>
                        <div className="adm-activity-time">{new Date(item.time).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {stats && <TrendAreaChart data={stats.byMonth} />}
            {stats && <WeeklyBarChart data={stats.byWeekday} />}

            <div className="adm-card">
              <div className="adm-card-title">Programme Snapshot</div>
              <p className="body-sm" style={{ marginBottom: 12 }}>
                8-month tuition-free programme by The Mighty Men of David. Students choose a gate of influence and enroll physically (Ago-Iwoye) or virtually.
              </p>
              <Link href="/admin/gates" className="link-read-more">View all 12 gates →</Link>
            </div>

            <p className="caption" style={{ textAlign: "center" }}>
              {connected ? "Streaming from PostgreSQL every 4s" : "Reconnecting to database…"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
