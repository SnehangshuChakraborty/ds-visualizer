import type { ValidSudokuStep } from '../../../../../types';

// Helper: format a 9-bit binary string from an integer
function toBin9(n: number): string {
  return n.toString(2).padStart(9, '0');
}

// Generator function to precompute all algorithm steps for the Valid Sudoku bitmask solution
export function generateSteps(board: string[][]): ValidSudokuStep[] {
  const steps: ValidSudokuStep[] = [];

  // Deep-copy the board for immutable snapshots
  const cloneBoard = (): string[][] => board.map(row => [...row]);

  // Mutable bitmask arrays
  const rows = new Array(9).fill(0);
  const cols = new Array(9).fill(0);
  const boxes = new Array(9).fill(0);

  // 1. Initial State — show the board
  steps.push({
    board: cloneBoard(),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: [...rows], cols: [...cols], boxes: [...boxes],
    highlightedLine: 2,
    status: 'start',
    message: "🏁 Let's validate this Sudoku board! We'll use 3 bitmask integers — one per row, column, and 3×3 box — to track which digits (1–9) have been seen.",
    conflictType: null,
    isValid: true,
  });

  // 2. Initialization — int[] rows = new int[9];
  steps.push({
    board: cloneBoard(),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: [...rows], cols: [...cols], boxes: [...boxes],
    highlightedLine: 3,
    status: 'start',
    message: "📦 Initializing rows[9] — an array of 9 integers, one per row. Each integer is a bitmask that tracks which digits (1–9) have been seen in that row.",
    conflictType: null,
    isValid: true,
  });

  // 3. Initialization — int[] cols = new int[9];
  steps.push({
    board: cloneBoard(),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: [...rows], cols: [...cols], boxes: [...boxes],
    highlightedLine: 4,
    status: 'start',
    message: "📦 Initializing cols[9] — same idea, but tracking digits per column.",
    conflictType: null,
    isValid: true,
  });

  // 4. Initialization — int[] boxes = new int[9];
  steps.push({
    board: cloneBoard(),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: [...rows], cols: [...cols], boxes: [...boxes],
    highlightedLine: 5,
    status: 'start',
    message: "📦 Initializing boxes[9] — tracking digits per 3×3 sub-box. The 9 sub-boxes are indexed 0–8 using the formula (r/3)*3 + (c/3).",
    conflictType: null,
    isValid: true,
  });

  // 5. Walk through the nested loops
  for (let r = 0; r < 9; r++) {
    // Step: outer for-loop entry — for (int r = 0; r < 9; r++)
    steps.push({
      board: cloneBoard(),
      row: r, col: -1, val: -1, boxIdx: -1, mask: 0,
      rows: [...rows], cols: [...cols], boxes: [...boxes],
      highlightedLine: 7,
      status: 'scan-cell',
      message: `🔄 Outer loop: starting row r = ${r}.`,
      conflictType: null,
      isValid: true,
    });

    for (let c = 0; c < 9; c++) {
      // Step: scan-cell — entering this cell (inner for-loop)
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val: -1, boxIdx: -1, mask: 0,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 8,
        status: 'scan-cell',
        message: `🔍 Scanning cell board[${r}][${c}] = '${board[r][c]}'.`,
        conflictType: null,
        isValid: true,
      });

      // If the cell is '.', skip
      if (board[r][c] === '.') {
        steps.push({
          board: cloneBoard(),
          row: r, col: c, val: -1, boxIdx: -1, mask: 0,
          rows: [...rows], cols: [...cols], boxes: [...boxes],
          highlightedLine: 9,
          status: 'skip-dot',
          message: `⏭️ Cell is '.', condition is true — skipping this cell.`,
          conflictType: null,
          isValid: true,
        });
        continue;
      } else {
        steps.push({
          board: cloneBoard(),
          row: r, col: c, val: -1, boxIdx: -1, mask: 0,
          rows: [...rows], cols: [...cols], boxes: [...boxes],
          highlightedLine: 9,
          status: 'scan-cell',
          message: `🔍 Cell contains digit '${board[r][c]}', condition is false — proceeding to validate.`,
          conflictType: null,
          isValid: true,
        });
      }

      // calc-val
      const val = board[r][c].charCodeAt(0) - '1'.charCodeAt(0);
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx: -1, mask: 0,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 11,
        status: 'calc-val',
        message: `🔢 val = '${board[r][c]}' - '1' = ${val}. This gives us the 0-indexed bit position for digit ${board[r][c]}.`,
        conflictType: null,
        isValid: true,
      });

      // calc-box
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask: 0,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 12,
        status: 'calc-box',
        message: `📦 boxIdx = (${r}/3)*3 + (${c}/3) = ${Math.floor(r / 3)}*3 + ${Math.floor(c / 3)} = ${boxIdx}. This cell belongs to sub-box #${boxIdx}.`,
        conflictType: null,
        isValid: true,
      });

      // calc-mask — this is the QUIZ step
      const mask = 1 << val;
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 15,
        status: 'calc-mask',
        message: `⬅️ mask = 1 << ${val} = ${mask} (binary: ${toBin9(mask)}). We shift the number 1 leftward by ${val} positions to create a bitmask targeting bit #${val}.`,
        conflictType: null,
        isValid: true,
      });

      // check-conflict — bitwise AND test
      const rowConflict = (rows[r] & mask) !== 0;
      const colConflict = (cols[c] & mask) !== 0;
      const boxConflict = (boxes[boxIdx] & mask) !== 0;

      if (rowConflict || colConflict || boxConflict) {
        const conflictType = rowConflict ? 'row' : colConflict ? 'col' : 'box';
        const conflictLabel = rowConflict
          ? `rows[${r}] (${toBin9(rows[r])})`
          : colConflict
          ? `cols[${c}] (${toBin9(cols[c])})`
          : `boxes[${boxIdx}] (${toBin9(boxes[boxIdx])})`;

        // Step: check-conflict (showing the failing AND)
        steps.push({
          board: cloneBoard(),
          row: r, col: c, val, boxIdx, mask,
          rows: [...rows], cols: [...cols], boxes: [...boxes],
          highlightedLine: 18,
          status: 'check-conflict',
          message: `🔍 Checking: (${conflictLabel} & ${toBin9(mask)}) ≠ 0? YES — bit #${val} is already set!`,
          conflictType,
          isValid: true,
        });

        // Step: conflict-found — return false
        steps.push({
          board: cloneBoard(),
          row: r, col: c, val, boxIdx, mask,
          rows: [...rows], cols: [...cols], boxes: [...boxes],
          highlightedLine: 19,
          status: 'conflict-found',
          message: `🚫 Conflict! Digit '${board[r][c]}' was already seen in ${conflictType} ${conflictType === 'row' ? r : conflictType === 'col' ? c : boxIdx}. Board is INVALID — return false.`,
          conflictType,
          isValid: false,
        });

        // Done — invalid board
        steps.push({
          board: cloneBoard(),
          row: r, col: c, val, boxIdx, mask,
          rows: [...rows], cols: [...cols], boxes: [...boxes],
          highlightedLine: 19,
          status: 'done-invalid',
          message: `❌ Validation complete: Board is INVALID. A duplicate digit '${board[r][c]}' was found in ${conflictType} ${conflictType === 'row' ? r : conflictType === 'col' ? c : boxIdx}.`,
          conflictType,
          isValid: false,
        });

        return steps;
      }

      // Step: check-conflict (no conflict)
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 18,
        status: 'check-conflict',
        message: `✅ No conflict! rows[${r}] (${toBin9(rows[r])}) & mask = 0, cols[${c}] (${toBin9(cols[c])}) & mask = 0, boxes[${boxIdx}] (${toBin9(boxes[boxIdx])}) & mask = 0. Bit #${val} is clear everywhere.`,
        conflictType: null,
        isValid: true,
      });

      // Step 1: set-bits rows[r] |= mask (Line 23)
      rows[r] |= mask;
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 23,
        status: 'set-bits',
        message: `💡 Setting bit #${val} in rows[${r}] to register digit '${board[r][c]}' for Row ${r}: rows[${r}] |= mask.`,
        conflictType: null,
        isValid: true,
      });

      // Step 2: set-bits cols[c] |= mask (Line 24)
      cols[c] |= mask;
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 24,
        status: 'set-bits',
        message: `💡 Setting bit #${val} in cols[${c}] to register digit '${board[r][c]}' for Col ${c}: cols[${c}] |= mask.`,
        conflictType: null,
        isValid: true,
      });

      // Step 3: set-bits boxes[boxIdx] |= mask (Line 25)
      boxes[boxIdx] |= mask;
      steps.push({
        board: cloneBoard(),
        row: r, col: c, val, boxIdx, mask,
        rows: [...rows], cols: [...cols], boxes: [...boxes],
        highlightedLine: 25,
        status: 'set-bits',
        message: `💡 Setting bit #${val} in boxes[${boxIdx}] to register digit '${board[r][c]}' for Box ${boxIdx}: boxes[${boxIdx}] |= mask.`,
        conflictType: null,
        isValid: true,
      });
    }
  }

  // 3. All cells scanned — valid!
  steps.push({
    board: cloneBoard(),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: [...rows], cols: [...cols], boxes: [...boxes],
    highlightedLine: 28,
    status: 'done-valid',
    message: `🎉 Validation complete! All 81 cells scanned with zero conflicts. The Sudoku board is VALID — return true.`,
    conflictType: null,
    isValid: true,
  });

  return steps;
}
