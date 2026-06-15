"use client";

import { Suspense } from "react";
import { ApplicationsPanel } from "@/components/admin/applications-panel";

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<p style={{ color: "#94a3b8" }}>Loading…</p>}>
      <ApplicationsPanel />
    </Suspense>
  );
}
