// src/hooks/useOrderTracking.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useOrderTracking() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function trackOrder(orderNumber, phone) {
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error } = await supabase.rpc("get_order_status", {
      p_order_number: orderNumber,
      p_phone: phone,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "We couldn't find that order.");
      return;
    }

    setOrder(data);
  }

  function reset() {
    setOrder(null);
    setError("");
  }

  return { order, loading, error, trackOrder, reset };
}
