// src/hooks/useAdminDelivery.js
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminDelivery() {
  const [zones, setZones] = useState([]);
  const [settings, setSettingsState] = useState({
    pickupEnabled: true,
    deliveryEnabled: true,
    minOrder: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [zonesRes, settingsRes] = await Promise.all([
      supabase.from("delivery_zones").select("id, name, fee, active").order("name"),
      supabase.from("settings").select("*").eq("id", 1).single(),
    ]);

    if (zonesRes.data) {
      setZones(zonesRes.data.map((z) => ({ ...z, fee: Number(z.fee) })));
    }
    if (settingsRes.data) {
      setSettingsState({
        pickupEnabled: settingsRes.data.pickup_enabled,
        deliveryEnabled: settingsRes.data.delivery_enabled,
        minOrder: Number(settingsRes.data.min_order_amount),
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addZone = useCallback(
    async (name, fee) => {
      const { error } = await supabase.from("delivery_zones").insert({ name, fee, active: true });
      if (!error) load();
    },
    [load]
  );

  const removeZone = useCallback(
    async (id) => {
      setZones((zs) => zs.filter((z) => z.id !== id)); // optimistic
      const { error } = await supabase.from("delivery_zones").delete().eq("id", id);
      if (error) load();
    },
    [load]
  );

  const updateZoneFee = useCallback(async (id, fee) => {
    setZones((zs) => zs.map((z) => (z.id === id ? { ...z, fee } : z))); // optimistic
    await supabase.from("delivery_zones").update({ fee }).eq("id", id);
  }, []);

  const toggleZone = useCallback(
    async (id) => {
      const current = zones.find((z) => z.id === id);
      if (!current) return;
      const next = !current.active;
      setZones((zs) => zs.map((z) => (z.id === id ? { ...z, active: next } : z))); // optimistic
      const { error } = await supabase.from("delivery_zones").update({ active: next }).eq("id", id);
      if (error) load();
    },
    [zones, load]
  );

  // Accepts a partial update, e.g. { pickupEnabled: false }
  const updateSettings = useCallback(
    async (patch) => {
      setSettingsState((s) => ({ ...s, ...patch })); // optimistic

      const dbPatch = {};
      if ("pickupEnabled" in patch) dbPatch.pickup_enabled = patch.pickupEnabled;
      if ("deliveryEnabled" in patch) dbPatch.delivery_enabled = patch.deliveryEnabled;
      if ("minOrder" in patch) dbPatch.min_order_amount = patch.minOrder;

      const { error } = await supabase.from("settings").update(dbPatch).eq("id", 1);
      if (error) load();
    },
    [load]
  );

  return {
    zones,
    settings,
    loading,
    addZone,
    removeZone,
    updateZoneFee,
    toggleZone,
    updateSettings,
  };
}
