// src/hooks/useMenuData.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useMenuData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, price, includes, icon, note, popular, category_id, image_url,
          category:categories ( slug ),
          product_extras ( extra:extras ( id, name, price ) )
        `)
        .eq("available", true)
        .order("sort_order");

      if (cancelled) return;
      if (error) { setError(error); setLoading(false); return; }

      const shaped = data.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category?.slug,
        includes: p.includes || [],
        icon: p.icon || "🍽️",
        imageUrl: p.image_url || null,
        note: p.note,
        popular: p.popular,
        extraIds: (p.product_extras || []).map((pe) => pe.extra.id),
        extrasList: (p.product_extras || []).map((pe) => ({
          id: pe.extra.id,
          name: pe.extra.name,
          price: Number(pe.extra.price),
        })),
      }));

      setProducts(shaped);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}
