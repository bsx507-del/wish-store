type PaymentLine = {
  name: string;
  quantity: number;
  unitAmountHalalas: number;
};

type CreateMoyasarPaymentInput = {
  amountHalalas: number;
  callbackUrl: string;
  description: string;
  sourceToken: string;
  lines: PaymentLine[];
  metadata: Record<string, string>;
};

/**
 * Server-only adapter for Moyasar.
 * Call this from a Next route handler after validating the authenticated user,
 * recalculating prices from the database, and enforcing idempotency.
 */
export async function createMoyasarPayment(input: CreateMoyasarPaymentInput) {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) throw new Error("MOYASAR_SECRET_KEY is not configured");
  if (!Number.isInteger(input.amountHalalas) || input.amountHalalas <= 0) {
    throw new Error("Payment amount must be a positive integer in halalas");
  }

  const response = await fetch("https://api.moyasar.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountHalalas,
      currency: "SAR",
      description: input.description,
      callback_url: input.callbackUrl,
      source: { type: "token", token: input.sourceToken },
      metadata: input.metadata,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Moyasar payment creation failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.json() as Promise<{ id: string; status: string; source?: { transaction_url?: string } }>;
}
