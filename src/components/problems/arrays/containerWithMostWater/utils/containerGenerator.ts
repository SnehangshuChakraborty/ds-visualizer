import type { ContainerStep } from '../../../../../types';

export function generateContainerSteps(heights: number[]): ContainerStep[] {
  const steps: ContainerStep[] = [];
  const n = heights.length;

  let maxArea = 0;
  let left = 0;
  let right = n - 1;

  // Step 1: Initialize maxArea on line 3
  steps.push({
    heights: [...heights],
    left: -1,
    right: -1,
    currentWidth: 0,
    currentHeight: 0,
    currentArea: 0,
    maxArea: 0,
    highlightedLine: 3,
    status: 'start',
    message: '🏁 Welcome to the Container with Most Water sandbox! We initialize maxArea = 0.'
  });

  // Step 2: Initialize left pointer on line 4
  steps.push({
    heights: [...heights],
    left: 0,
    right: -1,
    currentWidth: 0,
    currentHeight: 0,
    currentArea: 0,
    maxArea: 0,
    highlightedLine: 4,
    status: 'start',
    message: '📍 Place the left pointer (L) at the beginning of the array: left = 0.'
  });

  // Step 3: Initialize right pointer on line 5
  steps.push({
    heights: [...heights],
    left: 0,
    right: n - 1,
    currentWidth: n - 1,
    currentHeight: 0,
    currentArea: 0,
    maxArea: 0,
    highlightedLine: 5,
    status: 'start',
    message: `📍 Place the right pointer (R) at the end of the array: right = ${n - 1}. Initial width = ${n - 1}.`
  });

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(heights[left], heights[right]);
    const area = width * currentHeight;
    const isNewMax = area > maxArea;

    // Step 4: Loop check while (left < right) on line 7
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 7,
      status: 'evaluating',
      message: `🔄 Loop check: left pointer (${left}) is less than right pointer (${right}). We continue squeezing.`
    });

    // Step 5: Compute width on line 8
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 8,
      status: 'calculating',
      message: `📐 Calculate current width: right - left = ${right} - ${left} = ${width}.`
    });

    // Step 6: Compute bottleneck height on line 9
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 9,
      status: 'calculating',
      message: `📐 Find bottleneck height: Math.min(heights[L] (${heights[left]}), heights[R] (${heights[right]})) = ${currentHeight}.`
    });

    // Step 7: Compute current water capacity area on line 10
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 10,
      status: 'calculating',
      message: `📐 Compute current water volume: width (${width}) × height (${currentHeight}) = ${area} units of water.`
    });

    // Step 8: Update maxArea on line 12
    const prevMax = maxArea;
    if (isNewMax) {
      maxArea = area;
    }
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 12,
      status: isNewMax ? 'update-max' : 'calculating',
      message: isNewMax
        ? `🔥 Jackpot! Current area ${area} is larger than previous maxArea ${prevMax}. We update maxArea = ${area}.`
        : `❄️ Current area ${area} is not larger than maxArea ${maxArea}. Keep maxArea unchanged.`
    });

    // Step 9: Compare pointer heights on line 14
    steps.push({
      heights: [...heights],
      left,
      right,
      currentWidth: width,
      currentHeight,
      currentArea: area,
      maxArea,
      highlightedLine: 14,
      status: 'evaluating',
      message: `⚔️ Check heights: heights[L] (${heights[left]}) ${heights[left] < heights[right] ? '<' : '≥'} heights[R] (${heights[right]}).`
    });

    if (heights[left] < heights[right]) {
      // Step 10a: Squeeze Left Pointer on line 15
      steps.push({
        heights: [...heights],
        left: left + 1,
        right,
        currentWidth: right - (left + 1),
        currentHeight,
        currentArea: area,
        maxArea,
        highlightedLine: 15,
        status: 'move-left',
        message: `🚨 Squeezing Left! Since heights[L] (${heights[left]}) is shorter, we increment L to try finding a taller vertical wall: left++.`
      });
      left++;
    } else {
      // Step 10b: Squeeze Right Pointer on line 17
      steps.push({
        heights: [...heights],
        left,
        right: right - 1,
        currentWidth: (right - 1) - left,
        currentHeight,
        currentArea: area,
        maxArea,
        highlightedLine: 17,
        status: 'move-right',
        message: `🚨 Squeezing Right! Since heights[R] (${heights[right]}) is shorter or equal, we decrement R to try finding a taller vertical wall: right--.`
      });
      right--;
    }
  }

  // Step 11: Solver finished on line 20
  steps.push({
    heights: [...heights],
    left: -1,
    right: -1,
    currentWidth: 0,
    currentHeight: 0,
    currentArea: 0,
    maxArea,
    highlightedLine: 20,
    status: 'done',
    message: `🎉 Algorithm completed! The maximum water container capacity found is ${maxArea} units of water.`
  });

  return steps;
}
