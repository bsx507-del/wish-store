import { createClient } from "@supabase/supabase-js";
import { createMoyasarPayment } from "../../server/moyasar";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: serviceKey } = process.env;
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const { items, sourceToken, callbackUrl } = req.body || {};
  if (!url || !serviceKey) return res.status(503).json({ error: "Payment service is not configured" });
  if (!token) return res.status(401).json({ error: "Sign in is required" });
  if (!sourceToken || !callbackUrl || !Array.isArray(items) || !items.length) return res.status(400).json({ error: "Invalid payment request" });
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: "Invalid session" });
  const cleanItems = items.filter((item: any) => Number.isInteger(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99);
  if (cleanItems.length !== items.length) return res.status(400).json({ error: "Invalid cart items" });
  const ids = cleanItems.map((item: any) => item.productId);
  const { data: products, error: productsError } = await admin.from("products").select("id,name,price_halalas").in("id", ids).eq("active", true);
  if (productsError || !products || products.length !== new Set(ids).size) return res.status(400).json({ error: "One or more products are unavailable" });
  const productMap = new Map(products.map((product: any) => [product.id, product]));
  const amountHalalas = cleanItems.reduce((sum: number, item: any) => sum + (productMap.get(item.productId)?.price_halalas || 0) * item.quantity, 0);
  if (amountHalalas <= 0) return res.status(400).json({ error: "Invalid payment amount" });
  const orderId = `W-${Date.now().toString(36).toUpperCase()}`;
  const { error: orderError } = await admin.from("orders").insert({ id: orderId, user_id: authData.user.id, total_halalas: amountHalalas, status: "pending", payment_provider: "moyasar" });
  if (orderError) return res.status(502).json({ error: "Unable to create order" });
  const { error: itemError } = await admin.from("order_items").insert(cleanItems.map((item: any) => ({ order_id: orderId, product_id: item.productId, quantity: item.quantity, unit_price_halalas: productMap.get(item.productId)?.price_halalas || 0 })));
  if (itemError) {
    await admin.from("orders").delete().eq("id", orderId);
    return res.status(502).json({ error: "Unable to create order items" });
  }
  try {
    const payment = await createMoyasarPayment({
      amountHalalas, callbackUrl, description: `وِشّ · الطلب ${orderId}`, sourceToken,
      lines: cleanItems.map((item: any) => ({ name: productMap.get(item.productId)?.name || "منتج وِشّ", quantity: item.quantity, unitAmountHalalas: productMap.get(item.productId)?.price_halalas || 0 })),
      metadata: { order_id: orderId, user_id: authData.user.id },
    });
    await admin.from("orders").update({ provider_reference: payment.id }).eq("id", orderId);
    return res.status(200).json({ orderId, paymentId: payment.id, transactionUrl: payment.source?.transaction_url });
  } catch (error) {
    await admin.from("orders").update({ status: "failed" }).eq("id", orderId);
    return res.status(502).json({ error: error instanceof Error ? error.message : "Payment creation failed" });
  }
}
