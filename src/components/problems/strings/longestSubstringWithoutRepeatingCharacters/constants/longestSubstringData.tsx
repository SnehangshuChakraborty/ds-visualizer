// Boundary condition mnemonic database keyed by Java line number
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  11: {
    icon: '🧭',
    title: 'Explorer Pointer: right < n',
    mnemonic: 'Walk all the way to the end of the road! 🚶‍♂️',
    why: 'The right pointer acts as the leading edge of the sliding window, expanding the window by one character each iteration until we reach the end of the string.'
  },
  15: {
    icon: '🔮',
    title: 'Duplicate Check: hashSet.contains(rChar)',
    mnemonic: 'Checking the VIP list! If you are already inside, you cannot enter again! 🎟️',
    why: 'If the character at the right pointer is already present in our set, it means we have a duplicate! We must shrink the window from the left to maintain all unique characters.'
  },
  16: {
    icon: '🧹',
    title: 'Left Eviction: hashSet.remove(s.charAt(left))',
    mnemonic: 'Cleaning up from the back! Make room for the newcomer! 🧹',
    why: 'We evict characters from the left edge of the window one by one, shrinking our sliding window until the duplicate character has been removed.'
  },
  21: {
    icon: '📐',
    title: 'Compute Length: right - left + 1',
    mnemonic: 'Measure the bubble size! 📐',
    why: 'Computes the distance between left and right boundary (inclusive) to find the size of the current valid unique substring window.'
  },
  23: {
    icon: '📏',
    title: 'Max Window Update: Math.max',
    mnemonic: 'Measure your bubble! Save the record if it is the largest! 🫧',
    why: 'Compare the current window length with the global maximum length found so far, and keep the larger of the two.'
  }
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

export const PRESETS = [
  { name: 'Classic (Standard)', string: 'abcabcbb' },
  { name: 'All Duplicates (Heavy Shrink)', string: 'bbbbb' },
  { name: 'Jumping Window (Jumps)', string: 'pwwkew' },
  { name: 'Unique (No Duplicates)', string: 'abcdef' }
];
