import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface VisibilityMeterProps {
    score: number;
    previousScore?: number;
    label?: string;
}

export function VisibilityMeter({
    score,
    previousScore = score,
    label = "AI Visibility Score"
}: VisibilityMeterProps) {
    const change = score - previousScore;
    const data = [{ name: 'Score', value: score, fill: 'url(#tealGradient)' }];

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-400';
        if (s >= 60) return 'text-teal-400';
        if (s >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Good';
        if (s >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card card-hover"
        >
            <h3 className="text-sm font-medium text-text-muted mb-4">{label}</h3>

            <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={12}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <defs>
                            <linearGradient id="tealGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#38b2ac" />
                                <stop offset="100%" stopColor="#64ffda" />
                            </linearGradient>
                        </defs>
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: '#1d3557' }}
                            dataKey="value"
                            cornerRadius={6}
                            angleAxisId={0}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Center Score Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={clsx('text-5xl font-bold', getScoreColor(score))}
                    >
                        {score}
                    </motion.span>
                    <span className="text-text-muted text-sm mt-1">
                        {getScoreLabel(score)}
                    </span>
                </div>
            </div>

            {/* Change Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
                {change > 0 && (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp size={16} />
                        +{change.toFixed(1)}%
                    </span>
                )}
                {change < 0 && (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                        <TrendingDown size={16} />
                        {change.toFixed(1)}%
                    </span>
                )}
                {change === 0 && (
                    <span className="flex items-center gap-1 text-text-muted text-sm">
                        <Minus size={16} />
                        No change
                    </span>
                )}
                <span className="text-text-muted text-sm">vs last week</span>
            </div>
        </motion.div>
    );
}

export default VisibilityMeter;
