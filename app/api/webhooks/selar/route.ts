import { NextRequest, NextResponse } from "next/server";
import { findApplicationForPayment, markApplicationPaid } from "@/lib/db";
import { REGISTRATION_FEE_NGN } from "@/lib/payment";
import { parseSelarWebhook } from "@/lib/selar-webhook";

export async function POST(req: NextRequest) {
  const secret = process.env.SELAR_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("x-selar-secret") ?? req.headers.get("authorization");
    if (header !== secret && header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sale = parseSelarWebhook(body);
  if (!sale || !sale.successful) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (sale.amount !== null && sale.amount !== REGISTRATION_FEE_NGN) {
    return NextResponse.json({ error: "Unexpected payment amount" }, { status: 400 });
  }

  const app = await findApplicationForPayment({
    applicationId: sale.applicationId,
    email: sale.email,
  });

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.paymentStatus === "paid") {
    return NextResponse.json({ ok: true, applicationId: app.id, alreadyPaid: true });
  }

  const updated = await markApplicationPaid(app.id, sale.selarReference);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    applicationId: updated.id,
    paymentStatus: updated.paymentStatus,
  });
}
