import React from 'react';
import { Smartphone, Maximize2 } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  showFrame: boolean;
  onToggleFrame: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  showFrame,
  onToggleFrame,
}) => {
  return (
    <div
      className="min-h-screen w-full text-white flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-emerald-500 selection:text-white relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at top left, #1e293b 0%, #0f172a 60%), radial-gradient(circle at bottom right, #334155 0%, #0f172a 70%)',
      }}
    >
      {/* Decorative ambient blurred orbs for frosted refraction */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Helper Toggle */}
      <div className="hidden sm:flex items-center gap-2 mb-3 z-30">
        <button
          type="button"
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all shadow-lg"
          title="Alternar entre visualização de moldura ou tela expandida"
        >
          {showFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{showFrame ? 'Expandir Tela' : 'Modo Celular'}</span>
        </button>
      </div>

      {/* Main Frosted Glass Device Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col z-20 ${
          showFrame
            ? 'max-w-[450px] h-[92vh] max-h-[860px] bg-white/10 backdrop-blur-2xl rounded-[40px] border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden'
            : 'max-w-[450px] h-[100dvh] sm:h-auto sm:min-h-[760px] sm:max-h-[92vh] bg-slate-950 sm:bg-white/10 backdrop-blur-2xl sm:rounded-[40px] sm:border sm:border-white/20 shadow-2xl relative overflow-hidden'
        }`}
      >
        {/* Phone Notch/Speaker simulation */}
        {showFrame && (
          <div className="w-full flex items-center justify-center pt-2.5 pb-1 z-30 shrink-0 select-none">
            <div className="w-24 h-4 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center gap-2 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-black/60 border border-white/10" />
              <div className="w-8 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative h-full">
          {children}
        </div>

        {/* Phone Home Bar simulation (only in desktop frame mode) */}
        {showFrame && (
          <div className="w-full flex items-center justify-center pb-2.5 pt-1 z-30 shrink-0 select-none">
            <div className="w-32 h-1 bg-white/20 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

