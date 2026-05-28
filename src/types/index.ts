export interface AlgoStep {
  nums: number[];
  i: number;
  left: number;
  right: number;
  highlightedLine: number;
  sum: number | null;
  message: string;
  foundTriplets: [number, number, number][];
  activePointers: ('i' | 'left' | 'right')[];
  status: 'start' | 'sorting' | 'loop-i' | 'check-dup-i' | 'init-pointers' | 'compare-sum' | 'found' | 'too-small' | 'too-large' | 'skip-dup-inner' | 'pointer-move' | 'finished';
}

export type Theme = 'purple' | 'cyan' | 'amber' | 'aurora';
export type ProblemType = '3sum' | '2sum' | 'median' | 'coinchange2';

export interface CoinChange2Step {
  coins: number[];
  amount: number;
  dp: number[][];         // (coins.length+1) rows × (amount+1) cols
  currentRow: number;     // i — active cell row (-1 = no active cell)
  currentCol: number;     // j — active cell col (-1 = no active cell)
  revealed: boolean[][];  // boolean grid of size (coins.length+1) × (amount+1) indicating computed/revealed cells
  highlightedLine: number;
  phase: 'init' | 'fill' | 'done';
  narrative: string;
  answer: number | null;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface MedianStep {
  numsA: number[];
  numsB: number[];
  cutA: number;
  cutB: number;
  low: number;
  high: number;
  highlightedLine: number;
  champions: {
    maxLeftA: number;
    minRightA: number;
    maxLeftB: number;
    minRightB: number;
  };
  status: 'evaluating' | 'invalid-heavy-top' | 'invalid-heavy-bottom' | 'perfect-cut';
  narrative: string;
  median: number | null;
}
