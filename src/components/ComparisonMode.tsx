import { useState } from "react";
import { motion } from "motion/react";
import { SAMPLE_MOVIE_REVIEWS } from "../data/sampleReviews";
import { analyzeSentimentLocally } from "../utils/localSentimentEngine";
import { GitCompare, Sparkles, Film, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export function ComparisonMode() {
  const [reviewAId, setReviewAId] = useState<string>("oppenheimer");
  const [reviewBId, setReviewBId] = useState<string>("the-room");

  const [customTextA, setCustomTextA] = useState<string>(SAMPLE_MOVIE_REVIEWS[0].reviewText);
  const [customTitleA, setCustomTitleA] = useState<string>(SAMPLE_MOVIE_REVIEWS[0].title);

  const [customTextB, setCustomTextB] = useState<string>(SAMPLE_MOVIE_REVIEWS[1].reviewText);
  const [customTitleB, setCustomTitleB] = useState<string>(SAMPLE_MOVIE_REVIEWS[1].title);

  const handleSelectPresetA = (id: string) => {
    setReviewAId(id);
    const found = SAMPLE_MOVIE_REVIEWS.find((r) => r.id === id);
    if (found) {
      setCustomTitleA(found.title);
      setCustomTextA(found.reviewText);
    }
  };

  const handleSelectPresetB = (id: string) => {
    setReviewBId(id);
    const found = SAMPLE_MOVIE_REVIEWS.find((r) => r.id === id);
    if (found) {
      setCustomTitleB(found.title);
      setCustomTextB(found.reviewText);
    }
  };

  // Analyze both sides
  const resultA = analyzeSentimentLocally(customTextA, customTitleA);
  const resultB = analyzeSentimentLocally(customTextB, customTitleB);

  const delta = Number((resultA.polarityScore - resultB.polarityScore).toFixed(2));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl fluid-card-glow"
      >
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <GitCompare className="w-4 h-4" />
          <span>A/B Sentiment Duel</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
          Side-by-Side Review & Opinion Comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compare contrasting critical takes, conflicting audience reactions, or benchmark two movie reviews against each other.
        </p>

        {/* Delta Stat Callout */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Polarity Delta</span>
              <div className="text-lg sm:text-xl font-bold text-slate-100">
                Review A leads by{" "}
                <span className={delta >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {Math.abs(delta).toFixed(2)} pts
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Review A Score</span>
              <span className={`font-mono font-bold ${resultA.polarityScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {resultA.polarityScore >= 0 ? `+${resultA.polarityScore}` : resultA.polarityScore}
              </span>
            </div>
            <span className="text-slate-500 font-bold">VS</span>
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Review B Score</span>
              <span className={`font-mono font-bold ${resultB.polarityScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {resultB.polarityScore >= 0 ? `+${resultB.polarityScore}` : resultB.polarityScore}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Duel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review A Box */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-7 rounded-3xl fluid-card-glow space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              Reviewer A
            </span>
            <select
              value={reviewAId}
              onChange={(e) => handleSelectPresetA(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              {SAMPLE_MOVIE_REVIEWS.map((r) => (
                <option key={r.id} value={r.id}>
                  Preset: {r.title} ({r.year})
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={customTitleA}
            onChange={(e) => setCustomTitleA(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-slate-100"
            placeholder="Review Title"
          />

          <textarea
            rows={4}
            value={customTextA}
            onChange={(e) => setCustomTextA(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
            placeholder="Type or edit Review A..."
          />

          {/* Quick Metrics A */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Polarity</span>
              <span className={`font-mono font-bold ${resultA.polarityScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {resultA.polarityScore > 0 ? `+${resultA.polarityScore}` : resultA.polarityScore}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Label</span>
              <span className="font-semibold text-slate-200 truncate block">{resultA.polarityLabel}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Confidence</span>
              <span className="font-semibold text-indigo-400">{resultA.confidence}%</span>
            </div>
          </div>
        </motion.div>

        {/* Review B Box */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-7 rounded-3xl fluid-card-glow space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              Reviewer B
            </span>
            <select
              value={reviewBId}
              onChange={(e) => handleSelectPresetB(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              {SAMPLE_MOVIE_REVIEWS.map((r) => (
                <option key={r.id} value={r.id}>
                  Preset: {r.title} ({r.year})
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={customTitleB}
            onChange={(e) => setCustomTitleB(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-slate-100"
            placeholder="Review Title"
          />

          <textarea
            rows={4}
            value={customTextB}
            onChange={(e) => setCustomTextB(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
            placeholder="Type or edit Review B..."
          />

          {/* Quick Metrics B */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Polarity</span>
              <span className={`font-mono font-bold ${resultB.polarityScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {resultB.polarityScore > 0 ? `+${resultB.polarityScore}` : resultB.polarityScore}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Label</span>
              <span className="font-semibold text-slate-200 truncate block">{resultB.polarityLabel}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Confidence</span>
              <span className="font-semibold text-purple-400">{resultB.confidence}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aspect Head-to-Head Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl fluid-card"
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display mb-6">
          Aspect-by-Aspect Head-to-Head
        </h3>

        <div className="space-y-4">
          {resultA.aspects.map((aspA) => {
            const aspB = resultB.aspects.find((b) => b.aspect === aspA.aspect);
            const scoreA = aspA.score;
            const scoreB = aspB ? aspB.score : 0;

            return (
              <div key={aspA.aspect} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400">
                      {scoreA > 0 ? `+${scoreA}` : scoreA}
                    </span>
                    <span className="text-slate-400">{aspA.aspect}</span>
                  </span>
                  <span className="font-mono text-purple-400">
                    {scoreB > 0 ? `+${scoreB}` : scoreB}
                  </span>
                </div>

                {/* Comparative Dual Bar */}
                <div className="grid grid-cols-2 gap-2 h-2 rounded-full overflow-hidden bg-slate-800">
                  <div className="flex justify-end">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(((scoreA + 1) / 2) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-l-full ${
                        scoreA >= 0 ? "bg-indigo-500" : "bg-rose-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-start">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(((scoreB + 1) / 2) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-r-full ${
                        scoreB >= 0 ? "bg-purple-500" : "bg-rose-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
