import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useProperties() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  // true only until the very first fetch finishes
  const [loading, setLoading] = useState(true);
  // true only while the user pulls to refresh
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = useCallback(async () => {
    const [featuredRes, recommendedRes] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false }),
    ]);

    if (featuredRes.error) console.warn(featuredRes.error.message);
    if (recommendedRes.error) console.warn(recommendedRes.error.message);

    setFeatured((featuredRes.data as Property[]) ?? []);
    setRecommended((recommendedRes.data as Property[]) ?? []);
    setLoading(false);
  }, []);

  // silent refetch every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [fetchProperties]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  }, [fetchProperties]);

  return { featured, recommended, loading, refreshing, refresh };
}
