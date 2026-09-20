import { motion, useScroll, useSpring } from "motion/react";
import { Sparkles, BrainCircuit, BarChart2, GitCompare, Activity } from "lucide-react";

interface NavbarProps {
  activeTab: "SINGLE" | "BATCH" | "COMPARE";
  setActiveTab: (tab: "SINGLE" | "BATCH" | "COMPARE") => void;
  hasGeminiKey: boolean;
  onOpenLoadingScreen?: () => void;
}

export function Navbar({ activeTab, setActiveTab, hasGeminiKey, onOpenLoadingScreen }: NavbarProps) {
  // Ultra-smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-950/70 border-b border-white/[0.06] transition-all">
      {/* Top Scroll Progress Line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 origin-left z-50 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-100 font-display tracking-tight leading-none flex items-center gap-2">
              <span>Sentiment Analysis Tool</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Cinematic & Text Polarity Intelligence
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs font-semibold backdrop-blur-md">
          <button
            onClick={() => setActiveTab("SINGLE")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "SINGLE"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab("BATCH")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "BATCH"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Batch Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("COMPARE")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "COMPARE"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>A/B Duel</span>
          </button>
        </div>

        {/* Status Indicator & Re-run Loader button */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <button
            onClick={onOpenLoadingScreen}
            title="Click to view neural tensor initialization sequence"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all hover:scale-105 cursor-pointer ${
              hasGeminiKey
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"}`} />
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{hasGeminiKey ? "Gemini 3.8 Flash Active" : "Dual-Engine Ready"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
