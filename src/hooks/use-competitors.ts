import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCompetitors = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const competitorsQuery = useQuery({
    queryKey: ["competitors", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const benchmarkMutation = useMutation({
    mutationFn: async ({ brandDomain, competitors, prompts }: { brandDomain: string, competitors: string[], prompts: string[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/competitor-benchmark`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ brand_domain: brandDomain, competitors, prompts }),
      });

      if (!response.ok) throw new Error("Benchmark failed");
      return response.json();
    },
  });

  return {
    competitors: competitorsQuery.data || [],
    isLoading: competitorsQuery.isLoading,
    runBenchmark: benchmarkMutation.mutateAsync,
    isBenchmarking: benchmarkMutation.isPending,
  };
};
