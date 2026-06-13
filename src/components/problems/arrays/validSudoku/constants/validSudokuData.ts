// Boundary condition mnemonic database keyed by Java line number
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  9: {
    icon: '⏭️',
    title: "Dot Skip: board[r][c] == '.'",
    mnemonic: "Empty seats don't need name-tags! 🪑",
    why: "Only filled cells (digits 1–9) can cause conflicts. Empty cells ('.') are wildcards that haven't been filled yet, so we skip them entirely."
  },
  12: {
    icon: '📦',
    title: 'Box Index: (r/3)*3 + (c/3)',
    mnemonic: 'The Sudoku board is a 3×3 grid of 3×3 boxes — like a tic-tac-toe of tic-tac-toes! 🎯',
    why: 'Integer division (r/3) gives the box row (0, 1, or 2), and (c/3) gives the box column. Multiplying the row by 3 and adding the column maps all 9 boxes to unique indices 0–8.'
  },
  15: {
    icon: '⬅️',
    title: 'Bitmask: 1 << val',
    mnemonic: 'Think of 9 light switches in a row. "1 << val" walks to switch #val and flips ONLY that one ON! 💡',
    why: 'Left-shifting 1 by val positions creates a number where only bit #val is set. This lets us use a single integer as a set of 9 boolean flags — one per digit.'
  },
  18: {
    icon: '🔍',
    title: 'Conflict Check: (rows[r] & mask) != 0',
    mnemonic: 'Peek at the switch without touching it — if it\'s already ON, someone was here before! 👀',
    why: 'Bitwise AND checks if a specific bit is already set. If (rows[r] & mask) is non-zero, digit val+1 was already placed in row r — that\'s a conflict.'
  },
  23: {
    icon: '✅',
    title: 'Register: rows[r] |= mask',
    mnemonic: 'Flip the switch ON permanently — this digit is now claimed! 🔐',
    why: 'Bitwise OR sets the bit without disturbing other bits. After this, any future cell with the same digit in the same row/col/box will trigger the AND conflict check above.'
  },
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

// Preset Sudoku boards for visualization
export const PRESETS = [
  {
    name: 'Classic Valid (LeetCode Example)',
    board: [
      ['5','3','.','.','7','.','.','.','.'],
      ['6','.','.','1','9','5','.','.','.'],
      ['.','9','8','.','.','.','.','6','.'],
      ['8','.','.','.','6','.','.','.','3'],
      ['4','.','.','8','.','3','.','.','1'],
      ['7','.','.','.','2','.','.','.','6'],
      ['.','6','.','.','.','.','2','8','.'],
      ['.','.','.','4','1','9','.','.','5'],
      ['.','.','.','.','8','.','.','7','9'],
    ],
  },
  {
    name: 'Row Conflict (Duplicate 8 in Row 0)',
    board: [
      ['8','3','.','.','7','.','.','.','.'],
      ['6','.','.','1','9','5','.','.','.'],
      ['.','9','8','.','.','.','.','6','.'],
      ['8','.','.','.','6','.','.','.','3'],
      ['4','.','.','8','.','3','.','.','1'],
      ['7','.','.','.','2','.','.','.','6'],
      ['.','6','.','.','.','.','2','8','.'],
      ['.','.','.','4','1','9','.','.','5'],
      ['.','.','.','.','8','.','.','7','9'],
    ],
  },
  {
    name: 'Box Conflict (Duplicate 9 in Box 1)',
    board: [
      ['5','3','.','.','7','.','.','.','.'],
      ['6','.','.','9','9','5','.','.','.'],
      ['.','9','8','.','.','.','.','6','.'],
      ['8','.','.','.','6','.','.','.','3'],
      ['4','.','.','8','.','3','.','.','1'],
      ['7','.','.','.','2','.','.','.','6'],
      ['.','6','.','.','.','.','2','8','.'],
      ['.','.','.','4','1','9','.','.','5'],
      ['.','.','.','.','8','.','.','7','9'],
    ],
  },
  {
    name: 'Sparse Board (Valid)',
    board: [
      ['.','.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.','5'],
      ['.','.','.','.','.','.','.','.','.'],
      ['.','.','1','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.','7'],
      ['.','.','.','.','.','.','.','.','.'],
    ],
  },
];
