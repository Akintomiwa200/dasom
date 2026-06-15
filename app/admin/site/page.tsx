"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardStats } from "@/lib/dashboard-types";
import { AdminPageHead } from "@/components/admin/admin-page-head";

type SiteData = {
  pages: { path: string; name: string; description: string; type: string }[];
  components: { name: string; file: string; description: string; usedOn: string[] }[];
  apiRoutes: { method: string; path: string; description: string }[];
};

export default function AdminSitePage() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>();

  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: "include" })
      .then((r) => r.json())
      .then((data: DashboardStats & { site: SiteData }) => {
        setSite(data.site);
        setUpdatedAt(data.updatedAt);
      });
  }, []);

  return (
    <>
      <AdminPageHead
        title="Site & API Map"
        description="Public pages, React components, and API routes that power the DASOM enrollment platform."
        updatedAt={updatedAt}
        action={<Link href="/" className="btn-secondary">Open Homepage</Link>}
      />

      <div className="adm-body">
        <div className="adm-site-grid">
          <div className="adm-card">
            <div className="adm-card-title">Pages ({site?.pages.length ?? "…"})</div>
            {(site?.pages ?? []).map((p) => (
              <div key={p.path} className="adm-site-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 className="title-sm">{p.name}</h4>
                  <span className={`adm-tag ${p.type === "admin" ? "pending" : "approved"}`} style={{ fontSize: 9 }}>{p.type}</span>
                </div>
                <div className="text-code" style={{ marginTop: 6 }}>{p.path}</div>
                <p className="body-sm" style={{ marginTop: 6 }}>{p.description}</p>
                {p.type === "public" && (
                  <Link href={p.path} className="link-read-more" style={{ marginTop: 8, display: "inline-block", fontSize: 13 }}>
                    Open page →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="adm-card">
            <div className="adm-card-title">Components ({site?.components.length ?? "…"})</div>
            {(site?.components ?? []).map((c) => (
              <div key={c.file} className="adm-site-item">
                <h4 className="title-sm">{c.name}</h4>
                <div className="text-code" style={{ marginTop: 6 }}>{c.file}</div>
                <p className="body-sm" style={{ marginTop: 6 }}>{c.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {c.usedOn.map((u) => (
                    <span key={u} className="adm-pill">{u}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="adm-card">
            <div className="adm-card-title">API Routes ({site?.apiRoutes.length ?? "…"})</div>
            {(site?.apiRoutes ?? []).map((r) => (
              <div key={`${r.method}-${r.path}`} className="adm-site-item">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="adm-pill">{r.method}</span>
                  <span className="text-code">{r.path}</span>
                </div>
                <p className="body-sm" style={{ marginTop: 6 }}>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
