import type { Application } from "@/lib/db";

export const CHART_COLORS = {
  primary: "#f54e00",
  primarySoft: "#dfa88f",
  success: "#1f8a65",
  error: "#cf2d56",
  muted: "#807d72",
  ink: "#26251e",
  gates: ["#dfa88f", "#9fc9a2", "#9fbbe0", "#c0a8dd", "#c08532", "#f54e00", "#e6e5e0", "#9fc9a2", "#9fbbe0", "#c0a8dd", "#dfa88f", "#c08532"],
};

export type GateCluster = {
  name: string;
  desc: string;
  count: number;
  pending: number;
  approved: number;
  fill: string;
};

export type DashboardStats = {
  updatedAt: string;
  programme: {
    modules: number;
    gates: number;
    durationMonths: number;
    location: string;
  };
  totals: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    unpaid: number;
    last24h: number;
    last7d: number;
    physical: number;
    virtual: number;
    approvalRate: number;
    paymentRate: number;
  };
  byGate: { gate: string; count: number; fill: string }[];
  gateClusters: GateCluster[];
  byMode: { mode: string; count: number }[];
  byMonth: { month: string; submitted: number; approved: number }[];
  byWeekday: { day: string; count: number }[];
  byStatus: { status: string; count: number; fill: string }[];
  byPayment: { status: string; count: number; fill: string }[];
  byState: { state: string; count: number }[];
  byGender: { gender: string; count: number }[];
  recent: Application[];
  activity: { id: string; message: string; time: string; status: Application["status"]; kind?: "payment" | "application" }[];
};
