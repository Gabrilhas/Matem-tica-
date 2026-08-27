import React from 'react';
import { X, Trophy, Target, Zap, RotateCcw } from 'lucide-react';
import { Operator, UserStats } from '../types';

interface StatsModalProps {
  stats: UserStats;
  onResetStats: () => void;
  onClose: () => void;
}

const operatorNames: Record<Operator, string> = {
  add: 'Soma (+)',
  subtract: 'Subtração (-)',
  multiply: 'Multiplicação (×)',
  divide: 'Divisão (÷)',
  sqrt: 'Raiz Quadrada (√)',
  power: 'Potenciação (xⁿ)',
};

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onResetStats, onClose }) => {
  const globalAccuracy =
    stats.totalAttempted > 0 ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl text-white max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Progresso</p>
            <h3 className="text-lg font-bold font-display text-white">Estatísticas Gerais</h3>
          </div>
          <button
            id="btn-close-stats"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-white/60">Recorde</span>
            </div>
            <div className="font-math text-xl font-bold text-white">{stats.highScore.toLocaleString()}</div>
          </div>

          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-white/60">Maior Nível</span>
            </div>
            <div className="font-math text-xl font-bold text-white">Nível {stats.highestLevel}</div>
          </div>

          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider text-white/60">Acertos</span>
            </div>
            <div className="font-math text-xl font-bold text-white">
              {stats.totalSolved} / {stats.totalAttempted}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">{globalAccuracy}% de acerto</div>
          </div>

          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <span>🔥</span>
              <span className="text-[10px] uppercase tracking-wider text-white/60">Maior Combo</span>
            </div>
            <div className="font-math text-xl font-bold text-white">{stats.bestStreak} seguidos</div>
          </div>
        </div>

        {/* Operator Mastery */}
        <div className="flex-1 overflow-y-auto mb-4 border border-white/10 rounded-2xl p-3 bg-black/20 backdrop-blur-md">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
            Desempenho por Operação
          </div>
          <div className="space-y-3">
            {(Object.keys(stats.operatorStats) as Operator[]).map((op) => {
              const opStat = stats.operatorStats[op];
              const pct = opStat.total > 0 ? Math.round((opStat.correct / opStat.total) * 100) : 0;
              return (
                <div key={op} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/80">{operatorNames[op]}</span>
                    <span className="font-math text-emerald-300">
                      {opStat.correct}/{opStat.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${pct}%`, boxShadow: pct > 0 ? '0 0 8px #34d399' : 'none' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onResetStats}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 border border-rose-400/20 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Zerar Dados
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

