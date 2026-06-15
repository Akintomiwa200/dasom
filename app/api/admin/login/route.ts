import { NextRequest, NextResponse } from "next/server";
import {
  setAdminSessionCookie,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, email });
  setAdminSessionCookie(response, email);
  return response;
}
