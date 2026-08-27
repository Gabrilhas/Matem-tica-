import { GameSettings, UserStats } from '../types';

const STATS_KEY = 'mathmaster_stats_v1';
const SETTINGS_KEY = 'mathmaster_settings_v1';

export const defaultStats: UserStats = {
  highScore: 0,
  highestLevel: 1,
  totalGames: 0,
  totalSolved: 0,
  totalAttempted: 0,
  bestStreak: 0,
  operatorStats: {
    add: { correct: 0, total: 0 },
    subtract: { correct: 0, total: 0 },
    multiply: { correct: 0, total: 0 },
    divide: { correct: 0, total: 0 },
    sqrt: { correct: 0, total: 0 },
    power: { correct: 0, total: 0 },
  },
};

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  allowedOperators: ['add', 'subtract', 'multiply', 'divide', 'sqrt', 'power'],
  showPhoneFrame: false,
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return {
      ...defaultStats,
      ...parsed,
      operatorStats: {
        ...defaultStats.operatorStats,
        ...(parsed.operatorStats || {}),
      },
    };
  } catch {
    return defaultStats;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    const allowed = Array.isArray(parsed.allowedOperators) ? parsed.allowedOperators : defaultSettings.allowedOperators;
    // If power is not yet in allowedOperators, include it by default
    if (!allowed.includes('power')) {
      allowed.push('power');
    }
    return { ...defaultSettings, ...parsed, allowedOperators: allowed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
