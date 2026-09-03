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
    <div className="w-full relative border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-3.5 sm:px-5 pt-3.5 pb-2.5">
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

      <div className="flex flex-col gap-2">
        {/* Tier 1: Level Badge & Action Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Level & XP Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                  Nível {level.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  ({xpInLevel}/{xpRequired} XP)
                </span>
              </div>
              <h1 className="text-xs font-semibold text-white tracking-tight truncate leading-tight">
                {level <= 2 ? 'Iniciante' : level <= 4 ? 'Avançado' : 'Aritmética Mestre'}
              </h1>
            </div>
          </div>

          {/* Right: Action Buttons (Stats, Settings, Pause) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-stats"
              type="button"
              onClick={onOpenStats}
              title="Estatísticas"
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              id="btn-settings"
              type="button"
              onClick={onOpenSettings}
              title="Configurações"
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              id="btn-pause"
              type="button"
              onClick={onPause}
              title="Pausar"
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/20 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Gameplay Indicators (Lives & Points) */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
          {/* Left: Lives (Classic mode) or Mode Badge */}
          {mode === 'classic' ? (
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Vidas</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: maxLives }).map((_, i) => (
                  <motion.div
                    key={`life-heart-slot-${i}`}
                    initial={{ scale: 1 }}
                    animate={{ scale: i < lives ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        i < lives
                          ? 'text-rose-400 fill-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                          : 'text-white/20 fill-white/10'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : mode === 'practice' ? (
            <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-400/20 px-2.5 py-1 rounded-xl text-[10px] font-semibold text-sky-300">
              <span>Treino Livre</span>
              <span className="text-sky-400">♾️</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/20 px-2.5 py-1 rounded-xl text-[10px] font-semibold text-amber-300">
              <span>Contra o Relógio</span>
            </div>
          )}

          {/* Right: Score Card */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Pontos
            </span>
            <span className="text-xs sm:text-sm font-math font-bold text-emerald-300 tracking-wide">
              {score.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

