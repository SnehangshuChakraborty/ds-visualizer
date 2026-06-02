import type { LongestPalindromeStep } from '../../../../../types';

export function generateSteps(s: string): LongestPalindromeStep[] {
  const steps: LongestPalindromeStep[] = [];
  const n = s.length;

  if (n === 0) {
    steps.push({
      s,
      center: -1,
      isEven: false,
      left: -1,
      right: -1,
      start: 0,
      end: -1,
      maxLength: 0,
      highlightedLine: 4,
      status: 'init',
      message: '🏁 Empty string provided. Palindrome is empty.'
    });
    return steps;
  }

  let start = 0;
  let end = 0;
  let maxLength = 1;

  // 1. Initial State (Line 4)
  steps.push({
    s,
    center: -1,
    isEven: false,
    left: -1,
    right: -1,
    start: -1,
    end: -1,
    maxLength: 0,
    highlightedLine: 4,
    status: 'init',
    message: `🏁 Ready to trace Longest Palindromic Substring for s = "${s}".`
  });

  // 2. Empty check (Line 5)
  steps.push({
    s,
    left: -1,
    right: -1,
    center: -1,
    isEven: false,
    start: -1,
    end: -1,
    maxLength: 0,
    highlightedLine: 5,
    status: 'init',
    message: `⚙️ String validation check: s length is ${n}. Greater than 0, continuing...`
  });

  // 3. Start boundary index variable init (Line 6)
  steps.push({
    s,
    left: -1,
    right: -1,
    center: -1,
    isEven: false,
    start: 0,
    end: -1,
    maxLength: 0,
    highlightedLine: 6,
    status: 'init',
    message: `⚙️ Initialized start index variable: start = 0.`
  });

  // 4. End boundary index variable init (Line 7)
  steps.push({
    s,
    left: -1,
    right: -1,
    center: -1,
    isEven: false,
    start: 0,
    end: 0,
    maxLength: 1, // first character is a palindrome of length 1
    highlightedLine: 7,
    status: 'init',
    message: `⚙️ Initialized end index variable: end = 0. The default best palindrome is "${s[0]}" (length 1).`
  });

  for (let i = 0; i < n; i++) {
    // 5. Loop scanner (Line 9)
    steps.push({
      s,
      left: -1,
      right: -1,
      center: i,
      isEven: false,
      start,
      end,
      maxLength,
      highlightedLine: 9,
      status: 'center-step',
      message: `🧭 Center Scanner: i = ${i} (letter '${s[i]}'). Expanding odd and even ripples from here.`
    });

    // --- Odd Center Expansion (s, i, i) ---
    // Line 10: Call odd center expandAroundCenter
    steps.push({
      s,
      left: i,
      right: i,
      center: i,
      isEven: false,
      start,
      end,
      maxLength,
      highlightedLine: 10,
      status: 'expanding',
      message: `🦋 Odd symmetry scan: calling expandAroundCenter(s, ${i}, ${i}). Center character is '${s[i]}'.`
    });

    let L1 = i;
    let R1 = i;
    
    // Symmetrical expansion loop
    while (L1 >= 0 && R1 < n && s.charAt(L1) === s.charAt(R1)) {
      // Symmetrical match check (Line 24)
      steps.push({
        s,
        left: L1,
        right: R1,
        center: i,
        isEven: false,
        start,
        end,
        maxLength,
        highlightedLine: 24,
        status: 'match',
        message: L1 === R1 
          ? `🎯 Odd Pivot Established! Center character at index ${i} ('${s[i]}') is a base palindrome of length 1.`
          : `✅ Symmetric Match! s[${L1}] ('${s[L1]}') == s[${R1}] ('${s[R1]}'). Palindrome grows to: "${s.substring(L1, R1 + 1)}".`
      });

      L1--;
      R1++;

      if (L1 >= 0 && R1 < n) {
        // Step Pointer Move (Line 25-26)
        steps.push({
          s,
          left: L1,
          right: R1,
          center: i,
          isEven: false,
          start,
          end,
          maxLength,
          highlightedLine: 25,
          status: 'expanding',
          message: `🔄 Expanding odd wings! Left pointer goes L ⬅️ to index ${L1} ('${s[L1]}'), Right pointer R ➡️ to index ${R1} ('${s[R1]}').`
        });
      }
    }

    // Stop Expansion due to mismatch or out of bounds (Line 24)
    if (L1 < 0 || R1 >= n) {
      steps.push({
        s,
        left: L1,
        right: R1,
        center: i,
        isEven: false,
        start,
        end,
        maxLength,
        highlightedLine: 24,
        status: 'out-of-bounds',
        message: `🚫 Out of bounds! L = ${L1}, R = ${R1}. One of the pointers crossed string edges. Stopping expansion.`
      });
    } else {
      steps.push({
        s,
        left: L1,
        right: R1,
        center: i,
        isEven: false,
        start,
        end,
        maxLength,
        highlightedLine: 24,
        status: 'mismatch',
        message: `❌ Mismatch! s[${L1}] ('${s[L1]}') !== s[${R1}] ('${s[R1]}'). Symmetry broken! Stopping expansion.`
      });
    }

    const len1 = R1 - L1 - 1;

    // Expand Return length (Line 28)
    steps.push({
      s,
      left: L1,
      right: R1,
      center: i,
      isEven: false,
      start,
      end,
      maxLength,
      highlightedLine: 28,
      status: 'expanding',
      message: `📐 Returns odd expanded palindrome length: ${R1} - ${L1} - 1 = ${len1}.`
    });

    // --- Even Center Expansion (s, i, i + 1) ---
    // Line 11: Call even center expandAroundCenter
    const hasRightEvenNeighbor = i + 1 < n;
    steps.push({
      s,
      left: i,
      right: i + 1,
      center: i,
      isEven: true,
      start,
      end,
      maxLength,
      highlightedLine: 11,
      status: 'expanding',
      message: hasRightEvenNeighbor 
        ? `👥 Even symmetry scan: calling expandAroundCenter(s, ${i}, ${i + 1}). Checking gap between s[${i}] ('${s[i]}') and s[${i + 1}] ('${s[i + 1]}').`
        : `👥 Even symmetry scan: index ${i + 1} is out of bounds. No even center possible.`
    });

    let L2 = i;
    let R2 = i + 1;
    let len2 = 0;

    if (hasRightEvenNeighbor) {
      while (L2 >= 0 && R2 < n && s.charAt(L2) === s.charAt(R2)) {
        // Symmetrical match check (Line 24)
        steps.push({
          s,
          left: L2,
          right: R2,
          center: i,
          isEven: true,
          start,
          end,
          maxLength,
          highlightedLine: 24,
          status: 'match',
          message: `✅ Symmetric Match! s[${L2}] ('${s[L2]}') == s[${R2}] ('${s[R2]}'). Palindrome grows to: "${s.substring(L2, R2 + 1)}".`
        });

        L2--;
        R2++;

        if (L2 >= 0 && R2 < n) {
          // Step Pointer Move (Line 25-26)
          steps.push({
            s,
            left: L2,
            right: R2,
            center: i,
            isEven: true,
            start,
            end,
            maxLength,
            highlightedLine: 25,
            status: 'expanding',
            message: `🔄 Expanding even wings! Left pointer goes L ⬅️ to index ${L2} ('${s[L2]}'), Right pointer R ➡️ to index ${R2} ('${s[R2]}').`
          });
        }
      }

      // Stop Expansion due to mismatch or out of bounds (Line 24)
      if (L2 < 0 || R2 >= n) {
        steps.push({
          s,
          left: L2,
          right: R2,
          center: i,
          isEven: true,
          start,
          end,
          maxLength,
          highlightedLine: 24,
          status: 'out-of-bounds',
          message: `🚫 Out of bounds! L = ${L2}, R = ${R2}. One of the pointers crossed string edges. Stopping expansion.`
        });
      } else {
        steps.push({
          s,
          left: L2,
          right: R2,
          center: i,
          isEven: true,
          start,
          end,
          maxLength,
          highlightedLine: 24,
          status: 'mismatch',
          message: `❌ Mismatch! s[${L2}] ('${s[L2]}') !== s[${R2}] ('${s[R2]}'). Symmetry broken! Stopping expansion.`
        });
      }

      len2 = R2 - L2 - 1;
    }

    // Expand Return length (Line 28)
    steps.push({
      s,
      left: L2,
      right: R2,
      center: i,
      isEven: true,
      start,
      end,
      maxLength,
      highlightedLine: 28,
      status: 'expanding',
      message: `📐 Returns even expanded palindrome length: ${R2} - ${L2} - 1 = ${len2}.`
    });

    // Math.max calculation (Line 12)
    const len = Math.max(len1, len2);
    steps.push({
      s,
      left: -1,
      right: -1,
      center: i,
      isEven: false,
      start,
      end,
      maxLength,
      highlightedLine: 12,
      status: 'expanding',
      message: `🧮 Compare lengths: len = Math.max(odd: ${len1}, even: ${len2}) = ${len}.`
    });

    // Record check (Line 14)
    const isNewRecord = len > (end - start + 1);
    steps.push({
      s,
      left: -1,
      right: -1,
      center: i,
      isEven: false,
      start,
      end,
      maxLength,
      highlightedLine: 14,
      status: 'update-max',
      message: isNewRecord
        ? `👑 Record Check: len (${len}) > currentRecord (${end - start + 1})? YES! We have a new champion wingspan!`
        : `👑 Record Check: len (${len}) > currentRecord (${end - start + 1})? No change.`
    });

    if (isNewRecord) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
      maxLength = len;

      // Update boundaries (Line 15-16)
      steps.push({
        s,
        left: -1,
        right: -1,
        center: i,
        isEven: false,
        start,
        end,
        maxLength,
        highlightedLine: 15,
        status: 'update-max',
        message: `🎉 Palindrome boundaries updated! start = ${start}, end = ${end}. Current champion: "${s.substring(start, end + 1)}" (length ${len}).`
      });
    }
  }

  // Final Step: Return result (Line 20)
  steps.push({
    s,
    left: -1,
    right: -1,
    center: -1,
    isEven: false,
    start,
    end,
    maxLength,
    highlightedLine: 20,
    status: 'done',
    message: `🏁 Scanning complete! The absolute longest palindromic substring is "${s.substring(start, end + 1)}" with a length of ${maxLength}.`
  });

  return steps;
}
