// src/hooks/usePaystackPayment.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector("script[data-paystack]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.dataset.paystack = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}

/**
 * phase:
 *  idle        — nothing happening yet
 *  opening     — starting payment / loading the popup
 *  confirming  — popup closed with a completed charge, waiting on the webhook
 *  done        — webhook confirmed, order is CONFIRMED — confirmedOrder is set
 *  not_completed — customer closed the popup without paying
 *  slow        — still waiting after ~30s (webhook delayed, not necessarily failed)
 *  error       — something failed outright (couldn't start payment, script didn't load)
 */
export function usePaystackPayment() {
  const [phase, setPhase] = useState("idle");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState("");

  async function poll(orderNumber, phone, attempt) {
    const { data } = await supabase.rpc("get_order_status", {
      p_order_number: orderNumber,
      p_phone: phone,
    });

    if (data && data.status !== "PENDING") {
      setConfirmedOrder(data);
      setPhase("done");
      return;
    }
    if (attempt >= 12) {
      // ~30s of polling — the order is safely saved either way, this
      // just means the webhook hasn't landed yet.
      setPhase("slow");
      return;
    }
    setTimeout(() => poll(orderNumber, phone, attempt + 1), 2500);
  }

  async function payForOrder({ orderId, orderNumber, phone, email }) {
    setPhase("opening");
    setError("");

    const { data: initData, error: initError } = await supabase.rpc("init_payment", {
      p_order_id: orderId,
    });

    if (initError || !initData) {
      setPhase("error");
      setError(initError?.message || "Couldn't start payment.");
      return;
    }

    try {
      await loadPaystackScript();
    } catch {
      setPhase("error");
      setError("Payment system didn't load. Check your connection and try again.");
      return;
    }

    const resolvedEmail = email?.trim() || `${phone.replace(/\D/g, "")}@guest.citybeans.app`;

    window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: resolvedEmail,
      amount: Math.round(Number(initData.amount) * 100), // pesewas
      currency: "GHS",
      ref: initData.reference,
      callback: () => {
        // This fires client-side the moment Paystack's popup reports
        // success — it is NOT treated as truth. We wait for the
        // webhook-confirmed order status instead.
        setPhase("confirming");
        poll(orderNumber, phone, 0);
      },
      onClose: () => {
        setPhase((p) => (p === "confirming" || p === "done" ? p : "not_completed"));
      },
    }).openIframe();
  }

  function reset() {
    setPhase("idle");
    setConfirmedOrder(null);
    setError("");
  }

  return { phase, confirmedOrder, error, payForOrder, reset };
}
