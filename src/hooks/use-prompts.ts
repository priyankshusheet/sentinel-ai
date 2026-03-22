import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type TrackedPrompt = Tables<"tracked_prompts"> & {
  latest_ranking?: Tables<"prompt_rankings"> | null;
};

export const usePrompts = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const promptsQuery = useQuery({
    queryKey: ["prompts", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Use a single joined query to get prompts and their latest ranking
      // We'll fetch all rankings and then filter for the latest in JS, 
      // or use a more complex Postgrest query if possible.
      // Supabase doesn't support a simple "limit 1 per group" in a single .select() easily without RPC.
      // However, we can fetch prompts and then fetch rankings separately but in a batch,
      // or fetch all rankings and reduce. Given "tracked prompts" is likely < 1000, 
      // fetching prompts then rankings is better than the current N+1 loop.
      
      const { data: prompts, error } = await supabase
        .from("tracked_prompts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!prompts) return [];

      // Batch fetch latest rankings for all these prompts
      const { data: rankings, error: rankingsError } = await supabase
        .from("prompt_rankings")
        .select("*")
        .in("prompt_id", prompts.map(p => p.id))
        .order("checked_at", { ascending: false });

      if (rankingsError) throw rankingsError;

      // Group rankings by prompt_id and take the most recent one
      const latestRankingsMap = (rankings || []).reduce((acc, curr) => {
        if (!acc[curr.prompt_id]) {
          acc[curr.prompt_id] = curr;
        }
        return acc;
      }, {} as Record<string, Tables<"prompt_rankings">>);

      return prompts.map(p => ({
        ...p,
        latest_ranking: latestRankingsMap[p.id] || null
      })) as TrackedPrompt[];
    },
    enabled: !!userId,
  });

  const addPromptMutation = useMutation({
    mutationFn: async (newPrompt: { query: string; category: string }) => {
      if (!userId) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("tracked_prompts")
        .insert({ user_id: userId, ...newPrompt })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts", userId] });
      toast.success("Prompt added!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tracked_prompts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts", userId] });
      toast.success("Prompt removed");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const analyzePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      // 1. Get prompt data
      const { data: prompt, error: promptError } = await supabase
        .from("tracked_prompts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (promptError) throw promptError;

      // 2. Call Python Backend
      const response = await fetch("http://localhost:8000/analyze/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.query, prompt_id: id, user_id: userId })
      });

      if (!response.ok) throw new Error("Backend analysis failed");
      const result = await response.json();

      // 3. Store result in Supabase
      const { error: insertError } = await supabase.from("prompt_rankings").insert({
        user_id: userId!,
        prompt_id: id,
        llm_platform: result.analysis.provider,
        visibility: result.analysis.analysis?.visibility || "mentioned", // Fallback if format varies
        confidence_score: result.analysis.analysis?.confidence_score || 0,
        citations_found: result.analysis.analysis?.citations_found || 0,
        ai_response: result.analysis.content
      });

      if (insertError) throw insertError;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts", userId] });
      toast.success("Analysis complete!");
    },
    onError: (error: any) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });

  return {
    prompts: promptsQuery.data || [],
    isLoading: promptsQuery.isLoading,
    isError: promptsQuery.isError,
    error: promptsQuery.error,
    addPrompt: addPromptMutation.mutateAsync,
    isAdding: addPromptMutation.isPending,
    deletePrompt: deletePromptMutation.mutateAsync,
    isDeleting: deletePromptMutation.isPending,
    analyzePrompt: analyzePromptMutation.mutateAsync,
    isAnalyzing: analyzePromptMutation.isPending,
  };
};
