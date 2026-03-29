import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardMetrics = (userId?: string) => {
  const [metrics, setMetrics] = useState({
    trackedPrompts: 0,
    activeCitations: 0,
    contentGaps: 0,
    competitors: 0,
    visibilityScore: 0,
    loading: true
  });

  const fetchMetrics = async () => {
    if (!userId) return;
    
    try {
      // 1. Get tracked prompts count
      const { count: promptsCount } = await supabase
        .from("tracked_prompts")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId);

      // 2. Get citations count
      const { count: citationsCount } = await supabase
        .from("citations")
        .select("*", { count: 'exact', head: true });

      // 3. Get gaps count (from optimization_tasks where category is content_gap)
      const { count: gapsCount } = await supabase
        .from("optimization_tasks")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)
        .eq("category", "content_gap");

      // 4. Get latest visibility score (confidence_score in prompt_rankings)
      const { data: rankings } = await supabase
        .from("prompt_rankings")
        .select("confidence_score")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      // 5. Get competitors count
      const { count: competitorsCount } = await supabase
        .from("competitors")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId);

      setMetrics({
        trackedPrompts: promptsCount || 0,
        activeCitations: citationsCount || 0,
        contentGaps: gapsCount || 0,
        competitors: competitorsCount || 0,
        visibilityScore: rankings?.[0]?.confidence_score || 0,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      setMetrics(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [userId]);

  return metrics;
};
