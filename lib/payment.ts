/** DASOM registration fee via Selar — safe for client and server */
export const REGISTRATION_FEE_NGN = 3150;

export const SELAR_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_SELAR_CHECKOUT_URL ?? "https://selar.com/m1kom27ixh";

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function dasomReference(applicationId: string) {
  return `DASOM-${applicationId}`;
}

/** Build Selar checkout URL with buyer email pre-filled when supported */
export function getSelarCheckoutUrl(app: {
  id: string;
  email: string;
  firstName: string;
  surname: string;
}) {
  const params = new URLSearchParams({
    email: app.email,
    name: `${app.firstName} ${app.surname}`.trim(),
  });
  return `${SELAR_CHECKOUT_URL}?${params.toString()}`;
}

export function parseDasomReference(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const match = value.match(/DASOM-([a-z0-9]+)/i);
  return match?.[1] ?? null;
}

export function parsePaymentAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string") {
    const n = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? Math.round(n) : null;
  }
  return null;
}
