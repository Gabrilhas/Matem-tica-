import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Equation,
  GameMode,
  GameSettings,
  Operator,
  SolvedRecord,
  UserStats,
} from './types';
import { generateEquation, getTimeLimitForLevel } from './utils/equationGenerator';
import {
  defaultSettings,
  defaultStats,
  loadSettings,
  loadUserStats,
  saveSettings,
  saveUserStats,
} from './utils/storage';
import { soundManager, triggerVibration } from './utils/audio';

import { PhoneContainer } from './components/PhoneContainer';
import { HomeScreen } from './components/HomeScreen';
import { LevelHeader } from './components/LevelHeader';
import { TimerBar } from './components/TimerBar';
import { EquationDisplay } from './components/EquationDisplay';
import { NumericKeypad } from './components/NumericKeypad';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { PauseModal } from './components/PauseModal';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { CountdownOverlay } from './components/CountdownOverlay';

export default function App() {
  // Persistence state
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  // Navigation & Modals
  const [screen, setScreen] = useState<'home' | 'playing' | 'game_over'>('home');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [levelUpNewLevel, setLevelUpNewLevel] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdownLevel, setCountdownLevel] = useState<number | null>(null);

  // Gameplay state
  const [level, setLevel] = useState(1);
  const [xpInLevel, setXpInLevel] = useState(0);
  const [xpRequired, setXpRequired] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives] = useState(3);

  // Current equation & input
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime, setTotalTime] = useState(15);
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Time Attack 60s Global Mode Timer
  const [globalTimeAttackRemaining, setGlobalTimeAttackRemaining] = useState(60);

  // Session history
  const [history, setHistory] = useState<SolvedRecord[]>([]);

  // Sync sound settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const updateSettingsAndSave = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateStatsAndSave = (updater: (prev: UserStats) => UserStats) => {
    setStats((prev) => {
      const next = updater(prev);
      saveUserStats(next);
      return next;
    });
  };

  // Helper to spawn a new equation
  const spawnEquation = useCallback(
    (lvl: number) => {
      const eq = generateEquation(lvl, settings.allowedOperators);
      setCurrentEquation(eq);
      setUserInput('');
      setIsCorrectFeedback(null);
      setIsProcessingAnswer(false);
      const limit = eq.timeLimit;
      setTotalTime(limit);
      setTimeLeft(limit);
      lastTimeRef.current = Date.now();
    },
    [settings.allowedOperators]
  );

  // Start new game
  const handleStartGame = (mode: GameMode = gameMode) => {
    setGameMode(mode);
    setLevel(1);
    setXpInLevel(0);
    setXpRequired(3);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(mode === 'classic' ? 3 : 999);
    setHistory([]);
    setIsPaused(false);
    setLevelUpNewLevel(null);
    setGlobalTimeAttackRemaining(60);

    setScreen('playing');
    spawnEquation(1);
    setCountdownLevel(1);
    setIsCountdownActive(true);
  };

  const handleDismissLevelUp = () => {
    const nextLvl = levelUpNewLevel ?? level;
    setLevelUpNewLevel(null);
    spawnEquation(nextLvl);
    setCountdownLevel(nextLvl);
    setIsCountdownActive(true);
  };

  const handleCountdownComplete = () => {
    setIsCountdownActive(false);
    setCountdownLevel(null);
    setIsProcessingAnswer(false);
    lastTimeRef.current = Date.now();
  };

  // Handle Game Over
  const triggerGameOver = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    soundManager.playGameOver();
    if (settings.vibrationEnabled) {
      triggerVibration([100, 50, 100]);
    }

    // Check high score
    const isNewHigh = score > stats.highScore;

    updateStatsAndSave((prev) => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      highScore: Math.max(prev.highScore, score),
      highestLevel: Math.max(prev.highestLevel, level),
      bestStreak: Math.max(prev.bestStreak, maxStreak),
    }));

    setScreen('game_over');
  }, [score, stats.highScore, level, maxStreak, settings.vibrationEnabled]);

  // Handle Timeout
  const handleTimeout = useCallback(() => {
    if (isProcessingAnswer || !currentEquation || screen !== 'playing' || isPaused) return;

    setIsProcessingAnswer(true);
    setIsCorrectFeedback(false);
    soundManager.playWrong();
    if (settings.vibrationEnabled) {
      triggerVibration(200);
    }

    // Record miss
    const record: SolvedRecord = {
      id: `rec-${Date.now()}`,
      equation: currentEquation,
      userAnswer: null,
      isCorrect: false,
      timeSpent: totalTime,
      timestamp: Date.now(),
    };
    setHistory((prev) => [record, ...prev]);

    // Update stats
    updateStatsAndSave((prev) => {
      const op = currentEquation.operator;
      const prevOp = prev.operatorStats[op] || { correct: 0, total: 0 };
      return {
        ...prev,
        totalAttempted: prev.totalAttempted + 1,
        operatorStats: {
          ...prev.operatorStats,
          [op]: { ...prevOp, total: prevOp.total + 1 },
        },
      };
    });

    setStreak(0);

    if (gameMode === 'classic') {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => {
          triggerGameOver();
        }, 1100);
        return;
      }
    }

    // Move to next question after showing explanation
    setTimeout(() => {
      if (screen === 'playing') {
        spawnEquation(level);
      }
    }, 1200);
  }, [
    isProcessingAnswer,
    currentEquation,
    screen,
    isPaused,
    settings.vibrationEnabled,
    totalTime,
    gameMode,
    lives,
    spawnEquation,
    level,
    triggerGameOver,
  ]);

  // Main Timer Loop
  useEffect(() => {
    if (
      screen !== 'playing' ||
      isPaused ||
      isProcessingAnswer ||
      isCountdownActive ||
      levelUpNewLevel !== null
    ) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    lastTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Handle per-equation timer
      setTimeLeft((prev) => {
        const next = prev - delta;
        if (next <= 0) {
          handleTimeout();
          return 0;
        }
        return next;
      });

      // Handle Time Attack 60s global timer
      if (gameMode === 'time_attack') {
        setGlobalTimeAttackRemaining((prev) => {
          const next = prev - delta;
          if (next <= 0) {
            triggerGameOver();
            return 0;
          }
          return next;
        });
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    screen,
    isPaused,
    isProcessingAnswer,
    isCountdownActive,
    levelUpNewLevel,
    gameMode,
    handleTimeout,
    triggerGameOver,
  ]);

  // Handle Digit Input
  const handleDigit = (digit: string) => {
    if (isProcessingAnswer) return;
    setUserInput((prev) => {
      if (prev.length >= 7) return prev; // Limit max digits
      if (prev === '0' && digit !== '.') return digit;
      if (prev === '-0') return `-${digit}`;
      return prev + digit;
    });
  };

  // Handle Delete / Backspace
  const handleDelete = () => {
    if (isProcessingAnswer) return;
    setUserInput((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  // Handle Clear
  const handleClear = () => {
    if (isProcessingAnswer) return;
    setUserInput('');
  };

  // Handle Sign Toggle (±)
  const handleToggleSign = () => {
    if (isProcessingAnswer) return;
    setUserInput((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-')) return prev.slice(1);
      return `-${prev}`;
    });
  };

  // Handle Submit / Confirmation
  const handleSubmit = () => {
    if (isProcessingAnswer || !currentEquation || userInput.trim() === '' || userInput === '-') {
      return;
    }

    setIsProcessingAnswer(true);
    const numericAnswer = parseInt(userInput, 10);
    const isCorrect = numericAnswer === currentEquation.answer;
    const timeSpent = Math.max(0.1, totalTime - timeLeft);

    // Record in session history
    const record: SolvedRecord = {
      id: `rec-${Date.now()}`,
      equation: currentEquation,
      userAnswer: numericAnswer,
      isCorrect,
      timeSpent,
      timestamp: Date.now(),
    };
    setHistory((prev) => [record, ...prev]);

    // Update global operator stats
    updateStatsAndSave((prev) => {
      const op = currentEquation.operator;
      const prevOp = prev.operatorStats[op] || { correct: 0, total: 0 };
      return {
        ...prev,
        totalAttempted: prev.totalAttempted + 1,
        totalSolved: isCorrect ? prev.totalSolved + 1 : prev.totalSolved,
        operatorStats: {
          ...prev.operatorStats,
          [op]: {
            correct: isCorrect ? prevOp.correct + 1 : prevOp.correct,
            total: prevOp.total + 1,
          },
        },
      };
    });

    if (isCorrect) {
      setIsCorrectFeedback(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      // Calculate score with combo multiplier & time bonus
      const basePoints = 100 * level;
      const comboMultiplier = Math.min(5, 1 + (newStreak - 1) * 0.25);
      const timeBonus = Math.floor(timeLeft * 15);
      const addedScore = Math.floor(basePoints * comboMultiplier) + timeBonus;

      setScore((prev) => prev + addedScore);
      soundManager.playCorrect(newStreak);
      if (settings.vibrationEnabled) {
        triggerVibration([30, 30]);
      }

      // Progression system: Check Level Up
      let nextLevel = level;
      const nextXp = xpInLevel + 1;

      if (nextXp >= xpRequired) {
        nextLevel = level + 1;
        setLevel(nextLevel);
        setXpInLevel(0);
        // Level up curve: requires 3, then 4, then 5 hits to advance
        setXpRequired(Math.min(6, 3 + Math.floor(nextLevel / 2)));
        setLevelUpNewLevel(nextLevel);

        // Heart reward on level up in Classic mode if damaged
        if (gameMode === 'classic' && lives < maxLives) {
          setLives((prev) => Math.min(maxLives, prev + 1));
        }
        // Note: Equation and countdown will spawn when LevelUpOverlay is dismissed
      } else {
        setXpInLevel(nextXp);
        // Next equation after smooth reward animation
        setTimeout(() => {
          if (screen === 'playing') {
            spawnEquation(nextLevel);
          }
        }, 550);
      }
    } else {
      setIsCorrectFeedback(false);
      setStreak(0);
      soundManager.playWrong();
      if (settings.vibrationEnabled) {
        triggerVibration(200);
      }

      if (gameMode === 'classic') {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => {
            triggerGameOver();
          }, 1200);
          return;
        }
      }

      // Give 1.1s to review the correct solution before continuing
      setTimeout(() => {
        if (screen === 'playing') {
          spawnEquation(level);
        }
      }, 1200);
    }
  };

  // Keyboard shortcut listener (0-9, Backspace, Enter, Minus, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        screen !== 'playing' ||
        isPaused ||
        isProcessingAnswer ||
        isCountdownActive ||
        levelUpNewLevel !== null
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === '-' || e.key === 'm') {
        handleToggleSign();
      } else if (e.key === 'Escape') {
        setIsPaused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const isNewHighScore = score > 0 && score >= stats.highScore;

  return (
    <PhoneContainer
      showFrame={settings.showPhoneFrame}
      onToggleFrame={() => updateSettingsAndSave({ ...settings, showPhoneFrame: !settings.showPhoneFrame })}
    >
      {/* 1. Home Screen */}
      {screen === 'home' && (
        <HomeScreen
          stats={stats}
          selectedMode={gameMode}
          onSelectMode={setGameMode}
          onStartGame={() => handleStartGame(gameMode)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          allowedOperators={settings.allowedOperators}
        />
      )}

      {/* 2. Active Game Screen */}
      {screen === 'playing' && (
        <div className="flex-1 flex flex-col justify-between h-full bg-slate-950">
          {/* Header */}
          <LevelHeader
            level={level}
            xpInLevel={xpInLevel}
            xpRequired={xpRequired}
            score={score}
            lives={lives}
            maxLives={maxLives}
            mode={gameMode}
            onPause={() => setIsPaused(true)}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Time Attack Total Timer Banner (if in time_attack mode) */}
          {gameMode === 'time_attack' && (
            <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-1 flex items-center justify-between text-xs font-bold text-amber-300">
              <span>Modo Contra o Relógio</span>
              <span className="font-math text-sm">{Math.ceil(globalTimeAttackRemaining)}s restantes</span>
            </div>
          )}

          {/* Equation Countdown Timer */}
          <TimerBar
            timeLeft={timeLeft}
            totalTime={totalTime}
            isRunning={!isPaused && !isProcessingAnswer && !isCountdownActive && levelUpNewLevel === null}
            soundEnabled={settings.soundEnabled}
          />

          {/* Equation Display (Math formula + user typed result) */}
          <EquationDisplay
            equation={currentEquation}
            userInput={userInput}
            isCorrectFeedback={isCorrectFeedback}
            streak={streak}
            showExplanation={isCorrectFeedback === false}
          />

          {/* On-Screen Numeric Keypad (0-9, ±, Backspace, Clear, Confirm) */}
          <NumericKeypad
            onDigit={handleDigit}
            onDelete={handleDelete}
            onClear={handleClear}
            onToggleSign={handleToggleSign}
            onSubmit={handleSubmit}
            disabled={isProcessingAnswer || isCountdownActive || levelUpNewLevel !== null}
            canSubmit={userInput.trim() !== '' && userInput !== '-'}
            vibrationEnabled={settings.vibrationEnabled}
          />
        </div>
      )}

      {/* 3. Game Over Modal */}
      {screen === 'game_over' && (
        <GameOverModal
          score={score}
          level={level}
          maxStreak={maxStreak}
          isNewHighScore={isNewHighScore}
          history={history}
          onRestart={() => handleStartGame(gameMode)}
          onHome={() => setScreen('home')}
        />
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Countdown Overlay (3, 2, 1, Calcule!) */}
        {isCountdownActive && (
          <CountdownOverlay
            level={countdownLevel ?? undefined}
            onComplete={handleCountdownComplete}
            vibrationEnabled={settings.vibrationEnabled}
          />
        )}

        {/* Level Up Celebration Banner */}
        {levelUpNewLevel !== null && (
          <LevelUpOverlay
            newLevel={levelUpNewLevel}
            onDismiss={handleDismissLevelUp}
          />
        )}

        {/* Pause Modal */}
        {isPaused && (
          <PauseModal
            level={level}
            score={score}
            onResume={() => setIsPaused(false)}
            onRestart={() => handleStartGame(gameMode)}
            onHome={() => {
              setIsPaused(false);
              setScreen('home');
            }}
            onOpenSettings={() => {
              setIsPaused(false);
              setIsSettingsOpen(true);
            }}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={updateSettingsAndSave}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Stats Modal */}
        {isStatsOpen && (
          <StatsModal
            stats={stats}
            onResetStats={() => {
              updateStatsAndSave(() => defaultStats);
            }}
            onClose={() => setIsStatsOpen(false)}
          />
        )}
      </AnimatePresence>
    </PhoneContainer>
  );
}
