import React, { useState, useRef } from 'react';
import { Trophy, Flame, RotateCcw, Award, CheckCircle, XCircle, Home, ListOrdered, ArrowDown, ArrowUp } from 'lucide-react';
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
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const listRef = useRef<HTMLDivElement>(null);

  const total = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const wrongCount = total - correctCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const filteredHistory = history.map((rec, originalIdx) => ({ rec, originalIdx })).filter(({ rec }) => {
    if (filter === 'wrong') return !rec.isCorrect;
    if (filter === 'correct') return rec.isCorrect;
    return true;
  });

  const scrollList = (direction: 'up' | 'down') => {
    if (listRef.current) {
      listRef.current.scrollBy({
        top: direction === 'down' ? 120 : -120,
        behavior: 'smooth',
      });
    }
  };

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
        <div className="flex items-center justify-between px-3.5 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 mb-2.5 text-xs shrink-0">
          <div className="flex items-center gap-2 text-white/80">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Maior Sequência (Combo):</span>
          </div>
          <span className="font-math font-bold text-amber-400 text-sm">{maxStreak} seguidos</span>
        </div>

        {/* Full Equation History List with visible side scrollbar and controls */}
        <div className="flex-1 min-h-[150px] max-h-[260px] border border-white/15 rounded-2xl p-2.5 bg-black/40 backdrop-blur-md flex flex-col overflow-hidden mb-3">
          {/* Header with Title and Filter Tabs */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-white/10 mb-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 shrink-0">
              <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
              Equações ({history.length})
            </span>

            {/* Quick Filter Buttons */}
            {history.length > 0 && (
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded-lg border font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  Todas ({total})
                </button>
                {wrongCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter('wrong')}
                    className={`px-2 py-0.5 rounded-lg border font-semibold transition-all ${
                      filter === 'wrong'
                        ? 'bg-rose-500/25 border-rose-400/50 text-rose-300'
                        : 'bg-white/5 border-white/10 text-rose-300/70 hover:text-rose-200'
                    }`}
                  >
                    Erradas ({wrongCount})
                  </button>
                )}
                {correctCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter('correct')}
                    className={`px-2 py-0.5 rounded-lg border font-semibold transition-all ${
                      filter === 'correct'
                        ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-emerald-300/70 hover:text-emerald-200'
                    }`}
                  >
                    Certas ({correctCount})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Equation Items with styled, permanent custom scrollbar & navigation */}
          {filteredHistory.length > 0 ? (
            <div className="relative flex-1 flex overflow-hidden">
              <div
                ref={listRef}
                className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-[190px]"
              >
                {filteredHistory.map(({ rec, originalIdx }) => (
                  <div
                    key={`history-entry-${originalIdx}-${rec.id}`}
                    className={`p-2.5 rounded-xl border text-xs backdrop-blur-md transition-all ${
                      rec.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-math text-sm font-bold mb-1">
                      <span className="text-white">
                        <span className="text-white/40 text-xs mr-1.5">#{originalIdx + 1}</span>
                        {rec.equation.display}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        {rec.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-sans font-medium">
                          {rec.isCorrect
                            ? `Resp: ${rec.userAnswer}`
                            : `Sua resp: ${rec.userAnswer ?? 'Esgotado'}`}
                        </span>
                      </span>
                    </div>
                    {!rec.isCorrect && (
                      <div className="text-[11px] text-white/80 pt-1 mt-1 border-t border-rose-400/20">
                        <span className="font-bold text-amber-300">Resposta correta: {rec.equation.answer}</span>
                        {rec.equation.explanation && (
                          <p className="mt-0.5 text-white/60">{rec.equation.explanation}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Side Scroll Assist Buttons for convenient navigation */}
              {filteredHistory.length > 2 && (
                <div className="flex flex-col justify-between pl-1 border-l border-white/10 my-1 py-1">
                  <button
                    type="button"
                    onClick={() => scrollList('up')}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/70 hover:text-white transition-colors"
                    title="Rolar para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollList('down')}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/70 hover:text-white transition-colors"
                    title="Rolar para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-white/40">
              Nenhuma equação encontrada neste filtro.
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

