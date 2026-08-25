// supabase/functions/verify-payment/index.ts
//
// Deploy WITHOUT --no-verify-jwt (default) — this one should only be
// callable by someone with a real logged-in Supabase session, unlike
// the public Paystack webhook.
//
// supabase functions deploy verify-payment

import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY")!;
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  // Acts as the calling admin (not a service-role bypass) — RLS still
  // applies, so this can only ever do what an admin is already allowed
  // to do via the dashboard.
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { reference } = await req.json();
  if (!reference) {
    return new Response(JSON.stringify({ error: "Missing reference" }), { status: 400 });
  }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${paystackSecret}` },
  });
  const verifyJson = await verifyRes.json();

  if (!verifyJson.status || verifyJson.data?.status !== "success") {
    return new Response(
      JSON.stringify({ result: "not_paid", paystackStatus: verifyJson.data?.status || "unknown" }),
      { status: 200 }
    );
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, order_id, amount, status")
    .eq("reference", reference)
    .single();

  if (!payment) {
    return new Response(JSON.stringify({ error: "Payment record not found" }), { status: 404 });
  }
  if (payment.status === "PAID") {
    return new Response(JSON.stringify({ result: "already_confirmed" }), { status: 200 });
  }

  const expectedPesewas = Math.round(Number(payment.amount) * 100);
  if (verifyJson.data.amount !== expectedPesewas) {
    return new Response(JSON.stringify({ error: "Amount mismatch — needs manual review" }), { status: 400 });
  }

  await supabase.from("payments").update({
    status: "PAID",
    paid_at: new Date().toISOString(),
    raw_webhook: verifyJson,
  }).eq("id", payment.id);

  await supabase.from("orders").update({ status: "CONFIRMED" }).eq("id", payment.order_id);

  return new Response(JSON.stringify({ result: "confirmed" }), { status: 200 });
});
