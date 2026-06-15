import { REGISTRATION_FEE_NGN, parseDasomReference, parsePaymentAmount } from "@/lib/payment";

type SelarPayload = Record<string, unknown>;

function asRecord(value: unknown): SelarPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as SelarPayload;
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectStrings(v, out));
  }
  return out;
}

function extractEmail(payload: SelarPayload): string | null {
  const candidates = [
    payload.email,
    payload.buyer_email,
    payload.customer_email,
    asRecord(payload.customer)?.email,
    asRecord(payload.buyer)?.email,
    asRecord(payload.data)?.email,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.includes("@")) return c.toLowerCase().trim();
  }
  return null;
}

function extractAmount(payload: SelarPayload): number | null {
  const candidates = [
    payload.amount,
    payload.total,
    payload.price,
    payload.amount_paid,
    asRecord(payload.data)?.amount,
    asRecord(payload.payment)?.amount,
  ];
  for (const c of candidates) {
    const parsed = parsePaymentAmount(c);
    if (parsed !== null) return parsed;
  }
  return null;
}

function extractApplicationId(payload: SelarPayload): string | null {
  const direct = [
    payload.application_id,
    payload.applicationId,
    payload.reference,
    payload.order_reference,
    payload.custom_reference,
    asRecord(payload.metadata)?.application_id,
    asRecord(payload.custom_fields)?.application_ref,
    asRecord(payload.custom_fields)?.reference,
  ];
  for (const c of direct) {
    const id = parseDasomReference(c);
    if (id) return id;
  }
  for (const text of collectStrings(payload)) {
    const id = parseDasomReference(text);
    if (id) return id;
  }
  return null;
}

function isSuccessfulSale(payload: SelarPayload): boolean {
  const status = [
    payload.status,
    payload.payment_status,
    payload.event,
    payload.type,
    asRecord(payload.data)?.status,
  ]
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.toLowerCase());

  if (status.some((s) => ["failed", "cancelled", "canceled", "refunded"].includes(s))) {
    return false;
  }
  if (status.some((s) => ["success", "successful", "paid", "completed", "sale", "new sale"].includes(s))) {
    return true;
  }
  // Zapier / generic webhooks often omit status — treat as success if amount matches
  return extractAmount(payload) === REGISTRATION_FEE_NGN;
}

export type ParsedSelarSale = {
  applicationId: string | null;
  email: string | null;
  amount: number | null;
  selarReference: string;
  successful: boolean;
};

export function parseSelarWebhook(body: unknown): ParsedSelarSale | null {
  const payload = asRecord(body);
  if (!payload) return null;

  const nested = asRecord(payload.data) ?? asRecord(payload.sale) ?? payload;
  const merged = { ...payload, ...nested };

  return {
    applicationId: extractApplicationId(merged),
    email: extractEmail(merged),
    amount: extractAmount(merged),
    selarReference:
      [merged.reference, merged.order_id, merged.transaction_id, merged.id]
        .find((v): v is string => typeof v === "string" && v.length > 0) ?? "",
    successful: isSuccessfulSale(merged),
  };
}
