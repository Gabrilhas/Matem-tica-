import React from 'react';
import { Heart, Trophy, Zap, Pause, Settings, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GameMode } from '../types';

interface LevelHeaderProps {
  level: number;
  xpInLevel: number;
  xpRequired: number;
  score: number;
  lives: number;
  maxLives: number;
  mode: GameMode;
  onPause: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  level,
  xpInLevel,
  xpRequired,
  score,
  lives,
  maxLives,
  mode,
  onPause,
  onOpenStats,
  onOpenSettings,
}) => {
  const xpPercentage = Math.min(100, (xpInLevel / xpRequired) * 100);

  return (
    <div className="w-full relative border-b border-white/10 bg-white/5 backdrop-blur-md px-5 pt-4 pb-3">
      {/* Top glowing progress line on container header */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400"
          style={{ boxShadow: '0 0 10px #34d399' }}
          initial={{ width: 0 }}
          animate={{ width: `${xpPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Level Header info */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4 fill-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Nível {level.toString().padStart(2, '0')}
            </p>
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span>{level <= 2 ? 'Iniciante' : level <= 4 ? 'Avançado' : 'Aritmética Mestre'}</span>
              <span className="text-[10px] text-white/40 font-mono">({xpInLevel}/{xpRequired})</span>
            </h1>
          </div>
        </div>

        {/* Center: Lives (if Classic mode) */}
        {mode === 'classic' && (
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-white/10">
            {Array.from({ length: maxLives }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: i < lives ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                    i < lives
                      ? 'text-rose-400 fill-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                      : 'text-white/20 fill-white/10'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Right: Score & Menu buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="text-right px-2.5 py-1 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
            <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold flex items-center justify-end gap-1">
              <Trophy className="w-2.5 h-2.5 text-amber-400" /> Pontos
            </p>
            <h2 className="text-xs sm:text-sm font-math font-bold text-white tracking-wide">
              {score.toLocaleString()}
            </h2>
          </div>

          <button
            id="btn-stats"
            type="button"
            onClick={onOpenStats}
            title="Estatísticas"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-settings"
            type="button"
            onClick={onOpenSettings}
            title="Configurações"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-pause"
            type="button"
            onClick={onPause}
            title="Pausar"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

