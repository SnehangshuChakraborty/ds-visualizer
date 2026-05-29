// Boundary condition mnemonic database keyed by Java line number
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  7: {
    icon: '🪗',
    title: 'Squeeze Boundary: left < right',
    mnemonic: 'The container needs two separate walls to trap any water! 🪗',
    why: 'If left meets right (left == right), the width becomes 0. A single line cannot form a container.'
  },
  14: {
    icon: '💡',
    title: 'Greedy Pointer Selection',
    mnemonic: 'Always replace the weaker link! Squeeze the shorter wall inward. 🧱',
    why: 'The container capacity is limited by the shorter wall. Moving the taller wall inward only decreases the width while keeping the same or worse bottleneck height, which guaranteed yields a smaller area.'
  }
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

export const PRESETS = [
  { name: 'Standard LeetCode Example', heights: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
  { name: 'Symmetric Towers', heights: [4, 3, 2, 1, 4] },
  { name: 'Ascending Steps', heights: [1, 2, 3, 4, 5, 6, 7] },
  { name: 'Valley Shape', heights: [8, 1, 1, 1, 1, 8] }
];
