import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Building2, Globe, Users, Target, Zap, ShoppingCart, GraduationCap, Heart, CheckCircle, Shield } from "lucide-react";
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
    if (!cardRef.current) return;
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
      // Save onboarding data
      if (!user) { navigate("/login"); return; }
      setSaving(true);
      try {
        await supabase.from("profiles").update({
          industry: selectedIndustry,
          website_url: brandUrl,
          selected_llms: selectedLLMs,
          goals: selectedGoals,
          onboarding_completed: true,
        }).eq("user_id", user.id);

        // Save competitors
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
        toast.success("Setup complete!");
        navigate("/dashboard");
      } catch (e) {
        toast.error("Failed to save. Please try again.");
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
      <motion.div className="relative z-10 w-full max-w-[560px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8 justify-center opacity-80">
          <Shield className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <span className="text-sm font-bold tracking-widest text-[#8ba3c7] uppercase">Sentinel System</span>
        </div>

        <div className="mb-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest text-[#8ba3c7] uppercase">Step {step} of {totalSteps}</span>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_8px_rgba(0,212,255,0.8)]" initial={{ width: 0 }} animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        <motion.div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="glass rounded-[28px] border-cyan-400/10 p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          onMouseEnter={() => playSound('hover')}
        >
          {/* Energy Pulse Border (Traveling Light) */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none z-0">
             <motion.div 
              className="absolute w-[40%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"
              animate={{ left: ["-100%", "150%"], top: ["0%", "0%", "100%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-10">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"><Building2 className="h-5 w-5 text-primary" /></div>
                <div><h2 className="text-xl font-semibold text-foreground">What's your industry?</h2><p className="text-sm text-muted-foreground">This helps us customize your experience</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {industries.map((industry) => (
                  <button key={industry.id} onClick={() => setSelectedIndustry(industry.id)} className={cn("relative p-6 rounded-xl border-2 text-left transition-all", selectedIndustry === industry.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                    <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4", industry.color)}><industry.icon className="h-6 w-6 text-white" /></div>
                    <h3 className="font-semibold text-foreground">{industry.name}</h3>
                    {selectedIndustry === industry.id && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"><Globe className="h-5 w-5 text-primary" /></div>
                <div><h2 className="text-xl font-semibold text-foreground">What's your brand URL?</h2><p className="text-sm text-muted-foreground">We'll analyze your current AI visibility</p></div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input id="url" value={brandUrl} onChange={(e) => setBrandUrl(e.target.value)} placeholder="https://yourbrand.com" className="bg-secondary border-none text-lg h-12" />
                </div>
                <p className="text-sm text-muted-foreground">We'll scan your website and analyze how AI engines currently perceive your brand.</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"><Users className="h-5 w-5 text-primary" /></div>
                <div><h2 className="text-xl font-semibold text-foreground">Who are your competitors?</h2><p className="text-sm text-muted-foreground">Add up to 5 competitors to track</p></div>
              </div>
              <div className="space-y-3">
                {competitors.map((comp, index) => (
                  <Input key={index} value={comp} onChange={(e) => { const n = [...competitors]; n[index] = e.target.value; setCompetitors(n); }} placeholder={`Competitor ${index + 1} URL`} className="bg-secondary border-none" />
                ))}
                {competitors.length < 5 && <Button variant="outline" onClick={addCompetitor} className="w-full">+ Add another competitor</Button>}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"><Sparkles className="h-5 w-5 text-primary" /></div>
                <div><h2 className="text-xl font-semibold text-foreground">Which AI platforms to track?</h2><p className="text-sm text-muted-foreground">Select the LLMs you want to monitor</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {llms.map((llm) => (
                  <button key={llm.id} onClick={() => toggleLLM(llm.id)} className={cn("relative p-4 rounded-xl border-2 flex items-center gap-4 transition-all", selectedLLMs.includes(llm.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                    <span className="text-3xl">{llm.emoji}</span>
                    <span className="font-semibold text-foreground">{llm.name}</span>
                    {selectedLLMs.includes(llm.id) && <CheckCircle className="absolute top-3 right-3 h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20"><Target className="h-5 w-5 text-primary" /></div>
                <div><h2 className="text-xl font-semibold text-foreground">What are your goals?</h2><p className="text-sm text-muted-foreground">Select what matters most to you</p></div>
              </div>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("relative w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all", selectedGoals.includes(goal.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                    <div><h3 className="font-semibold text-foreground">{goal.name}</h3><p className="text-sm text-muted-foreground">{goal.description}</p></div>
                    {selectedGoals.includes(goal.id) && <CheckCircle className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-cyan-400/10 relative z-10">
            <Button 
              variant="ghost" 
              onClick={() => { playSound('click'); prevStep(); }} 
              disabled={step === 1} 
              className="gap-2 text-[#8ba3c7] hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button 
              onClick={() => { playSound('click'); nextStep(); }} 
              className="gap-2 h-11 px-6 rounded-xl font-bold text-[14px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 border-0 text-white" 
              disabled={saving}
            >
              {saving ? "Saving..." : step === totalSteps ? "Launch Dashboard" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
