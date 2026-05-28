import type { CoinChange2Step } from '../../../../../types';

export function generateCoinChange2Steps(coins: number[], amount: number): CoinChange2Step[] {
  const steps: CoinChange2Step[] = [];
  const n = coins.length;

  // Build initial empty dp table (all zeros initially)
  const makeTable = (): number[][] =>
    Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
  const makeRevealed = (): boolean[][] =>
    Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(false));

  const dp = makeTable();
  const revealed = makeRevealed();

  // Shorthand to snapshot dp and revealed and push a step
  const push = (partial: Omit<CoinChange2Step, 'coins' | 'amount' | 'dp' | 'revealed'>) =>
    steps.push({
      coins,
      amount,
      dp: dp.map(r => [...r]),
      revealed: revealed.map(r => [...r]),
      ...partial,
    });

  // ── Line 1: Class declaration ───────────────────────────────────
  push({
    currentRow: -1,
    currentCol: -1,
    highlightedLine: 1,
    phase: 'init',
    narrative: `🚀 We define the class Solution with the change() method to count the number of combinations that sum to amount = ${amount}.`,
    answer: null,
  });

  // ── Line 2: Method signature ─────────────────────────────────────
  push({
    currentRow: -1,
    currentCol: -1,
    highlightedLine: 2,
    phase: 'init',
    narrative: `📦 Method signature: amount = ${amount}, coins = [${coins.join(', ')}].`,
    answer: null,
  });

  // ── Line 3: n = coins.length ─────────────────────────────────────
  push({
    currentRow: -1,
    currentCol: -1,
    highlightedLine: 3,
    phase: 'init',
    narrative: `📐 n = coins.length = ${n}. We have ${n} coin denomination${n !== 1 ? 's' : ''}.`,
    answer: null,
  });

  // ── Line 4: dp table initialization ──────────────────────────────
  push({
    currentRow: -1,
    currentCol: -1,
    highlightedLine: 4,
    phase: 'init',
    narrative: `🗂️ dp = new int[${n + 1}][${amount + 1}] — Java initialises every cell in the 2D array to 0. The table now has ${n + 1} rows (i=0…${n}) and ${amount + 1} columns (j=0…${amount}).`,
    answer: null,
  });

  // ── Lines 5-7: Base case initialization loop ─────────────────────
  for (let i = 0; i <= n; i++) {
    // Highlight the loop header
    push({
      currentRow: i,
      currentCol: -1,
      highlightedLine: 5,
      phase: 'init',
      narrative: `🔁 Base case loop: i = ${i}. We will initialize the column dp[i][0] to 1 since there is 1 way to make amount 0.`,
      answer: null,
    });

    // Highlight the cell assignments
    dp[i][0] = 1;
    revealed[i][0] = true; // This cell is now computed/revealed
    push({
      currentRow: i,
      currentCol: 0,
      highlightedLine: 6,
      phase: 'init',
      narrative: `🎯 dp[${i}][0] = 1. There is exactly 1 way to reach amount 0 using the first ${i} coin type${i !== 1 ? 's' : ''} — the empty selection.`,
      answer: null,
    });
  }

  // ── Lines 8-15: Nested loops for filling the DP table ────────────
  for (let i = 1; i <= n; i++) {
    const coin = coins[i - 1];

    // Highlight outer loop header
    push({
      currentRow: i,
      currentCol: -1,
      highlightedLine: 8,
      phase: 'fill',
      narrative: `🔁 Outer loop: i = ${i}, coin denomination = ${coin}. Row ${i} represents combinations using coin ${coin}.`,
      answer: null,
    });

    for (let j = 1; j <= amount; j++) {
      // Highlight inner loop header
      push({
        currentRow: i,
        currentCol: j,
        highlightedLine: 9,
        phase: 'fill',
        narrative: `  🔄 Inner loop: j = ${j}. Finding combinations to make amount ${j} using the first ${i} coin type${i !== 1 ? 's' : ''}.`,
        answer: null,
      });

      // Line 10: Inherit from above (exclude coin)
      dp[i][j] = dp[i - 1][j];
      revealed[i][j] = true; // Cell is now computed
      push({
        currentRow: i,
        currentCol: j,
        highlightedLine: 10,
        phase: 'fill',
        narrative: `  📋 dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}. Inherited from row above — ways to make amount ${j} WITHOUT using coin ${coin}.`,
        answer: null,
      });

      // Line 11: Check if j >= coin
      if (j >= coin) {
        push({
          currentRow: i,
          currentCol: j,
          highlightedLine: 11,
          phase: 'fill',
          narrative: `  ✅ j (${j}) ≥ coin (${coin}) is true. We can include coin ${coin} by checking dp[${i}][${j - coin}] = ${dp[i][j - coin]}.`,
          answer: null,
        });

        // Line 12: Add from left (include coin)
        dp[i][j] += dp[i][j - coin];
        push({
          currentRow: i,
          currentCol: j,
          highlightedLine: 12,
          phase: 'fill',
          narrative: `  ➕ dp[${i}][${j}] += dp[${i}][${j - coin}] (${dp[i][j - coin]}) → dp[${i}][${j}] = ${dp[i][j]}. Total ways to make ${j} using coin ${coin}.`,
          answer: null,
        });
      } else {
        push({
          currentRow: i,
          currentCol: j,
          highlightedLine: 11,
          phase: 'fill',
          narrative: `  ❌ j (${j}) < coin (${coin}) is false. We cannot use coin ${coin} here. dp[${i}][${j}] stays ${dp[i][j]}.`,
          answer: null,
        });
      }
    }
  }

  // ── Line 16: Return final answer ─────────────────────────────────
  const answer = dp[n][amount];
  push({
    currentRow: n,
    currentCol: amount,
    highlightedLine: 16,
    phase: 'done',
    narrative: `🏆 Return dp[${n}][${amount}] = ${answer}. There ${answer === 1 ? 'is' : 'are'} ${answer} way${answer !== 1 ? 's' : ''} to make amount ${amount} using coins [${coins.join(', ')}]!`,
    answer,
  });

  return steps;
}
