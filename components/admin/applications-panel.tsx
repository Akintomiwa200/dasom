"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Application } from "@/lib/db";
import { useDashboardLive } from "@/hooks/use-dashboard-live";
import { AdminPageHead } from "@/components/admin/admin-page-head";

export function ApplicationsPanel() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const { stats } = useDashboardLive(true);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterGate, setFilterGate] = useState("all");

  useEffect(() => {
    setFilterStatus(searchParams.get("status") || "all");
  }, [searchParams]);

  const fetchApps = useCallback(async () => {
    const res = await fetch("/api/admin/applications", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  useEffect(() => {
    if (stats?.updatedAt) fetchApps();
  }, [stats?.updatedAt, fetchApps]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchApps();
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status: status as Application["status"] } : null));
    }
  };

  const filtered = apps.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterGate !== "all" && a.gateOfInfluence !== filterGate) return false;
    if (filterPayment !== "all" && a.paymentStatus !== filterPayment) return false;
    return true;
  });

  const gates = Array.from(new Set(apps.map((a) => a.gateOfInfluence).filter(Boolean)));

  return (
    <>
      <AdminPageHead
        title="Applications"
        description="Review, approve, or reject enrollment applications. Updates sync live from PostgreSQL as students submit the /enroll form."
        updatedAt={stats?.updatedAt}
      />

      <div className="adm-body">
        <div className="adm-toolbar">
          <div className="adm-filters">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`adm-filter-btn ${filterStatus === s ? "active" : ""}`}
              >
                {s} {s !== "all" && `(${apps.filter((a) => a.status === s).length})`}
              </button>
            ))}
            {["all", "paid", "unpaid"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterPayment(s)}
                className={`adm-filter-btn ${filterPayment === s ? "active" : ""}`}
              >
                {s === "all" ? "All payments" : s} {s !== "all" && `(${apps.filter((a) => a.paymentStatus === s).length})`}
              </button>
            ))}
            {gates.length > 0 && (
              <select
                value={filterGate}
                onChange={(e) => setFilterGate(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  background: "var(--surface-card)",
                  color: "var(--ink)",
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                }}
              >
                <option value="all">All Gates</option>
                {gates.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            )}
          </div>
          <button className="btn-ghost btn-sm" onClick={fetchApps}>↻ Refresh</button>
        </div>

        <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <p className="body-sm text-muted" style={{ padding: 48, textAlign: "center" }}>Loading applications…</p>
          ) : filtered.length === 0 ? (
            <p className="body-sm text-muted" style={{ padding: 48, textAlign: "center" }}>No applications match this filter.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    {["Name", "Email", "Gate", "Mode", "Payment", "Status", "Applied", "Actions"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <button
                          onClick={() => setSelected(app)}
                          style={{ background: "none", border: "none", color: "var(--ink)", cursor: "pointer", fontSize: 14, padding: 0, fontFamily: "var(--font-sans)" }}
                        >
                          {app.firstName} {app.surname}
                        </button>
                      </td>
                      <td className="body-sm">{app.email}</td>
                      <td><span className="adm-pill">{app.gateOfInfluence || "—"}</span></td>
                      <td className="body-sm">{app.modeOfEnrollment}</td>
                      <td><span className={`adm-tag ${app.paymentStatus}`}>{app.paymentStatus}</span></td>
                      <td><span className={`adm-tag ${app.status}`}>{app.status}</span></td>
                      <td className="caption">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {app.status !== "approved" && (
                            <button className="adm-action-btn approve" onClick={() => updateStatus(app.id, "approved")}>Approve</button>
                          )}
                          {app.status !== "rejected" && (
                            <button className="adm-action-btn reject" onClick={() => updateStatus(app.id, "rejected")}>Reject</button>
                          )}
                          {app.status !== "pending" && (
                            <button className="adm-action-btn reset" onClick={() => updateStatus(app.id, "pending")}>Reset</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="caption" style={{ marginTop: 16 }}>
          Showing {filtered.length} of {apps.length} applications · synced live
        </p>
      </div>

      {selected && (
        <div className="adm-panel">
          <div className="adm-panel-head">
            <span className="title-sm">Application Detail</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>
          <div className="adm-panel-body">
            <h2 className="display-sm" style={{ fontSize: 20, marginBottom: 8 }}>{selected.firstName} {selected.surname}</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <span className={`adm-tag ${selected.status}`}>{selected.status}</span>
              <span className={`adm-tag ${selected.paymentStatus}`}>{selected.paymentStatus}</span>
              <span className="adm-pill">{selected.gateOfInfluence}</span>
              <span className="adm-pill">{selected.modeOfEnrollment}</span>
            </div>
            {[
              ["Email", selected.email],
              ["Mobile", selected.mobileNumber],
              ["Date of Birth", selected.dateOfBirth],
              ["Gender", selected.gender],
              ["Nationality", selected.nationality],
              ["State / City", `${selected.state}, ${selected.city}`],
              ["Profession", selected.profession],
              ["Referee", `${selected.refereeName} — ${selected.refereePhone}`],
              ["Applied", new Date(selected.createdAt).toLocaleString()],
              ["Reference", `DASOM-${selected.id}`],
              ["Payment", selected.paymentStatus === "paid" ? `Paid ${selected.paymentAmount.toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 })}` : `Unpaid — ₦${selected.paymentAmount.toLocaleString("en-NG")}`],
              ["Paid At", selected.paidAt ? new Date(selected.paidAt).toLocaleString() : "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="adm-detail-label">{k}</div>
                <div className="adm-detail-value">{k === "Reference" ? <span className="text-code">{v}</span> : v}</div>
              </div>
            ))}
            {[
              ["Salvation Experience", selected.salvationExperience],
              ["Life Vision", selected.lifeVision],
              ["Reason for Enrolling", selected.reasonForEnrolling],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="adm-detail-label">{k}</div>
                <div className="adm-detail-block">{v || "—"}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {selected.status !== "approved" && (
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => updateStatus(selected.id, "approved")}>Approve</button>
              )}
              {selected.status !== "rejected" && (
                <button className="btn-ghost adm-action-btn reject" style={{ flex: 1, padding: "12px" }} onClick={() => updateStatus(selected.id, "rejected")}>Reject</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
