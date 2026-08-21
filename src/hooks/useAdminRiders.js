// src/hooks/useAdminRiders.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("riders")
      .select("id, name, phone, active")
      .order("name")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setRiders(data);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { riders, loading };
}
