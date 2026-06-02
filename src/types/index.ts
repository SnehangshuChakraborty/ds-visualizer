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
export type ProblemType = '3sum' | '2sum' | 'median' | 'coinchange2' | 'container' | 'longest-substring' | 'palindrome' | 'rotting-oranges' | 'search-rotated-sorted-array';

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

export interface ContainerStep {
  heights: number[];
  left: number;
  right: number;
  currentWidth: number;
  currentHeight: number;
  currentArea: number;
  maxArea: number;
  highlightedLine: number;
  status: 'start' | 'evaluating' | 'calculating' | 'update-max' | 'move-left' | 'move-right' | 'done';
  message: string;
}

export interface LongestSubstringStep {
  s: string;
  left: number;
  right: number;
  charSet: string[];         // list of unique characters currently in the sliding window
  maxLength: number;
  currentLength: number;
  highlightedLine: number;
  status: 'init' | 'checking' | 'duplicate' | 'shrink' | 'add' | 'update-max' | 'done';
  message: string;
}

export interface LongestPalindromeStep {
  s: string;
  center: number;
  isEven: boolean;          // true = even center (i, i+1), false = odd center (i, i)
  left: number;             // active expansion left pointer
  right: number;            // active expansion right pointer
  start: number;            // best start index found so far
  end: number;              // best end index found so far
  maxLength: number;        // maximum length of palindromic substring found so far
  highlightedLine: number;
  status: 'init' | 'center-step' | 'expanding' | 'match' | 'mismatch' | 'out-of-bounds' | 'update-max' | 'done';
  message: string;
}

export interface RottingOrangesStep {
  grid: number[][];              // 2D grid matrix state: 0=empty, 1=fresh, 2=rotten, 3=newly rotten in current layer
  queue: [number, number][];     // active BFS coordinates queue
  freshOranges: number;
  minutes: number;
  highlightedLine: number;
  activePoint: [number, number] | null;  // active orange being processed
  activeNeighbors: [number, number][];   // current neighbors being checked
  rottedInThisRound: boolean;
  status: 'init' | 'scan' | 'check-fresh' | 'bfs-loop' | 'pop-orange' | 'check-neighbors' | 'rot-orange' | 'increment-time' | 'done';
  message: string;
  activeRow?: number;            // Row index currently being scanned/processed (-1 if none)
  activeCol?: number;            // Column index currently being scanned/processed (-1 if none)
}

export interface SearchRotatedSortedArrayStep {
  nums: number[];
  target: number;
  left: number;
  right: number;
  mid: number;
  highlightedLine: number;
  status: 'init' | 'check-bounds' | 'loop-header' | 'calc-mid' | 'found' | 'left-sorted' | 'right-sorted' | 'target-in-left' | 'target-in-right' | 'move-left' | 'move-right' | 'not-found' | 'done';
  message: string;
}



