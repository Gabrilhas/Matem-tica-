import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  soundEnabled: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  soundEnabled,
}) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const isUrgent = percentage <= 30 && timeLeft > 0;
  const isCritical = percentage <= 15 && timeLeft > 0;

  useEffect(() => {
    if (!isRunning || !soundEnabled) return;
    if (isCritical) {
      soundManager.playTick(true);
    }
  }, [timeLeft, isCritical, isRunning, soundEnabled]);

  // Dynamic color gradient based on percentage
  let barGradient = 'from-emerald-400 to-teal-300';
  let glowStyle = { boxShadow: '0 0 12px rgba(52, 211, 153, 0.6)' };

  if (percentage <= 25) {
    barGradient = 'from-rose-500 to-pink-500';
    glowStyle = { boxShadow: '0 0 14px rgba(244, 63, 94, 0.8)' };
  } else if (percentage <= 50) {
    barGradient = 'from-amber-400 to-orange-400';
    glowStyle = { boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)' };
  }

  return (
    <div className="w-full px-5 py-2">
      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-spin-slow' : 'text-white/60'}`} />
          <span className="text-xs uppercase tracking-wider text-white/60">Tempo Restante</span>
          {isUrgent && (
            <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Rápido!
            </span>
          )}
        </div>
        <div
          className={`font-math text-xs px-2.5 py-0.5 rounded-full transition-all border ${
            isCritical
              ? 'bg-rose-500/20 text-rose-300 font-bold border-rose-400/40 animate-pulse'
              : isUrgent
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              : 'bg-white/10 text-white/90 border-white/10'
          }`}
        >
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {/* Frosted Progress track */}
      <div className="relative h-2 w-full bg-black/30 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-100 ease-linear ${
            isCritical ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%`, ...glowStyle }}
        />
      </div>
    </div>
  );
};

