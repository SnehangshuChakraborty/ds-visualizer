import type { MedianStep } from '../../../../../types';

export function generateMedianSteps(numsA: number[], numsB: number[]): MedianStep[] {
  const steps: MedianStep[] = [];

  let A = [...numsA];
  let B = [...numsB];
  let swapped = false;

  if (A.length > B.length) {
    A = [...numsB];
    B = [...numsA];
    swapped = true;
  }

  const m = A.length;
  const n = B.length;

  // Swapping/setup initial state
  steps.push({
    numsA: [...A],
    numsB: [...B],
    cutA: 0,
    cutB: 0,
    low: 0,
    high: m,
    highlightedLine: swapped ? 3 : 6,
    champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
    status: 'evaluating',
    narrative: swapped
      ? `🔄 We swapped the arrays! Since Array A is longer than Array B (${numsA.length} > ${numsB.length}), we swap them so that the shorter array is on top, securing O(log(min(m, n))) complexity.`
      : `🏁 Ready for the Weigh-in! Array A (top) has size m = ${m}, and Array B (bottom) has size n = ${n}. We perform binary search on the shorter top array A.`,
    median: null
  });

  if (swapped) {
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA: 0,
      cutB: 0,
      low: 0,
      high: m,
      highlightedLine: 6,
      champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `🏁 Arrays swapped and loaded! Array A (top) has size m = ${m}, and Array B (bottom) has size n = ${n}. We perform binary search on the shorter top array A.`,
      median: null
    });
  }

  // Record low, high boundaries initialization on line 7
  steps.push({
    numsA: [...A],
    numsB: [...B],
    cutA: 0,
    cutB: 0,
    low: 0,
    high: m,
    highlightedLine: 7,
    champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
    status: 'evaluating',
    narrative: `📍 Boundary pointers low and high are initialized on Array A. low = 0, high = ${m}.`,
    median: null
  });

  let low = 0;
  let high = m;

  while (low <= high) {
    const cutA = Math.floor((low + high) / 2);
    const cutB = Math.floor((m + n + 1) / 2) - cutA;

    // Record loop check step on line 9
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 9,
      champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `🔍 Squeezing binary search bounds: low index is ${low}, high index is ${high}. Checking loop condition low <= high.`,
      median: null
    });

    // Record cutA calculation step on line 10
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 10,
      champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `📐 Calculate top array partition: cutA = (low + high) / 2 = (${low} + ${high}) / 2 = ${cutA}.`,
      median: null
    });

    // Record cutB calculation step on line 11
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 11,
      champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `📐 Calculate bottom array partition: cutB = (m + n + 1) / 2 - cutA = (${m} + ${n} + 1) / 2 - ${cutA} = ${cutB}.`,
      median: null
    });

    const maxLeftA = cutA === 0 ? -Infinity : A[cutA - 1];
    const minRightA = cutA === m ? Infinity : A[cutA];

    const maxLeftB = cutB === 0 ? -Infinity : B[cutB - 1];
    const minRightB = cutB === n ? Infinity : B[cutB];

    const champions = { maxLeftA, minRightA, maxLeftB, minRightB };

    // Record maxLeftA loading step on line 13
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 13,
      champions: { maxLeftA, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `🛡️ Finding top-left boundary value (maxLeftA): ${maxLeftA === -Infinity ? '-∞' : maxLeftA}.`,
      median: null
    });

    // Record minRightA loading step on line 14
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 14,
      champions: { maxLeftA, minRightA, maxLeftB: -Infinity, minRightB: Infinity },
      status: 'evaluating',
      narrative: `🛡️ Finding top-right boundary value (minRightA): ${minRightA === Infinity ? '∞' : minRightA}.`,
      median: null
    });

    // Record maxLeftB loading step on line 15
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 15,
      champions: { maxLeftA, minRightA, maxLeftB, minRightB: Infinity },
      status: 'evaluating',
      narrative: `🛡️ Finding bottom-left boundary value (maxLeftB): ${maxLeftB === -Infinity ? '-∞' : maxLeftB}.`,
      median: null
    });

    // Record minRightB loading step on line 16
    steps.push({
      numsA: [...A],
      numsB: [...B],
      cutA,
      cutB,
      low,
      high,
      highlightedLine: 16,
      champions,
      status: 'evaluating',
      narrative: `🛡️ Finding bottom-right boundary value (minRightB): ${minRightB === Infinity ? '∞' : minRightB}. All boundary champions are loaded!`,
      median: null
    });

    // Check if partition is valid
    if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
      const median = (m + n) % 2 === 1
        ? Math.max(maxLeftA, maxLeftB)
        : (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;

      // Clash check condition passes on line 18
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: 18,
        champions,
        status: 'perfect-cut',
        narrative: `🎉 Clash check successful! Both left elements are lighter than or equal to right elements: maxLeftA (${maxLeftA === -Infinity ? '-∞' : maxLeftA}) <= minRightB (${minRightB === Infinity ? '∞' : minRightB}) and maxLeftB (${maxLeftB === -Infinity ? '-∞' : maxLeftB}) <= minRightA (${minRightA === Infinity ? '∞' : minRightA}).`,
        median: null
      });

      // Perfect cut is returned on line 20 or 22
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: (m + n) % 2 === 1 ? 20 : 22,
        champions,
        status: 'perfect-cut',
        narrative: `🎉 Perfect Cut found! Left Kingdom contains only lightweights, and Right Kingdom contains only heavyweights. Median is calculated as ${median}.`,
        median
      });
      break;
    } else if (maxLeftA > minRightB) {
      // Clash check fails on line 18
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: 18,
        champions,
        status: 'invalid-heavy-top',
        narrative: `⚔️ Cross-checking boundaries on line 18: Is maxLeftA (${maxLeftA}) <= minRightB (${minRightB === Infinity ? '∞' : minRightB}) and maxLeftB (${maxLeftB === -Infinity ? '-∞' : maxLeftB}) <= minRightA (${minRightA === Infinity ? '∞' : minRightA})? No, boundary check failed!`,
        median: null
      });

      // Step 1: check condition on line 24
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: 24,
        champions,
        status: 'invalid-heavy-top',
        narrative: `🚨 Clash evaluation: Top-Left Champion maxLeftA (${maxLeftA}) is heavier than Bottom-Right Challenger minRightB (${minRightB}). Too many high numbers in top partition!`,
        median: null
      });

      // Step 2: squeeze left on line 25
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high: cutA - 1,
        highlightedLine: 25,
        champions,
        status: 'invalid-heavy-top',
        narrative: `🚨 Squeezing Left! Move top cut left by adjusting high bound to cutA - 1 = ${cutA - 1}.`,
        median: null
      });
      high = cutA - 1;
    } else {
      // Clash check fails on line 18
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: 18,
        champions,
        status: 'invalid-heavy-bottom',
        narrative: `⚔️ Cross-checking boundaries on line 18: Is maxLeftA (${maxLeftA === -Infinity ? '-∞' : maxLeftA}) <= minRightB (${minRightB === Infinity ? '∞' : minRightB}) and maxLeftB (${maxLeftB}) <= minRightA (${minRightA === Infinity ? '∞' : minRightA})? No, boundary check failed!`,
        median: null
      });

      // Step 1: check condition on line 24
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low,
        high,
        highlightedLine: 24,
        champions,
        status: 'invalid-heavy-bottom',
        narrative: `🚨 Clash evaluation: Bottom-Left Champion maxLeftB (${maxLeftB}) is heavier than Top-Right Challenger minRightA (${minRightA}). Too many low numbers in top partition!`,
        median: null
      });

      // Step 2: squeeze right on line 27
      steps.push({
        numsA: [...A],
        numsB: [...B],
        cutA,
        cutB,
        low: cutA + 1,
        high,
        highlightedLine: 27,
        champions,
        status: 'invalid-heavy-bottom',
        narrative: `🚨 Squeezing Right! Move top cut right by adjusting low bound to cutA + 1 = ${cutA + 1}.`,
        median: null
      });
      low = cutA + 1;
    }
  }

  return steps;
}
