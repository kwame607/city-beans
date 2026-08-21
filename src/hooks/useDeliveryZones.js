// src/hooks/useDeliveryZones.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useDeliveryZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("id, name, fee")
        .eq("active", true)
        .order("name");

      if (cancelled) return;
      if (!error && data) {
        setZones(data.map((z) => ({ id: z.id, name: z.name, fee: Number(z.fee) })));
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { zones, loading };
}
