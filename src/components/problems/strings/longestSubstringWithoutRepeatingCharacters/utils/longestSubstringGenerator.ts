import type { LongestSubstringStep } from '../../../../../types';

export function generateSteps(s: string): LongestSubstringStep[] {
  const steps: AlgoStepContainer[] = [];
  const n = s.length;
  let maxLength = 0;
  let left = 0;
  const currentSet = new Set<string>();

  // Helper to convert set to array for storage in state
  const getSetArray = () => Array.from(currentSet);

  // 1. Initial State (Line 4)
  steps.push({
    s,
    left: -1,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 4,
    status: 'init',
    message: `🏁 Ready to trace sliding window. Let's find the longest substring of unique characters in s = "${s}".`
  });

  // MaxLength initialization step (Line 5)
  steps.push({
    s,
    left: -1,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 5,
    status: 'init',
    message: `⚙️ Initialized: maxLength = 0 to track our best unique substring length.`
  });

  // Read string length step (Line 6)
  steps.push({
    s,
    left: -1,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 6,
    status: 'init',
    message: `📏 Read input string length: n = ${n}.`
  });

  // Left pointer initialization step (Line 8)
  steps.push({
    s,
    left: 0,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 8,
    status: 'init',
    message: `⚙️ Initialized: left = 0 as the trailing edge pointer of our sliding window.`
  });

  // HashSet initialization step (Line 9)
  steps.push({
    s,
    left: 0,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 9,
    status: 'init',
    message: `⚙️ Initialized: empty HashSet to track seen characters inside the active window.`
  });

  for (let right = 0; right < n; right++) {
    const rChar = s.charAt(right);

    // Loop header check step (Line 11)
    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: right - left, // before expansion
      highlightedLine: 11,
      status: 'checking',
      message: `🧭 Right pointer expands window: points to index ${right} ('${rChar}'). s[${left}...${right}] is being evaluated.`
    });

    // Fetch s.charAt(right) (Line 12)
    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: right - left,
      highlightedLine: 12,
      status: 'checking',
      message: `🔎 Reading lead character rChar = '${rChar}' at index ${right}.`
    });

    // Check duplicate condition (Line 15)
    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: right - left,
      highlightedLine: 15,
      status: 'checking',
      message: currentSet.has(rChar)
        ? `🚨 Collision! The letter '${rChar}' is already in our HashSet: {${getSetArray().join(', ')}}. We must shrink the window from the left.`
        : `🔮 No duplicate! '${rChar}' is NOT in our HashSet. It is safe to expand.`
    });

    // Shrink window while duplicate exists
    while (currentSet.has(rChar)) {
      const lChar = s.charAt(left);

      // Highlight line 16: remove char from set
      steps.push({
        s,
        left,
        right,
        charSet: getSetArray(),
        maxLength,
        currentLength: right - left,
        highlightedLine: 16,
        status: 'duplicate',
        message: `🧹 Evicting '${lChar}' from left edge (index ${left}) to clear duplicates.`
      });

      currentSet.delete(lChar);

      left++;
      // Highlight line 17: left++
      steps.push({
        s,
        left,
        right,
        charSet: getSetArray(),
        maxLength,
        currentLength: right - left,
        highlightedLine: 17,
        status: 'shrink',
        message: `➡️ Shrinking! Left pointer steps forward to index ${left} (points to '${s[left]}').`
      });

      // Highlight line 15: duplicate loop header condition recheck
      steps.push({
        s,
        left,
        right,
        charSet: getSetArray(),
        maxLength,
        currentLength: right - left,
        highlightedLine: 15,
        status: 'checking',
        message: currentSet.has(rChar)
          ? `🚨 Collision remains! The letter '${rChar}' is still present in {${getSetArray().join(', ')}}. Continuing left eviction.`
          : `✅ Clear! '${rChar}' has no more duplicates in the current window set.`
      });
    }

    // Add rChar to set (Line 20)
    currentSet.add(rChar);
    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: right - left, // Prior to line 21 execution, length is still the previous value
      highlightedLine: 20,
      status: 'add',
      message: `📥 Adding '${rChar}' to our active unique character set. Current unique set: {${getSetArray().join(', ')}}.`
    });

    // Compute currentLength variable (Line 21)
    const curLen = right - left + 1;
    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: curLen, // Now it is updated to right - left + 1
      highlightedLine: 21,
      status: 'checking',
      message: `⚙️ Calculating window length: currentLength = right - left + 1 = ${right} - ${left} + 1 = ${curLen}.`
    });

    // Update maxLength (Line 23)
    const isNewMax = curLen > maxLength;
    if (isNewMax) {
      maxLength = curLen;
    }

    steps.push({
      s,
      left,
      right,
      charSet: getSetArray(),
      maxLength,
      currentLength: curLen,
      highlightedLine: 23,
      status: 'update-max',
      message: isNewMax
        ? `📏 Record Broken! Substring "${s.substring(left, right + 1)}" has length ${curLen}. Setting maxLength = ${maxLength}!`
        : `📏 Window evaluated! Substring "${s.substring(left, right + 1)}" length is ${curLen}. Max length remains ${maxLength}.`
    });
  }

  // Final Step: Return result (Line 26)
  steps.push({
    s,
    left: -1,
    right: -1,
    charSet: getSetArray(),
    maxLength,
    currentLength: 0,
    highlightedLine: 26,
    status: 'done',
    message: `🏁 Trace Complete! The longest substring without repeating characters in "${s}" has a maximum length of ${maxLength}.`
  });

  return steps;
}

// Simple internal interface to enforce type compatibility
interface AlgoStepContainer extends LongestSubstringStep {}
