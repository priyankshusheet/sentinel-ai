import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Eye, EyeOff, FileText, Clock, Plus, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePrompts } from "@/hooks/use-prompts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["All", "General", "Product Reviews", "Comparisons", "How-to Guides", "Best Of Lists", "Alternatives"];

export default function Prompts() {
  const { user } = useAuth();
  const { prompts, isLoading, addPrompt, deletePrompt } = usePrompts(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ query: "", category: "General" });

  const handleAddPrompt = async () => {
    if (!newPrompt.query.trim()) return;
    await addPrompt(newPrompt);
    setNewPrompt({ query: "", category: "General" });
    setDialogOpen(false);
  };

  const filtered = prompts.filter(p => {
    const matchSearch = p.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const mentioned = prompts.filter(p => p.latest_ranking?.visibility === "mentioned").length;
  const partial = prompts.filter(p => p.latest_ranking?.visibility === "partial").length;
  const notMentioned = prompts.filter(p => !p.latest_ranking || p.latest_ranking.visibility === "not_mentioned").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prompt Analytics</h1>
            <p className="text-muted-foreground mt-1">Track how AI responds to prompts about your brand</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Prompt</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Track a New Prompt</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Prompt Query</Label><Input value={newPrompt.query} onChange={e => setNewPrompt(p => ({ ...p, query: e.target.value }))} placeholder="Best project management tools for startups" /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newPrompt.category} onValueChange={v => setNewPrompt(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddPrompt} className="w-full">Track Prompt</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search prompts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-none" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 rounded-lg bg-secondary text-foreground border-none">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Total Prompts</p><p className="text-2xl font-bold text-foreground">{prompts.length}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Mentioned</p><p className="text-2xl font-bold text-success">{mentioned}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Partial</p><p className="text-2xl font-bold text-warning">{partial}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Not Mentioned</p><p className="text-2xl font-bold text-destructive">{notMentioned}</p></div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading prompts...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No prompts tracked yet. Start by adding prompts you want to monitor.</p>
            <Button onClick={() => setDialogOpen(true)}>Add Your First Prompt</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((prompt, index) => {
              const r = prompt.latest_ranking;
              const vis = r?.visibility || "not_mentioned";
              const confidence = r?.confidence_score || 0;
              const citations = r?.citations_found || 0;

              return (
                <motion.div key={prompt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", vis === "mentioned" && "bg-success/20", vis === "partial" && "bg-warning/20", vis === "not_mentioned" && "bg-destructive/20")}>
                            {vis === "not_mentioned" ? <EyeOff className="h-4 w-4 text-destructive" /> : <Eye className={cn("h-4 w-4", vis === "mentioned" ? "text-success" : "text-warning")} />}
                          </div>
                          <h3 className="font-medium text-foreground truncate">{prompt.query}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="secondary">{prompt.category || "General"}</Badge>
                          <span className="flex items-center gap-1 text-muted-foreground"><FileText className="h-3 w-3" />{citations} citations</span>
                          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{r ? new Date(r.checked_at).toLocaleDateString() : "Not checked"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-foreground">{confidence}%</div>
                          <div className="text-xs text-muted-foreground">{r?.llm_platform || "—"}</div>
                        </div>
                        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", expandedPrompt === prompt.id && "rotate-180")} />
                      </div>
                    </div>
                  </div>

                  {expandedPrompt === prompt.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border p-4 bg-secondary/20">
                      {r?.ai_response ? (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">AI Response</h4>
                          <div className="p-3 rounded-lg bg-background border border-border text-sm text-muted-foreground">{r.ai_response}</div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-4">No analysis results yet. Analysis will run when you configure your AI API key.</p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); deletePrompt(prompt.id); }} className="gap-1"><Trash2 className="h-3 w-3" /> Remove</Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
