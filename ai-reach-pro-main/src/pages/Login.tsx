import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  Eye, 
  CheckCircle,
  Github,
  Chrome,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">GeoSync</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to monitor your AI visibility" 
                : "Create an account to start optimizing"}
            </p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="w-full">
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="bg-secondary border-none"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@company.com"
                className="bg-secondary border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="bg-secondary border-none"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button type="button" className="text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 max-w-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Animated score display */}
          <motion.div
            className="mx-auto mb-8 w-64 h-64 rounded-full bg-card/50 backdrop-blur-sm border border-border flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl font-bold text-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                78.5
              </motion.div>
              <p className="text-muted-foreground mt-2">AI Visibility Score</p>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-foreground mb-4">
            Control Your AI Presence
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Monitor, optimize, and dominate how your brand appears in ChatGPT, Claude, Gemini, and Perplexity.
          </p>

          {/* Features */}
          <div className="space-y-3 text-left">
            {[
              "Real-time visibility tracking across all major LLMs",
              "Competitor intelligence and benchmarking",
              "Actionable optimization recommendations",
              "Citation source management",
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
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
