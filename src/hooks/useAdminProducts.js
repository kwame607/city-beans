// src/hooks/useAdminProducts.js
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [{id, slug}]
  const [extrasMaster, setExtrasMaster] = useState([]); // [{id, name, price}]
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [productsRes, categoriesRes, extrasRes] = await Promise.all([
      supabase
        .from("products")
        .select(`
          id, name, price, available, category_id,
          category:categories ( slug ),
          product_extras ( extra_id )
        `)
        .order("sort_order"),
      supabase.from("categories").select("id, slug"),
      supabase.from("extras").select("id, name, price").order("name"),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (extrasRes.data) {
      setExtrasMaster(extrasRes.data.map((e) => ({ ...e, price: Number(e.price) })));
    }
    if (productsRes.data) {
      setProducts(
        productsRes.data.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          available: p.available,
          category: p.category?.slug || "",
          extraIds: (p.product_extras || []).map((pe) => pe.extra_id),
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoryIdForSlug = useCallback(
    (slug) => categories.find((c) => c.slug === slug)?.id,
    [categories]
  );

  const syncExtras = async (productId, extraIds) => {
    await supabase.from("product_extras").delete().eq("product_id", productId);
    if (extraIds.length > 0) {
      await supabase
        .from("product_extras")
        .insert(extraIds.map((extra_id) => ({ product_id: productId, extra_id })));
    }
  };

  const addProduct = useCallback(
    async (form) => {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: form.name,
          price: form.price,
          available: form.available,
          category_id: categoryIdForSlug(form.category),
        })
        .select("id")
        .single();

      if (error || !data) return;
      await syncExtras(data.id, form.extraIds || []);
      load();
    },
    [categoryIdForSlug, load]
  );

  const updateProduct = useCallback(
    async (id, form) => {
      await supabase
        .from("products")
        .update({
          name: form.name,
          price: form.price,
          available: form.available,
          category_id: categoryIdForSlug(form.category),
        })
        .eq("id", id);

      await syncExtras(id, form.extraIds || []);
      load();
    },
    [categoryIdForSlug, load]
  );

  const deleteProduct = useCallback(
    async (id) => {
      setProducts((ps) => ps.filter((p) => p.id !== id)); // optimistic
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) load();
    },
    [load]
  );

  const toggleAvailable = useCallback(
    async (id) => {
      const current = products.find((p) => p.id === id);
      if (!current) return;
      const next = !current.available;
      setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, available: next } : p))); // optimistic
      const { error } = await supabase.from("products").update({ available: next }).eq("id", id);
      if (error) load();
    },
    [products, load]
  );

  return {
    products,
    categories,
    extrasMaster,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailable,
  };
}
