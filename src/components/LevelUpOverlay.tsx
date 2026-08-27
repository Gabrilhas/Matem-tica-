import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowUpRight, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LevelUpOverlayProps {
  newLevel: number;
  onDismiss: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ newLevel, onDismiss }) => {
  useEffect(() => {
    soundManager.playLevelUp();

    const timer = setTimeout(() => {
      onDismiss();
    }, 1400);

    return () => clearTimeout(timer);
  }, [newLevel, onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer select-none"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xs text-center p-6 bg-white/10 backdrop-blur-2xl border border-white/25 rounded-[32px] shadow-2xl relative overflow-hidden"
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
          <Zap className="w-8 h-8 fill-slate-950 stroke-slate-950" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md mb-2">
          <Sparkles className="w-3 h-3" /> Subiu de Nível!
        </div>

        <h2 className="text-2xl font-extrabold font-display text-white mb-1 tracking-tight">
          NÍVEL <span className="text-emerald-400 font-math">{newLevel}</span>
        </h2>

        <p className="text-xs text-white/70 flex items-center justify-center gap-1 mt-2">
          <span>Dificuldade & velocidade aumentadas</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </p>
      </motion.div>
    </div>
  );
};

