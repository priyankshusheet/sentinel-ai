import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  FileText,
  Zap,
  Globe,
  Users,
  Bot,
  Puzzle,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Prompt Analytics",
    href: "/prompts",
    icon: Search,
    badge: "12 new",
  },
  {
    title: "Citations",
    href: "/citations",
    icon: FileText,
  },
  {
    title: "Optimization",
    href: "/optimization",
    icon: Zap,
    badge: "5 fixes",
  },
  {
    title: "Programmatic SEO",
    href: "/programmatic-seo",
    icon: Globe,
  },
  {
    title: "Competitors",
    href: "/competitors",
    icon: Users,
  },
  {
    title: "AI Agents",
    href: "/ai-agents",
    icon: Bot,
    badge: "Beta",
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Puzzle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex h-screen flex-col border-r border-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Sentinel-AI</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              !collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex flex-1 items-center justify-between overflow-hidden"
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          item.badge === "Beta"
                            ? "bg-accent/20 text-accent"
                            : "bg-primary/20 text-primary"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* AI Score Widget */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mb-3 overflow-hidden"
          >
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">AI Visibility</span>
              </div>
              <div className="text-2xl font-bold text-gradient">78.5</div>
              <div className="text-xs text-muted-foreground mt-1">+3.2% this week</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Section */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-primary-foreground">
            JD
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <div className="text-sm font-medium text-foreground truncate">John Doe</div>
                <div className="text-xs text-muted-foreground truncate">john@company.com</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
