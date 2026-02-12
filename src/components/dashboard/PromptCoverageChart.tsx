import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PromptCategory {
  name: string;
  total: number;
  covered: number;
  color: string;
}

const categories: PromptCategory[] = [
  { name: "Product Reviews", total: 45, covered: 38, color: "bg-primary" },
  { name: "Comparisons", total: 32, covered: 21, color: "bg-accent" },
  { name: "How-to Guides", total: 28, covered: 15, color: "bg-success" },
  { name: "Best Of Lists", total: 24, covered: 18, color: "bg-warning" },
  { name: "Alternatives", total: 18, covered: 8, color: "bg-blue-500" },
];

export function PromptCoverageChart() {
  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Prompt Coverage</h3>
          <p className="text-sm text-muted-foreground">Your visibility across prompt categories</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Covered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Gap</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const percentage = Math.round((category.covered / category.total) * 100);
          
          return (
            <motion.div
              key={category.name}
              className="group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {category.covered}/{category.total} ({percentage}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", category.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">68%</p>
            <p className="text-sm text-muted-foreground">Overall coverage</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors">
            View gaps
          </button>
        </div>
      </div>
    </div>
  );
}
