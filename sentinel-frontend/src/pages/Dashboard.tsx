import { motion } from 'framer-motion';
import { VisibilityMeter } from '../components/dashboard/VisibilityMeter';
import { CitationNodeMap } from '../components/dashboard/CitationNodeMap';
import { RevenueWidget } from '../components/dashboard/RevenueWidget';
import { ActionList } from '../components/dashboard/ActionList';
import { Sparkles, Target, Zap, TrendingUp } from 'lucide-react';

interface QuickStatProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
}

function QuickStat({ icon, label, value, trend, trendUp }: QuickStatProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="card card-hover flex items-center gap-4"
        >
            <div className="p-3 rounded-xl bg-teal-400/10">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-text-muted">{label}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
            </div>
            <div className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
            </div>
        </motion.div>
    );
}

export function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Sparkles className="text-teal-400" size={24} />
                        Welcome to Command Center
                    </h1>
                    <p className="text-text-muted mt-1">
                        Your AI visibility overview at a glance
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-teal-400 text-navy-900 font-semibold flex items-center gap-2 hover:bg-teal-300 transition-colors"
                >
                    <Zap size={18} />
                    Run Full Scan
                </motion.button>
            </motion.div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <QuickStat
                    icon={<Target className="text-teal-400" size={24} />}
                    label="Prompt Coverage"
                    value="78%"
                    trend="+5.2%"
                    trendUp={true}
                />
                <QuickStat
                    icon={<Sparkles className="text-teal-400" size={24} />}
                    label="AI Mentions"
                    value="4,580"
                    trend="+12.8%"
                    trendUp={true}
                />
                <QuickStat
                    icon={<TrendingUp className="text-teal-400" size={24} />}
                    label="Schema Score"
                    value="72.5"
                    trend="+3.1%"
                    trendUp={true}
                />
                <QuickStat
                    icon={<Zap className="text-teal-400" size={24} />}
                    label="Agentic Ready"
                    value="67.5%"
                    trend="-2.1%"
                    trendUp={false}
                />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VisibilityMeter score={78} previousScore={73} />
                        <CitationNodeMap />
                    </div>
                    <RevenueWidget />
                </div>

                {/* Right Column - Action Items */}
                <div className="space-y-6">
                    <ActionList />

                    {/* AI Insight Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="card border-teal-400/20"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-teal-400/10">
                                <Sparkles className="text-teal-400" size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-text-primary">AI Insight</h4>
                                <p className="text-sm text-text-muted mt-1">
                                    Your brand was mentioned <span className="text-teal-400 font-medium">23% more</span> in
                                    AI-generated answers this week. Focus on FAQ schema to maintain this growth.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
