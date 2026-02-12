import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Search, FileText, Zap, Globe, Users, Bot, Puzzle, Settings,
  Sparkles, Menu, X, LogOut, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Prompt Analytics", href: "/prompts", icon: Search, badge: "12 new" },
  { title: "Citations", href: "/citations", icon: FileText },
  { title: "Optimization", href: "/optimization", icon: Zap, badge: "5 fixes" },
  { title: "Programmatic SEO", href: "/programmatic-seo", icon: Globe },
  { title: "Competitors", href: "/competitors", icon: Users },
  { title: "AI Agents", href: "/ai-agents", icon: Bot, badge: "Beta" },
  { title: "Integrations", href: "/integrations", icon: Puzzle },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar border-r border-border">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Sentinel AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    item.badge === "Beta" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* AI Score Widget */}
        <div className="mx-3 mb-3">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">AI Visibility</span>
            </div>
            <div className="text-2xl font-bold text-gradient">78.5</div>
            <div className="text-xs text-muted-foreground mt-1">+3.2% this week</div>
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-primary-foreground">
              {user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-foreground truncate">{user?.user_metadata?.full_name || user?.email || "User"}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-3 py-2 mt-1 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
