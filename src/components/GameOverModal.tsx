import React, { useState } from 'react';
import { Trophy, Flame, RotateCcw, Award, CheckCircle, XCircle, ChevronDown, ChevronUp, Home } from 'lucide-react';
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
  const [showReview, setShowReview] = useState(false);

  const total = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl text-white max-h-[90vh] flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-lg">
            <Trophy className="w-9 h-9" />
          </div>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Partida Finalizada
          </p>
          <h2 className="text-2xl font-bold font-display text-white">Fim de Jogo!</h2>
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-sm"
            >
              <Award className="w-3.5 h-3.5" /> Novo Recorde!
            </motion.div>
          )}
        </div>

        {/* Score & Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Pontos</div>
            <div className="font-math text-xl font-bold text-emerald-300">{score.toLocaleString()}</div>
          </div>

          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Nível</div>
            <div className="font-math text-xl font-bold text-white">{level}</div>
          </div>

          <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Precisão</div>
            <div className="font-math text-xl font-bold text-emerald-300">{accuracy}%</div>
          </div>
        </div>

        {/* Extra info: Max Streak */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/10 mb-4 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Maior Sequência (Combo):</span>
          </div>
          <span className="font-math font-bold text-amber-400 text-sm">{maxStreak} seguidos</span>
        </div>

        {/* Review Mistakes / History Accordion */}
        {history.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 border border-white/10 rounded-2xl p-2 bg-black/20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between p-2 text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              <span>Revisar Equações ({history.length})</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReview && (
              <div className="space-y-2 mt-2 px-1">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className={`p-2.5 rounded-xl border text-xs backdrop-blur-md ${
                      record.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-math text-sm font-bold mb-1">
                      <span className="text-white">{record.equation.display}</span>
                      <span className="flex items-center gap-1 text-xs">
                        {record.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span>Sua resp: {record.userAnswer ?? 'Tempo esgotado'}</span>
                      </span>
                    </div>
                    {!record.isCorrect && (
                      <div className="text-[11px] text-white/80 pt-1 border-t border-rose-400/20">
                        <span className="font-bold text-amber-300">Resposta correta: {record.equation.answer}</span>
                        <p className="mt-0.5 text-white/60">{record.equation.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
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

