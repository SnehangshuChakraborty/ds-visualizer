// Boundary condition database keyed by Java line numbers
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  9: {
    icon: '🧭',
    title: 'Center Scanner Loop',
    mnemonic: 'Scan every single character as a potential mirror center! 🪞',
    why: 'The loop traverses through the string, considering each index i (and gap between i and i+1) as the center of potential palindromes.'
  },
  10: {
    icon: '🦋',
    title: 'Odd Palindrome: expand(s, i, i)',
    mnemonic: 'Symmetry around a single letter! (e.g. "a-b-a") 🦋',
    why: 'Triggers symmetrical expansion where L and R pointers start at the exact same index i. Finds odd-length palindromes.'
  },
  11: {
    icon: '👥',
    title: 'Even Palindrome: expand(s, i, i+1)',
    mnemonic: 'Symmetry around a gap between twin letters! (e.g. "a-b-b-a") 👥',
    why: 'Triggers expansion starting with L at index i and R at index i+1. Finds even-length palindromes.'
  },
  14: {
    icon: '👑',
    title: 'Record Check: len > end - start + 1',
    mnemonic: 'Measure the wingspan! Compare it to the legendary record! 👑',
    why: 'Checks if the newly expanded palindrome length is strictly greater than our previous best record (which has length end - start + 1).'
  },
  24: {
    icon: '📐',
    title: 'Expansion Guard: Bounds & Character Match',
    mnemonic: 'Expand only when bounds are safe and wingtips match! 📐',
    why: 'We can only expand as long as the left index is inside the left bound (>= 0), the right index is inside the right bound (< length), and s.charAt(left) equals s.charAt(right).'
  }
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

export const PRESETS = [
  { name: 'Classic (Odd & Even)', string: 'babad' },
  { name: 'Even Center Winner', string: 'cbbd' },
  { name: 'Fully Symmetric', string: 'racecar' },
  { name: 'Isolated Center', string: 'aacabdkacaa' }
];
