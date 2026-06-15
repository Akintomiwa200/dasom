"use client";

import { useEffect, useState } from "react";
import type { DashboardStats } from "@/lib/dashboard-types";

export function useDashboardLive(enabled: boolean) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const es = new EventSource("/api/admin/dashboard/stream");

    es.onopen = () => setConnected(true);
    es.onmessage = (event) => {
      setStats(JSON.parse(event.data) as DashboardStats);
      setConnected(true);
    };
    es.onerror = () => setConnected(false);

    return () => {
      es.close();
      setConnected(false);
    };
  }, [enabled]);

  return { stats, connected };
}
