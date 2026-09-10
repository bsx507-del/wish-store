import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { MOYASAR_SECRET_KEY: secretKey, NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: serviceKey } = process.env;
  const paymentId = req.body?.id;
  if (!secretKey || !url || !serviceKey || !paymentId) return res.status(400).json({ error: "Invalid webhook" });
  const response = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}` } });
  if (!response.ok) return res.status(502).json({ error: "Unable to verify payment" });
  const payment = await response.json();
  const status = payment.status === "paid" ? "paid" : ["failed", "canceled"].includes(payment.status) ? payment.status : "pending";
  if (!payment.metadata?.order_id) return res.status(400).json({ error: "Missing order reference" });
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await admin.from("orders").update({ status, provider_reference: payment.id }).eq("id", payment.metadata.order_id);
  if (error) return res.status(502).json({ error: "Unable to update order" });
  return res.status(200).json({ received: true });
}
