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
    mutationFn: async ({ id, parallel = false, platforms, use_cache = true }: { id: string; parallel?: boolean; platforms?: string[]; use_cache?: boolean }) => {
      // 1. Get prompt data
      const { data: prompt, error: promptError } = await supabase
        .from("tracked_prompts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (promptError) throw promptError;

      // 2. Call Python Backend with Auth
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/analyze/visibility`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          prompt: prompt.query, 
          prompt_id: id, 
          user_id: userId,
          parallel,
          platforms,
          use_cache
        })
      });

      if (!response.ok) throw new Error("Backend analysis failed");
      const result = await response.json();

      // 3. Store result in Supabase
      const analyses = result.analyses || [result.analysis];
      
      for (const analysis of analyses) {
        const { error: insertError } = await supabase.from("prompt_rankings").insert({
          user_id: userId!,
          prompt_id: id,
          llm_platform: analysis.provider,
          visibility: analysis.analysis?.visibility || "mentioned",
          confidence_score: analysis.analysis?.visibility_score || analysis.analysis?.confidence_score || 0,
          citations_found: (analysis.analysis?.citations || []).length,
          ai_response: analysis.content
        });

        if (insertError) throw insertError;

        // 4. Auto-populate citations if found
        const citations = analysis.analysis?.citations || [];
        if (citations.length > 0) {
          const citationRows = citations.map((cit: any) => ({
            user_id: userId!,
            source_name: typeof cit === 'string' ? cit : (cit.name || cit.url),
            source_url: typeof cit === 'string' ? cit : cit.url,
            sentiment: analysis.analysis?.sentiment || 'neutral'
          }));

          await supabase.from("citations").upsert(citationRows, {
            onConflict: 'source_url'
          });
        }
      }

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
