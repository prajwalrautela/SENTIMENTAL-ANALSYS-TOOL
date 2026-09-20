import { motion } from "motion/react";
import { EmotionScores } from "../types";
import { Flame, Smile, Compass, HeartHandshake, Zap, CloudRain, Skull, AlertTriangle } from "lucide-react";

interface EmotionSpectrumProps {
  emotions: EmotionScores;
}

interface EmotionConfig {
  key: keyof EmotionScores;
  name: string;
  color: string;
  textColor: string;
  bgLight: string;
  icon: typeof Smile;
  description: string;
}

const EMOTION_CONFIGS: EmotionConfig[] = [
  { key: "joy", name: "Joy / Ecstasy", color: "from-amber-400 to-emerald-400", textColor: "text-amber-300", bgLight: "bg-amber-400/10", icon: Smile, description: "Delight & Triumph" },
  { key: "trust", name: "Trust / Acceptance", color: "from-teal-400 to-cyan-400", textColor: "text-teal-300", bgLight: "bg-teal-400/10", icon: HeartHandshake, description: "Authenticity & Respect" },
  { key: "anticipation", name: "Anticipation", color: "from-blue-400 to-indigo-400", textColor: "text-blue-300", bgLight: "bg-blue-400/10", icon: Compass, description: "Suspense & Curiosity" },
  { key: "surprise", name: "Surprise / Shock", color: "from-fuchsia-400 to-pink-400", textColor: "text-fuchsia-300", bgLight: "bg-fuchsia-400/10", icon: Zap, description: "Unexpected Twists" },
  { key: "sadness", name: "Sadness / Grief", color: "from-indigo-400 to-slate-400", textColor: "text-indigo-300", bgLight: "bg-indigo-400/10", icon: CloudRain, description: "Heartache & Melancholy" },
  { key: "anger", name: "Anger / Outrage", color: "from-red-500 to-orange-500", textColor: "text-red-400", bgLight: "bg-red-400/10", icon: Flame, description: "Irritation & Fury" },
  { key: "disgust", name: "Disgust / Loathing", color: "from-lime-500 to-emerald-600", textColor: "text-lime-400", bgLight: "bg-lime-400/10", icon: Skull, description: "Revulsion & Cringe" },
  { key: "fear", name: "Fear / Terror", color: "from-purple-500 to-violet-700", textColor: "text-purple-300", bgLight: "bg-purple-400/10", icon: AlertTriangle, description: "Tension & Cosmic Dread" },
];

export function EmotionSpectrum({ emotions }: EmotionSpectrumProps) {
  // Find top dominant emotion
  const sorted = [...EMOTION_CONFIGS].sort((a, b) => (emotions[b.key] || 0) - (emotions[a.key] || 0));
  const dominant = sorted[0];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-3xl fluid-card-glow transition-all duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Granular Sentiment
          </span>
          <h3 className="text-lg font-bold text-slate-100 font-display">
            Emotional Spectrum Matrix
          </h3>
        </div>

        {dominant && emotions[dominant.key] > 15 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/80 ${dominant.bgLight} text-xs font-medium ${dominant.textColor}`}
          >
            <dominant.icon className="w-3.5 h-3.5" />
            <span>Dominant: <strong className="font-semibold">{dominant.name.split("/")[0]}</strong> ({emotions[dominant.key]}%)</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {EMOTION_CONFIGS.map((item, idx) => {
          const value = Math.max(0, Math.min(100, emotions[item.key] || 0));
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${item.bgLight} ${item.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.description}</div>
                  </div>
                </div>

                <span className={`text-xs font-mono font-bold ${item.textColor}`}>
                  {value}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.7, delay: idx * 0.04, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
