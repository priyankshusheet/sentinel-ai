import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Eye,
    Wrench,
    Brain,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Commander', icon: <LayoutDashboard size={20} /> },
    { id: 'analytics', label: 'The Eyes', icon: <Eye size={20} />, badge: 3 },
    { id: 'optimization', label: 'The Hands', icon: <Wrench size={20} /> },
    { id: 'strategy', label: 'The Brain', icon: <Brain size={20} />, badge: 5 },
];

interface SidebarProps {
    activeItem: string;
    onItemClick: (id: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={clsx(
                'fixed left-0 top-0 h-screen',
                'bg-navy-950 border-r border-navy-700/50',
                'flex flex-col z-50'
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-navy-700/50">
                <motion.div
                    className="flex items-center gap-3"
                    animate={{ opacity: collapsed ? 0 : 1 }}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <Zap size={18} className="text-navy-900" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-lg gradient-text">SENTINEL</span>
                    )}
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                            'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                            'transition-colors duration-200',
                            activeItem === item.id
                                ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                                : 'text-text-secondary hover:text-text-primary hover:bg-navy-800/50'
                        )}
                    >
                        <span className={clsx(
                            activeItem === item.id && 'text-teal-400'
                        )}>
                            {item.icon}
                        </span>
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left text-sm font-medium">
                                    {item.label}
                                </span>
                                {item.badge && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-teal-400/20 text-teal-400">
                                        {item.badge}
                                    </span>
                                )}
                            </>
                        )}
                    </motion.button>
                ))}
            </nav>

            {/* Settings & Collapse */}
            <div className="p-3 border-t border-navy-700/50 space-y-2">
                <button
                    className={clsx(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                        'text-text-secondary hover:text-text-primary hover:bg-navy-800/50',
                        'transition-colors duration-200'
                    )}
                >
                    <Settings size={20} />
                    {!collapsed && <span className="text-sm font-medium">Settings</span>}
                </button>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={clsx(
                        'w-full flex items-center justify-center py-2 rounded-lg',
                        'text-text-muted hover:text-text-secondary hover:bg-navy-800/50',
                        'transition-colors duration-200'
                    )}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </motion.aside>
    );
}

export default Sidebar;
