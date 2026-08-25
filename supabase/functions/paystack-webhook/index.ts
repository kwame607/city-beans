// supabase/functions/paystack-webhook/index.ts
//
// Deploy with: supabase functions deploy paystack-webhook --no-verify-jwt
// (--no-verify-jwt is required — Paystack can't send a Supabase auth
// token, so the HMAC signature check below is what secures this
// instead of Supabase's normal per-request JWT check.)

async function hmacSha512Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY")!;
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Confirm this request actually came from Paystack before doing
  // anything else — anyone can POST to this URL otherwise.
  const expectedSignature = await hmacSha512Hex(paystackSecret, rawBody);
  if (expectedSignature !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return new Response("ignored", { status: 200 });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return new Response("missing reference", { status: 400 });
  }

  // Never trust the webhook body's own claim of success — re-verify
  // directly with Paystack's API using the secret key.
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${paystackSecret}` } }
  );
  const verifyJson = await verifyRes.json();

  if (!verifyJson.status || verifyJson.data?.status !== "success") {
    return new Response("not verified", { status: 200 });
  }

  const amountPesewas = verifyJson.data.amount;

  const sbHeaders = {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };

  const paymentRes = await fetch(
    `${supabaseUrl}/rest/v1/payments?reference=eq.${reference}&select=id,order_id,amount,status`,
    { headers: sbHeaders }
  );
  const payments = await paymentRes.json();
  const payment = payments[0];

  if (!payment) {
    return new Response("payment record not found", { status: 200 });
  }
  if (payment.status === "PAID") {
    return new Response("already processed", { status: 200 }); // idempotent — webhooks can retry
  }

  // Amount check — the payment row's amount came from the server-side
  // create_order()/init_payment() total, so this catches any mismatch
  // between what was actually charged and what the order says it costs.
  const expectedPesewas = Math.round(Number(payment.amount) * 100);
  if (amountPesewas !== expectedPesewas) {
    return new Response("amount mismatch", { status: 400 });
  }

  await fetch(`${supabaseUrl}/rest/v1/payments?id=eq.${payment.id}`, {
    method: "PATCH",
    headers: sbHeaders,
    body: JSON.stringify({
      status: "PAID",
      paid_at: new Date().toISOString(),
      raw_webhook: event,
    }),
  });

  await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${payment.order_id}`, {
    method: "PATCH",
    headers: sbHeaders,
    body: JSON.stringify({ status: "CONFIRMED" }),
  });

  return new Response("ok", { status: 200 });
});
