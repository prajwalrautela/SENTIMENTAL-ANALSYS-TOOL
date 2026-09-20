import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { BatchItem, SentimentResult } from "../types";
import { analyzeSentimentLocally } from "../utils/localSentimentEngine";
import { SAMPLE_MOVIE_REVIEWS } from "../data/sampleReviews";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  FileSpreadsheet,
} from "lucide-react";

export function BatchDashboard() {
  // Pre-seed with sample reviews for immediate visualization
  const [items, setItems] = useState<BatchItem[]>(() =>
    SAMPLE_MOVIE_REVIEWS.map((rev) => ({
      id: rev.id,
      title: `${rev.title} (${rev.year}) - ${rev.reviewerName}`,
      text: rev.reviewText,
      category: rev.genre,
      result: analyzeSentimentLocally(rev.reviewText, rev.title),
    }))
  );

  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "POSITIVE" | "NEUTRAL" | "NEGATIVE">("ALL");

  // Add new custom review to batch
  const handleAddItem = () => {
    if (!inputText.trim()) return;
    const newItem: BatchItem = {
      id: `custom-${Date.now()}`,
      title: inputTitle.trim() || `Review #${items.length + 1}`,
      text: inputText.trim(),
      result: analyzeSentimentLocally(inputText.trim(), inputTitle),
    };
    setItems((prev) => [newItem, ...prev]);
    setInputText("");
    setInputTitle("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // CSV file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const newItems: BatchItem[] = [];

      lines.forEach((line, idx) => {
        // Simple CSV or line-separated text parser
        const clean = line.replace(/^["']|["']$/g, "").trim();
        if (clean.length > 10) {
          newItems.push({
            id: `upload-${Date.now()}-${idx}`,
            title: `Uploaded Record #${idx + 1}`,
            text: clean,
            result: analyzeSentimentLocally(clean),
          });
        }
      });

      if (newItems.length > 0) {
        setItems((prev) => [...newItems, ...prev]);
      }
    };
    reader.readAsText(file);
  };

  // Compute aggregate statistics
  const stats = useMemo(() => {
    if (items.length === 0) {
      return {
        avgPolarity: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        posPercent: 0,
        neuPercent: 0,
        negPercent: 0,
        best: null as BatchItem | null,
        worst: null as BatchItem | null,
      };
    }

    let sum = 0;
    let pos = 0;
    let neu = 0;
    let neg = 0;

    items.forEach((it) => {
      const p = it.result?.polarityScore || 0;
      sum += p;
      if (p >= 0.15) pos++;
      else if (p <= -0.15) neg++;
      else neu++;
    });

    const avg = Number((sum / items.length).toFixed(2));
    const sorted = [...items].sort(
      (a, b) => (b.result?.polarityScore || 0) - (a.result?.polarityScore || 0)
    );

    return {
      avgPolarity: avg,
      positiveCount: pos,
      neutralCount: neu,
      negativeCount: neg,
      posPercent: Math.round((pos / items.length) * 100),
      neuPercent: Math.round((neu / items.length) * 100),
      negPercent: Math.round((neg / items.length) * 100),
      best: sorted[0] || null,
      worst: sorted[sorted.length - 1] || null,
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const p = it.result?.polarityScore || 0;
      if (filterType === "POSITIVE") return p >= 0.15;
      if (filterType === "NEGATIVE") return p <= -0.15;
      if (filterType === "NEUTRAL") return p > -0.15 && p < 0.15;
      return true;
    });
  }, [items, filterType]);

  // Export JSON summary
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentiment-batch-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Overview Aggregate Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 sm:p-8 rounded-3xl fluid-card-glow"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              Aggregate Sentiment Intelligence
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
              Multi-Review Trend Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Analyzing {items.length} reviews and opinions across critical consensus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Text / CSV</span>
              <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Average Polarity */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs font-medium text-slate-400">Mean Corpus Polarity</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-display ${
                  stats.avgPolarity >= 0.15
                    ? "text-emerald-400"
                    : stats.avgPolarity <= -0.15
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              >
                {stats.avgPolarity >= 0 ? `+${stats.avgPolarity.toFixed(2)}` : stats.avgPolarity.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">(-1.0 to +1.0)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {stats.avgPolarity >= 0.2
                ? "Overwhelmingly Favorable"
                : stats.avgPolarity <= -0.2
                ? "Predominantly Critical"
                : "Divided / Neutral Opinion"}
            </div>
          </div>

          {/* Positive Ratio */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Positive Acclaim</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400 mt-2">
              {stats.posPercent}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {stats.positiveCount} of {items.length} reviews positive
            </div>
          </div>

          {/* Negative Ratio */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-400">Critical / Negative</span>
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-rose-400 mt-2">
              {stats.negPercent}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {stats.negativeCount} of {items.length} reviews negative
            </div>
          </div>

          {/* Neutral / Mixed Ratio */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">Neutral / Ambivalent</span>
              <span className="text-xs font-mono text-amber-400 font-bold">{stats.neuPercent}%</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-amber-400 mt-2">
              {stats.neutralCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Balanced or split takes</div>
          </div>
        </div>

        {/* Stacked Sentiment Ratio Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Corpus Sentiment Distribution</span>
            <span>{items.length} items analyzed</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
            <motion.div
              style={{ width: `${stats.posPercent}%` }}
              className="bg-emerald-500 h-full"
              title={`Positive: ${stats.posPercent}%`}
            />
            <motion.div
              style={{ width: `${stats.neuPercent}%` }}
              className="bg-amber-500 h-full"
              title={`Neutral: ${stats.neuPercent}%`}
            />
            <motion.div
              style={{ width: `${stats.negPercent}%` }}
              className="bg-rose-500 h-full"
              title={`Negative: ${stats.negPercent}%`}
            />
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Positive ({stats.posPercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Neutral ({stats.neuPercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Negative ({stats.negPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Top Acclaimed vs Most Critical Highlight */}
        {stats.best && stats.worst && stats.best.id !== stats.worst.id && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Highest Acclaim
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{stats.best.result?.polarityScore}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{stats.best.title}</h4>
              <p className="text-xs text-slate-400 italic line-clamp-2 mt-1">
                "{stats.best.text}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Most Critical
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {stats.worst.result?.polarityScore}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">{stats.worst.title}</h4>
              <p className="text-xs text-slate-400 italic line-clamp-2 mt-1">
                "{stats.worst.text}"
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Add Custom Review to Batch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-7 rounded-3xl fluid-card"
      >
        <h3 className="text-base font-bold text-slate-200 font-display mb-3">
          Append Another Review to Batch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Reviewer / Movie Title (e.g. Dune: Part Two - Total Film)"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="sm:col-span-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Paste review snippet or paragraph here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddItem}
            disabled={!inputText.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add & Analyze</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filter and Item List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Filter By Sentiment:</span>
            {(["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterType === ft
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                }`}
              >
                {ft}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500">Showing {filteredItems.length} records</span>
        </div>

        {/* List of Analyzed Reviews */}
        <div className="space-y-3">
          {filteredItems.map((item, idx) => {
            const p = item.result?.polarityScore || 0;
            let badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
            if (p >= 0.15) badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
            else if (p <= -0.15) badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                      {p >= 0 ? `+${p.toFixed(2)}` : p.toFixed(2)} ({item.result?.polarityLabel})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">"{item.text}"</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-[11px] text-slate-500 hidden sm:block">
                    <div>Conf: {item.result?.confidence}%</div>
                    <div>Subj: {Math.round((item.result?.subjectivityScore || 0) * 100)}%</div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
