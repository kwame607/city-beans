// src/hooks/useAdminOrders.js
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Supabase/PostgREST returns one-to-one joins as either an object or a
// single-item array depending on version — normalize either way.
function one(rel) {
  return Array.isArray(rel) ? rel[0] : rel;
}

function shapeOrder(o) {
  const address = one(o.delivery_addresses);
  const delivery = one(o.deliveries);

  return {
    id: o.id, // real UUID — used for updates, React keys
    orderNumber: o.order_number, // "CB-1049" — used for display
    customer: o.guest_name,
    phone: o.guest_phone,
    method: (o.method || "").toLowerCase(), // 'delivery' | 'pickup'
    area: address?.area || "—",
    items: (o.order_items || [])
      .map((i) => `${i.quantity} × ${i.name_snapshot}`)
      .join(", "),
    total: Number(o.total),
    // There's no Payment table yet (Paystack isn't wired up), so every
    // real order shows PENDING here until that's connected.
    paymentStatus: "PENDING",
    status: o.status,
    riderId: delivery?.rider_id || null,
    placedAt: timeAgo(o.created_at),
  };
}

const SELECT = `
  id, order_number, guest_name, guest_phone, method, status, total, created_at,
  delivery_addresses ( area ),
  order_items ( name_snapshot, quantity ),
  deliveries ( rider_id )
`;

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(SELECT)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setOrders(data.map(shapeOrder));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // Live-refresh whenever an order or delivery changes — e.g. a new
    // order comes in from the storefront, or a rider updates status.
    const channel = supabase
      .channel("admin-orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const changeStatus = useCallback(
    async (orderId, status) => {
      setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status } : o))); // optimistic
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) load(); // revert to real state if the write failed
    },
    [load]
  );

  const assignRider = useCallback(
    async (orderId, riderId) => {
      setOrders((os) =>
        os.map((o) =>
          o.id === orderId
            ? { ...o, riderId, status: riderId ? "RIDER_ASSIGNED" : o.status }
            : o
        )
      ); // optimistic

      const { error: deliveryError } = await supabase.from("deliveries").upsert(
        {
          order_id: orderId,
          rider_id: riderId,
          assigned_at: riderId ? new Date().toISOString() : null,
        },
        { onConflict: "order_id" }
      );

      if (!deliveryError && riderId) {
        await supabase.from("orders").update({ status: "RIDER_ASSIGNED" }).eq("id", orderId);
      }

      if (deliveryError) load();
    },
    [load]
  );

  return { orders, loading, error, changeStatus, assignRider, refetch: load };
}
