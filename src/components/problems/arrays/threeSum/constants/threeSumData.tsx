// Boundary condition mnemonic database keyed by Java line number
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  8: {
    icon: '🛑',
    title: 'Anchor Boundary: nums.length - 2',
    mnemonic: "You can't seat a group of 3 if only 2 chairs are left! 🪑🪑",
    why: 'i stops at length-2 because we need at least 2 more elements (left, right) after it to form a triplet.'
  },
  9: {
    icon: '🧬',
    title: 'First-Time Safeguard: i > 0',
    mnemonic: "You can't look over your shoulder if you're the first person in line! 👤",
    why: 'We check i > 0 before accessing nums[i-1]. At i=0 there is no previous element — this prevents an IndexOutOfBounds crash.'
  },
  14: {
    icon: '🪗',
    title: 'Squeeze Guard: left < right',
    mnemonic: 'The Accordion squeezes, but your hands can never touch! 🪗',
    why: 'If left meets right, both pointers reference the same element. A valid triplet needs 3 distinct indices.'
  },
  19: {
    icon: '🔂',
    title: 'Inner Left Dup Guard: left < right',
    mnemonic: 'Double-check your brakes while driving fast! 🛑',
    why: 'While fast-skipping duplicate lefts, left could overshoot past right. The extra left < right check prevents crossing.'
  },
  20: {
    icon: '🔂',
    title: 'Inner Right Dup Guard: left < right',
    mnemonic: 'Double-check your brakes while driving fast! 🛑',
    why: 'While fast-skipping duplicate rights, right could undershoot past left. The extra left < right check prevents crossing.'
  },
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

export const PRESETS = [
  { name: 'Classic (Duplicates & Matches)', array: [-1, 0, 1, 2, -1, -4] },
  { name: 'Zero Dense', array: [-2, 0, 0, 2, 2] },
  { name: 'Multiple Triplets', array: [-1, 2, 1, -4, 2, -1, -1, 0] },
  { name: 'No Triplets', array: [1, 2, 3, 4, 5] }
];
