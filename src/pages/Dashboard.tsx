import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIVisibilityScore } from "@/components/dashboard/AIVisibilityScore";
import { ShareOfVoice } from "@/components/dashboard/ShareOfVoice";
import { CompetitorCard } from "@/components/dashboard/CompetitorCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PromptCoverageChart } from "@/components/dashboard/PromptCoverageChart";
import { SentimentIndicator } from "@/components/dashboard/SentimentIndicator";
import { CitationNodeMap } from "@/components/dashboard/CitationNodeMap";
import { VisibilityTrendChart } from "@/components/dashboard/VisibilityTrendChart";
import { 
  Search, 
  FileText, 
  Zap, 
  Users,
  Activity,
} from "lucide-react";

const competitors = [
  { rank: 1, name: "Your Brand", domain: "yourbrand.com", score: 78, change: 5.2, isYou: true },
  { rank: 2, name: "RankIQ", domain: "rankiq.com", score: 72, change: -2.1 },
  { rank: 3, name: "BrightEdge", domain: "brightedge.io", score: 68, change: 3.8 },
  { rank: 4, name: "Surfer SEO", domain: "surferseo.ai", score: 54, change: 0 },
  { rank: 5, name: "Clearscope", domain: "clearscope.com", score: 41, change: -4.5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your AI visibility across ChatGPT, Claude, Gemini & Perplexity
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-success animate-pulse" />
            Last synced 5 min ago
          </div>
        </motion.div>

        {/* Quick metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Tracked Prompts"
            value="1,284"
            change={12}
            icon={Search}
            variant="primary"
          />
          <MetricCard
            title="Active Citations"
            value="487"
            change={8}
            icon={FileText}
            variant="success"
          />
          <MetricCard
            title="Content Gaps"
            value="23"
            change={-15}
            icon={Zap}
            variant="warning"
          />
          <MetricCard
            title="Competitors"
            value="5"
            icon={Users}
            description="Tracking 5 competitors"
          />
        </motion.div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - AI Score */}
          <motion.div variants={itemVariants}>
            <AIVisibilityScore score={78} change={5.2} trend="up" />
          </motion.div>

          {/* Middle column - Share of Voice */}
          <motion.div variants={itemVariants}>
            <ShareOfVoice />
          </motion.div>

          {/* Right column - Sentiment */}
          <motion.div variants={itemVariants}>
            <SentimentIndicator />
          </motion.div>
        </div>

        {/* Competitor rankings */}
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl bg-card p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Competitor Rankings</h3>
                <p className="text-sm text-muted-foreground">AI visibility leaderboard</p>
              </div>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {competitors.map((competitor) => (
                <CompetitorCard key={competitor.rank} {...competitor} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 30-day visibility trend */}
        <motion.div variants={itemVariants}>
          <VisibilityTrendChart />
        </motion.div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt coverage */}
          <motion.div variants={itemVariants}>
            <PromptCoverageChart />
          </motion.div>

          {/* Citation node map */}
          <motion.div variants={itemVariants}>
            <CitationNodeMap />
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div variants={itemVariants}>
          <AlertsPanel />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
