import { prisma } from "@/lib/prisma";
import { gates as gateDefinitions } from "@/lib/content";
import { CHART_COLORS, type DashboardStats, type GateCluster } from "@/lib/dashboard-types";
import { formatNaira } from "@/lib/payment";

export type { DashboardStats, GateCluster } from "@/lib/dashboard-types";
export { CHART_COLORS } from "@/lib/dashboard-types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function lastMonths(count: number) {
  const result = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ label: MONTH_LABELS[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
  }
  return result;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const months = lastMonths(7);

  const [
    all,
    pending,
    approved,
    rejected,
    last24h,
    last7d,
    physical,
    virtual,
    paid,
    unpaid,
    gateGroups,
    modeGroups,
    stateGroups,
    genderGroups,
    recent,
    allApps,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.application.count({ where: { status: "approved" } }),
    prisma.application.count({ where: { status: "rejected" } }),
    prisma.application.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.application.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.application.count({ where: { modeOfEnrollment: "Physical" } }),
    prisma.application.count({ where: { modeOfEnrollment: "Virtual" } }),
    prisma.application.count({ where: { paymentStatus: "paid" } }),
    prisma.application.count({ where: { paymentStatus: "unpaid" } }),
    prisma.application.groupBy({
      by: ["gateOfInfluence"],
      _count: { _all: true },
      orderBy: { _count: { gateOfInfluence: "desc" } },
    }),
    prisma.application.groupBy({ by: ["modeOfEnrollment"], _count: { _all: true } }),
    prisma.application.groupBy({
      by: ["state"],
      _count: { _all: true },
      orderBy: { _count: { state: "desc" } },
      take: 8,
    }),
    prisma.application.groupBy({ by: ["gender"], _count: { _all: true } }),
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.application.findMany({
      select: { createdAt: true, status: true, gateOfInfluence: true, state: true },
    }),
  ]);

  const gateCountMap = new Map(gateGroups.map((g) => [g.gateOfInfluence, g._count._all]));
  const gateStatusMap = await prisma.application.groupBy({
    by: ["gateOfInfluence", "status"],
    _count: { _all: true },
  });

  const gateClusters: GateCluster[] = gateDefinitions.map((g, i) => {
    const statusForGate = gateStatusMap.filter((s) => s.gateOfInfluence === g.name);
    return {
      name: g.name,
      desc: g.desc,
      count: gateCountMap.get(g.name) ?? 0,
      pending: statusForGate.find((s) => s.status === "pending")?._count._all ?? 0,
      approved: statusForGate.find((s) => s.status === "approved")?._count._all ?? 0,
      fill: CHART_COLORS.gates[i % CHART_COLORS.gates.length],
    };
  });

  const byGate = gateClusters
    .filter((g) => g.count > 0)
    .map((g) => ({ gate: g.name, count: g.count, fill: g.fill }));

  const byMonth = months.map(({ label, year, month }) => {
    const inMonth = allApps.filter((a) => {
      const d = new Date(a.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    return {
      month: label,
      submitted: inMonth.length,
      approved: inMonth.filter((a) => a.status === "approved").length,
    };
  });

  const byWeekday = [1, 2, 3, 4, 5, 6, 0].map((dayIndex, i) => {
    return {
      day: WEEKDAY_LABELS[i],
      count: allApps.filter((a) => new Date(a.createdAt).getDay() === dayIndex).length,
    };
  });

  const byStatus = [
    { status: "pending", count: pending, fill: CHART_COLORS.primarySoft },
    { status: "approved", count: approved, fill: CHART_COLORS.success },
    { status: "rejected", count: rejected, fill: CHART_COLORS.error },
  ];

  const byPayment = [
    { status: "paid", count: paid, fill: CHART_COLORS.success },
    { status: "unpaid", count: unpaid, fill: CHART_COLORS.primarySoft },
  ];

  const activity = [
    ...recent
      .filter((app) => app.paymentStatus === "paid" && app.paidAt)
      .map((app) => ({
        id: `${app.id}-paid`,
        message: `${app.firstName} ${app.surname} paid ${formatNaira(app.paymentAmount)} registration fee`,
        time: app.paidAt!.toISOString(),
        status: app.status,
        kind: "payment" as const,
      })),
    ...recent.map((app) => ({
      id: app.id,
      message: `${app.firstName} ${app.surname} applied for ${app.gateOfInfluence} (${app.modeOfEnrollment})`,
      time: app.createdAt.toISOString(),
      status: app.status,
      kind: "application" as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 12);

  return {
    updatedAt: now.toISOString(),
    programme: {
      modules: 12,
      gates: 12,
      durationMonths: 8,
      location: "Ago-Iwoye, Ogun State",
    },
    totals: {
      all,
      pending,
      approved,
      rejected,
      last24h,
      last7d,
      physical,
      virtual,
      approvalRate: all > 0 ? Math.round((approved / all) * 100) : 0,
      paid,
      unpaid,
      paymentRate: all > 0 ? Math.round((paid / all) * 100) : 0,
    },
    byGate,
    gateClusters,
    byMode: modeGroups.map((m) => ({ mode: m.modeOfEnrollment, count: m._count._all })),
    byMonth,
    byWeekday,
    byStatus,
    byPayment,
    byState: stateGroups.map((s) => ({ state: s.state, count: s._count._all })),
    byGender: genderGroups.map((g) => ({ gender: g.gender, count: g._count._all })),
    recent,
    activity,
  };
}
