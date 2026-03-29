import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Building2, Globe, Users, Target, Zap, ShoppingCart, GraduationCap, Heart, CheckCircle, Shield, Loader2, Cpu, Network, BarChart, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAudioEffects } from "@/hooks/use-audio-effects";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const industries = [
  { id: "saas", name: "SaaS", icon: Zap, color: "from-blue-500 to-cyan-500" },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, color: "from-orange-500 to-red-500" },
  { id: "edtech", name: "EdTech", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
  { id: "healthtech", name: "HealthTech", icon: Heart, color: "from-green-500 to-emerald-500" },
];

const llms = [
  { id: "chatgpt", name: "ChatGPT", emoji: "🤖" },
  { id: "claude", name: "Claude", emoji: "🧠" },
  { id: "gemini", name: "Gemini", emoji: "✨" },
  { id: "perplexity", name: "Perplexity", emoji: "🔍" },
];

const goals = [
  { id: "visibility", name: "Brand Visibility", description: "Get mentioned more often" },
  { id: "leads", name: "Lead Generation", description: "Drive more qualified traffic" },
  { id: "revenue", name: "Revenue Growth", description: "Increase conversions" },
  { id: "actions", name: "AI Agent Actions", description: "Enable bookings & purchases" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Initializing...");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [brandUrl, setBrandUrl] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>(["chatgpt", "claude"]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["visibility"]);
  const [saving, setSaving] = useState(false);
  const totalSteps = 5;
  const { playSound } = useAudioEffects();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isProcessing) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const nextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (!user) { navigate("/login"); return; }
      setSaving(true);
      setIsProcessing(true);
      
      const statuses = [
        "Analyzing site structure...",
        "Identifying entity nodes...",
        "Mapping competitor clusters...",
        "Calibrating visibility engine...",
        "Synchronizing with LLM gateways..."
      ];

      for (let i = 0; i < statuses.length; i++) {
        setProcessingStatus(statuses[i]);
        await new Promise(r => setTimeout(r, 1200));
      }

      try {
        await supabase.from("profiles").update({
          industry: selectedIndustry,
          website_url: brandUrl,
          selected_llms: selectedLLMs,
          goals: selectedGoals,
          onboarding_completed: true,
        }).eq("user_id", user.id);

        const validComps = competitors.filter(c => c.trim());
        if (validComps.length > 0) {
          await supabase.from("competitors").insert(
            validComps.map(c => ({
              user_id: user.id,
              name: new URL(c.startsWith("http") ? c : `https://${c}`).hostname.replace("www.", ""),
              domain: c.trim(),
            }))
          );
        }
        toast.success("Sentinel Matrix Initialized!");
        navigate("/dashboard");
      } catch (e) {
        toast.error("Handshake failed. Retrying...");
        setIsProcessing(false);
      } finally {
        setSaving(false);
      }
    }
  };

  const prevStep = () => { if (step > 1) setStep(step - 1); };
  const toggleLLM = (id: string) => setSelectedLLMs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleGoal = (id: string) => setSelectedGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const addCompetitor = () => { if (competitors.length < 5) setCompetitors([...competitors, ""]); };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 animated-bg text-foreground relative overflow-hidden">
      <motion.div className="relative z-10 w-full max-w-[560px]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}>
                <div className="flex items-center gap-3 mb-10 justify-center opacity-80">
                <Shield className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                <span className="text-xs font-black tracking-[0.3em] text-[#8ba3c7] uppercase">Sentinel Protocol v2.68</span>
                </div>

                <div className="mb-10 px-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black tracking-widest text-[#556987] uppercase">Stage_0{step} / Stage_0{totalSteps}</span>
                    <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">{Math.round((step / totalSteps) * 100)}% Linked</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5 p-[2px]">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.6)]" initial={{ width: 0 }} animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
                </div>
                </div>

                <motion.div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="glass rounded-[40px] border-white/5 p-10 sm:p-12 shadow-2xl relative overflow-hidden group"
                onMouseEnter={() => playSound('hover')}
                >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                
                <div className="relative z-10">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Vertical Selection</h2>
                        <p className="text-sm text-[#8ba3c7] font-medium leading-relaxed">Choose your industry to calibrate the semantic discovery model.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {industries.map((industry) => (
                        <button 
                            key={industry.id} 
                            onClick={() => { playSound('click'); setSelectedIndustry(industry.id); }} 
                            className={cn(
                                "relative p-6 rounded-2xl border transition-all duration-300 text-left group/btn", 
                                selectedIndustry === industry.id ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "border-white/5 bg-white/5 hover:border-white/20"
                            )}
                            aria-pressed={selectedIndustry === industry.id}
                        >
                            <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform group-hover/btn:scale-110", industry.color)}>
                                <industry.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-bold text-white tracking-tight">{industry.name}</h3>
                            {selectedIndustry === industry.id && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-cyan-400" />}
                        </button>
                        ))}
                    </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Entity Identity</h2>
                        <p className="text-sm text-[#8ba3c7] font-medium leading-relaxed">What is your primary brand URL for visibility crawling?</p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                        <Label htmlFor="url" className="text-[10px] font-black uppercase tracking-widest text-[#556987]">Endpoint URL</Label>
                        <Input id="url" value={brandUrl} onChange={(e) => setBrandUrl(e.target.value)} placeholder="https://yourbrand.com" className="bg-secondary/50 border-white/5 text-lg h-14 rounded-2xl focus:ring-1 focus:ring-cyan-500/50" />
                        </div>
                        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex gap-3">
                            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-[#8ba3c7] leading-relaxed">Sentinel will verify this domain against multi-LLM citations to establish your baseline authority score.</p>
                        </div>
                    </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Market Rivals</h2>
                        <p className="text-sm text-[#8ba3c7] font-medium leading-relaxed">Track up to 5 competitors to identify semantic gaps.</p>
                    </div>
                    <div className="space-y-3">
                        {competitors.map((comp, index) => (
                        <div key={index} className="relative group/input">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#556987] group-focus-within/input:text-cyan-400 transition-colors" />
                            <Input value={comp} onChange={(e) => { const n = [...competitors]; n[index] = e.target.value; setCompetitors(n); }} placeholder={`Competitor ${index + 1} Domain`} className="bg-secondary/50 border-white/5 pl-12 h-12 rounded-xl focus:ring-1 focus:ring-cyan-500/50" />
                        </div>
                        ))}
                        {competitors.length < 5 && (
                            <Button variant="ghost" onClick={addCompetitor} className="w-full h-12 rounded-xl border border-dashed border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-[#8ba3c7]">
                                <Plus className="h-4 w-4 mr-2" /> Link Another Entity
                            </Button>
                        )}
                    </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Engine Gateways</h2>
                        <p className="text-sm text-[#8ba3c7] font-medium leading-relaxed">Select the generative engines you want to monitor.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {llms.map((llm) => (
                        <button 
                            key={llm.id} 
                            onClick={() => { playSound('click'); toggleLLM(llm.id); }} 
                            className={cn(
                                "relative p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group/btn", 
                                selectedLLMs.includes(llm.id) ? "border-cyan-500/50 bg-cyan-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
                            )}
                            aria-pressed={selectedLLMs.includes(llm.id)}
                        >
                            <span className="text-2xl group-hover/btn:scale-110 transition-transform">{llm.emoji}</span>
                            <span className="font-bold text-white tracking-tight">{llm.name}</span>
                            {selectedLLMs.includes(llm.id) && <CheckCircle className="absolute top-3 right-3 h-4 w-4 text-cyan-400" />}
                        </button>
                        ))}
                    </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Objective Flux</h2>
                        <p className="text-sm text-[#8ba3c7] font-medium leading-relaxed">What metrics will define your 2026 success?</p>
                    </div>
                    <div className="space-y-3">
                        {goals.map((goal) => (
                        <button 
                            key={goal.id} 
                            onClick={() => { playSound('click'); toggleGoal(goal.id); }} 
                            className={cn(
                                "relative w-full p-5 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between group/btn", 
                                selectedGoals.includes(goal.id) ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.05)]" : "border-white/5 bg-white/5 hover:border-white/20"
                            )}
                            aria-pressed={selectedGoals.includes(goal.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-inner", selectedGoals.includes(goal.id) ? "bg-cyan-500/20" : "bg-white/5")}>
                                    <Target className={cn("h-5 w-5", selectedGoals.includes(goal.id) ? "text-cyan-400" : "text-[#556987]")} />
                                </div>
                                <div><h3 className="font-bold text-white tracking-tight">{goal.name}</h3><p className="text-[10px] text-[#8ba3c7] font-medium uppercase tracking-widest">{goal.description}</p></div>
                            </div>
                            {selectedGoals.includes(goal.id) && <CheckCircle className="h-5 w-5 text-cyan-400" />}
                        </button>
                        ))}
                    </div>
                    </motion.div>
                )}

                <div className="flex items-center justify-between mt-12 pt-10 border-t border-white/5 relative z-10">
                    <Button 
                    variant="ghost" 
                    onClick={() => { playSound('click'); prevStep(); }} 
                    disabled={step === 1} 
                    className="gap-2 text-[#8ba3c7] hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl uppercase font-black text-[10px] tracking-widest px-6"
                    >
                    <ArrowLeft className="h-3 w-3" /> Previous Stage
                    </Button>
                    <Button 
                    onClick={() => { playSound('click'); nextStep(); }} 
                    className="gap-2 h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-500 border-0 text-white group" 
                    disabled={saving}
                    >
                    {step === totalSteps ? "Initiate Matrix" : "Next Protocol"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
                </div>
                </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="processing" 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass rounded-[40px] border-cyan-400/20 p-16 text-center space-y-10 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
            >
              <div className="relative h-32 w-32 mx-auto">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping" />
                <motion.div 
                  className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-0 border-t-4 border-cyan-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-12 w-12 text-cyan-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Initializing Sentinel</h2>
                <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 animate-pulse">{processingStatus}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    </div>
                    <div className="text-[8px] font-black text-[#556987]">CRAWLER</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-cyan-400" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
                    </div>
                    <div className="text-[8px] font-black text-[#556987]">ANALYTICS</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
                    </div>
                    <div className="text-[8px] font-black text-[#556987]">VIRTUAL-NODE</div>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
