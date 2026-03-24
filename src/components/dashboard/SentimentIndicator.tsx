import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Smile, Meh, Frown } from "lucide-react";
import { useAudioEffects } from "@/hooks/use-audio-effects";
import { cn } from "@/lib/utils";

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

const sentimentData: SentimentData = {
  positive: 72,
  neutral: 21,
  negative: 7,
};

export function SentimentIndicator() {
  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Brand Sentiment</h3>
        <p className="text-sm text-muted-foreground">How AI portrays your brand</p>
      </div>

      {/* Main sentiment display */}
      <div className="flex items-center justify-center mb-8">
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-success/20 flex items-center justify-center">
              <Smile className="h-12 w-12 text-success" />
            </div>
          </div>
          <motion.div
            className="absolute -right-2 -top-2 rounded-full bg-success px-3 py-1 text-sm font-bold text-success-foreground"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {sentimentData.positive}%
          </motion.div>
        </motion.div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Smile className="h-5 w-5 text-success" />
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-success"
                initial={{ width: 0 }}
                animate={{ width: `${sentimentData.positive}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground w-12 text-right">
            {sentimentData.positive}%
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Meh className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-muted-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${sentimentData.neutral}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground w-12 text-right">
            {sentimentData.neutral}%
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Frown className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-destructive"
                initial={{ width: 0 }}
                animate={{ width: `${sentimentData.negative}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground w-12 text-right">
            {sentimentData.negative}%
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function SentimentRow({ icon: Icon, value, color, labelColor, delay }: any) {
  return (
    <motion.div
      className="flex items-center gap-4 group/row"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover/row:scale-120", labelColor)} />
      <div className="flex-1">
        <div className="h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full relative", color)}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "circOut" }}
          >
            <div className="absolute inset-0 bg-white/20 blur-[2px] opacity-30" />
          </motion.div>
        </div>
      </div>
      <span className={cn("text-xs font-bold w-12 text-right tracking-tight", labelColor)}>
        {value}%
      </span>
    </motion.div>
  );
}
