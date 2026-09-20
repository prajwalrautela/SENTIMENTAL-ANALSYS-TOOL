import { useState } from "react";
import { motion } from "motion/react";
import { SentencePolarity, KeywordWeight } from "../types";
import { Layers, ThumbsUp, ThumbsDown, AlertCircle, Sparkles, UserCheck } from "lucide-react";

interface SentenceHeatmapProps {
  sentences: SentencePolarity[];
  positiveKeywords: KeywordWeight[];
  negativeKeywords: KeywordWeight[];
  sarcasmDetected: boolean;
  recommendedAudience: string;
}

export function SentenceHeatmap({
  sentences,
  positiveKeywords,
  negativeKeywords,
  sarcasmDetected,
  recommendedAudience,
}: SentenceHeatmapProps) {
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState<number | null>(null);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Linguistic Density
          </span>
          <h3 className="text-lg font-bold text-slate-100 font-display">
            Interactive Sentence Heatmap & Lexical Drivers
          </h3>
        </div>

        {sarcasmDetected && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold"
          >
            <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Nuance / Irony Detected</span>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-slate-400 mb-4">
        Click any sentence below to isolate its polarity score and inspect its narrative weight.
      </p>

      {/* Heatmap Paragraph */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm sm:text-base leading-relaxed text-slate-200 space-x-1.5 select-text mb-6">
        {sentences.map((item, idx) => {
          const isSelected = selectedSentenceIdx === idx;
          let styleClass = "bg-transparent hover:bg-slate-800/60 text-slate-300";

          if (item.polarity >= 0.4) {
            styleClass = "bg-emerald-500/15 border-b-2 border-emerald-400/80 text-emerald-200 hover:bg-emerald-500/25";
          } else if (item.polarity >= 0.15) {
            styleClass = "bg-teal-500/10 border-b border-teal-400/50 text-teal-200 hover:bg-teal-500/20";
          } else if (item.polarity <= -0.4) {
            styleClass = "bg-rose-500/15 border-b-2 border-rose-400/80 text-rose-200 hover:bg-rose-500/25";
          } else if (item.polarity <= -0.15) {
            styleClass = "bg-red-500/10 border-b border-red-400/50 text-red-200 hover:bg-red-500/20";
          }

          if (isSelected) {
            styleClass += " ring-2 ring-indigo-400 shadow-lg font-medium";
          }

          return (
            <motion.span
              key={idx}
              onClick={() => setSelectedSentenceIdx(isSelected ? null : idx)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`inline cursor-pointer px-1.5 py-0.5 rounded transition-all duration-200 ${styleClass}`}
              title={`Polarity: ${item.polarity > 0 ? "+" : ""}${item.polarity} (${item.label})`}
            >
              {item.sentence}{" "}
            </motion.span>
          );
        })}
      </div>

      {/* Focused Sentence Badge if Selected */}
      {selectedSentenceIdx !== null && sentences[selectedSentenceIdx] && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4"
        >
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-indigo-400">Selected Sentence #{selectedSentenceIdx + 1}:</span>{" "}
            "{sentences[selectedSentenceIdx].sentence}"
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                sentences[selectedSentenceIdx].polarity > 0
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : sentences[selectedSentenceIdx].polarity < 0
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {sentences[selectedSentenceIdx].polarity > 0 ? "+" : ""}
              {sentences[selectedSentenceIdx].polarity} ({sentences[selectedSentenceIdx].label})
            </span>
            <button
              onClick={() => setSelectedSentenceIdx(null)}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Keywords and Audience Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Drivers */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-semibold">
            <ThumbsUp className="w-4 h-4" />
            <span>Key Positive Valence Drivers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {positiveKeywords.length > 0 ? (
              positiveKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center gap-1.5"
                >
                  <span>{kw.word}</span>
                  <span className="text-[10px] font-mono opacity-70">+{kw.weight}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No strong positive lexical tokens</span>
            )}
          </div>
        </div>

        {/* Negative Drivers */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
          <div className="flex items-center gap-2 mb-3 text-rose-400 text-xs font-semibold">
            <ThumbsDown className="w-4 h-4" />
            <span>Key Negative Valence Drivers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {negativeKeywords.length > 0 ? (
              negativeKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium flex items-center gap-1.5"
                >
                  <span>{kw.word}</span>
                  <span className="text-[10px] font-mono opacity-70">-{kw.weight}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No strong negative lexical tokens</span>
            )}
          </div>
        </div>
      </div>

      {/* Target Audience Recommendation */}
      {recommendedAudience && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-0.5">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Target Demographic / Viewership Resonance</span>
            <p className="text-sm text-slate-200 mt-0.5">{recommendedAudience}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
