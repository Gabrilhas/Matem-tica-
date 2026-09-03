import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Zap, Timer } from 'lucide-react';

interface TimeAttackLevelUpPopupProps {
  level: number;
  secondsGained: number;
  onDismiss: () => void;
}

export const TimeAttackLevelUpPopup: React.FC<TimeAttackLevelUpPopupProps> = ({
  level,
  secondsGained,
  onDismiss,
}) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismissRef.current();
    }, 3000);

    return () => clearTimeout(timer);
  }, [level]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 450, damping: 26 }}
      className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-emerald-400/60 shadow-[0_4px_25px_rgba(16,185,129,0.4)] backdrop-blur-md w-max max-w-[92%]"
    >
      <div className="flex items-center gap-1.5 font-extrabold text-xs text-white">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
        <span className="tracking-wide uppercase text-[11px]">Nível {level}</span>
      </div>

      <span className="w-1 h-1 rounded-full bg-white/30" />

      <div className="flex items-center gap-1 font-math font-black text-xs text-emerald-300">
        <Timer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>+{secondsGained}s Ganhos!</span>
      </div>
    </motion.div>
  );
};

