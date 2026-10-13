// supabase/functions/verify-payment/index.ts
//
// Deploy WITHOUT --no-verify-jwt (default) — this one should only be
// callable by someone with a real logged-in Supabase session, unlike
// the public Paystack webhook.
//
// supabase functions deploy verify-payment
//
// This function is called from the admin page in a browser, on a different
// web address from Supabase. Browsers first send an OPTIONS "preflight"
// request and refuse to continue unless it is answered with CORS headers,
// so every response below carries them.

import { createClient } from "npm:@supabase/supabase-js@2";

// Pages that are allowed to call this function from a browser.
const ALLOWED_ORIGINS = [
  "https://kwame607.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

function corsFor(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  // Browser preflight — must succeed before the real request is sent.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization");

  if (!paystackSecret) {
    console.log("verify-payment: PAYSTACK_SECRET_KEY is not set in Edge Function secrets");
    return json({ error: "Payment key is not set up on the server" }, 500);
  }

  if (!authHeader) {
    return json({ error: "Not authenticated" }, 401);
  }

  // Acts as the calling admin (not a service-role bypass) — RLS still
  // applies, so this can only ever do what an admin is already allowed
  // to do via the dashboard.
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return json({ error: "Not authenticated" }, 401);
  }

  const { reference } = await req.json();
  if (!reference) {
    return json({ error: "Missing reference" }, 400);
  }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${paystackSecret}` },
  });
  const verifyJson = await verifyRes.json();

  if (!verifyJson.status || verifyJson.data?.status !== "success") {
    console.log("verify-payment: Paystack did not report success", verifyJson.message, verifyJson.data?.status);
    return json({ result: "not_paid", paystackStatus: verifyJson.data?.status || "unknown" });
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, order_id, amount, status")
    .eq("reference", reference)
    .single();

  if (!payment) {
    console.log("verify-payment: no payments row for reference", reference);
    return json({ error: "Payment record not found" }, 404);
  }
  if (payment.status === "PAID") {
    return json({ result: "already_confirmed" });
  }

  const expectedPesewas = Math.round(Number(payment.amount) * 100);
  if (verifyJson.data.amount !== expectedPesewas) {
    console.log("verify-payment: amount mismatch", verifyJson.data.amount, expectedPesewas);
    return json({ error: "Amount mismatch — needs manual review" }, 400);
  }

  await supabase.from("payments").update({
    status: "PAID",
    paid_at: new Date().toISOString(),
    raw_webhook: verifyJson,
  }).eq("id", payment.id);

  await supabase.from("orders").update({ status: "CONFIRMED" }).eq("id", payment.order_id);

  return json({ result: "confirmed" });
});
