export interface SearchPreset {
  name: string;
  nums: number[];
  target: number;
  description: string;
}

export const PRESETS: SearchPreset[] = [
  {
    name: "Standard Rotated (Pivot Mid)",
    nums: [4, 5, 6, 7, 0, 1, 2],
    target: 0,
    description: "Array is rotated at index 3. Target 0 is in the right half. Normal O(log N) search."
  },
  {
    name: "Pivot on Left (Short Left Half)",
    nums: [6, 7, 8, 1, 2, 3, 4, 5],
    target: 8,
    description: "Array is rotated at index 2. Target 8 lies at the boundary of the left half."
  },
  {
    name: "Target Not Present",
    nums: [4, 5, 6, 7, 0, 1, 2],
    target: 3,
    description: "Target 3 is missing. Pointers will cross (L > R) and return -1."
  },
  {
    name: "Single Element (Found)",
    nums: [5],
    target: 5,
    description: "L and R start at the same cell. Target matches mid on first step. Returns 0."
  },
  {
    name: "Single Element (Not Found)",
    nums: [5],
    target: 2,
    description: "L and R start at same cell. Mid doesn't match target. Pointers cross. Returns -1."
  }
];

export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  2: {
    icon: '🏁',
    title: 'Method Entry',
    mnemonic: 'search Method Started! 🏁',
    why: 'The search operation begins with a rotated sorted array and the target value.'
  },
  3: {
    icon: '🛡️',
    title: 'Guard Clause',
    mnemonic: 'Guard against empty arrays! 🛡️',
    why: 'If the array is null or empty, search is impossible. We return -1 immediately.'
  },
  5: {
    icon: '👈',
    title: 'Left Pointer Set',
    mnemonic: 'Set Left Pointer = 0! 👈',
    why: 'Initialize left search index at the first element of the active search range.'
  },
  6: {
    icon: '👉',
    title: 'Right Pointer Set',
    mnemonic: 'Set Right Pointer = length - 1! 👉',
    why: 'Initialize right search index at the last element of the active search range.'
  },
  8: {
    icon: '🔄',
    title: 'Loop Header',
    mnemonic: 'Loop while Left <= Right! 🔄',
    why: 'Runs as long as there is a valid search window left. If Left > Right, the target does not exist.'
  },
  9: {
    icon: '📐',
    title: 'Midpoint Calculation',
    mnemonic: 'Calculate middle index mid! 📐',
    why: 'Compute mid index to divide-and-conquer. Using left + (right - left)/2 avoids integer overflow.'
  },
  11: {
    icon: '🎯',
    title: 'Jackpot Target Match',
    mnemonic: 'Check if nums[mid] is target! 🎯',
    why: 'If the element at mid matches target, we have successfully found our target! Return its index.'
  },
  16: {
    icon: '⚖️',
    title: 'Sorted Half Detect',
    mnemonic: 'Detect if left half is sorted! ⚖️',
    why: 'We compare nums[left] and nums[mid]. If nums[left] <= nums[mid], the left portion is sorted normally.'
  },
  18: {
    icon: '🔍',
    title: 'Scope check (Left)',
    mnemonic: 'Is target inside Left boundary? 🔍',
    why: 'Checks if target is between nums[left] and nums[mid]. If yes, we narrow the search to the left half.'
  },
  19: {
    icon: '⬅️',
    title: 'Shift Window Left',
    mnemonic: 'Move Right pointer to mid - 1! ⬅️',
    why: 'Since target is confirmed to lie inside the sorted left half, discard the right half by moving right = mid - 1.'
  },
  21: {
    icon: '➡️',
    title: 'Shift Window Right',
    mnemonic: 'Move Left pointer to mid + 1! ➡️',
    why: 'Target is not in the sorted left half, meaning it must lie in the right half. Set left = mid + 1.'
  },
  27: {
    icon: '🔍',
    title: 'Scope check (Right)',
    mnemonic: 'Is target inside Right boundary? 🔍',
    why: 'Checks if target is between nums[mid] and nums[right] (the sorted right half).'
  },
  28: {
    icon: '➡️',
    title: 'Shift Window Right',
    mnemonic: 'Move Left pointer to mid + 1! ➡️',
    why: 'Target is confirmed to lie inside the sorted right half. Discard the left half by setting left = mid + 1.'
  },
  30: {
    icon: '⬅️',
    title: 'Shift Window Left',
    mnemonic: 'Move Right pointer to mid - 1! ⬅️',
    why: 'Target is not in the sorted right half, meaning it must lie in the left half. Set right = mid - 1.'
  },
  34: {
    icon: '❌',
    title: 'Not Found',
    mnemonic: 'Search space exhausted, return -1! ❌',
    why: 'Pointers have crossed, meaning target was not found in any segment. Return -1.'
  }
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);
