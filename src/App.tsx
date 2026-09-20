import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Send,
  RotateCcw,
  Film,
  Zap,
  CheckCircle2,
  Copy,
  ChevronUp,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { SmoothBackground } from "./components/SmoothBackground";
import { PolarityGauge } from "./components/PolarityGauge";
import { EmotionSpectrum } from "./components/EmotionSpectrum";
import { AspectBreakdown } from "./components/AspectBreakdown";
import { TrendTrajectory } from "./components/TrendTrajectory";
import { SentenceHeatmap } from "./components/SentenceHeatmap";
import { BatchDashboard } from "./components/BatchDashboard";
import { ComparisonMode } from "./components/ComparisonMode";
import { FrontLoadingScreen } from "./components/FrontLoadingScreen";
import { SAMPLE_MOVIE_REVIEWS } from "./data/sampleReviews";
import { analyzeSentimentLocally } from "./utils/localSentimentEngine";
import { SentimentResult, MovieReviewPreset } from "./types";

export default function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [activeTab, setActiveTab] = useState<"SINGLE" | "BATCH" | "COMPARE">("SINGLE");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("oppenheimer");

  const [reviewTitle, setReviewTitle] = useState("Oppenheimer (2023)");
  const [reviewCategory, setReviewCategory] = useState("Biographical Thriller / Drama");
  const [reviewText, setReviewText] = useState(SAMPLE_MOVIE_REVIEWS[0].reviewText);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Result state
  const [result, setResult] = useState<SentimentResult>(() =>
    analyzeSentimentLocally(SAMPLE_MOVIE_REVIEWS[0].reviewText, "Oppenheimer")
  );

  // Real-time quick score while typing
  const livePolarity = analyzeSentimentLocally(reviewText).polarityScore;

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check backend health & API key existence
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Dev server or local fallback
      });
  }, []);

  // Trigger confetti for high positive sentiment
  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#10b981", "#6366f1", "#38bdf8", "#ec4899"],
    });
  };

  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Run deep analysis
  const handleAnalyze = async (forceGemini = false) => {
    if (!reviewText.trim()) return;

    setIsAnalyzing(true);
    setInfoNotice(null);

    try {
      if (hasGeminiKey || forceGemini) {
        const response = await fetch("/api/analyze-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: reviewText,
            title: reviewTitle,
            category: reviewCategory,
          }),
        });

        const resData = await response.json();

        if (resData.success && resData.data) {
          let engineName = "Gemini 3.8 Flash (AI Model)";
          if (resData.source === "gemini-3.1-flash-lite") {
            engineName = "Gemini 3.1 Flash Lite (AI Model)";
          } else if (resData.source === "gemini-flash-latest") {
            engineName = "Gemini Flash (AI Model)";
          } else if (resData.source?.includes("Local") || resData.source?.includes("Demand Spike")) {
            engineName = "Local NLP Engine (Demand Spike Fallback)";
          }

          if (resData.notice) {
            setInfoNotice(resData.notice);
            setTimeout(() => setInfoNotice(null), 5000);
          }

          const finalResult: SentimentResult = {
            ...resData.data,
            analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            engineUsed: engineName,
          };
          setResult(finalResult);

          if (finalResult.polarityScore >= 0.65) {
            triggerCelebration();
          }
          setIsAnalyzing(false);
          return;
        }
      }

      // Local engine fallback or instant mode
      const localResult = analyzeSentimentLocally(reviewText, reviewTitle);
      setResult(localResult);

      if (localResult.polarityScore >= 0.65) {
        triggerCelebration();
      }
    } catch (err) {
      console.warn("Analysis using local fallback engine:", err);
      const localResult = analyzeSentimentLocally(reviewText, reviewTitle);
      setResult(localResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: MovieReviewPreset) => {
    setSelectedPresetId(preset.id);
    setReviewTitle(`${preset.title} (${preset.year})`);
    setReviewCategory(preset.genre);
    setReviewText(preset.reviewText);

    // Compute sentiment immediately
    const res = analyzeSentimentLocally(preset.reviewText, preset.title);
    setResult(res);

    if (res.polarityScore >= 0.65) {
      triggerCelebration();
    }
  };

  const handleCopyReport = () => {
    const report = `Sentiment Analysis Report: ${reviewTitle}
Polarity Score: ${result.polarityScore > 0 ? "+" : ""}${result.polarityScore} (${result.polarityLabel})
Confidence: ${result.confidence}% | Subjectivity: ${Math.round(result.subjectivityScore * 100)}%
Verdict: ${result.summaryVerdict}
Recommended Audience: ${result.recommendedAudience}
Engine: ${result.engineUsed}`;

    navigator.clipboard.writeText(report);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      <SmoothBackground />

      {/* Realistic & Beautiful Neural Front Loading Screen */}
      <AnimatePresence>
        {showLoadingScreen && (
          <FrontLoadingScreen
            onComplete={() => setShowLoadingScreen(false)}
            hasGeminiKey={hasGeminiKey}
          />
        )}
      </AnimatePresence>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasGeminiKey={hasGeminiKey}
        onOpenLoadingScreen={() => setShowLoadingScreen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* VIEW 1: SINGLE REVIEW INSPECTOR */}
        {activeTab === "SINGLE" && (
          <div className="space-y-12">
            {/* Review Input and Preset Section */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    Review Presets & Custom Input
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
                    Analyze Movie Review & Text Polarity
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Report Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Info Notice Banner */}
              <AnimatePresence>
                {infoNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{infoNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Presets Row */}
              <div className="mb-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium block">
                  Quick Movie Presets (Acclaimed, Cult, Panned, Mixed):
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_MOVIE_REVIEWS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <motion.button
                        key={preset.id}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelectPreset(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
                            : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60"
                        }`}
                      >
                        <span>{preset.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            preset.expectedPolarity.includes("Positive")
                              ? "bg-emerald-500/20 text-emerald-300"
                              : preset.expectedPolarity.includes("Negative")
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {preset.ratingScore}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Category Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Movie / Text Subject Title
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Oppenheimer (2023)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Genre / Context
                  </label>
                  <input
                    type="text"
                    value={reviewCategory}
                    onChange={(e) => setReviewCategory(e.target.value)}
                    placeholder="e.g. Sci-Fi / Thriller"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Text Area */}
              <div className="relative mb-4">
                <textarea
                  rows={6}
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    setSelectedPresetId("");
                  }}
                  placeholder="Paste or type any movie review, audience comment, or text paragraph to analyze sentiment..."
                  className="w-full p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all leading-relaxed resize-y"
                />

                {/* Live Polarity Preview Pill in Corner */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Live Valence:</span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                      livePolarity >= 0.15
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : livePolarity <= -0.15
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {livePolarity >= 0 ? `+${livePolarity.toFixed(2)}` : livePolarity.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>{reviewText.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <span className="mx-2">•</span>
                  <span>{reviewText.length} characters</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReviewText("");
                      setReviewTitle("");
                      setSelectedPresetId("");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnalyze(true)}
                    disabled={isAnalyzing || !reviewText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Evaluating Model...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Full Sentiment Analysis</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.section>

            {/* Consensus Verdict Callout */}
            <motion.div
              key={result.summaryVerdict}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-6 rounded-3xl fluid-card flex items-start gap-4"
            >
              <div
                className={`p-3 rounded-2xl mt-0.5 shrink-0 ${
                  result.polarityScore >= 0.15
                    ? "bg-emerald-500/15 text-emerald-400"
                    : result.polarityScore <= -0.15
                    ? "bg-rose-500/15 text-rose-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200">
                    Critical Consensus & Emotional Verdict
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Engine: {result.engineUsed}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {result.summaryVerdict}
                </p>
              </div>
            </motion.div>

            {/* Primary Metrics Grid: Gauge + Emotion Matrix */}
            <motion.section
              initial={{ opacity: 0, y: 35, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <PolarityGauge
                score={result.polarityScore}
                label={result.polarityLabel}
                confidence={result.confidence}
                subjectivityScore={result.subjectivityScore}
                engineUsed={result.engineUsed}
              />

              <EmotionSpectrum emotions={result.emotions} />
            </motion.section>

            {/* Aspect Mining Breakdown */}
            <motion.section
              initial={{ opacity: 0, y: 35, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <AspectBreakdown aspects={result.aspects} />
            </motion.section>

            {/* Narrative Polarity Trajectory Trend */}
            <motion.section
              initial={{ opacity: 0, y: 35, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <TrendTrajectory sentences={result.sentences} />
            </motion.section>

            {/* Interactive Sentence Heatmap & Lexical Drivers */}
            <motion.section
              initial={{ opacity: 0, y: 35, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SentenceHeatmap
                sentences={result.sentences}
                positiveKeywords={result.positiveKeywords}
                negativeKeywords={result.negativeKeywords}
                sarcasmDetected={result.sarcasmDetected}
                recommendedAudience={result.recommendedAudience}
              />
            </motion.section>
          </div>
        )}

        {/* VIEW 2: BATCH TREND DASHBOARD */}
        {activeTab === "BATCH" && <BatchDashboard />}

        {/* VIEW 3: A/B DUAL COMPARISON */}
        {activeTab === "COMPARE" && <ComparisonMode />}
      </main>

      {/* Floating Smooth Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/50 border border-indigo-400/30 hover:bg-indigo-500 transition-all flex items-center justify-center cursor-pointer"
            title="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>Sentiment Analysis Tool</span> • Real-Time Polarity, Emotion & Aspect Analytics
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash & Dual NLP Lexicon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
