import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Equation, Operator } from '../types';
import { Sparkles, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface EquationDisplayProps {
  equation: Equation | null;
  userInput: string;
  isCorrectFeedback: boolean | null;
  streak: number;
  showExplanation?: boolean;
}

const operatorLabels: Record<Operator, { label: string; icon: string; color: string }> = {
  add: { label: 'Soma', icon: '+', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30' },
  subtract: { label: 'Subtração', icon: '-', color: 'bg-sky-500/10 text-sky-300 border-sky-400/30' },
  multiply: { label: 'Multiplicação', icon: '×', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30' },
  divide: { label: 'Divisão', icon: '÷', color: 'bg-amber-500/10 text-amber-300 border-amber-400/30' },
  sqrt: { label: 'Raiz Quadrada', icon: '√', color: 'bg-purple-500/10 text-purple-300 border-purple-400/30' },
  power: { label: 'Potenciação', icon: 'xⁿ', color: 'bg-rose-500/10 text-rose-300 border-rose-400/30' },
};

export const EquationDisplay: React.FC<EquationDisplayProps> = ({
  equation,
  userInput,
  isCorrectFeedback,
  streak,
  showExplanation = false,
}) => {
  if (!equation) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-white/50">
        Carregando equação...
      </div>
    );
  }

  const opInfo = operatorLabels[equation.operator];
  const hasQuestionMark = equation.display.includes('?');

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-3 min-h-[140px] sm:min-h-[180px]">
      {/* Operator Badge & Streak Multiplier */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${opInfo.color} bg-white/5 backdrop-blur-md shadow-sm`}
        >
          <span className="font-math font-bold text-sm">{opInfo.icon}</span>
          <span>{opInfo.label}</span>
          {equation.isAlgebraic && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/15 rounded text-[10px] uppercase font-mono tracking-wider text-white/90">
              Álgebra
            </span>
          )}
        </span>

        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-400/30 text-amber-300 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Combo {streak}x</span>
          </motion.div>
        )}
      </div>

      {/* Main Frosted Equation Box */}
      <motion.div
        key={equation.id}
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: isCorrectFeedback === false ? [-6, 6, -4, 4, 0] : 0,
        }}
        transition={{ duration: 0.25 }}
        className={`w-full max-w-sm rounded-3xl p-4 sm:p-6 text-center border transition-all duration-200 relative overflow-hidden backdrop-blur-2xl shadow-xl ${
          isCorrectFeedback === true
            ? 'bg-emerald-500/15 border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.25)]'
            : isCorrectFeedback === false
            ? 'bg-rose-500/15 border-rose-400/60 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
            : 'bg-white/10 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
        }`}
      >
        {/* Subtle glass refraction glow inside card */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

        {/* The Equation Expression */}
        <div className="relative font-math text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
          {hasQuestionMark ? (
            <>
              <span className="drop-shadow-sm">{equation.display.replace('?', '').trim()}</span>
              <span className="inline-flex items-center justify-center min-w-[72px] px-3 py-1 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl transition-all shadow-inner relative text-emerald-300 font-math text-3xl sm:text-4xl">
                {userInput ? (
                  <span className="font-bold text-white drop-shadow">{userInput}</span>
                ) : (
                  <span className="text-white/30 font-normal animate-pulse">?</span>
                )}
                {/* Typing cursor */}
                <span className="inline-block w-0.5 h-6 bg-emerald-400 ml-1 animate-pulse shadow-[0_0_8px_#34d399]" />
              </span>
            </>
          ) : (
            <>
              {/* For algebraic equations like "x + 9 = 24" */}
              <div className="w-full text-white mb-2 drop-shadow-sm">{equation.display}</div>
              <div className="w-full flex items-center justify-center gap-2 text-xl sm:text-2xl text-white/90 font-sans font-semibold">
                <span className="text-emerald-400 font-math font-bold italic text-3xl">x</span>
                <span>=</span>
                <span className="inline-flex items-center justify-center min-w-[72px] px-3 py-1 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl transition-all shadow-inner relative text-emerald-300 font-math text-3xl sm:text-4xl">
                  {userInput ? (
                    <span className="font-bold text-white drop-shadow">{userInput}</span>
                  ) : (
                    <span className="text-white/30 font-normal animate-pulse">?</span>
                  )}
                  <span className="inline-block w-0.5 h-6 bg-emerald-400 ml-1 animate-pulse shadow-[0_0_8px_#34d399]" />
                </span>
              </div>
            </>
          )}
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {isCorrectFeedback === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-sm drop-shadow"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Correto! +{(100 * Math.max(1, streak)).toLocaleString()} pts</span>
            </motion.div>
          )}

          {isCorrectFeedback === false && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-rose-300 text-sm font-semibold flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Resposta correta: {equation.answer}</span>
              </div>
              {showExplanation && (
                <div className="text-xs text-white/80 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl mt-1 border border-white/10 text-left flex items-start gap-2 w-full shadow-inner">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{equation.explanation}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

