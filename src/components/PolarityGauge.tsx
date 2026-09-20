import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { Sparkles, ShieldCheck, HelpCircle } from "lucide-react";

interface PolarityGaugeProps {
  score: number; // -1.0 to 1.0
  label: string;
  confidence: number;
  subjectivityScore: number;
  engineUsed: string;
}

export function PolarityGauge({
  score,
  label,
  confidence,
  subjectivityScore,
  engineUsed,
}: PolarityGaugeProps) {
  // Score mapped from -1.0..1.0 to angle -90deg..90deg
  const targetAngle = score * 90;

  // Spring animation for smooth needle movement
  const springAngle = useSpring(targetAngle, {
    stiffness: 70,
    damping: 14,
    mass: 1,
  });

  useEffect(() => {
    springAngle.set(targetAngle);
  }, [targetAngle, springAngle]);

  // Rolling counter display for numeric score
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    let start = displayScore;
    const end = score;
    const duration = 650;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }, [score]);

  // Color scheme based on polarity
  const getColor = (s: number) => {
    if (s >= 0.5) return { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", glow: "#10b981", label: "Strongly Positive" };
    if (s >= 0.15) return { text: "text-teal-400", border: "border-teal-500/30", bg: "bg-teal-500/10", glow: "#14b8a6", label: "Positive" };
    if (s > -0.15) return { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", glow: "#f59e0b", label: "Neutral" };
    if (s > -0.5) return { text: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10", glow: "#f43f5e", label: "Negative" };
    return { text: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10", glow: "#ef4444", label: "Strongly Negative" };
  };

  const currentTheme = getColor(score);

  // Normalized 0 to 100 percentage
  const normalizedPercentage = Math.round(((score + 1) / 2) * 100);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="relative p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300 group overflow-hidden"
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-[1px] opacity-70 blur-[1px] transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentTheme.glow}, transparent)`,
        }}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Sentiment Gauge
          </span>
          <h3 className="text-lg font-bold text-slate-100 font-display">
            Overall Polarity Score
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{confidence}% Confidence</span>
        </div>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2 select-none">
        <svg
          viewBox="0 0 260 145"
          className="w-full max-w-[280px] overflow-visible drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={currentTheme.glow} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 25 130 A 105 105 0 0 1 235 130"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Gradient Active Arc */}
          <path
            d="M 25 130 A 105 105 0 0 1 235 130"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="330"
            strokeDashoffset="0"
            opacity="0.85"
          />

          {/* Ticks */}
          {[-1, -0.5, 0, 0.5, 1].map((val) => {
            const angle = val * 90; // -90 to +90
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = 130 + 88 * Math.cos(rad);
            const y1 = 130 + 88 * Math.sin(rad);
            const x2 = 130 + 102 * Math.cos(rad);
            const y2 = 130 + 102 * Math.sin(rad);

            return (
              <line
                key={val}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Rotating Needle */}
          <motion.g
            style={{
              originX: "130px",
              originY: "130px",
              rotate: springAngle,
            }}
          >
            {/* Needle Line */}
            <line
              x1="130"
              y1="130"
              x2="130"
              y2="42"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            {/* Arrow Tip Accent */}
            <circle cx="130" cy="40" r="4.5" fill={currentTheme.glow} />
          </motion.g>

          {/* Center Hub */}
          <circle cx="130" cy="130" r="14" fill="#0f172a" stroke="#334155" strokeWidth="3" />
          <circle cx="130" cy="130" r="6" fill={currentTheme.glow} />

          {/* Tick Labels */}
          <text x="22" y="145" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">-1.0</text>
          <text x="130" y="24" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">0.0</text>
          <text x="238" y="145" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">+1.0</text>
        </svg>

        {/* Floating Numeric Score Badge */}
        <motion.div
          key={label}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center -mt-4"
        >
          <div className="flex items-center justify-center gap-1">
            <span
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-display transition-colors duration-300 ${currentTheme.text}`}
            >
              {displayScore >= 0 ? `+${displayScore.toFixed(2)}` : displayScore.toFixed(2)}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs sm:text-sm font-semibold border ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text} transition-colors duration-300`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {label}
          </div>
        </motion.div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        {/* Normalized Rating */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>Positive Scale</span>
            <span className="font-mono text-slate-200 font-semibold">{normalizedPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${normalizedPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Subjectivity vs Objectivity */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>Subjectivity</span>
            <span className="font-mono text-slate-200 font-semibold">
              {Math.round(subjectivityScore * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(subjectivityScore * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Factual</span>
            <span>Opinionated</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
