import { createClient } from "@supabase/supabase-js";

type Request = { method?: string; body?: unknown };
type Response = { status: (code: number) => Response; json: (value: unknown) => void };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const paymentId = (req.body as { id?: string } | undefined)?.id;
  if (!secretKey || !url || !serviceKey || !paymentId) return res.status(400).json({ error: "Invalid webhook" });

  const response = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}` },
  });
  if (!response.ok) return res.status(502).json({ error: "Unable to verify payment" });
  const payment = await response.json() as { id: string; status: string; metadata?: { order_id?: string } };
  const status = payment.status === "paid" ? "paid" : ["failed", "canceled"].includes(payment.status) ? payment.status : "pending";
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await admin.from("orders").update({ status, provider_reference: payment.id }).eq("id", payment.metadata?.order_id || "");
  if (error) return res.status(502).json({ error: "Unable to update order" });
  return res.status(200).json({ received: true });
}
