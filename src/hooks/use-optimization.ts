import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOptimization = (userId?: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const generateWeeklyTasks = async (url: string) => {
    if (!userId || !url) return null;
    setIsGenerating(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/weekly-tasks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ user_id: userId, url })
      });
      const data = await response.json();
      if (data.status === "success") {
        return data.tasks;
      }
      throw new Error(data.detail || "Failed to generate tasks");
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const runTechnicalAudit = async (url: string) => {
    if (!url) return null;
    setIsAuditing(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/technical-audit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (data.status === "success") {
        return data.report;
      }
      throw new Error(data.detail || "Audit failed");
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setIsAuditing(false);
    }
  };

  const generateContentFix = async (topic: string, context: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/generate-content`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ topic, website_context: context })
      });
      const data = await response.json();
      return data.generated_content;
    } catch (e: any) {
      toast.error("Content generation failed");
      return null;
    }
  };

  return {
    generateWeeklyTasks,
    runTechnicalAudit,
    generateContentFix,
    isGenerating,
    isAuditing
  };
};
