// src/hooks/useCreateOrder.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Builds the RPC payload from cart + checkout form state and calls
 * the server-side create_order() function. Prices are never sent —
 * only product/extra IDs and quantities. The database looks up the
 * real, current price for everything.
 */
export function useCreateOrder() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createOrder({ cart, method, zoneId, zoneName, form }) {
    setSubmitting(true);
    setError("");

    const payload = {
      guest_name: form.fullName,
      guest_phone: form.phone,
      guest_email: form.email || null,
      method: method === "delivery" ? "DELIVERY" : "PICKUP",
      zone_id: method === "delivery" ? zoneId : null,
      address:
        method === "delivery"
          ? {
              region: "Ashanti Region",
              city: "Kumasi",
              area: zoneName,
              ghana_post_gps: form.ghanaPostGPS,
              house_desc: form.houseDesc,
              instructions: form.instructions,
            }
          : null,
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.qty,
        extra_ids: (item.extras || []).map((e) => e.id),
      })),
    };

    const { data, error } = await supabase.rpc("create_order", { payload });

    setSubmitting(false);

    if (error) {
      // Postgres exceptions raised with `raise exception` land here as
      // error.message — these are the customer-facing validation errors
      // (e.g. "Delivery zone is required", "Minimum order is GH₵50").
      setError(error.message || "Something went wrong placing your order.");
      return null;
    }

    return data; // { order_id, order_number, subtotal, delivery_fee, total }
  }

  return { createOrder, submitting, error };
}
