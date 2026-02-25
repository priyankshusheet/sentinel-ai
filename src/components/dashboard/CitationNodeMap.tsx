import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  type: "brand" | "owned" | "external";
  x: number;
  y: number;
  mentions: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const WIDTH = 480;
const HEIGHT = 300;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

const RAW_NODES: Omit<Node, "x" | "y">[] = [
  { id: "brand", label: "Your Brand", type: "brand", mentions: 487 },
  { id: "g2", label: "G2", type: "owned", mentions: 156 },
  { id: "capterra", label: "Capterra", type: "owned", mentions: 128 },
  { id: "producthunt", label: "Product Hunt", type: "external", mentions: 87 },
  { id: "techcrunch", label: "TechCrunch", type: "external", mentions: 64 },
  { id: "blog", label: "Your Blog", type: "owned", mentions: 52 },
  { id: "reddit", label: "Reddit", type: "external", mentions: 43 },
];

const EDGES: Edge[] = [
  { source: "brand", target: "g2", weight: 3 },
  { source: "brand", target: "capterra", weight: 3 },
  { source: "brand", target: "producthunt", weight: 2 },
  { source: "brand", target: "techcrunch", weight: 2 },
  { source: "brand", target: "blog", weight: 2 },
  { source: "brand", target: "reddit", weight: 1 },
  { source: "g2", target: "capterra", weight: 1 },
];

function buildNodes(): Node[] {
  const satellites = RAW_NODES.slice(1);
  const angleStep = (2 * Math.PI) / satellites.length;
  const radius = 100;
  return [
    { ...RAW_NODES[0], x: CENTER_X, y: CENTER_Y },
    ...satellites.map((n, i) => ({
      ...n,
      x: CENTER_X + radius * Math.cos(angleStep * i - Math.PI / 2),
      y: CENTER_Y + radius * Math.sin(angleStep * i - Math.PI / 2),
    })),
  ];
}

const NODES = buildNodes();
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

const typeColor: Record<Node["type"], string> = {
  brand: "hsl(var(--primary))",
  owned: "hsl(var(--success))",
  external: "hsl(var(--muted-foreground))",
};

export function CitationNodeMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hoveredNode = hovered ? NODE_MAP[hovered] : null;

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Citation Node Map</h3>
          <p className="text-sm text-muted-foreground">How AI engines connect your brand</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> You</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success inline-block" /> Owned</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground inline-block" /> External</span>
        </div>
      </div>

      <div className="relative" style={{ height: HEIGHT }}>
        <svg
          width="100%"
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="overflow-visible"
        >
          {/* Edges */}
          {EDGES.map((edge) => {
            const src = NODE_MAP[edge.source];
            const tgt = NODE_MAP[edge.target];
            const isActive = hovered === edge.source || hovered === edge.target;
            return (
              <motion.line
                key={`${edge.source}-${edge.target}`}
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={isActive ? edge.weight + 1 : edge.weight}
                strokeOpacity={isActive ? 0.9 : 0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const r = node.type === "brand" ? 22 : 13;
            const isHovered = hovered === node.id;
            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: mounted ? i * 0.08 : 0, type: "spring", stiffness: 200 }}
                style={{ originX: `${node.x}px`, originY: `${node.y}px`, cursor: "pointer" }}
                onHoverStart={() => setHovered(node.id)}
                onHoverEnd={() => setHovered(null)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <motion.circle
                    cx={node.x} cy={node.y}
                    r={r + 8}
                    fill={typeColor[node.type]}
                    fillOpacity={0.15}
                    initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  />
                )}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={typeColor[node.type]}
                  fillOpacity={isHovered ? 1 : 0.85}
                />
                <text
                  x={node.x} y={node.type === "brand" ? node.y + 5 : node.y + 4}
                  textAnchor="middle"
                  fontSize={node.type === "brand" ? 8 : 7}
                  fontWeight="600"
                  fill="white"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.label.split(" ").map((w, wi) => (
                    <tspan key={wi} x={node.x} dy={wi === 0 ? (node.label.includes(" ") ? "-4" : "0") : "10"}>{w}</tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredNode && (
          <motion.div
            className="absolute bottom-0 right-0 bg-popover border border-border rounded-xl p-3 text-sm shadow-lg min-w-36"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="font-semibold text-foreground">{hoveredNode.label}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{hoveredNode.mentions} mentions</p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              hoveredNode.type === "owned" ? "bg-success/20 text-success" :
              hoveredNode.type === "brand" ? "bg-primary/20 text-primary" :
              "bg-muted text-muted-foreground"
            }`}>
              {hoveredNode.type === "owned" ? "Owned Source" : hoveredNode.type === "brand" ? "Your Brand" : "External Source"}
            </span>
          </motion.div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-success">3 owned</span> / {NODES.length - 1} total sources
        </span>
        <button className="text-primary hover:underline text-xs">View all citations →</button>
      </div>
    </div>
  );
}
