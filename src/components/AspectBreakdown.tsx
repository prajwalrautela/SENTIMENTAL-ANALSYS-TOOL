import { motion } from "motion/react";
import { AspectSentiment } from "../types";
import { Clapperboard, Film, FileText, Eye, Music, Hourglass, Quote } from "lucide-react";

interface AspectBreakdownProps {
  aspects: AspectSentiment[];
}

const ASPECT_ICONS: Record<string, typeof Film> = {
  "Acting & Cast": Film,
  "Direction & Vision": Clapperboard,
  "Screenplay & Dialogue": FileText,
  "Visuals & Cinematography": Eye,
  "Score & Sound": Music,
  "Pacing & Tone": Hourglass,
};

export function AspectBreakdown({ aspects }: AspectBreakdownProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Aspect-Based Opinion Mining
          </span>
          <h3 className="text-lg font-bold text-slate-100 font-display">
            Cinematic Element Breakdown
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aspects.map((item, idx) => {
          const Icon = ASPECT_ICONS[item.aspect] || Film;
          const scorePercent = Math.round(((item.score + 1) / 2) * 100);

          let badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30";
          let barColor = "from-amber-500 to-yellow-400";
          if (item.score >= 0.2) {
            badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
            barColor = "from-emerald-500 to-teal-400";
          } else if (item.score <= -0.2) {
            badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";
            barColor = "from-rose-500 to-red-500";
          }

          return (
            <motion.div
              key={item.aspect}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{item.aspect}</span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
                  >
                    {item.score > 0 ? `+${item.score.toFixed(2)}` : item.score.toFixed(2)}
                  </span>
                </div>

                {/* Score bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden relative">
                    {/* Neutral center marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-500/40 z-10" />
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt quote */}
              {item.excerpt && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400 italic flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 opacity-60" />
                  <span className="line-clamp-2">"{item.excerpt}"</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
