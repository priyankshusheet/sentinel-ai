import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Link2 } from 'lucide-react';
import { clsx } from 'clsx';

interface RevenueWidgetProps {
    estimatedImpact?: number;
    aiTraffic?: number;
    citations?: number;
    visibilityChange?: number;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    change?: number;
    delay?: number;
}

function StatCard({ icon, label, value, change, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={clsx(
                'p-4 rounded-lg bg-navy-700/30',
                'border border-navy-600/30',
                'hover:border-teal-400/20 transition-colors'
            )}
        >
            <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-teal-400/10">
                    {icon}
                </div>
                {change !== undefined && (
                    <span className={clsx(
                        'text-xs font-medium flex items-center gap-1',
                        change >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                        <TrendingUp size={12} />
                        {change >= 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <p className="mt-3 text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-sm text-text-muted">{label}</p>
        </motion.div>
    );
}

export function RevenueWidget({
    estimatedImpact = 45200,
    aiTraffic = 12500,
    citations = 342,
    visibilityChange = 8.5
}: RevenueWidgetProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card card-hover"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted">Revenue Impact</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-teal-400/10 text-teal-400">
                    Monthly Estimate
                </span>
            </div>

            {/* Main Revenue Display */}
            <div className="text-center py-4 mb-4 border-b border-navy-700">
                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold gradient-text"
                >
                    {formatCurrency(estimatedImpact)}
                </motion.p>
                <p className="text-sm text-text-muted mt-1">
                    Estimated AI-Driven Revenue
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <StatCard
                    icon={<Users size={18} className="text-teal-400" />}
                    label="AI Traffic"
                    value={formatNumber(aiTraffic)}
                    change={12}
                    delay={0.1}
                />
                <StatCard
                    icon={<Link2 size={18} className="text-teal-400" />}
                    label="Citations"
                    value={formatNumber(citations)}
                    change={23}
                    delay={0.2}
                />
                <StatCard
                    icon={<DollarSign size={18} className="text-teal-400" />}
                    label="Visibility"
                    value={`${visibilityChange}%`}
                    change={visibilityChange}
                    delay={0.3}
                />
            </div>
        </motion.div>
    );
}

export default RevenueWidget;
