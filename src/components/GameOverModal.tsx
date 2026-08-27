import React from 'react';
import { Trophy, Flame, RotateCcw, Award, CheckCircle, XCircle, Home, ListOrdered } from 'lucide-react';
import { motion } from 'motion/react';
import { SolvedRecord } from '../types';

interface GameOverModalProps {
  score: number;
  level: number;
  maxStreak: number;
  isNewHighScore: boolean;
  history: SolvedRecord[];
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  level,
  maxStreak,
  isNewHighScore,
  history,
  onRestart,
  onHome,
}) => {
  const total = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-lg">
            <Trophy className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-0.5">
            Partida Finalizada
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Fim de Jogo!</h2>
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-sm"
            >
              <Award className="w-3.5 h-3.5" /> Novo Recorde!
            </motion.div>
          )}
        </div>

        {/* Score & Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-2.5 shrink-0">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Pontos</div>
            <div className="font-math text-lg sm:text-xl font-bold text-emerald-300">{score.toLocaleString()}</div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Nível</div>
            <div className="font-math text-lg sm:text-xl font-bold text-white">{level}</div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Precisão</div>
            <div className="font-math text-lg sm:text-xl font-bold text-emerald-300">{accuracy}%</div>
          </div>
        </div>

        {/* Extra info: Max Streak */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 mb-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-white/80">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Maior Sequência (Combo):</span>
          </div>
          <span className="font-math font-bold text-amber-400 text-sm">{maxStreak} seguidos</span>
        </div>

        {/* Full Equation History List */}
        <div className="flex-1 min-h-[140px] max-h-[260px] overflow-y-auto mb-3 border border-white/10 rounded-2xl p-2.5 bg-black/30 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10 mb-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90">
              <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
              Equações da Partida ({history.length})
            </span>
            <span className="text-[11px] text-white/50">
              {correctCount} certas / {total - correctCount} erradas
            </span>
          </div>

          {history.length > 0 ? (
            <div className="space-y-2 overflow-y-auto pr-1">
              {history.map((record, index) => (
                <div
                  key={record.id || index}
                  className={`p-2.5 rounded-xl border text-xs backdrop-blur-md transition-all ${
                    record.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-math text-sm font-bold mb-1">
                    <span className="text-white">
                      <span className="text-white/40 text-xs mr-1.5">#{index + 1}</span>
                      {record.equation.display}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      {record.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="font-sans font-medium">
                        {record.isCorrect
                          ? `Resp: ${record.userAnswer}`
                          : `Sua resp: ${record.userAnswer ?? 'Esgotado'}`}
                      </span>
                    </span>
                  </div>
                  {!record.isCorrect && (
                    <div className="text-[11px] text-white/80 pt-1 mt-1 border-t border-rose-400/20">
                      <span className="font-bold text-amber-300">Resposta correta: {record.equation.answer}</span>
                      {record.equation.explanation && (
                        <p className="mt-0.5 text-white/60">{record.equation.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-white/40">
              Nenhuma equação registrada nesta partida.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-1 shrink-0">
          <button
            id="btn-gameover-home"
            type="button"
            onClick={onHome}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Início
          </button>

          <button
            id="btn-gameover-restart"
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar de Novo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

