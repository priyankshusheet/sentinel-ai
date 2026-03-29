import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SENTINEL_AI_KEY = Deno.env.get("SENTINEL_AI_KEY");
    if (!SENTINEL_AI_KEY) throw new Error("SENTINEL_AI_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt_id, query, brand_name, llm_platform } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const platform = llm_platform || "chatgpt";
    const brand = brand_name || "the user's brand";

    const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL") || "https://ai.gateway.sentinel-ai.dev/v1/chat/completions";
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENTINEL_AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI visibility analyst. When given a search query, analyze how a brand would likely appear in AI-generated responses from ${platform}. Evaluate visibility, sentiment, and citations.`,
          },
          {
            role: "user",
            content: `Analyze the query: "${query}"

For the brand "${brand}", provide a JSON analysis:
{
  "visibility": "mentioned" | "partial" | "not_mentioned",
  "confidence_score": 0-100,
  "citations_found": number (estimated citation sources),
  "sentiment": "positive" | "neutral" | "negative",
  "ai_response_summary": "Brief summary of how the AI would likely respond to this query and whether the brand would be mentioned",
  "recommendations": ["actionable tip 1", "actionable tip 2"]
}

Return ONLY valid JSON, no markdown.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_visibility",
              description: "Return the visibility analysis for a brand query",
              parameters: {
                type: "object",
                properties: {
                  visibility: { type: "string", enum: ["mentioned", "partial", "not_mentioned"] },
                  confidence_score: { type: "number" },
                  citations_found: { type: "number" },
                  sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                  ai_response_summary: { type: "string" },
                  recommendations: { type: "array", items: { type: "string" } },
                },
                required: ["visibility", "confidence_score", "citations_found", "sentiment", "ai_response_summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_visibility" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    let analysis;
    
    // Extract from tool call
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse content
      const content = aiResult.choices?.[0]?.message?.content || "";
      analysis = JSON.parse(content);
    }

    // Store ranking in database
    if (prompt_id) {
      await supabase.from("prompt_rankings").insert({
        user_id: user.id,
        prompt_id,
        llm_platform: platform,
        visibility: analysis.visibility,
        confidence_score: analysis.confidence_score,
        citations_found: analysis.citations_found,
        ai_response: analysis.ai_response_summary,
      });
    }

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-visibility error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
