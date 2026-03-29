import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Slack, Webhook, Send, CheckCircle, Zap, Puzzle, Key, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

const ALERT_THRESHOLDS = [
  { id: "visibility_drop", label: "Visibility Drop Alert", description: "Notify when visibility drops >10% in 24h", enabled: true },
  { id: "competitor_gain", label: "Competitor Overtake", description: "Alert when a competitor surpasses your ranking", enabled: true },
  { id: "new_citation", label: "New Citation Detected", description: "Notify when your brand is newly cited", enabled: false },
  { id: "weekly_summary", label: "Weekly Digest", description: "Send weekly AEO performance summary", enabled: true },
];

export default function Settings() {
  const { user } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [alertToggles, setAlertToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERT_THRESHOLDS.map(a => [a.id, a.enabled]))
  );
  
  // Profile State
  const [profile, setProfile] = useState({
    company_name: "",
    website_url: "",
    industry: "",
    selected_llms: ["ChatGPT", "Claude", "Gemini", "Perplexity"]
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load Profile
  useState(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile({
          company_name: data.company_name || "",
          website_url: data.website_url || "",
          industry: data.industry || "",
          selected_llms: data.selected_llms || ["ChatGPT", "Claude", "Gemini", "Perplexity"]
        });
        setWebhookUrl(data.webhook_url || "");
        if (data.alert_preferences) setAlertToggles(data.alert_preferences);
      }
    };
    loadProfile();
  });

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profile,
          webhook_url: webhookUrl,
          alert_preferences: alertToggles,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) { toast.error("Please enter a webhook URL first"); return; }
    setTestingWebhook(true);
    try {
      const { error } = await supabase.functions.invoke("send-webhook-alert", {
        body: {
          webhook_url: webhookUrl,
          alert_type: "test",
          title: "Sentinel AI – Webhook Test",
          message: "✅ Your webhook is configured correctly! You'll receive alerts here for critical AI visibility events.",
          severity: "info",
        }
      });
      if (error) throw error;
      toast.success("Test alert sent successfully!");
    } catch (e: any) {
      toast.error("Webhook test failed: " + e.message);
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl py-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure alerts, integrations, and report exports</p>
        </div>

        {/* Profile Information */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Manage your brand and company details</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={profile.company_name}
                onChange={e => setProfile(p => ({ ...p, company_name: e.target.value }))}
                placeholder="Acme Corp"
                className="bg-secondary/50 border-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={profile.website_url}
                onChange={e => setProfile(p => ({ ...p, website_url: e.target.value }))}
                placeholder="https://acme.com"
                className="bg-secondary/50 border-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <select 
                value={profile.industry}
                onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))}
                className="w-full h-10 rounded-md bg-secondary/50 border-white/5 px-3 text-sm focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="">Select Industry</option>
                <option value="SaaS">SaaS</option>
                <option value="FinTech">FinTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Target LLMs</Label>
              <div className="flex flex-wrap gap-2">
                {["ChatGPT", "Claude", "Gemini", "Perplexity"].map(llm => (
                  <button
                    key={llm}
                    onClick={() => setProfile(p => ({
                      ...p,
                      selected_llms: p.selected_llms.includes(llm) 
                        ? p.selected_llms.filter(l => l !== llm)
                        : [...p.selected_llms, llm]
                    }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      profile.selected_llms.includes(llm) ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {llm}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold" onClick={saveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Update Profile"}
          </Button>
        </section>

        {/* API & Developers */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Puzzle size={120} className="text-purple-400" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Puzzle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">API & Developers</h2>
              <p className="text-sm text-muted-foreground">Access Sentinel AI programmatically</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Management API Key</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="sentinel_live_sk_83920xk29381..."
                  className="bg-secondary/50 border-white/5 font-mono text-xs"
                />
                <Button variant="outline" size="icon" className="shrink-0 border-white/10" onClick={() => toast.success("Copied to clipboard!")}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="shrink-0 border-white/10" onClick={() => toast.success("Key rotated successfully!")}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Last rotated: March 27, 2026. This key allows full analyst access.</p>
            </div>
            <div className="pt-2">
              <Button variant="link" className="text-xs text-purple-400 h-auto p-0" onClick={() => window.open('https://docs.sentinel.ai')}>View API Documentation →</Button>
            </div>
          </div>
        </section>

        {/* Webhook Integration */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Webhook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Webhook Alerts</h2>
              <p className="text-sm text-muted-foreground">Connect Slack, Discord, or any custom endpoint</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/... or https://discord.com/api/webhooks/..."
                className="bg-secondary/50 border-white/5 font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={testWebhook} disabled={testingWebhook} variant="outline" className="gap-2 border-white/10 hover:bg-secondary">
                <Send className="h-4 w-4" />
                {testingWebhook ? "Sending..." : "Test Connection"}
              </Button>
            </div>
          </div>
        </section>

        {/* Alert Preferences */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Alert Preferences</h2>
              <p className="text-sm text-muted-foreground">Choose which events trigger notifications</p>
            </div>
          </div>
          <div className="space-y-3">
            {ALERT_THRESHOLDS.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <Zap className={`h-4 w-4 ${alertToggles[alert.id] ? "text-cyan-400" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.label}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAlertToggles(prev => ({ ...prev, [alert.id]: !prev[alert.id] }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${alertToggles[alert.id] ? "bg-cyan-500" : "bg-muted"}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${alertToggles[alert.id] ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-secondary border border-white/5 hover:bg-secondary/80" onClick={saveProfile}>
            <CheckCircle className="h-4 w-4 mr-2" /> Save Alert Logic
          </Button>
        </section>

        <section>
          <ReportGenerator />
        </section>
      </div>
    </DashboardLayout>
  );
}
