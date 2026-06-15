"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboard-types";
import { CHART_COLORS } from "@/lib/dashboard-types";

const tooltipStyle = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #e6e5e0",
    borderRadius: 8,
    fontSize: 13,
    boxShadow: "0 4px 12px rgba(38,37,30,0.08)",
  },
  labelStyle: { color: "#807d72" },
  itemStyle: { color: "#26251e" },
};

export function SubmittedVsApprovedChart({ data }: { data: DashboardStats["byMonth"] }) {
  return (
    <div className="adm-card">
      <div className="adm-card-title">Applications Submitted vs Approved</div>
      <div className="adm-chart-h" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#efeee8" vertical={false} />
            <XAxis dataKey="month" stroke="#a09c92" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a09c92" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="submitted" name="Submitted" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} />
            <Line type="monotone" dataKey="approved" name="Approved" stroke={CHART_COLORS.success} strokeWidth={2} strokeDasharray="5 4" dot={{ fill: CHART_COLORS.success, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function GateDonutChart({ data }: { data: DashboardStats["byGate"] }) {
  if (!data.length) {
    return (
      <div className="adm-card">
        <div className="adm-card-title">Applications by Gate</div>
        <p className="body-sm text-muted">No gate data yet — enrollments will appear here live.</p>
      </div>
    );
  }
  return (
    <div className="adm-card">
      <div className="adm-card-title">Applications by Gate</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="gate" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.gate} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusDonutChart({ data, total }: { data: DashboardStats["byStatus"]; total: number }) {
  const approved = data.find((d) => d.status === "approved")?.count ?? 0;
  const pct = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="adm-card">
      <div className="adm-card-title">Review Status</div>
      <div style={{ height: 200, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", pointerEvents: "none" }}>
          <span className="caption" style={{ fontSize: 11 }}>Approved</span>
          <span style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {data.map((d) => (
          <div key={d.status} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span className={`adm-tag ${d.status}`}>{d.status}</span>
            <span className="text-ink">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyBarChart({ data }: { data: DashboardStats["byWeekday"] }) {
  return (
    <div className="adm-card">
      <div className="adm-card-title">Applications by Weekday</div>
      <div className="adm-chart-h">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#efeee8" vertical={false} />
            <XAxis dataKey="day" stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendAreaChart({ data }: { data: DashboardStats["byMonth"] }) {
  return (
    <div className="adm-card">
      <div className="adm-card-title">Enrollment Trend</div>
      <div className="adm-chart-h">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="admAreaPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#efeee8" vertical={false} />
            <XAxis dataKey="month" stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="submitted" stroke={CHART_COLORS.primary} fill="url(#admAreaPrimary)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ModeBarChart({ data }: { data: DashboardStats["byMode"] }) {
  return (
    <div className="adm-card">
      <div className="adm-card-title">Physical vs Virtual</div>
      <div className="adm-chart-h" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid stroke="#efeee8" horizontal={false} />
            <XAxis type="number" stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="mode" stroke="#a09c92" fontSize={12} tickLine={false} axisLine={false} width={70} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StateBarChart({ data }: { data: DashboardStats["byState"] }) {
  if (!data.length) {
    return (
      <div className="adm-card">
        <div className="adm-card-title">Applicants by State</div>
        <p className="body-sm text-muted">No state data yet.</p>
      </div>
    );
  }
  return (
    <div className="adm-card">
      <div className="adm-card-title">Applicants by State</div>
      <div className="adm-chart-h">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#efeee8" vertical={false} />
            <XAxis dataKey="state" stroke="#a09c92" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#a09c92" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill={CHART_COLORS.ink} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
