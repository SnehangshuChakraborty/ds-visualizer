import type { SearchRotatedSortedArrayStep } from '../../../../../types';

export function generateSteps(nums: number[], target: number): SearchRotatedSortedArrayStep[] {
  const steps: SearchRotatedSortedArrayStep[] = [];
  
  // 1. Initial State (Line 2)
  steps.push({
    nums: [...nums],
    target,
    left: -1,
    right: -1,
    mid: -1,
    highlightedLine: 2,
    status: 'init',
    message: "🏁 Method entry: Initializing Search in Rotated Sorted Array search space."
  });

  // 2. Guard Check (Line 3)
  steps.push({
    nums: [...nums],
    target,
    left: -1,
    right: -1,
    mid: -1,
    highlightedLine: 3,
    status: 'check-bounds',
    message: "🛡️ Guard check: Verifying if input array is null or empty."
  });

  if (nums == null || nums.length === 0) {
    steps.push({
      nums: [...nums],
      target,
      left: -1,
      right: -1,
      mid: -1,
      highlightedLine: 4,
      status: 'done',
      message: "❌ Guard triggered: Array is empty. Target cannot be found. Returning -1."
    });
    return steps;
  }

  // 3. Set Left Pointer (Line 5)
  let left = 0;
  steps.push({
    nums: [...nums],
    target,
    left,
    right: -1,
    mid: -1,
    highlightedLine: 5,
    status: 'init',
    message: `👈 Left pointer set to 0. (nums[0] = ${nums[0]})`
  });

  // 4. Set Right Pointer (Line 6)
  let right = nums.length - 1;
  steps.push({
    nums: [...nums],
    target,
    left,
    right,
    mid: -1,
    highlightedLine: 6,
    status: 'init',
    message: `👉 Right pointer set to array boundary length - 1 = ${right}. (nums[${right}] = ${nums[right]})`
  });

  // 5. Binary Search loop
  while (left <= right) {
    // Loop header check (Line 8)
    steps.push({
      nums: [...nums],
      target,
      left,
      right,
      mid: -1,
      highlightedLine: 8,
      status: 'loop-header',
      message: `🔄 Evaluating loop condition: left (${left}) <= right (${right})? True.`
    });

    // Midpoint calculation (Line 9)
    let mid = left + Math.floor((right - left) / 2);
    steps.push({
      nums: [...nums],
      target,
      left,
      right,
      mid,
      highlightedLine: 9,
      status: 'calc-mid',
      message: `📐 Calculating midpoint: mid = ${left} + (${right} - ${left})/2 = ${mid}. (nums[mid] = ${nums[mid]})`
    });

    // Check if matches (Line 11)
    steps.push({
      nums: [...nums],
      target,
      left,
      right,
      mid,
      highlightedLine: 11,
      status: 'calc-mid',
      message: `🎯 Checking target match: nums[mid] (${nums[mid]}) == target (${target})?`
    });

    if (nums[mid] === target) {
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 12,
        status: 'found',
        message: `🎉 Jackpot! Target found at index ${mid}. Returning index.`
      });
      
      // Done Step
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 12,
        status: 'done',
        message: `🏁 Search complete. Target ${target} resides at index ${mid}.`
      });
      return steps;
    }

    // Check if left half is sorted (Line 16)
    steps.push({
      nums: [...nums],
      target,
      left,
      right,
      mid,
      highlightedLine: 16,
      status: 'left-sorted',
      message: `⚖️ Checking sorting: Is left half sorted? nums[left] (${nums[left]}) <= nums[mid] (${nums[mid]})?`
    });

    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 16,
        status: 'left-sorted',
        message: `✔️ Left half [${left}...${mid}] is sorted. Pivot lies in the right segment.`
      });

      // Check target scope in left half (Line 18)
      const inScope = nums[left] <= target && target < nums[mid];
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 18,
        status: 'target-in-left',
        message: `🔍 Checking target range: Is target (${target}) in sorted left range [${nums[left]}...${nums[mid]})? ${inScope ? "Yes" : "No"}`
      });

      if (inScope) {
        right = mid - 1;
        // Shift right (Line 19)
        steps.push({
          nums: [...nums],
          target,
          left,
          right,
          mid,
          highlightedLine: 19,
          status: 'move-right',
          message: `⬅️ Target lies in the left half. Narrowing search window: right = mid - 1 = ${right}.`
        });
      } else {
        left = mid + 1;
        // Shift left (Line 21)
        steps.push({
          nums: [...nums],
          target,
          left,
          right,
          mid,
          highlightedLine: 21,
          status: 'move-left',
          message: `➡️ Target lies in the right half. Narrowing search window: left = mid + 1 = ${left}.`
        });
      }
    } else {
      // Right half is sorted
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 16,
        status: 'right-sorted',
        message: `✔️ Right half [${mid}...${right}] is sorted. Pivot lies in the left segment.`
      });

      // Check target scope in right half (Line 27)
      const inScope = nums[mid] < target && target <= nums[right];
      steps.push({
        nums: [...nums],
        target,
        left,
        right,
        mid,
        highlightedLine: 27,
        status: 'target-in-right',
        message: `🔍 Checking target range: Is target (${target}) in sorted right range (${nums[mid]}...${nums[right]}]? ${inScope ? "Yes" : "No"}`
      });

      if (inScope) {
        left = mid + 1;
        // Shift left (Line 28)
        steps.push({
          nums: [...nums],
          target,
          left,
          right,
          mid,
          highlightedLine: 28,
          status: 'move-left',
          message: `➡️ Target lies in the right half. Narrowing search window: left = mid + 1 = ${left}.`
        });
      } else {
        right = mid - 1;
        // Shift right (Line 30)
        steps.push({
          nums: [...nums],
          target,
          left,
          right,
          mid,
          highlightedLine: 30,
          status: 'move-right',
          message: `⬅️ Target lies in the left half. Narrowing search window: right = mid - 1 = ${right}.`
        });
      }
    }
  }

  // Target not found (Line 8 loop exit)
  steps.push({
    nums: [...nums],
    target,
    left,
    right,
    mid: -1,
    highlightedLine: 8,
    status: 'loop-header',
    message: `🔄 Evaluating loop condition: left (${left}) <= right (${right})? False (Pointers crossed). Loop terminates.`
  });

  // Return -1 (Line 34)
  steps.push({
    nums: [...nums],
    target,
    left,
    right,
    mid: -1,
    highlightedLine: 34,
    status: 'not-found',
    message: "❌ Target not present. Returning -1."
  });

  steps.push({
    nums: [...nums],
    target,
    left,
    right,
    mid: -1,
    highlightedLine: 34,
    status: 'done',
    message: `🏁 Search complete. Target ${target} was not found in the array.`
  });

  return steps;
}
