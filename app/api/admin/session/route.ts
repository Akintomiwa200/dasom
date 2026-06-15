import { NextResponse } from "next/server";
import { getAdminEmail, isAdminSessionValid } from "@/lib/admin-auth";

export async function GET() {
  const valid = await isAdminSessionValid();
  if (!valid) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email: getAdminEmail() });
}
