import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SentencePolarity } from "../types";
import { TrendingUp, Activity, MessageSquare } from "lucide-react";

interface TrendTrajectoryProps {
  sentences: SentencePolarity[];
}

export function TrendTrajectory({ sentences }: TrendTrajectoryProps) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  if (!sentences || sentences.length === 0) {
    return null;
  }

  // Width and height of SVG canvas
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;
  const zeroY = paddingY + chartHeight / 2;

  // Calculate coordinates for each sentence
  const points = sentences.map((item, idx) => {
    const x =
      sentences.length > 1
        ? paddingX + (idx / (sentences.length - 1)) * chartWidth
        : paddingX + chartWidth / 2;
    // item.polarity is -1 to 1; 1 -> paddingY, 0 -> zeroY, -1 -> zeroY + chartHeight/2
    const y = zeroY - item.polarity * (chartHeight / 2);
    return { x, y, ...item, index: idx };
  });

  // Construct smooth SVG path using cubic beziers or line segments
  let linePath = "";
  if (points.length === 1) {
    linePath = `M ${points[0].x - 40} ${points[0].y} L ${points[0].x + 40} ${points[0].y}`;
  } else {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      linePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // Active sentence details
  const activePoint = activeSentenceIndex !== null ? points[activeSentenceIndex] : null;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Narrative Arc & Trend
          </span>
          <h3 className="text-lg font-bold text-slate-100 font-display">
            Chronological Polarity Trajectory
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Praise Arc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Critique Arc</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950/60 border border-slate-800/80 p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="trendStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {points.map((pt, idx) => {
                const offset = sentences.length > 1 ? (idx / (sentences.length - 1)) * 100 : 50;
                const color = pt.polarity >= 0.15 ? "#10b981" : pt.polarity <= -0.15 ? "#f43f5e" : "#f59e0b";
                return <stop key={idx} offset={`${offset}%`} stopColor={color} />;
              })}
            </linearGradient>

            <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Neutral Reference Axis */}
          <line
            x1={paddingX}
            y1={zeroY}
            x2={svgWidth - paddingX}
            y2={zeroY}
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={paddingX - 10}
            y={zeroY + 4}
            fill="#64748b"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            0.0
          </text>

          <text
            x={paddingX - 10}
            y={paddingY + 8}
            fill="#10b981"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            +1.0
          </text>

          <text
            x={paddingX - 10}
            y={svgHeight - paddingY}
            fill="#f43f5e"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            -1.0
          </text>

          {/* Trajectory Stroke */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#trendStrokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Interactive Data Points */}
          {points.map((pt, idx) => {
            const isHovered = activeSentenceIndex === idx;
            const ptColor = pt.polarity >= 0.15 ? "#10b981" : pt.polarity <= -0.15 ? "#f43f5e" : "#f59e0b";

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActiveSentenceIndex(idx)}
                onClick={() => setActiveSentenceIndex(idx)}
              >
                {/* Invisible larger hover hit target */}
                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                {/* Visible Animated Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 5}
                  fill={isHovered ? "#ffffff" : ptColor}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="none"
                    stroke={ptColor}
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Narrative Flow Stage Labels */}
        <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-6">
          <span>Opening Hook</span>
          <span>Core Exposition & Pacing</span>
          <span>Climax & Final Verdict</span>
        </div>
      </div>

      {/* Active Sentence Callout Tooltip Card */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-300">
                  Sentence #{activePoint.index + 1} of {sentences.length}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    activePoint.polarity >= 0.15
                      ? "bg-emerald-500/20 text-emerald-300"
                      : activePoint.polarity <= -0.15
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {activePoint.polarity > 0 ? `+${activePoint.polarity}` : activePoint.polarity} ({activePoint.label})
                </span>
              </div>
              <p className="text-sm text-slate-200 italic">"{activePoint.sentence}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
