import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAudioEffects } from "@/hooks/use-audio-effects";
import { cn } from "@/lib/utils";

interface LLMData {
  name: string;
  icon: string;
  value: number;
  color: string;
  glow: string;
}

const llmData: LLMData[] = [
  { name: "ChatGPT", icon: "🤖", value: 42, color: "from-emerald-400 to-emerald-600", glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]" },
  { name: "Claude", icon: "🧠", value: 28, color: "from-orange-400 to-orange-600", glow: "shadow-[0_0_15px_rgba(249,115,22,0.5)]" },
  { name: "Gemini", icon: "✨", value: 18, color: "from-blue-400 to-blue-600", glow: "shadow-[0_0_15px_rgba(37,99,235,0.5)]" },
  { name: "Perplexity", icon: "🔍", value: 12, color: "from-purple-400 to-purple-600", glow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]" },
];

export function ShareOfVoice() {
  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Share of Voice</h3>
          <p className="text-sm text-muted-foreground">Brand visibility across AI platforms</p>
        </div>
        <select className="text-sm bg-secondary border-none rounded-lg px-3 py-1.5 text-foreground">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Stacked bar */}
      <div className="h-8 rounded-full bg-secondary overflow-hidden flex mb-6">
        {llmData.map((llm, index) => (
          <motion.div
            key={llm.name}
            className={`h-full bg-gradient-to-r ${llm.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${llm.value}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        {llmData.map((llm, index) => (
          <motion.div
            key={llm.name}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{llm.icon}</span>
              <span className="text-sm font-medium text-foreground">{llm.name}</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{llm.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
