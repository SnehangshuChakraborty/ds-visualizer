import type { AlgoStep } from '../../../../../types';

// Generator function to precompute all algorithm steps with punchy labels
export function generateSteps(initialNums: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const foundTriplets: [number, number, number][] = [];
  const nums = [...initialNums];

  // 1. Initial State
  steps.push({
    nums: [...nums],
    i: -1, left: -1, right: -1,
    highlightedLine: 4,
    sum: null,
    message: "🏁 Let's find unique triplets that sum to exactly 0. Let's trace the accordion logic!",
    foundTriplets: [],
    activePointers: [],
    status: 'start'
  });

  // 2. Sort the array
  nums.sort((a, b) => a - b);
  steps.push({
    nums: [...nums],
    i: -1, left: -1, right: -1,
    highlightedLine: 6,
    sum: null,
    message: "🧹 Array Sorted! Pointers can now move systematically to squeeze from both sides.",
    foundTriplets: [],
    activePointers: [],
    status: 'sorting'
  });

  // 3. Loop through array
  for (let i = 0; i < nums.length - 2; i++) {
    steps.push({
      nums: [...nums],
      i, left: -1, right: -1,
      highlightedLine: 8,
      sum: null,
      message: `⚓ Anchor set! nums[i] = ${nums[i]}. Squeezing search window between indices ${i + 1} and ${nums.length - 1}.`,
      foundTriplets: [...foundTriplets],
      activePointers: ['i'],
      status: 'loop-i'
    });

    if (i > 0 && nums[i] === nums[i - 1]) {
      steps.push({
        nums: [...nums],
        i, left: -1, right: -1,
        highlightedLine: 9,
        sum: null,
        message: `🧬 Duplicate Anchor skipped! nums[i] (${nums[i]}) already processed at previous index.`,
        foundTriplets: [...foundTriplets],
        activePointers: ['i'],
        status: 'check-dup-i'
      });
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;
    steps.push({
      nums: [...nums],
      i, left, right,
      highlightedLine: 11,
      sum: null,
      message: `🎯 Accordion Ready! Left pointer at index ${left} (${nums[left]}), Right pointer at index ${right} (${nums[right]}).`,
      foundTriplets: [...foundTriplets],
      activePointers: ['i', 'left', 'right'],
      status: 'init-pointers'
    });

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      steps.push({
        nums: [...nums],
        i, left, right,
        highlightedLine: 15,
        sum,
        message: `🧮 Calculating: ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`,
        foundTriplets: [...foundTriplets],
        activePointers: ['i', 'left', 'right'],
        status: 'compare-sum'
      });

      if (sum === 0) {
        foundTriplets.push([nums[i], nums[left], nums[right]]);
        steps.push({
          nums: [...nums],
          i, left, right,
          highlightedLine: 18,
          sum,
          message: `🎉 Jackpot! Harmonious triplet [${nums[i]}, ${nums[left]}, ${nums[right]}] sums exactly to 0!`,
          foundTriplets: [...foundTriplets],
          activePointers: ['i', 'left', 'right'],
          status: 'found'
        });

        // Duplicate skip for Left
        let didSkipLeft = false;
        while (left < right && nums[left] === nums[left + 1]) {
          left++;
          didSkipLeft = true;
        }
        if (didSkipLeft) {
          steps.push({
            nums: [...nums],
            i, left, right,
            highlightedLine: 19,
            sum,
            message: `🧹 Skip Left Duplicate: index ${left} has matching value of ${nums[left]}.`,
            foundTriplets: [...foundTriplets],
            activePointers: ['i', 'left', 'right'],
            status: 'skip-dup-inner'
          });
        }

        // Duplicate skip for Right
        let didSkipRight = false;
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
          didSkipRight = true;
        }
        if (didSkipRight) {
          steps.push({
            nums: [...nums],
            i, left, right,
            highlightedLine: 20,
            sum,
            message: `🧹 Skip Right Duplicate: index ${right} has matching value of ${nums[right]}.`,
            foundTriplets: [...foundTriplets],
            activePointers: ['i', 'left', 'right'],
            status: 'skip-dup-inner'
          });
        }

        left++;
        right--;
        if (left < right) {
          steps.push({
            nums: [...nums],
            i, left, right,
            highlightedLine: 21,
            sum: null,
            message: `🔄 Harmonize! Squeeze both pointers (L ➡️ and ⬅️ R) to index ${left} and ${right}.`,
            foundTriplets: [...foundTriplets],
            activePointers: ['i', 'left', 'right'],
            status: 'pointer-move'
          });
        }
      } else if (sum < 0) {
        left++;
        steps.push({
          nums: [...nums],
          i, left, right,
          highlightedLine: 24,
          sum,
          message: `❄️ Too Cold! Sum is negative (${sum} < 0). Move Left pointer rightward (L ➡️) to index ${left} to increase value.`,
          foundTriplets: [...foundTriplets],
          activePointers: ['i', 'left', 'right'],
          status: 'too-small'
        });
      } else {
        right--;
        steps.push({
          nums: [...nums],
          i, left, right,
          highlightedLine: 26,
          sum,
          message: `🔥 Too Hot! Sum is positive (${sum} > 0). Move Right pointer leftward (⬅️ R) to index ${right} to decrease value.`,
          foundTriplets: [...foundTriplets],
          activePointers: ['i', 'left', 'right'],
          status: 'too-large'
        });
      }
    }
  }

  // End return
  steps.push({
    nums: [...nums],
    i: -1, left: -1, right: -1,
    highlightedLine: 30,
    sum: null,
    message: `🏁 Accordion Squeeze Complete! Identified ${foundTriplets.length} unique combinations that sum to zero!`,
    foundTriplets: [...foundTriplets],
    activePointers: [],
    status: 'finished'
  });

  return steps;
}
