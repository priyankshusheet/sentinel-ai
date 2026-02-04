import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Globe, 
  Users, 
  Target,
  Zap,
  ShoppingCart,
  GraduationCap,
  Heart,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [brandUrl, setBrandUrl] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>(["chatgpt", "claude"]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["visibility"]);

  const totalSteps = 5;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleLLM = (id: string) => {
    setSelectedLLMs(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, ""]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">GeoSync</span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-2xl border border-border p-8">
          {/* Step 1: Industry */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">What's your industry?</h2>
                  <p className="text-sm text-muted-foreground">This helps us customize your experience</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={cn(
                      "relative p-6 rounded-xl border-2 text-left transition-all",
                      selectedIndustry === industry.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                      industry.color
                    )}>
                      <industry.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">{industry.name}</h3>
                    {selectedIndustry === industry.id && (
                      <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Brand URL */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">What's your brand URL?</h2>
                  <p className="text-sm text-muted-foreground">We'll analyze your current AI visibility</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    value={brandUrl}
                    onChange={(e) => setBrandUrl(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="bg-secondary border-none text-lg h-12"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll scan your website and analyze how AI engines currently perceive your brand.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Competitors */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Who are your competitors?</h2>
                  <p className="text-sm text-muted-foreground">Add up to 5 competitors to track</p>
                </div>
              </div>

              <div className="space-y-3">
                {competitors.map((comp, index) => (
                  <Input
                    key={index}
                    value={comp}
                    onChange={(e) => {
                      const newComps = [...competitors];
                      newComps[index] = e.target.value;
                      setCompetitors(newComps);
                    }}
                    placeholder={`Competitor ${index + 1} URL`}
                    className="bg-secondary border-none"
                  />
                ))}
                {competitors.length < 5 && (
                  <Button
                    variant="outline"
                    onClick={addCompetitor}
                    className="w-full"
                  >
                    + Add another competitor
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: LLMs */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Which AI platforms to track?</h2>
                  <p className="text-sm text-muted-foreground">Select the LLMs you want to monitor</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {llms.map((llm) => (
                  <button
                    key={llm.id}
                    onClick={() => toggleLLM(llm.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 flex items-center gap-4 transition-all",
                      selectedLLMs.includes(llm.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-3xl">{llm.emoji}</span>
                    <span className="font-semibold text-foreground">{llm.name}</span>
                    {selectedLLMs.includes(llm.id) && (
                      <CheckCircle className="absolute top-3 right-3 h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Goals */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">What are your goals?</h2>
                  <p className="text-sm text-muted-foreground">Select what matters most to you</p>
                </div>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "relative w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all",
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {step === totalSteps ? "Launch Dashboard" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
