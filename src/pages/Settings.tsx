import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Slack, Webhook, Send, CheckCircle, Zap } from "lucide-react";
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

  const triggerManualAlert = async () => {
    if (!webhookUrl.trim()) { toast.error("Please configure a webhook URL first"); return; }
    try {
      await supabase.functions.invoke("send-webhook-alert", {
        body: {
          webhook_url: webhookUrl,
          alert_type: "visibility_drop",
          title: "🚨 Critical Visibility Drop Detected",
          message: "Your AI visibility score dropped from 78% to 61% over the past 24 hours. Immediate action recommended.",
          severity: "critical",
          platform: "ChatGPT, Perplexity",
        }
      });
      toast.success("Critical alert dispatched!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure alerts, integrations, and report exports</p>
        </div>

        {/* Webhook Integration */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Webhook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Webhook Alerts</h2>
              <p className="text-sm text-muted-foreground">Connect Slack, Discord, or any webhook endpoint</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/... or https://discord.com/api/webhooks/..."
                className="bg-secondary border-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Supports Slack Incoming Webhooks and Discord webhooks. Auto-detected from URL.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={testWebhook} disabled={testingWebhook} variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                {testingWebhook ? "Sending..." : "Test Connection"}
              </Button>
              <Button onClick={triggerManualAlert} variant="destructive" className="gap-2">
                <Bell className="h-4 w-4" /> Simulate Critical Alert
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Alert Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
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
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Zap className={`h-4 w-4 ${alertToggles[alert.id] ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.label}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAlertToggles(prev => ({ ...prev, [alert.id]: !prev[alert.id] }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${alertToggles[alert.id] ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${alertToggles[alert.id] ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" onClick={() => toast.success("Alert preferences saved!")}>
            <CheckCircle className="h-4 w-4 mr-2" /> Save Preferences
          </Button>
        </motion.div>

        {/* Report Generator */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ReportGenerator />
        </motion.div>

        {/* Slack quick setup */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Slack className="h-6 w-6 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Quick Setup Guide</h2>
          </div>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Go to <span className="text-primary">api.slack.com/apps</span> → Create New App → Incoming Webhooks</li>
            <li>Activate Incoming Webhooks and click "Add New Webhook to Workspace"</li>
            <li>Choose a channel and copy the Webhook URL</li>
            <li>Paste it above and click "Test Connection"</li>
          </ol>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
