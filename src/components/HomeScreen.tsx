import React from 'react';
import { Play, Flame, Timer, GraduationCap, Trophy, Settings, BarChart2, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GameMode, Operator, UserStats } from '../types';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  stats: UserStats;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  allowedOperators: Operator[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  selectedMode,
  onSelectMode,
  onStartGame,
  onOpenSettings,
  onOpenStats,
  allowedOperators,
}) => {
  const modes: { id: GameMode; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'classic',
      title: 'Níveis Progressivos',
      desc: 'Começa fácil e aumenta o nível com seus acertos. 3 vidas.',
      icon: <Flame className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'time_attack',
      title: 'Contra o Relógio (60s)',
      desc: 'Resolva o máximo de equações antes do tempo zerar!',
      icon: <Timer className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'practice',
      title: 'Treino Livre',
      desc: 'Sem limite de tempo e sem vidas, ideal para dominar raiz quadrada e contas no seu ritmo.',
      icon: <GraduationCap className="w-5 h-5 text-sky-400" />,
    },
  ];

  const opSymbols: { id: Operator; sym: string; name: string }[] = [
    { id: 'add', sym: '+', name: 'Soma' },
    { id: 'subtract', sym: '-', name: 'Subtração' },
    { id: 'multiply', sym: '×', name: 'Multiplicação' },
    { id: 'divide', sym: '÷', name: 'Divisão' },
    { id: 'sqrt', sym: '√', name: 'Raiz' },
    { id: 'power', sym: 'xⁿ', name: 'Potência' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 pb-8 sm:pb-5 max-w-sm mx-auto w-full text-white overflow-y-auto">
      {/* Top Brand & Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider text-white/50 font-medium">Recorde:</span>
            <span className="font-math font-bold text-emerald-300 text-xs">{stats.highScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-home-stats"
              type="button"
              onClick={onOpenStats}
              title="Estatísticas"
              className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              id="btn-home-settings"
              type="button"
              onClick={onOpenSettings}
              title="Configurações"
              className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero title */}
        <div className="text-center my-3 sm:my-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl" />
            <span className="font-math font-extrabold text-2xl sm:text-3xl text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
              √x ±
            </span>
          </motion.div>

          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Desafio Matemático
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white mb-1">
            Matemática Básica
          </h1>
          <p className="text-xs text-white/60 max-w-xs mx-auto">
            Resolva equações de soma, subtração, multiplicação, divisão, raiz e potência!
          </p>

          {/* Active Operations Chips */}
          <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
            {opSymbols.map((op) => {
              const active = allowedOperators.includes(op.id);
              return (
                <span
                  key={op.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[11px] font-semibold border backdrop-blur-md transition-all ${
                    active
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/5 text-white/30 line-through'
                  }`}
                  title={op.name}
                >
                  <span className="font-math text-xs text-emerald-400">{op.sym}</span>
                  <span>{op.name}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="space-y-2 mt-4">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">
            Modo de Jogo
          </div>

          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all backdrop-blur-xl active:scale-[0.98] ${
                  isSelected
                    ? 'bg-white/15 border-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="p-2 rounded-xl bg-black/20 border border-white/10 shrink-0">
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-white">{mode.title}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5 line-clamp-2 leading-relaxed">{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-start-game"
          type="button"
          onClick={() => {
            soundManager.unlockAudio();
            onStartGame();
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:shadow-[0_0_35px_rgba(52,211,153,0.6)] active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Iniciar Desafio</span>
          <Sparkles className="w-4 h-4 text-emerald-950 fill-emerald-950 ml-0.5" />
        </button>
      </div>
    </div>
  );
};

