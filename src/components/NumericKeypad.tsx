import React from 'react';
import { Delete, Check, RotateCcw } from 'lucide-react';
import { soundManager, triggerVibration } from '../utils/audio';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  canSubmit?: boolean;
  vibrationEnabled?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigit,
  onDelete,
  onClear,
  onToggleSign,
  onSubmit,
  disabled = false,
  canSubmit = true,
  vibrationEnabled = true,
}) => {
  const handlePress = (action: () => void, soundType: 'digit' | 'delete' | 'submit' | 'util', digit?: string) => {
    if (disabled) return;
    if (vibrationEnabled) {
      triggerVibration(25);
    }
    if (soundType === 'digit') {
      soundManager.playKeyTap(digit);
    } else if (soundType === 'delete') {
      soundManager.playDelete();
    } else {
      soundManager.playKeyTap();
    }
    action();
  };

  const keyBase =
    'relative flex items-center justify-center font-math font-medium rounded-2xl transition-all duration-150 select-none backdrop-blur-md shadow-sm active:scale-95 touch-manipulation disabled:opacity-30 disabled:pointer-events-none cursor-pointer';

  const digitClass = `${keyBase} h-12 sm:h-14 text-2xl sm:text-3xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 active:border-white/30 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]`;

  const utilClass = `${keyBase} h-12 sm:h-14 text-lg bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-white/70 hover:text-white active:border-white/20`;

  return (
    <div className="w-full max-w-sm mx-auto px-4 pt-1 pb-7 sm:pb-4 mb-[env(safe-area-inset-bottom,0px)]">
      {/* 4x3 Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Row 1: 1, 2, 3 */}
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            id={`keypad-digit-${num}`}
            type="button"
            disabled={disabled}
            onClick={() => handlePress(() => onDigit(num.toString()), 'digit', num.toString())}
            className={digitClass}
          >
            {num}
          </button>
        ))}

        {/* Row 2: 4, 5, 6 */}
        {[4, 5, 6].map((num) => (
          <button
            key={num}
            id={`keypad-digit-${num}`}
            type="button"
            disabled={disabled}
            onClick={() => handlePress(() => onDigit(num.toString()), 'digit', num.toString())}
            className={digitClass}
          >
            {num}
          </button>
        ))}

        {/* Row 3: 7, 8, 9 */}
        {[7, 8, 9].map((num) => (
          <button
            key={num}
            id={`keypad-digit-${num}`}
            type="button"
            disabled={disabled}
            onClick={() => handlePress(() => onDigit(num.toString()), 'digit', num.toString())}
            className={digitClass}
          >
            {num}
          </button>
        ))}

        {/* Row 4: ± / Limpar, 0, Backspace */}
        <button
          id="keypad-toggle-sign"
          type="button"
          disabled={disabled}
          onClick={() => handlePress(onToggleSign, 'util')}
          className={utilClass}
          title="Alternar sinal positivo/negativo"
        >
          <span className="font-sans text-lg font-semibold text-emerald-400">±</span>
        </button>

        <button
          id="keypad-digit-0"
          type="button"
          disabled={disabled}
          onClick={() => handlePress(() => onDigit('0'), 'digit', '0')}
          className={digitClass}
        >
          0
        </button>

        <button
          id="keypad-backspace"
          type="button"
          disabled={disabled}
          onClick={() => handlePress(onDelete, 'delete')}
          className={`${keyBase} h-12 sm:h-14 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-400/20 hover:border-rose-400/40`}
          title="Apagar dígito"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Row 5: Action bar (Clear & Submit) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 mt-1.5 sm:mt-2.5">
        <button
          id="keypad-clear"
          type="button"
          disabled={disabled}
          onClick={() => handlePress(onClear, 'delete')}
          className={`${keyBase} col-span-1 h-11 sm:h-12 text-xs font-semibold tracking-wider uppercase text-white/60 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10`}
          title="Limpar tudo"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>C</span>
        </button>

        <button
          id="keypad-submit"
          type="button"
          disabled={disabled || !canSubmit}
          onClick={() => handlePress(onSubmit, 'submit')}
          className={`${keyBase} col-span-3 h-11 sm:h-12 text-sm font-bold tracking-wider uppercase bg-emerald-400 hover:bg-emerald-300 text-slate-950 border-none shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-[0.98] transition-all disabled:bg-white/5 disabled:text-white/30 disabled:shadow-none disabled:border disabled:border-white/10`}
        >
          <span className="flex items-center justify-center gap-2">
            Confirmar
            <Check className="w-4 h-4 stroke-[3]" />
          </span>
        </button>
      </div>
    </div>
  );
};

