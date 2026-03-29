import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquare, ArrowRight, Play, BarChart3, Plus, Sparkles, Loader2, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PromptTesting() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");

  const runTest = () => {
    if (!variantA.trim() || !variantB.trim()) {
      toast.error("Please provide both variants for comparison.");
      return;
    }
    setIsTesting(true);
    setTestResults(null);
    
    setTimeout(() => {
      setIsTesting(false);
      setTestResults({
        delta: 14.5,
        winner: "Variant B",
        timestamp: new Date().toISOString(),
        metrics: [
          { name: "Visibility", a: 72, b: 84 },
          { name: "Citation Authority", a: 65, b: 68 },
          { name: "Entity Trust", a: 58, b: 76 }
        ]
      });
      toast.success("A/B Test Simulation Complete", {
        description: "Variant B shows a significant visibility lift.",
        icon: <Sparkles className="h-4 w-4 text-cyan-400" />
      });
    }, 3000);
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight italic uppercase">A/B Prompt Testing</h1>
              <p className="text-muted-foreground mt-1 font-medium">Quantify the impact of semantic phrasing on LLM visibility</p>
            </div>
            <Badge variant="outline" className="px-4 py-2 border-cyan-500/20 text-cyan-400 bg-cyan-500/5 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Simulation Engine v1.0
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Variant A [Original]
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent>The control variant currently being monitored.</TooltipContent>
                      </Tooltip>
                  </div>
                  <textarea 
                      value={variantA}
                      onChange={(e) => setVariantA(e.target.value)}
                      className="w-full h-40 bg-secondary/20 border border-white/5 rounded-2xl p-6 text-sm text-[#8ba3c7] focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-serif leading-relaxed"
                      placeholder="e.g., What are the best enterprise SEO tools for 2026?"
                  ></textarea>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Variant B [Challenger]
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent>The experimental phrasing to test for lift.</TooltipContent>
                      </Tooltip>
                  </div>
                  <textarea 
                      value={variantB}
                      onChange={(e) => setVariantB(e.target.value)}
                      className="w-full h-40 bg-secondary/20 border border-white/5 rounded-2xl p-6 text-sm text-[#8ba3c7] focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-serif leading-relaxed"
                      placeholder="e.g., Recommend top-tier B2B Generative Engine Optimization platforms."
                  ></textarea>
              </motion.div>
          </div>

          <div className="flex justify-center pt-4">
              <Button 
                onClick={runTest} 
                disabled={isTesting}
                className="gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black px-12 py-7 rounded-[24px] shadow-[0_0_30px_rgba(168,85,247,0.4)] border-0 transition-all hover:scale-105 uppercase tracking-[0.2em] text-xs"
              >
                  {isTesting ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Delta...</> : <><Play className="h-5 w-5 fill-current" /> Initialize Comparison</>}
              </Button>
          </div>

          <div className="space-y-8 pt-12 border-t border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-cyan-400" /></div>
                  Strategic Delta Analysis
              </h2>
              
              <AnimatePresence mode="wait">
                {!testResults ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <EmptyState 
                      icon={MessageSquare}
                      title="No Analysis Data"
                      description="Input two phrasing variants and initialize the simulation to quantify the expected visibility lift."
                    />
                  </motion.div>
                ) : (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-card rounded-[32px] border border-border p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"><TrendingUp size={100} /></div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#556987] mb-8">Metric Delta Breakdown</h3>
                        <div className="space-y-10">
                            {testResults.metrics.map((m: any) => (
                                <div key={m.name} className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-muted-foreground">{m.name}</span>
                                        <span className="text-cyan-400">{m.b}% vs {m.a}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-secondary/30 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-cyan-400/20" style={{ width: `${m.a}%` }} />
                                        <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]" style={{ width: `${m.b - m.a}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-[32px] border border-cyan-500/30 p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-cyan-900/20">
                        <div className="h-20 w-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
                            <TrendingUp className="h-10 w-10 text-cyan-400" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 mb-2">Recommended Winner</h4>
                        <p className="text-3xl font-black text-white mb-6 tracking-tighter italic uppercase">{testResults.winner}</p>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full border border-white/10">
                            <div className="text-5xl font-black text-cyan-400 mb-1">+{testResults.delta}%</div>
                            <div className="text-[10px] uppercase font-black tracking-widest text-[#8ba3c7]">EST. VISIBILITY LIFT</div>
                        </div>
                        <Button className="w-full mt-8 bg-white text-black font-black uppercase tracking-widest text-[10px] h-11 rounded-xl hover:bg-cyan-400 transition-colors shadow-xl">Deploy Phrasing</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
