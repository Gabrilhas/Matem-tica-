import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, triggerVibration } from '../utils/audio';

interface CountdownOverlayProps {
  level?: number;
  onComplete: () => void;
  vibrationEnabled?: boolean;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  level,
  onComplete,
  vibrationEnabled = true,
}) => {
  // Steps: 3, 2, 1, 'go' (Calcule!)
  const [step, setStep] = useState<3 | 2 | 1 | 'go'>(3);

  useEffect(() => {
    // Step 3
    soundManager.playCountdownBeep(3);
    if (vibrationEnabled) triggerVibration(30);

    const t2 = setTimeout(() => {
      setStep(2);
      soundManager.playCountdownBeep(2);
      if (vibrationEnabled) triggerVibration(30);
    }, 700);

    const t1 = setTimeout(() => {
      setStep(1);
      soundManager.playCountdownBeep(1);
      if (vibrationEnabled) triggerVibration(35);
    }, 1400);

    const tGo = setTimeout(() => {
      setStep('go');
      soundManager.playCountdownBeep('start');
      if (vibrationEnabled) triggerVibration([40, 40]);
    }, 2100);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 2750);

    return () => {
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tGo);
      clearTimeout(tEnd);
    };
  }, [onComplete, vibrationEnabled]);

  const stepConfig = {
    3: {
      text: '3',
      color: 'text-sky-400',
      glow: 'shadow-[0_0_50px_rgba(56,189,248,0.4)]',
      border: 'border-sky-400/40',
      bg: 'bg-sky-500/15',
    },
    2: {
      text: '2',
      color: 'text-amber-400',
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.4)]',
      border: 'border-amber-400/40',
      bg: 'bg-amber-500/15',
    },
    1: {
      text: '1',
      color: 'text-rose-400',
      glow: 'shadow-[0_0_50px_rgba(244,63,94,0.4)]',
      border: 'border-rose-400/40',
      bg: 'bg-rose-500/15',
    },
    go: {
      text: 'Calcule!',
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_60px_rgba(52,211,153,0.5)]',
      border: 'border-emerald-400/50',
      bg: 'bg-emerald-500/20',
    },
  };

  const current = stepConfig[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none pointer-events-auto">
      <div className="text-center flex flex-col items-center">
        {level && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/10 text-white/80 border border-white/15 backdrop-blur-md"
          >
            Nível {level}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.4, opacity: 0, filter: 'blur(4px)' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 22,
            }}
            className={`flex items-center justify-center rounded-[36px] border ${current.border} ${current.bg} ${current.glow} backdrop-blur-2xl px-8 py-6 min-w-[140px] min-h-[140px]`}
          >
            <span
              className={`font-display font-black tracking-tight ${current.color} ${
                step === 'go' ? 'text-4xl sm:text-5xl uppercase' : 'text-7xl sm:text-8xl font-math'
              }`}
            >
              {current.text}
            </span>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-xs font-semibold text-white/50 uppercase tracking-wider"
        >
          {step === 'go' ? 'Valendo o tempo!' : 'Atenção aos números...'}
        </motion.p>
      </div>
    </div>
  );
};
