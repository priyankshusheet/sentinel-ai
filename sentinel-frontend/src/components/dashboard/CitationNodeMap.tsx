import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { clsx } from 'clsx';

interface CitationNode {
    name: string;
    size: number;
    sentiment: number;
    citations: number;
}

interface CitationNodeMapProps {
    data?: CitationNode[];
}

const defaultData: CitationNode[] = [
    { name: 'ChatGPT', size: 4500, sentiment: 0.85, citations: 156 },
    { name: 'Perplexity', size: 3200, sentiment: 0.92, citations: 98 },
    { name: 'Claude', size: 2800, sentiment: 0.78, citations: 67 },
    { name: 'Gemini', size: 1800, sentiment: 0.72, citations: 45 },
    { name: 'Copilot', size: 1200, sentiment: 0.68, citations: 32 },
    { name: 'You.com', size: 800, sentiment: 0.82, citations: 21 },
];

// Transform data for Treemap
const transformData = (data: CitationNode[]) => ({
    name: 'Citations',
    children: data.map(item => ({
        name: item.name,
        size: item.size,
        sentiment: item.sentiment,
        citations: item.citations,
    })),
});

// Custom content renderer for treemap cells
const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, sentiment, citations } = props;

    if (width < 50 || height < 40) return null;

    const getSentimentColor = (s: number) => {
        if (s >= 0.8) return '#64ffda';
        if (s >= 0.6) return '#4fd1c5';
        if (s >= 0.4) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={8}
                fill={getSentimentColor(sentiment)}
                fillOpacity={0.15}
                stroke={getSentimentColor(sentiment)}
                strokeWidth={2}
                strokeOpacity={0.5}
            />
            <text
                x={x + width / 2}
                y={y + height / 2 - 10}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize={width > 100 ? 14 : 11}
                fontWeight="600"
            >
                {name}
            </text>
            <text
                x={x + width / 2}
                y={y + height / 2 + 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={width > 100 ? 12 : 10}
            >
                {citations} citations
            </text>
        </g>
    );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="glass rounded-lg p-3 border border-teal-400/20">
                <p className="font-semibold text-text-primary">{data.name}</p>
                <p className="text-sm text-teal-400">{data.citations} citations</p>
                <p className="text-sm text-text-muted">
                    Sentiment: {(data.sentiment * 100).toFixed(0)}%
                </p>
            </div>
        );
    }
    return null;
};

export function CitationNodeMap({ data = defaultData }: CitationNodeMapProps) {
    const treeData = transformData(data);
    const totalCitations = data.reduce((sum, d) => sum + d.citations, 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card card-hover"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted">Citation Network</h3>
                <span className="text-xs text-teal-400 font-medium">
                    {totalCitations} total citations
                </span>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={treeData.children}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        stroke="#0a192f"
                        content={<CustomizedContent />}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {data.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div
                            className={clsx(
                                'w-3 h-3 rounded-full',
                                item.sentiment >= 0.8 && 'bg-teal-400',
                                item.sentiment >= 0.6 && item.sentiment < 0.8 && 'bg-teal-500',
                                item.sentiment < 0.6 && 'bg-yellow-400'
                            )}
                        />
                        <span className="text-xs text-text-muted">{item.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default CitationNodeMap;
