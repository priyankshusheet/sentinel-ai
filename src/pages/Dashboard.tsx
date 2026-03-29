import { motion } from "framer-motion";
import { CommunityIntelPanel } from "@/components/dashboard/CommunityIntelPanel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIVisibilityScore } from "@/components/dashboard/AIVisibilityScore";
import { ShareOfVoice } from "@/components/dashboard/ShareOfVoice";
import { CompetitorCard } from "@/components/dashboard/CompetitorCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PromptCoverageChart } from "@/components/dashboard/PromptCoverageChart";
import { SentimentIndicator } from "@/components/dashboard/SentimentIndicator";
import { CitationNodeMap } from "@/components/dashboard/CitationNodeMap";
import { VisibilityTrendChart } from "@/components/dashboard/VisibilityTrendChart";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Sparkles, Zap, Bell, Search, FileText, Users, Activity, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const competitors = [
  { rank: 1, name: "Your Brand", domain: "yourbrand.com", score: 78, change: 5.2, isYou: true },
  { rank: 2, name: "RankIQ", domain: "rankiq.com", score: 72, change: -2.1 },
  { rank: 3, name: "BrightEdge", domain: "brightedge.io", score: 68, change: 3.8 },
  { rank: 4, name: "Surfer SEO", domain: "surferseo.ai", score: 54, change: 0 },
  { rank: 5, name: "Clearscope", domain: "clearscope.com", score: 41, change: -4.5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();
  const metrics = useDashboardMetrics(user?.id);

  return (
    <DashboardLayout>
      <TooltipProvider>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Intelligence Center</h1>
              <p className="text-muted-foreground mt-1 text-sm">Real-time visibility monitoring & predictive GEO analytics</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 hidden sm:flex">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">System Ready</span>
                </div>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Badge variant="outline" className="gap-1 border-cyan-500/30 text-cyan-400 bg-cyan-950/20 cursor-help">
                      <Activity size={10} className="animate-pulse" /> Live Tracking
                   </Badge>
                 </TooltipTrigger>
                 <TooltipContent className="bg-background border-border text-xs">
                   Connected to Sentinel Cloud Engine v2.4. Pulse interval: 15s.
                 </TooltipContent>
               </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button aria-label="System Notifications" className="p-2.5 rounded-xl bg-secondary/50 border border-white/5 relative hover:bg-secondary transition-colors group">
                       <Bell size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                       <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-background"></span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border-border text-xs">
                    View active alerts and system logs
                  </TooltipContent>
                </Tooltip>
            </div>
          </motion.div>

          {/* Quick metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Tracked Prompts" value={metrics.trackedPrompts.toString()} icon={Search} variant="primary" />
            <MetricCard title="Active Citations" value={metrics.activeCitations.toString()} icon={FileText} variant="success" />
            <MetricCard title="AEO Fixes" value={metrics.contentGaps.toString()} icon={Zap} variant="warning" />
            <MetricCard title="Industry Rank" value="#1" icon={TrendingUp} description="Top 5% of B2B SaaS" />
          </motion.div>

          {/* Predictive & Real-time Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/5">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <TrendingUp size={120} className="text-cyan-400" />
                  </div>
                  <div className="flex items-center justify-between mb-8">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                               <Sparkles className="h-4 w-4 text-cyan-400" /> Predictive Visibility
                            </h3>
                            <Tooltip>
                              <TooltipTrigger asChild><Info size={12} className="text-muted-foreground cursor-help" /></TooltipTrigger>
                              <TooltipContent className="max-w-[200px] text-[11px] leading-relaxed">Forecasted visibility scores based on historical trend lines and market volatility coefficients.</TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-muted-foreground">AI-forecasted trend based on historical 90-day data</p>
                      </div>
                      <Badge variant="outline" className="border-cyan-500/20 text-cyan-400 bg-cyan-500/5">92% Confidence</Badge>
                  </div>
                  <div className="h-48 flex items-end gap-2 mb-6 px-1">
                     {[45, 52, 48, 61, 68, 72, 78, 81, 85].map((h, i) => (
                         <Tooltip key={i}>
                           <TooltipTrigger asChild>
                             <div className="flex-1 bg-gradient-to-t from-cyan-600/20 to-cyan-400/40 rounded-t-lg transition-all hover:to-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer" style={{ height: `${h}%` }}></div>
                           </TooltipTrigger>
                           <TooltipContent className="text-[10px] bg-cyan-900 border-cyan-500/30 text-white font-bold">HISTORICAL: {h}%</TooltipContent>
                         </Tooltip>
                     ))}
                     {[88, 91, 93, 94, 95].map((h, i) => (
                         <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/10 to-purple-400/20 border-t-2 border-dashed border-purple-500/50 rounded-t-lg relative group/bar" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-purple-900 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30 text-white font-bold whitespace-nowrap z-10">{h}% EST.</div>
                         </div>
                     ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground pt-4 border-t border-white/5">
                      <span className="flex items-center gap-2 tracking-widest"><div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(0,212,255,0.5)]" /> Historical</span>
                      <span className="text-purple-400 flex items-center gap-2 tracking-widest">Forecast <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" /></span>
                  </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                  <AlertsPanel />
              </motion.div>
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="hover:scale-[1.01] transition-transform duration-300">
              <AIVisibilityScore score={metrics.visibilityScore} change={5.2} trend="up" />
            </motion.div>
            <motion.div variants={itemVariants} className="hover:scale-[1.01] transition-transform duration-300">
              <ShareOfVoice />
            </motion.div>
            <motion.div variants={itemVariants} className="hover:scale-[1.01] transition-transform duration-300">
              <SentimentIndicator />
            </motion.div>
          </div>

          {/* Visibility Trends */}
          <motion.div variants={itemVariants} className="hover:shadow-lg transition-shadow">
            <VisibilityTrendChart />
          </motion.div>

          {/* Network & Coverage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}><PromptCoverageChart /></motion.div>
            <motion.div variants={itemVariants}><CitationNodeMap /></motion.div>
          </div>

          {/* Rankings */}
          <motion.div variants={itemVariants}>
            <div className="rounded-[24px] bg-card p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8 text-foreground pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Competitive Landscape</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Visibility share across monitored domains</p>
                </div>
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <button aria-label="View Full Competitive Leaderboard" className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                      Full Leaderboard <TrendingUp size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border-border text-xs">
                    Expand competitive visibility data
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {competitors.map(c => <CompetitorCard key={c.rank} {...c} />)}
              </div>
            </div>
          </motion.div>

          {/* Community Intel */}
          <motion.div variants={itemVariants}>
            <CommunityIntelPanel keywords={["generative intelligence", "AEO strategies", "LLM ranking factors"]} />
          </motion.div>
        </motion.div>
      </TooltipProvider>
    </DashboardLayout>
  );
}

