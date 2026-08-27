import { Difficulty, Equation, Operator } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  'x': 'ˣ',
  'n': 'ⁿ',
};

export function toSuperscript(val: number | string): string {
  return String(val)
    .split('')
    .map((char) => SUPERSCRIPTS[char] || char)
    .join('');
}

export function getTimeLimitForLevel(level: number): number {
  // Level 1: 15s, Level 2: 14s, Level 3: 13s, Level 4: 12s, Level 5: 11s, Level 6+: 9s-8s
  if (level <= 1) return 15;
  if (level === 2) return 14;
  if (level === 3) return 13;
  if (level === 4) return 12;
  if (level === 5) return 11;
  if (level === 6) return 10;
  if (level <= 8) return 9;
  return 8;
}

export function getDifficultyLabel(level: number): Difficulty {
  if (level <= 2) return 'facil';
  if (level <= 4) return 'medio';
  if (level <= 6) return 'dificil';
  return 'mestre';
}

export function generateEquation(
  level: number,
  allowedOperators: Operator[] = ['add', 'subtract', 'multiply', 'divide', 'sqrt', 'power']
): Equation {
  // Determine available operators for this level filtered by user's allowed operators
  let levelOps: Operator[] = ['add', 'subtract'];

  if (level >= 2) {
    levelOps.push('multiply', 'power');
  }
  if (level >= 3) {
    levelOps.push('divide', 'sqrt');
  }

  // Intersect with user preferences
  const validOps = levelOps.filter((op) => allowedOperators.includes(op));
  const chosenOp: Operator = validOps.length > 0 ? getRandomItem(validOps) : getRandomItem(allowedOperators);

  const timeLimit = getTimeLimitForLevel(level);
  const difficulty = getDifficultyLabel(level);
  const id = `eq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Chance of algebraic missing term format ("x + a = b" or "√x = a") increases with level
  const isAlgebraic = level >= 3 && Math.random() < Math.min(0.45, 0.15 + level * 0.05);

  let display = '';
  let answer = 0;
  let explanation = '';

  switch (chosenOp) {
    case 'add': {
      let a = 0;
      let b = 0;
      if (level <= 1) {
        a = getRandomInt(1, 9);
        b = getRandomInt(1, 9);
      } else if (level === 2) {
        a = getRandomInt(5, 20);
        b = getRandomInt(3, 15);
      } else if (level <= 4) {
        a = getRandomInt(15, 60);
        b = getRandomInt(10, 45);
      } else {
        a = getRandomInt(40, 150);
        b = getRandomInt(25, 95);
      }

      const sum = a + b;
      if (isAlgebraic) {
        // x + b = sum -> solve for x
        const hideA = Math.random() > 0.5;
        if (hideA) {
          display = `x + ${b} = ${sum}`;
          answer = a;
          explanation = `Subtraia ${b} dos dois lados: x = ${sum} - ${b} = ${a}`;
        } else {
          display = `${a} + x = ${sum}`;
          answer = b;
          explanation = `Subtraia ${a} dos dois lados: x = ${sum} - ${a} = ${b}`;
        }
      } else {
        display = `${a} + ${b} = ?`;
        answer = sum;
        explanation = `Some as duas parcelas: ${a} + ${b} = ${sum}`;
      }
      break;
    }

    case 'subtract': {
      let a = 0;
      let b = 0;
      if (level <= 1) {
        a = getRandomInt(4, 12);
        b = getRandomInt(1, a - 1);
      } else if (level === 2) {
        a = getRandomInt(12, 35);
        b = getRandomInt(4, a - 2);
      } else if (level <= 4) {
        a = getRandomInt(25, 80);
        b = getRandomInt(10, a - 5);
      } else {
        a = getRandomInt(60, 190);
        b = getRandomInt(20, a - 10);
      }

      const diff = a - b;
      if (isAlgebraic) {
        const variant = Math.random();
        if (variant < 0.5) {
          // x - b = diff -> x = diff + b
          display = `x - ${b} = ${diff}`;
          answer = a;
          explanation = `Isole o x somando ${b}: x = ${diff} + ${b} = ${a}`;
        } else {
          // a - x = diff -> x = a - diff
          display = `${a} - x = ${diff}`;
          answer = b;
          explanation = `Isole o x: x = ${a} - ${diff} = ${b}`;
        }
      } else {
        display = `${a} - ${b} = ?`;
        answer = diff;
        explanation = `Efetue a subtração: ${a} - ${b} = ${diff}`;
      }
      break;
    }

    case 'multiply': {
      let a = 0;
      let b = 0;
      if (level <= 2) {
        a = getRandomInt(2, 5);
        b = getRandomInt(2, 6);
      } else if (level === 3) {
        a = getRandomInt(3, 9);
        b = getRandomInt(3, 9);
      } else if (level <= 5) {
        a = getRandomInt(6, 15);
        b = getRandomInt(3, 9);
      } else {
        a = getRandomInt(11, 25);
        b = getRandomInt(4, 12);
      }

      const prod = a * b;
      if (isAlgebraic) {
        const hideA = Math.random() > 0.5;
        if (hideA) {
          display = `${b} · x = ${prod}`;
          answer = a;
          explanation = `Divida os dois lados por ${b}: x = ${prod} ÷ ${b} = ${a}`;
        } else {
          display = `x · ${a} = ${prod}`;
          answer = b;
          explanation = `Divida os dois lados por ${a}: x = ${prod} ÷ ${a} = ${b}`;
        }
      } else {
        display = `${a} × ${b} = ?`;
        answer = prod;
        explanation = `Multiplique os fatores: ${a} × ${b} = ${prod}`;
      }
      break;
    }

    case 'divide': {
      let divisor = 0;
      let quotient = 0;

      if (level <= 3) {
        divisor = getRandomInt(2, 9);
        quotient = getRandomInt(2, 9);
      } else if (level <= 5) {
        divisor = getRandomInt(3, 12);
        quotient = getRandomInt(4, 15);
      } else {
        divisor = getRandomInt(4, 16);
        quotient = getRandomInt(8, 25);
      }

      const dividend = divisor * quotient;
      if (isAlgebraic) {
        const variant = Math.random();
        if (variant < 0.5) {
          // x ÷ divisor = quotient
          display = `x ÷ ${divisor} = ${quotient}`;
          answer = dividend;
          explanation = `Multiplique os dois lados por ${divisor}: x = ${quotient} × ${divisor} = ${dividend}`;
        } else {
          // dividend ÷ x = quotient
          display = `${dividend} ÷ x = ${quotient}`;
          answer = divisor;
          explanation = `Isole o divisor: x = ${dividend} ÷ ${quotient} = ${divisor}`;
        }
      } else {
        display = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient;
        explanation = `Efetue a divisão: ${dividend} ÷ ${divisor} = ${quotient}`;
      }
      break;
    }

    case 'sqrt': {
      // Perfect squares from 1 to 25
      let root = 0;
      if (level <= 3) {
        root = getRandomInt(2, 10); // 4, 9, 16, 25, 36, 49, 64, 81, 100
      } else if (level <= 5) {
        root = getRandomInt(4, 15); // up to 225
      } else {
        root = getRandomInt(6, 25); // up to 625
      }

      const square = root * root;

      // Higher levels can have composite root equations e.g. "√64 + 15" or "√x = 9" or "2 × √49"
      if (level >= 5 && Math.random() < 0.45) {
        const compType = getRandomItem(['add_num', 'mul_num', 'sub_num']);
        if (compType === 'add_num') {
          const addVal = getRandomInt(2, 20);
          display = `√${square} + ${addVal} = ?`;
          answer = root + addVal;
          explanation = `Como √${square} = ${root}, temos: ${root} + ${addVal} = ${answer}`;
        } else if (compType === 'sub_num') {
          const subVal = getRandomInt(1, Math.max(1, root - 1));
          display = `√${square} - ${subVal} = ?`;
          answer = root - subVal;
          explanation = `Como √${square} = ${root}, temos: ${root} - ${subVal} = ${answer}`;
        } else {
          const factor = getRandomInt(2, 5);
          display = `${factor} × √${square} = ?`;
          answer = factor * root;
          explanation = `Como √${square} = ${root}, temos: ${factor} × ${root} = ${answer}`;
        }
      } else if (isAlgebraic) {
        // √x = root -> x = root^2
        display = `√x = ${root}`;
        answer = square;
        explanation = `Eleve os dois lados ao quadrado: x = ${root}² = ${square}`;
      } else {
        display = `√${square} = ?`;
        answer = root;
        explanation = `A raiz quadrada de ${square} é o número que multiplicado por ele mesmo dá ${square}: ${root} × ${root} = ${square}`;
      }
      break;
    }

    case 'power': {
      let base = 2;
      let exp = 2;

      if (level <= 2) {
        const pool = [
          { b: 2, e: 2 }, { b: 3, e: 2 }, { b: 4, e: 2 }, { b: 5, e: 2 },
          { b: 6, e: 2 }, { b: 7, e: 2 }, { b: 8, e: 2 }, { b: 9, e: 2 },
          { b: 10, e: 2 }, { b: 2, e: 3 }, { b: 3, e: 3 }, { b: 4, e: 3 },
          { b: 5, e: 3 }, { b: 2, e: 4 }, { b: getRandomInt(2, 9), e: 0 }, { b: getRandomInt(2, 9), e: 1 },
        ];
        const chosen = getRandomItem(pool);
        base = chosen.b;
        exp = chosen.e;
      } else if (level <= 4) {
        const pool = [
          { b: 2, e: 3 }, { b: 2, e: 4 }, { b: 2, e: 5 }, { b: 2, e: 6 },
          { b: 3, e: 2 }, { b: 3, e: 3 }, { b: 3, e: 4 },
          { b: 4, e: 2 }, { b: 4, e: 3 },
          { b: 5, e: 2 }, { b: 5, e: 3 },
          { b: 6, e: 2 }, { b: 7, e: 2 }, { b: 8, e: 2 }, { b: 9, e: 2 },
          { b: 10, e: 2 }, { b: 10, e: 3 },
          { b: 11, e: 2 }, { b: 12, e: 2 }, { b: 13, e: 2 }, { b: 14, e: 2 }, { b: 15, e: 2 },
        ];
        const chosen = getRandomItem(pool);
        base = chosen.b;
        exp = chosen.e;
      } else {
        const pool = [
          { b: 2, e: 4 }, { b: 2, e: 5 }, { b: 2, e: 6 }, { b: 2, e: 7 }, { b: 2, e: 8 },
          { b: 3, e: 3 }, { b: 3, e: 4 }, { b: 3, e: 5 },
          { b: 4, e: 3 }, { b: 4, e: 4 },
          { b: 5, e: 3 }, { b: 5, e: 4 },
          { b: 6, e: 3 },
          { b: 10, e: 3 }, { b: 10, e: 4 },
          { b: 12, e: 2 }, { b: 13, e: 2 }, { b: 14, e: 2 }, { b: 15, e: 2 },
          { b: 16, e: 2 }, { b: 20, e: 2 }, { b: 25, e: 2 },
        ];
        const chosen = getRandomItem(pool);
        base = chosen.b;
        exp = chosen.e;
      }

      const powVal = Math.pow(base, exp);
      const expSup = toSuperscript(exp);

      if (level >= 5 && Math.random() < 0.4) {
        // Composite power expressions
        const compType = getRandomItem(['add_num', 'sub_num', 'sum_squares']);
        if (compType === 'sum_squares') {
          // e.g. 3² + 4² = ?
          const pair = getRandomItem([
            { b1: 3, b2: 4, val: 25 },
            { b1: 2, b2: 3, val: 13 },
            { b1: 5, b2: 12, val: 169 },
            { b1: 6, b2: 8, val: 100 },
          ]);
          display = `${pair.b1}² + ${pair.b2}² = ?`;
          answer = pair.val;
          explanation = `${pair.b1}² = ${pair.b1 * pair.b1} e ${pair.b2}² = ${pair.b2 * pair.b2}. Somando: ${pair.b1 * pair.b1} + ${pair.b2 * pair.b2} = ${pair.val}`;
        } else if (compType === 'add_num') {
          const addVal = getRandomInt(2, 20);
          display = `${base}${expSup} + ${addVal} = ?`;
          answer = powVal + addVal;
          explanation = `Como ${base}${expSup} = ${powVal}, temos: ${powVal} + ${addVal} = ${answer}`;
        } else {
          const subVal = getRandomInt(1, Math.min(20, Math.max(1, powVal - 1)));
          display = `${base}${expSup} - ${subVal} = ?`;
          answer = powVal - subVal;
          explanation = `Como ${base}${expSup} = ${powVal}, temos: ${powVal} - ${subVal} = ${answer}`;
        }
      } else if (isAlgebraic) {
        // e.g. x² = 64 -> x = 8 or 2ˣ = 32 -> x = 5
        const isExpUnknown = Math.random() < 0.45 && base <= 5 && exp >= 2 && exp <= 6;
        if (isExpUnknown) {
          // 2ˣ = 16 -> x = 4
          display = `${base}ˣ = ${powVal}`;
          answer = exp;
          explanation = `Qual expoente de ${base} resulta em ${powVal}? Como ${base} elevado a ${exp} = ${powVal}, então x = ${exp}`;
        } else {
          // x² = 49 -> x = 7
          display = `x${expSup} = ${powVal}`;
          answer = base;
          explanation = `Qual número elevado a ${exp} resulta em ${powVal}? x = ${base}`;
        }
      } else {
        display = `${base}${expSup} = ?`;
        answer = powVal;
        if (exp === 0) {
          explanation = `Qualquer número não-nulo elevado a 0 é igual a 1. Logo: ${base}⁰ = 1`;
        } else if (exp === 1) {
          explanation = `Qualquer número elevado a 1 é igual a ele mesmo. Logo: ${base}¹ = ${base}`;
        } else if (exp === 2) {
          explanation = `${base}² é ${base} multiplicado por ele mesmo: ${base} × ${base} = ${powVal}`;
        } else {
          const factors = Array(exp).fill(base).join(' × ');
          explanation = `${base}${expSup} significa multiplicar a base ${base} por ela mesma ${exp} vezes: ${factors} = ${powVal}`;
        }
      }
      break;
    }
  }

  return {
    id,
    display,
    operator: chosenOp,
    answer,
    explanation,
    timeLimit,
    level,
    difficulty,
    isAlgebraic,
  };
}
