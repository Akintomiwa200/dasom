import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/dashboard";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
