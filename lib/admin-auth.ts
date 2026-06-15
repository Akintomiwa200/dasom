import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "dasom_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || "admin@dasom.com";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "dasom123";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dasom-dev-session-secret-change-in-production";
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return email.toLowerCase() === getAdminEmail().toLowerCase() && password === getAdminPassword();
}

export function createSessionToken(email: string): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${email}:${exp}`;
  const sig = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return false;
    const sig = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const expected = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
    const [, expStr] = payload.split(":");
    const exp = Number(expStr);
    return Number.isFinite(exp) && exp > Date.now();
  } catch {
    return false;
  }
}

export function setAdminSessionCookie(response: NextResponse, email: string): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}

export function isAdminAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token && verifySessionToken(token)) return true;
  const legacyKey = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("key");
  return legacyKey === getAdminPassword();
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
