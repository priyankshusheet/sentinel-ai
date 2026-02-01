import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [activeItem, setActiveItem] = useState('dashboard');
    const [sidebarWidth] = useState(240);

    return (
        <div className="min-h-screen bg-navy-900">
            <Sidebar
                activeItem={activeItem}
                onItemClick={setActiveItem}
            />

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="transition-all duration-200"
                style={{ marginLeft: sidebarWidth }}
            >
                {/* Header */}
                <header className="h-16 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-sm sticky top-0 z-40">
                    <div className="h-full px-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-text-primary">
                                {activeItem === 'dashboard' && 'Command Center'}
                                {activeItem === 'analytics' && 'The Eyes - Analytics Engine'}
                                {activeItem === 'optimization' && 'The Hands - Optimization Suite'}
                                {activeItem === 'strategy' && 'The Brain - Strategy Hub'}
                            </h1>
                            <p className="text-sm text-text-muted">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm text-text-muted">AI Visibility</p>
                                <p className="text-lg font-semibold text-teal-400">78.5%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-text-muted">Citations</p>
                                <p className="text-lg font-semibold text-text-primary">342</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-navy-900 font-bold">
                                S
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </motion.main>
        </div>
    );
}

export default DashboardLayout;
