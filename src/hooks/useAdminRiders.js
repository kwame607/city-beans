// src/hooks/useAdminRiders.js
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("riders")
      .select("id, name, phone, active")
      .order("name");

    if (!error && data) setRiders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addRider = useCallback(
    async (form) => {
      const { error } = await supabase
        .from("riders")
        .insert({ name: form.name, phone: form.phone, active: true });
      if (!error) load();
    },
    [load]
  );

  const toggleActive = useCallback(
    async (id) => {
      const current = riders.find((r) => r.id === id);
      if (!current) return;
      const next = !current.active;
      setRiders((rs) => rs.map((r) => (r.id === id ? { ...r, active: next } : r))); // optimistic
      const { error } = await supabase.from("riders").update({ active: next }).eq("id", id);
      if (error) load();
    },
    [riders, load]
  );

  return { riders, loading, addRider, toggleActive, refetch: load };
}
