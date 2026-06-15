export const sitePages = [
  { path: "/", name: "Home", description: "Landing page with programme overview", type: "public" as const },
  { path: "/about", name: "About", description: "Cave of Adullam origin, pillars, instructor", type: "public" as const },
  { path: "/curriculum", name: "Curriculum", description: "12 modules and gates of influence", type: "public" as const },
  { path: "/structure", name: "Structure", description: "Timeline, fees, attendance rules", type: "public" as const },
  { path: "/enroll", name: "Enroll", description: "4-step enrollment application form", type: "public" as const },
  { path: "/admin", name: "Overview", description: "Enrollment command center", type: "admin" as const },
  { path: "/admin/applications", name: "Applications", description: "Review and manage enrollments", type: "admin" as const },
  { path: "/admin/gates", name: "Gates of Influence", description: "Live cluster breakdown (12 gates)", type: "admin" as const },
  { path: "/admin/enrollment", name: "Enrollment Insights", description: "Physical/virtual, geography, demographics", type: "admin" as const },
  { path: "/admin/site", name: "Site & API Map", description: "Pages, components, and routes", type: "admin" as const },
];

export const siteComponents = [
  { name: "SiteNav", file: "components/site-nav.tsx", description: "Public site navigation", usedOn: ["Home", "About", "Curriculum", "Enroll"] },
  { name: "SiteFooter", file: "components/site-footer.tsx", description: "Public site footer", usedOn: ["Home", "About", "Curriculum"] },
  { name: "PageHero", file: "components/page-hero.tsx", description: "Inner page header band", usedOn: ["About", "Curriculum", "Structure"] },
  { name: "DashboardShell", file: "components/admin/dashboard-shell.tsx", description: "Admin layout with DASOM-branded sidebar", usedOn: ["Admin"] },
  { name: "DashboardCharts", file: "components/admin/dashboard-charts.tsx", description: "Enrollment charts (Recharts)", usedOn: ["Overview", "Enrollment Insights"] },
  { name: "ApplicationsPanel", file: "components/admin/applications-panel.tsx", description: "Application review table and detail drawer", usedOn: ["Applications"] },
  { name: "AdminPageHead", file: "components/admin/admin-page-head.tsx", description: "Page title band with live sync timestamp", usedOn: ["All admin pages"] },
];

export const apiRoutes = [
  { method: "POST", path: "/api/applications", description: "Submit enrollment (public)" },
  { method: "GET", path: "/api/applications/[id]/payment", description: "Poll payment status after Selar checkout" },
  { method: "POST", path: "/api/webhooks/selar", description: "Selar sale webhook — marks application paid" },
  { method: "POST", path: "/api/admin/login", description: "Admin authentication" },
  { method: "GET", path: "/api/admin/dashboard", description: "Stats snapshot + site registry" },
  { method: "GET", path: "/api/admin/dashboard/stream", description: "Real-time SSE stats (4s interval)" },
  { method: "GET", path: "/api/admin/applications", description: "List all applications" },
  { method: "PATCH", path: "/api/admin/applications", description: "Update application status" },
];

export type SitePage = (typeof sitePages)[number];
export type SiteComponent = (typeof siteComponents)[number];
