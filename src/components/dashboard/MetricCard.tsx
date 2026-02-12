import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "from-secondary to-secondary",
  primary: "from-primary/20 to-accent/20",
  success: "from-success/20 to-success/10",
  warning: "from-warning/20 to-warning/10",
  destructive: "from-destructive/20 to-destructive/10",
};

const iconVariantStyles = {
  default: "bg-secondary text-foreground",
  primary: "bg-primary/20 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
};

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  variant = "default",
}: MetricCardProps) {
  const trend = change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : null;

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl bg-gradient-to-br p-6 border border-border overflow-hidden",
        variantStyles[variant]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-card/80" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                trend === "up" && "bg-success/20 text-success",
                trend === "down" && "bg-destructive/20 text-destructive",
                trend === "neutral" && "bg-secondary text-muted-foreground"
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {trend === "neutral" && <Minus className="h-3 w-3" />}
              {change !== undefined && <span>{change > 0 ? "+" : ""}{change}%</span>}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
