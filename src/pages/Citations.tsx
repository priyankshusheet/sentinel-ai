import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExternalLink, Crown, Star, Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Citation {
  id: string;
  source_name: string;
  source_url: string;
  domain: string | null;
  mention_count: number | null;
  authority_score: number | null;
  is_owned: boolean | null;
  sentiment: string | null;
}

export default function Citations() {
  const { user } = useAuth();
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCitation, setNewCitation] = useState({ source_name: "", source_url: "", is_owned: false });

  const fetchCitations = async () => {
    if (!user) return;
    const { data } = await supabase.from("citations").select("*").eq("user_id", user.id).order("mention_count", { ascending: false });
    setCitations(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCitations(); }, [user]);

  const addCitation = async () => {
    if (!user || !newCitation.source_name || !newCitation.source_url) return;
    const domain = (() => { try { return new URL(newCitation.source_url.startsWith("http") ? newCitation.source_url : `https://${newCitation.source_url}`).hostname; } catch { return newCitation.source_url; } })();
    const { error } = await supabase.from("citations").insert({ user_id: user.id, source_name: newCitation.source_name, source_url: newCitation.source_url, domain, is_owned: newCitation.is_owned });
    if (error) { toast.error(error.message); return; }
    toast.success("Citation added!");
    setNewCitation({ source_name: "", source_url: "", is_owned: false });
    setDialogOpen(false);
    fetchCitations();
  };

  const deleteCitation = async (id: string) => {
    await supabase.from("citations").delete().eq("id", id);
    toast.success("Citation removed");
    fetchCitations();
  };

  const ownedCount = citations.filter(c => c.is_owned).length;
  const totalMentions = citations.reduce((acc, c) => acc + (c.mention_count || 0), 0);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Star className="h-5 w-5 text-slate-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Citations</h1>
            <p className="text-muted-foreground mt-1">Where AI finds your brand information</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Citation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Citation Source</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Source Name</Label><Input value={newCitation.source_name} onChange={e => setNewCitation(p => ({ ...p, source_name: e.target.value }))} placeholder="e.g. G2 Reviews" /></div>
                <div className="space-y-2"><Label>Source URL</Label><Input value={newCitation.source_url} onChange={e => setNewCitation(p => ({ ...p, source_url: e.target.value }))} placeholder="https://g2.com/products/..." /></div>
                <div className="flex items-center gap-2"><Switch checked={newCitation.is_owned} onCheckedChange={v => setNewCitation(p => ({ ...p, is_owned: v }))} /><Label>Owned source</Label></div>
                <Button onClick={addCitation} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_15px_rgba(0,212,255,0.4)] border-0">Add Citation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Total Sources</p><p className="text-2xl font-bold text-foreground">{citations.length}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Owned</p><p className="text-2xl font-bold text-success">{ownedCount}</p></div>
          <div className="bg-card rounded-xl p-4 border border-border"><p className="text-sm text-muted-foreground">Total Mentions</p><p className="text-2xl font-bold text-primary">{totalMentions}</p></div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading citations...</div>
        ) : citations.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground mb-4">No citations tracked yet. Add your first citation source.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_15px_rgba(0,212,255,0.4)] border-0">Add Citation</Button>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-3">
            {citations.map((citation, index) => (
              <motion.div key={citation.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{citation.source_name}</span>
                    {citation.is_owned && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-success/20 text-success">Owned</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{citation.domain || citation.source_url}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{citation.mention_count || 0} mentions</div>
                  <div className="text-xs text-muted-foreground">Authority: {citation.authority_score || 0}</div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deleteCitation(citation.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
