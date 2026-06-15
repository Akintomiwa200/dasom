import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/dashboard";
import { apiRoutes, siteComponents, sitePages } from "@/lib/site-registry";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  const stats = await getDashboardStats();
  return NextResponse.json({
    ...stats,
    site: { pages: sitePages, components: siteComponents, apiRoutes },
  });
}
