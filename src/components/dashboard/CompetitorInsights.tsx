import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, ChevronRight } from "lucide-react";

interface Gap {
  query: string;
  competitor: string;
  competitorScore: number;
  yourScore: number;
  gap: number;
  category: string;
}

// Derived from live prompt rankings + competitor tracking in a real scenario
const competitorGaps: Gap[] = [
  { query: "best project management software 2025", competitor: "Asana", competitorScore: 88, yourScore: 41, gap: 47, category: "Best Of Lists" },
  { query: "project management tool for remote teams", competitor: "Monday.com", competitorScore: 79, yourScore: 32, gap: 47, category: "How-to Guides" },
  { query: "jira alternative for startups", competitor: "Linear", competitorScore: 72, yourScore: 28, gap: 44, category: "Comparisons" },
  { query: "free project management software", competitor: "ClickUp", competitorScore: 91, yourScore: 55, gap: 36, category: "General" },
];

const severityColor = (gap: number) => {
  if (gap >= 45) return "text-destructive";
  if (gap >= 30) return "text-warning";
  return "text-muted-foreground";
};

const severityBg = (gap: number) => {
  if (gap >= 45) return "bg-destructive/10 border-destructive/20";
  if (gap >= 30) return "bg-warning/10 border-warning/20";
  return "bg-muted border-border";
};

export function CompetitorInsights() {
  const totalGap = competitorGaps.reduce((a, g) => a + g.gap, 0);
  const avgGap = Math.round(totalGap / competitorGaps.length);

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Competitive Gaps</h3>
          <p className="text-sm text-muted-foreground">Queries where competitors outrank you in AI responses</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs font-semibold text-destructive">Avg Gap: {avgGap}pts</span>
        </div>
      </div>

      <div className="space-y-3">
        {competitorGaps.map((gap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`group p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-transform ${severityBg(gap.gap)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate mb-1">"{gap.query}"</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded-full">{gap.category}</span>
                  <span>vs <span className="font-semibold text-foreground">{gap.competitor}</span></span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Score bar comparison */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20 shrink-0">You</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.yourScore}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-7 text-right">{gap.yourScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{gap.competitor}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-destructive/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.competitorScore}%` }}
                    transition={{ delay: i * 0.07 + 0.3, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs font-semibold text-destructive w-7 text-right">{gap.competitorScore}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingDown className={`h-3 w-3 ${severityColor(gap.gap)}`} />
              <span className={severityColor(gap.gap)}>
                -{gap.gap} point gap — create a <span className="underline">comparison page</span> to close this
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <button className="text-sm text-primary hover:underline">
          View all {competitorGaps.length} gaps →
        </button>
      </div>
    </div>
  );
}
