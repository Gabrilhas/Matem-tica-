export type Operator = 'add' | 'subtract' | 'multiply' | 'divide' | 'sqrt' | 'power';

export type Difficulty = 'facil' | 'medio' | 'dificil' | 'mestre';

export type GameMode = 'classic' | 'time_attack' | 'practice';

export interface Equation {
  id: string;
  display: string; // The full string representation, e.g. "12 + 15 = ?" or "x + 9 = 24" or "√81 = ?"
  questionLatex?: string;
  operator: Operator;
  answer: number;
  explanation: string;
  timeLimit: number;
  level: number;
  difficulty: Difficulty;
  isAlgebraic: boolean;
}

export interface SolvedRecord {
  id: string;
  equation: Equation;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: number;
}

export interface OperatorStat {
  correct: number;
  total: number;
}

export interface UserStats {
  highScore: number;
  highestLevel: number;
  totalGames: number;
  totalSolved: number;
  totalAttempted: number;
  bestStreak: number;
  operatorStats: Record<Operator, OperatorStat>;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  allowedOperators: Operator[];
  showPhoneFrame: boolean;
}
