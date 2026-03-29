import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sparkles, Info, Users, FileText, Globe, ZoomIn, Maximize2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export default function IntelligenceGraph() {
  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Intelligence Graph</h1>
              <p className="text-muted-foreground mt-1">Visualize and decode the semantic entity relationships established by LLMs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-bold uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                <Sparkles className="h-3 w-3" /> Live Entity Mapping
              </div>
              <button className="p-2 rounded-lg bg-secondary/50 border border-white/5 hover:bg-secondary transition-colors"><Share2 size={16} className="text-muted-foreground" /></button>
            </div>
          </div>

          <div className="aspect-[16/8] w-full bg-[#0a0f18] rounded-[32px] border border-border relative overflow-hidden flex items-center justify-center group/graph shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a365d44_0%,_transparent_70%)] opacity-50"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            {/* Graph Controls */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <button className="p-2 rounded-lg bg-background/80 backdrop-blur-md border border-white/5 hover:bg-background transition-all shadow-lg"><ZoomIn size={14} className="text-muted-foreground" /></button>
                <button className="p-2 rounded-lg bg-background/80 backdrop-blur-md border border-white/5 hover:bg-background transition-all shadow-lg"><Maximize2 size={14} className="text-muted-foreground" /></button>
            </div>

            <div className="text-center z-10 p-12 max-w-lg bg-background/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl transition-all group-hover/graph:-translate-y-2">
              <Globe className="h-12 w-12 text-cyan-400/40 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-black mb-3 tracking-tighter uppercase italic">Semantic Cluster Alpha</h2>
              <p className="text-sm text-[#8ba3c7] mb-10 leading-relaxed font-serif px-4">
                This high-dimensional graph maps the relationships between your brand and core topical clusters. 
                Nodes represent **Semantic Entities** discovered during multi-engine AEO audits.
              </p>
              <div className="flex items-center justify-center gap-10 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                  <div className="flex items-center gap-2 group/legend cursor-help">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> 
                    <span className="group-hover/legend:text-cyan-400 transition-colors">Your Brand</span>
                  </div>
                  <div className="flex items-center gap-2 group/legend cursor-help">
                    <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" /> 
                    <span className="group-hover/legend:text-purple-400 transition-colors">Core Topics</span>
                  </div>
                  <div className="flex items-center gap-2 group/legend cursor-help">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" /> 
                    <span className="group-hover/legend:text-yellow-400 transition-colors">Competitors</span>
                  </div>
              </div>
            </div>

            {/* Interactive Nodes Placeholder */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/3 h-6 w-6 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(0,212,255,0.6)] cursor-pointer z-20 hover:scale-150 transition-transform"
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-cyan-900 border-cyan-500/30 text-white font-bold p-3">
                    <div className="text-xs">BRAND ENTITY</div>
                    <div className="text-[10px] opacity-70">Primary Authority: 94%</div>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        animate={{ y: [0, 8, 0], x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/4 h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer z-20"
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-purple-900 border-purple-500/30 text-white font-bold p-3">
                    <div className="text-xs">TOPIC: DATA SECURITY</div>
                    <div className="text-[10px] opacity-70">Weight: 42% Affinity</div>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        animate={{ x: [0, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute top-1/3 right-1/4 h-5 w-5 rounded-full bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer z-20"
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-yellow-900 border-yellow-500/30 text-white font-bold p-3">
                    <div className="text-xs">COMPETITOR A</div>
                    <div className="text-[10px] opacity-70">Overlap: 64% (Displacement risk)</div>
                </TooltipContent>
            </Tooltip>
            
            <svg className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-1000">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee55" />
                  <stop offset="100%" stopColor="#a855f755" />
                </linearGradient>
              </defs>
              <motion.line 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                x1="33%" y1="25%" x2="25%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" 
              />
              <motion.line 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
                x1="33%" y1="25%" x2="75%" y2="33%" stroke="url(#lineGrad)" strokeWidth="1" 
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm group hover:border-yellow-500/30 transition-all">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-[#556987]">
                      <Users className="h-4 w-4 text-yellow-500" /> High Affinity Domains
                  </h4>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between group/item">
                        <span className="text-sm font-bold text-foreground group-hover/item:text-yellow-400 transition-colors">competitor-intel.ai</span>
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-500/5">91% MATCH</Badge>
                      </div>
                      <div className="flex items-center justify-between group/item">
                        <span className="text-sm font-bold text-foreground group-hover/item:text-yellow-400 transition-colors">market-leader.io</span>
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-500/5">78% MATCH</Badge>
                      </div>
                  </div>
              </div>
              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm group hover:border-purple-500/30 transition-all">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-[#556987]">
                      <FileText className="h-4 w-4 text-purple-500" /> Cluster Analytics
                  </h4>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between group/item">
                        <span className="text-sm font-bold text-foreground group-hover/item:text-purple-400 transition-colors">Generative UX</span>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5">AUTHORITY</Badge>
                      </div>
                      <div className="flex items-center justify-between group/item">
                        <span className="text-sm font-bold text-foreground group-hover/item:text-purple-400 transition-colors">Cyber-Security</span>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5">SENTIMENT</Badge>
                      </div>
                  </div>
              </div>
              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm group hover:border-cyan-500/30 transition-all">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-[#556987]">
                      <Info className="h-4 w-4 text-cyan-400" /> Strategic Gap A.I.
                  </h4>
                  <p className="text-[13px] text-[#8ba3c7] leading-relaxed font-medium">
                    The model identifies a critical link missing between your brand and "Scalable Infrastructure". 
                    <span className="text-cyan-400 mx-1">Strengthen this link</span> to increase visibility by an estimated 14% on Perplexity.
                  </p>
              </div>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}

