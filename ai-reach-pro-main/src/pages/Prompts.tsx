import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  FileText,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Prompt {
  id: string;
  query: string;
  category: string;
  visibility: "mentioned" | "not_mentioned" | "partial";
  confidence: number;
  change: number;
  citations: number;
  lastChecked: string;
}

const prompts: Prompt[] = [
  {
    id: "1",
    query: "Best project management tools for startups",
    category: "Product Reviews",
    visibility: "mentioned",
    confidence: 92,
    change: 5,
    citations: 4,
    lastChecked: "2 hours ago",
  },
  {
    id: "2",
    query: "Top SaaS tools for remote teams 2024",
    category: "Best Of Lists",
    visibility: "mentioned",
    confidence: 87,
    change: 12,
    citations: 3,
    lastChecked: "3 hours ago",
  },
  {
    id: "3",
    query: "Project management software comparison",
    category: "Comparisons",
    visibility: "partial",
    confidence: 65,
    change: -3,
    citations: 2,
    lastChecked: "4 hours ago",
  },
  {
    id: "4",
    query: "How to choose a task management tool",
    category: "How-to Guides",
    visibility: "not_mentioned",
    confidence: 0,
    change: 0,
    citations: 0,
    lastChecked: "5 hours ago",
  },
  {
    id: "5",
    query: "Alternatives to Asana for small teams",
    category: "Alternatives",
    visibility: "mentioned",
    confidence: 78,
    change: 8,
    citations: 5,
    lastChecked: "6 hours ago",
  },
  {
    id: "6",
    query: "What is the best free project management tool",
    category: "Product Reviews",
    visibility: "partial",
    confidence: 45,
    change: -8,
    citations: 1,
    lastChecked: "7 hours ago",
  },
];

const categories = ["All", "Product Reviews", "Comparisons", "How-to Guides", "Best Of Lists", "Alternatives"];
const visibilityFilters = ["All", "Mentioned", "Partial", "Not Mentioned"];

export default function Prompts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVisibility, setSelectedVisibility] = useState("All");
  const [selectedLLM, setSelectedLLM] = useState("All LLMs");
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    const matchesVisibility = selectedVisibility === "All" || 
      (selectedVisibility === "Mentioned" && prompt.visibility === "mentioned") ||
      (selectedVisibility === "Partial" && prompt.visibility === "partial") ||
      (selectedVisibility === "Not Mentioned" && prompt.visibility === "not_mentioned");
    return matchesSearch && matchesCategory && matchesVisibility;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prompt Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Explore how AI responds to prompts related to your brand
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-none"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-secondary text-foreground border-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Visibility filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="px-4 py-2 rounded-lg bg-secondary text-foreground border-none"
          >
            {visibilityFilters.map((vis) => (
              <option key={vis} value={vis}>{vis}</option>
            ))}
          </select>

          {/* LLM selector */}
          <select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            className="px-4 py-2 rounded-lg bg-secondary text-foreground border-none"
          >
            <option>All LLMs</option>
            <option>ChatGPT</option>
            <option>Claude</option>
            <option>Gemini</option>
            <option>Perplexity</option>
          </select>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Total Prompts</p>
            <p className="text-2xl font-bold text-foreground">{prompts.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Mentioned</p>
            <p className="text-2xl font-bold text-success">
              {prompts.filter(p => p.visibility === "mentioned").length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Partial</p>
            <p className="text-2xl font-bold text-warning">
              {prompts.filter(p => p.visibility === "partial").length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Not Mentioned</p>
            <p className="text-2xl font-bold text-destructive">
              {prompts.filter(p => p.visibility === "not_mentioned").length}
            </p>
          </div>
        </div>

        {/* Prompts list */}
        <div className="space-y-3">
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Visibility indicator */}
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        prompt.visibility === "mentioned" && "bg-success/20",
                        prompt.visibility === "partial" && "bg-warning/20",
                        prompt.visibility === "not_mentioned" && "bg-destructive/20"
                      )}>
                        {prompt.visibility === "mentioned" && <Eye className="h-4 w-4 text-success" />}
                        {prompt.visibility === "partial" && <Eye className="h-4 w-4 text-warning" />}
                        {prompt.visibility === "not_mentioned" && <EyeOff className="h-4 w-4 text-destructive" />}
                      </div>

                      <h3 className="font-medium text-foreground truncate">{prompt.query}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">{prompt.category}</Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {prompt.citations} citations
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {prompt.lastChecked}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Confidence score */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">{prompt.confidence}%</div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        prompt.change > 0 && "text-success",
                        prompt.change < 0 && "text-destructive",
                        prompt.change === 0 && "text-muted-foreground"
                      )}>
                        {prompt.change > 0 && <TrendingUp className="h-3 w-3" />}
                        {prompt.change < 0 && <TrendingDown className="h-3 w-3" />}
                        {prompt.change === 0 && <Minus className="h-3 w-3" />}
                        {prompt.change > 0 ? "+" : ""}{prompt.change}%
                      </div>
                    </div>

                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      expandedPrompt === prompt.id && "rotate-180"
                    )} />
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {expandedPrompt === prompt.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border p-4 bg-secondary/20"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">AI Response Preview</h4>
                      <div className="p-4 rounded-lg bg-background border border-border text-sm text-muted-foreground">
                        <p>
                          "When it comes to project management tools for startups, <span className="text-primary font-medium">Your Brand</span> stands out for its intuitive interface and powerful collaboration features. Other popular options include Asana, Monday.com, and Notion..."
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Citation Sources</h4>
                      <div className="space-y-2">
                        {["G2 Reviews", "Capterra", "Product Hunt", "Your Blog"].slice(0, prompt.citations).map((source, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                            <span className="text-sm text-foreground">{source}</span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      View full response
                    </Button>
                    <Button variant="outline" size="sm">
                      Track this prompt
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Create content
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
