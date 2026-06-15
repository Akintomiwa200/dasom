import { NextRequest, NextResponse } from "next/server";
import { getApplicationById } from "@/lib/db";
import { dasomReference, formatNaira, getSelarCheckoutUrl } from "@/lib/payment";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const app = await getApplicationById(id);
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: app.id,
    reference: dasomReference(app.id),
    paymentStatus: app.paymentStatus,
    paymentAmount: app.paymentAmount,
    paymentAmountLabel: formatNaira(app.paymentAmount),
    paidAt: app.paidAt?.toISOString() ?? null,
    selarCheckoutUrl: getSelarCheckoutUrl(app),
  });
}
