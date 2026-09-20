import { motion } from "motion/react";

export function SmoothBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950">
      {/* Subtle radial ambient glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -35, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[30%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-cyan-600/15 via-emerald-600/10 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-[20%] left-[20%] w-[800px] h-[800px] rounded-full bg-gradient-to-t from-violet-800/15 via-blue-900/10 to-transparent blur-3xl"
      />

      {/* Modern micro-dot grid pattern for depth */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Gentle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
    </div>
  );
}
