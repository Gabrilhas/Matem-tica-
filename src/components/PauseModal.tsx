import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface PauseModalProps {
  level: number;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  level,
  score,
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-xs bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl text-white text-center relative overflow-hidden"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Pausa</p>
        <h3 className="text-xl font-bold font-display text-white mb-2">Jogo Pausado</h3>
        <p className="text-xs text-white/60 mb-5">
          Nível <span className="text-emerald-300 font-bold">{level}</span> •{' '}
          <span className="text-white font-bold">{score.toLocaleString()}</span> pts
        </p>

        <div className="space-y-2.5">
          <button
            id="btn-pause-resume"
            type="button"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Continuar
          </button>

          <button
            id="btn-pause-restart"
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 text-white rounded-2xl font-semibold text-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Jogo
          </button>

          <button
            id="btn-pause-settings"
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 text-white rounded-2xl font-semibold text-xs transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>

          <button
            id="btn-pause-home"
            type="button"
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-black/20 hover:bg-black/30 border border-white/10 text-white/70 hover:text-white rounded-2xl font-semibold text-xs transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Voltar ao Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
};

