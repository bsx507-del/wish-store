import { createClient } from "@supabase/supabase-js";
import { createMoyasarPayment } from "../../server/moyasar";

type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (value: unknown) => void;
};

type CartLine = { productId: number; quantity: number };

const jsonError = (res: Response, status: number, message: string) => res.status(status).json({ error: message });

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") return jsonError(res, 405, "Method not allowed");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const authorization = req.headers.authorization;
  const token = Array.isArray(authorization) ? authorization[0] : authorization;
  const body = req.body as { items?: CartLine[]; sourceToken?: string; callbackUrl?: string } | undefined;

  if (!url || !serviceKey) return jsonError(res, 503, "Payment service is not configured");
  if (!token?.startsWith("Bearer ")) return jsonError(res, 401, "Sign in is required");
  if (!body?.sourceToken || !body.callbackUrl || !Array.isArray(body.items) || body.items.length === 0) {
    return jsonError(res, 400, "Invalid payment request");
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token.slice(7));
  if (authError || !authData.user) return jsonError(res, 401, "Invalid session");

  const cleanItems = body.items.filter((item) =>
    Number.isInteger(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99,
  );
  if (cleanItems.length !== body.items.length) return jsonError(res, 400, "Invalid cart items");

  const ids = cleanItems.map((item) => item.productId);
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id,name,price_halalas")
    .in("id", ids)
    .eq("active", true);
  if (productsError) return jsonError(res, 502, "Unable to verify products");
  if (!products || products.length !== new Set(ids).size) return jsonError(res, 400, "One or more products are unavailable");

  const productMap = new Map(products.map((product) => [product.id, product]));
  const amountHalalas = cleanItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product?.price_halalas || 0) * item.quantity;
  }, 0);
  if (amountHalalas <= 0) return jsonError(res, 400, "Invalid payment amount");

  const orderId = `W-${Date.now().toString(36).toUpperCase()}`;
  const { error: orderError } = await admin.from("orders").insert({
    id: orderId,
    user_id: authData.user.id,
    total_halalas: amountHalalas,
    status: "pending",
    payment_provider: "moyasar",
  });
  if (orderError) return jsonError(res, 502, "Unable to create order");

  const { error: itemError } = await admin.from("order_items").insert(cleanItems.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price_halalas: productMap.get(item.productId)?.price_halalas || 0,
  })));
  if (itemError) {
    await admin.from("orders").delete().eq("id", orderId);
    return jsonError(res, 502, "Unable to create order items");
  }

  try {
    const payment = await createMoyasarPayment({
      amountHalalas,
      callbackUrl: body.callbackUrl,
      description: `وِشّ · الطلب ${orderId}`,
      sourceToken: body.sourceToken,
      lines: cleanItems.map((item) => ({
        name: productMap.get(item.productId)?.name || "منتج وِشّ",
        quantity: item.quantity,
        unitAmountHalalas: productMap.get(item.productId)?.price_halalas || 0,
      })),
      metadata: { order_id: orderId, user_id: authData.user.id },
    });
    await admin.from("orders").update({ provider_reference: payment.id }).eq("id", orderId);
    return res.status(200).json({ orderId, paymentId: payment.id, transactionUrl: payment.source?.transaction_url });
  } catch (error) {
    await admin.from("orders").update({ status: "failed" }).eq("id", orderId);
    return jsonError(res, 502, error instanceof Error ? error.message : "Payment creation failed");
  }
}
