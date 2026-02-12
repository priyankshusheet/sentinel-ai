import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Zap, CheckCircle, Clock, AlertTriangle, ArrowRight, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OptTask {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  ai_suggestion: string | null;
  target_url: string | null;
  impact_score: number | null;
  created_at: string;
}

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive",
  high: "bg-warning/20 text-warning",
  medium: "bg-primary/20 text-primary",
  low: "bg-muted text-muted-foreground",
};

const categoryLabels: Record<string, string> = {
  schema: "Schema Markup",
  content_gap: "Content Gap",
  technical: "Technical SEO",
  authority: "Brand Authority",
  general: "General",
};

export default function Optimization() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<OptTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [generating, setGenerating] = useState(false);

  const fetchTasks = async () => {
    if (!user) return;
    const { data } = await supabase.from("optimization_tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("optimization_tasks").update({ status, completed_at: status === "completed" ? new Date().toISOString() : null }).eq("id", id);
    toast.success(status === "completed" ? "Task completed!" : "Task updated");
    fetchTasks();
  };

  const generateTasks = async () => {
    if (!user) return;
    setGenerating(true);
    // Generate sample AEO tasks (will be replaced with AI-powered generation)
    const sampleTasks = [
      { title: "Add FAQ Schema to pricing page", description: "Adding FAQ structured data helps AI models extract answers directly from your pricing page.", category: "schema", priority: "high", ai_suggestion: "Add JSON-LD FAQ schema markup covering common pricing questions. This increases the chance of being cited when users ask about pricing.", impact_score: 85 },
      { title: "Update About page for brand authority", description: "Your About page lacks key brand signals that LLMs look for when deciding to recommend your product.", category: "authority", priority: "medium", ai_suggestion: "Add founding story, team credentials, awards, and customer logos. Include specific metrics like '10,000+ customers' to boost authority signals.", impact_score: 72 },
      { title: "Fill content gap: comparison pages", description: "No content exists for '[Your Brand] vs [Competitor]' queries that LLMs frequently encounter.", category: "content_gap", priority: "critical", ai_suggestion: "Create detailed comparison pages for your top 3 competitors. Include feature tables, pricing comparison, and real user testimonials.", impact_score: 92 },
      { title: "Add HowTo schema to documentation", description: "Your docs lack structured data that helps AI understand step-by-step processes.", category: "technical", priority: "medium", ai_suggestion: "Implement HowTo schema on your top 10 documentation pages. This helps LLMs provide accurate how-to answers citing your docs.", impact_score: 68 },
      { title: "Optimize meta descriptions for AI", description: "Current meta descriptions are too short and lack the context LLMs need.", category: "general", priority: "low", ai_suggestion: "Rewrite meta descriptions to be 150-160 chars, including your brand name, key value prop, and target use case in natural language.", impact_score: 45 },
    ];

    for (const task of sampleTasks) {
      await supabase.from("optimization_tasks").insert({ ...task, user_id: user.id, status: "pending" });
    }
    toast.success("Generated weekly AEO tasks!");
    setGenerating(false);
    fetchTasks();
  };

  const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Optimization</h1>
            <p className="text-muted-foreground mt-1">Schema audits, content gaps & weekly AEO to-do steps</p>
          </div>
          <Button onClick={generateTasks} disabled={generating} className="gap-2">
            <Lightbulb className="h-4 w-4" /> {generating ? "Generating..." : "Generate Weekly Tasks"}
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Total Tasks</p><p className="text-2xl font-bold text-foreground">{tasks.length}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning">{pendingCount}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-success">{completedCount}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Completion Rate</p><p className="text-2xl font-bold text-primary">{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</p></div>
        </div>

        <div className="flex gap-2">
          {["all", "pending", "in_progress", "completed", "dismissed"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f.replace("_", " ")}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No optimization tasks yet. Generate your weekly AEO to-do list!</p>
            <Button onClick={generateTasks}>Generate Tasks</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <motion.div key={task.id} className="bg-card rounded-xl border border-border p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={cn("text-xs", priorityColors[task.priority])}>{task.priority}</Badge>
                      <Badge variant="outline" className="text-xs">{categoryLabels[task.category] || task.category}</Badge>
                      {task.impact_score && <span className="text-xs text-muted-foreground">Impact: {task.impact_score}/100</span>}
                    </div>
                    <h3 className={cn("font-semibold text-foreground mb-1", task.status === "completed" && "line-through opacity-60")}>{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    {task.ai_suggestion && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1"><Lightbulb className="h-3 w-3 text-primary" /><span className="text-xs font-medium text-primary">AI Suggestion</span></div>
                        <p className="text-sm text-muted-foreground">{task.ai_suggestion}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {task.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(task.id, "in_progress")} className="gap-1"><Clock className="h-3 w-3" /> Start</Button>
                        <Button size="sm" onClick={() => updateStatus(task.id, "completed")} className="gap-1"><CheckCircle className="h-3 w-3" /> Done</Button>
                      </>
                    )}
                    {task.status === "in_progress" && (
                      <Button size="sm" onClick={() => updateStatus(task.id, "completed")} className="gap-1"><CheckCircle className="h-3 w-3" /> Complete</Button>
                    )}
                    {task.status !== "dismissed" && task.status !== "completed" && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(task.id, "dismissed")}><X className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
