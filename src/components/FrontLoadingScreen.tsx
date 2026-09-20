import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Cpu, Database, CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface FrontLoadingScreenProps {
  onComplete: () => void;
  hasGeminiKey: boolean;
}

interface StepLog {
  id: string;
  time: string;
  label: string;
  status: "pending" | "running" | "done";
}

export function FrontLoadingScreen({ onComplete, hasGeminiKey }: FrontLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStageText, setCurrentStageText] = useState("Initializing neural sentiment engine...");
  const [logs, setLogs] = useState<StepLog[]>([
    { id: "1", time: "00.04s", label: "Allocating memory buffers & tokenizer dictionaries", status: "running" },
    { id: "2", time: "--", label: "Synthesizing 8-dimensional emotion tensor vectors", status: "pending" },
    { id: "3", time: "--", label: "Ingesting aspect-based cinematic discourse ontology", status: "pending" },
    { id: "4", time: "--", label: "Connecting Gemini 3.8 Flash multi-tiered fallback proxy", status: "pending" },
    { id: "5", time: "--", label: "Calibrating real-time sentence polarity trajectories", status: "pending" },
  ]);

  // Frequency wave visualizer heights
  const [waveHeights, setWaveHeights] = useState<number[]>([18, 35, 60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 30, 75, 45, 20]);

  useEffect(() => {
    // Dynamic waveform animation
    const waveInterval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 15)
      );
    }, 120);

    return () => clearInterval(waveInterval);
  }, []);

  useEffect(() => {
    // Realistic multi-stage progress timing with authentic micro-delays
    const stages = [
      {
        threshold: 22,
        stage: "Compiling semantic sentiment embeddings & lexicons...",
        logIndex: 0,
      },
      {
        threshold: 48,
        stage: "Calibrating Plutchik emotional spectrum & polarity tensors...",
        logIndex: 1,
      },
      {
        threshold: 74,
        stage: "Mapping movie aspect taxonomy (acting, directing, screenplay)...",
        logIndex: 2,
      },
      {
        threshold: 92,
        stage: "Synchronizing resilient Gemini 3.8 Flash pipeline & local engine...",
        logIndex: 3,
      },
      {
        threshold: 100,
        stage: "Neural sentiment workspace online. Calibration optimal.",
        logIndex: 4,
      },
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Non-linear progression that feels organic and computational
      const increment = currentProgress < 30 ? 3.5 : currentProgress < 70 ? 2.8 : currentProgress < 90 ? 2.2 : 4.5;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(Math.round(currentProgress));

      // Update stage text and logs
      for (let i = 0; i < stages.length; i++) {
        if (currentProgress <= stages[i].threshold) {
          setCurrentStageText(stages[i].stage);
          setLogs((prev) =>
            prev.map((log, idx) => {
              if (idx < i) return { ...log, status: "done" as const, time: `${(0.12 * (idx + 1)).toFixed(2)}s` };
              if (idx === i) return { ...log, status: "running" as const, time: "active" };
              return { ...log, status: "pending" as const };
            })
          );
          break;
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setLogs((prev) =>
          prev.map((log, idx) => ({
            ...log,
            status: "done" as const,
            time: `${(0.14 * (idx + 1)).toFixed(2)}s`,
          }))
        );
        setTimeout(() => {
          onComplete();
        }, 550);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden"
    >
      {/* Dynamic atmospheric backdrops */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-violet-600/20 to-cyan-500/20 blur-[130px]"
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Scanning laser beam */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent pointer-events-none"
        />
      </div>

      <div className="relative w-full max-w-xl mx-4 sm:mx-6">
        {/* Soft, borderless glow card */}
        <div className="relative rounded-3xl p-7 sm:p-9 backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/[0.08] overflow-hidden">
          
          {/* Top Brand Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight font-display">
                    SENTIMENT AI
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    v3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Cinematic Polarity & Opinion Mining Core
                </p>
              </div>
            </div>

            {/* Quick Skip button */}
            <button
              onClick={onComplete}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1.5 group"
            >
              <span>Skip</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-indigo-400" />
            </button>
          </div>

          {/* Central Live Spectrogram & Polar Waves */}
          <div className="mb-7 p-4 rounded-2xl bg-slate-950/70 border border-white/[0.05] relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tensor Spectrum Calibration</span>
              </span>
              <span className="font-mono text-cyan-300">
                FP16 &bull; {hasGeminiKey ? "Cloud + Local Dual Engine" : "High-Precision Local Engine"}
              </span>
            </div>

            {/* Frequency bars animation */}
            <div className="flex items-end justify-between h-14 px-2 gap-1.5">
              {waveHeights.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className={`w-full rounded-t-sm transition-colors ${
                    i < 5
                      ? "bg-gradient-to-t from-indigo-600/60 to-indigo-400"
                      : i < 11
                      ? "bg-gradient-to-t from-violet-600/60 to-purple-400"
                      : "bg-gradient-to-t from-cyan-600/60 to-emerald-400"
                  }`}
                />
              ))}
            </div>

            {/* Polarity Zero-Axis line */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-rose-400">-1.00 Critical</span>
              <span className="text-slate-400">0.00 Neutral</span>
              <span className="text-emerald-400">+1.00 Acclaimed</span>
            </div>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{currentStageText}</span>
              </span>
              <span className="font-mono text-sm text-indigo-300 shrink-0 ml-2">
                {progress}%
              </span>
            </div>

            <div className="relative h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 relative shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              >
                <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/60 blur-[2px]" />
              </motion.div>
            </div>
          </div>

          {/* Live System Diagnostics Feed */}
          <div className="space-y-1.5 font-mono text-[11px] bg-slate-950/60 rounded-xl p-3 border border-white/[0.04]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  {log.status === "done" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : log.status === "running" ? (
                    <Zap className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={`truncate ${log.status === "running" ? "text-slate-200" : ""}`}>
                    {log.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                  {log.time}
                </span>
              </div>
            ))}
          </div>

          {/* Telemetry Footer */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plutchik 8-Factor Ready</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lexicon v3.8 Cached</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
