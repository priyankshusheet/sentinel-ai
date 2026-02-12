import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) { toast.error(error.message); return; }
        navigate("/dashboard");
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) { toast.error(error.message); return; }
        toast.success("Account created! Check your email to verify, or sign in now.");
        navigate("/onboarding");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Sentinel AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome back" : "Get started"}</h1>
            <p className="text-muted-foreground">{isLogin ? "Sign in to monitor your AI visibility" : "Create an account to start optimizing"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              <Chrome className="h-4 w-4 mr-2" /> Google
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Github className="h-4 w-4 mr-2" /> GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="bg-secondary border-none" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="bg-secondary border-none" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-secondary border-none" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <motion.div className="relative z-10 max-w-lg text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <motion.div className="mx-auto mb-8 w-64 h-64 rounded-full bg-card/50 backdrop-blur-sm border border-border flex items-center justify-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div className="text-center">
              <motion.div className="text-6xl font-bold text-gradient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>78.5</motion.div>
              <p className="text-muted-foreground mt-2">AI Visibility Score</p>
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Control Your AI Presence</h2>
          <p className="text-lg text-muted-foreground mb-8">Monitor, optimize, and dominate how your brand appears in ChatGPT, Claude, Gemini, and Perplexity.</p>
          <div className="space-y-3 text-left">
            {["Real-time visibility tracking across all major LLMs", "Competitor intelligence and benchmarking", "Actionable optimization recommendations", "Citation source management"].map((feature, index) => (
              <motion.div key={index} className="flex items-center gap-3 text-foreground" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
