import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, XCircle, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  time: string;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Lost citation detected",
    description: "TechCrunch article no longer mentions your brand",
    time: "2 hours ago",
    action: "View details",
  },
  {
    id: "2",
    type: "warning",
    title: "New competitor in top prompts",
    description: '"AIStartup Inc" now appears in 12 of your tracked prompts',
    time: "4 hours ago",
    action: "Analyze",
  },
  {
    id: "3",
    type: "success",
    title: "Visibility improved",
    description: "Your brand is now mentioned in ChatGPT responses for 5 new prompts",
    time: "6 hours ago",
  },
  {
    id: "4",
    type: "info",
    title: "Content opportunity detected",
    description: "High-value prompt gap: 'best AI tools for startups'",
    time: "Yesterday",
    action: "Create content",
  },
];

const alertStyles = {
  critical: {
    icon: XCircle,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-success/10",
    border: "border-success/30",
    iconColor: "text-success",
  },
  info: {
    icon: Info,
    bg: "bg-primary/10",
    border: "border-primary/30",
    iconColor: "text-primary",
  },
};

export function AlertsPanel() {
  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">AI behavior changes and opportunities</p>
        </div>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;

          return (
            <motion.div
              key={alert.id}
              className={cn(
                "flex items-start gap-4 rounded-xl p-4 border transition-all hover:bg-secondary/50 cursor-pointer",
                style.bg,
                style.border
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={cn("mt-0.5", style.iconColor)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-foreground">{alert.title}</h4>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                {alert.action && (
                  <button className="flex items-center gap-1 text-sm text-primary mt-2 hover:gap-2 transition-all">
                    {alert.action}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
