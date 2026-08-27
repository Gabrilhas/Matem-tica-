import React from 'react';
import { X, Volume2, VolumeX, Smartphone, Monitor, Check } from 'lucide-react';
import { GameSettings, Operator } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

const availableOperators: { id: Operator; label: string; symbol: string }[] = [
  { id: 'add', label: 'Soma', symbol: '+' },
  { id: 'subtract', label: 'Subtração', symbol: '-' },
  { id: 'multiply', label: 'Multiplicação', symbol: '×' },
  { id: 'divide', label: 'Divisão', symbol: '÷' },
  { id: 'sqrt', label: 'Raiz Quadrada', symbol: '√' },
  { id: 'power', label: 'Potenciação', symbol: 'xⁿ' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const toggleOperator = (op: Operator) => {
    const current = [...settings.allowedOperators];
    if (current.includes(op)) {
      if (current.length <= 1) return; // Keep at least one operator
      onUpdateSettings({ ...settings, allowedOperators: current.filter((o) => o !== op) });
    } else {
      onUpdateSettings({ ...settings, allowedOperators: [...current, op] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Preferências</p>
            <h3 className="text-lg font-bold font-display text-white">Configurações</h3>
          </div>
          <button
            id="btn-close-settings"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound & Haptic */}
        <div className="space-y-2.5 mb-5">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Áudio & Sensações</div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className="w-full flex items-center justify-between p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/40" />
              )}
              <span className="text-white/90">Efeitos Sonoros</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-emerald-400' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled })}
            className="w-full flex items-center justify-between p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-sky-400" />
              <span className="text-white/90">Vibração Tátil</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.vibrationEnabled ? 'bg-emerald-400' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, showPhoneFrame: !settings.showPhoneFrame })}
            className="w-full flex items-center justify-between p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-indigo-400" />
              <span className="text-white/90">Moldura de Celular</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.showPhoneFrame ? 'bg-emerald-400' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.showPhoneFrame ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Operators selection */}
        <div className="space-y-2 mb-6">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
            Operações Ativas ({settings.allowedOperators.length}/{availableOperators.length})
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {availableOperators.map((op) => {
              const active = settings.allowedOperators.includes(op.id);
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => toggleOperator(op.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all backdrop-blur-md cursor-pointer ${
                    active
                      ? 'bg-white/15 border-emerald-400/50 text-white'
                      : 'bg-black/20 border-white/10 text-white/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-math text-base w-6 text-center text-emerald-400">{op.symbol}</span>
                    <span>{op.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      active ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all cursor-pointer"
        >
          Salvar e Fechar
        </button>
      </div>
    </div>
  );
};

