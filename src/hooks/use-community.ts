import { useQuery } from "@tanstack/react-query";

export const useCommunity = (keywords: string[]) => {
  return useQuery({
    queryKey: ["community-intel", keywords],
    queryFn: async () => {
      if (keywords.length === 0) return [];
      
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/community-intel`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) throw new Error("Reddit monitoring failed");
      const data = await response.json();
      return data.posts;
    },
    enabled: keywords.length > 0,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
