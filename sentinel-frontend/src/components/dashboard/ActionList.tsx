import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface ActionItem {
    id: string;
    title: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    impact: string;
    completed: boolean;
}

interface ActionListProps {
    items?: ActionItem[];
    onToggle?: (id: string) => void;
}

const defaultItems: ActionItem[] = [
    {
        id: 'act-001',
        title: 'Add FAQ schema to top 10 landing pages',
        priority: 'critical',
        category: 'Schema',
        impact: 'High visibility boost expected',
        completed: false,
    },
    {
        id: 'act-002',
        title: 'Create "What is X" content for key product terms',
        priority: 'high',
        category: 'Content',
        impact: 'Improves definition queries',
        completed: false,
    },
    {
        id: 'act-003',
        title: 'Update Organization schema with complete info',
        priority: 'high',
        category: 'Schema',
        impact: 'Better brand entity recognition',
        completed: true,
    },
    {
        id: 'act-004',
        title: 'Build citations from AI-referenced sources',
        priority: 'medium',
        category: 'Authority',
        impact: 'Increases citation network',
        completed: false,
    },
    {
        id: 'act-005',
        title: 'Optimize meta descriptions for AI snippets',
        priority: 'medium',
        category: 'Content',
        impact: 'Better answer extraction',
        completed: false,
    },
];

const priorityStyles = {
    critical: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: <AlertTriangle size={14} />,
    },
    high: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: <ArrowRight size={14} />,
    },
    medium: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: <Circle size={14} />,
    },
    low: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: <Circle size={14} />,
    },
};

export function ActionList({ items = defaultItems, onToggle }: ActionListProps) {
    const [expanded, setExpanded] = useState(true);
    const [localItems, setLocalItems] = useState(items);

    const handleToggle = (id: string) => {
        setLocalItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
        onToggle?.(id);
    };

    const completedCount = localItems.filter(i => i.completed).length;
    const totalCount = localItems.length;
    const progressPercent = (completedCount / totalCount) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-text-muted">AEO Action Items</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                        {completedCount} of {totalCount} completed
                    </p>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 rounded hover:bg-navy-700 transition-colors"
                >
                    {expanded ? (
                        <ChevronUp size={18} className="text-text-muted" />
                    ) : (
                        <ChevronDown size={18} className="text-text-muted" />
                    )}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mb-4">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />
            </div>

            {/* Action Items */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 overflow-hidden"
                    >
                        {localItems.map((item, index) => {
                            const style = priorityStyles[item.priority];
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleToggle(item.id)}
                                    className={clsx(
                                        'p-3 rounded-lg cursor-pointer',
                                        'border transition-all duration-200',
                                        item.completed
                                            ? 'bg-navy-800/50 border-navy-700/50 opacity-60'
                                            : `${style.bg} ${style.border} hover:border-opacity-60`
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <div
                                            className={clsx(
                                                'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center',
                                                'transition-colors duration-200',
                                                item.completed
                                                    ? 'bg-teal-400 border-teal-400'
                                                    : 'border-text-muted hover:border-teal-400'
                                            )}
                                        >
                                            {item.completed && (
                                                <Check size={12} className="text-navy-900" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={clsx(
                                                    'text-sm font-medium',
                                                    item.completed
                                                        ? 'text-text-muted line-through'
                                                        : 'text-text-primary'
                                                )}
                                            >
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={clsx(
                                                        'text-xs px-2 py-0.5 rounded-full flex items-center gap-1',
                                                        style.bg,
                                                        style.text
                                                    )}
                                                >
                                                    {style.icon}
                                                    {item.priority}
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ActionList;
