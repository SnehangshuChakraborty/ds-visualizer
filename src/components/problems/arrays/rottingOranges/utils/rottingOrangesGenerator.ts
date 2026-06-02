import type { RottingOrangesStep } from '../../../../../types';

export function generateSteps(initialGrid: number[][]): RottingOrangesStep[] {
  const steps: RottingOrangesStep[] = [];
  
  // Helper to deep copy grid matrix
  const cloneGrid = (g: number[][]) => g.map(row => [...row]);
  
  let grid = cloneGrid(initialGrid);
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  
  if (rows === 0 || cols === 0) {
    steps.push({
      grid: cloneGrid(grid),
      queue: [],
      freshOranges: 0,
      minutes: 0,
      highlightedLine: 5,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound: false,
      status: 'init',
      message: "🏁 Empty grid matrix provided. Return 0 immediately."
    });
    return steps;
  }

  // 1. Initial State (Line 5)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 5,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: "🏁 Orange decay visualization ready. Entering method..."
  });

  // 2. Null/Empty Check (Line 6)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 6,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: "⚙️ Guard Clause: Checking if grid is null or has zero rows..."
  });

  // 3. Declare rows (Line 8)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 8,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: `⚙️ Read grid dimensions: rows = ${rows}.`
  });

  // 4. Declare cols (Line 9)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 9,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: `⚙️ Read grid dimensions: cols = ${cols}.`
  });

  // 5. Declare queue (Line 10)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 10,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: "⚙️ Allocated double-ended Queue in memory to hold rotten oranges."
  });

  // 6. Declare fresh counter (Line 11)
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 11,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: "⚙️ Initialized freshOranges counter variable = 0."
  });

  // 7. Initial Scanner Loop Start (Line 14)
  let queue: [number, number][] = [];
  let freshOranges = 0;
  
  for (let r = 0; r < rows; r++) {
    // 7.1. Row scan step (Line 14)
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes: 0,
      highlightedLine: 14,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound: false,
      status: 'scan',
      message: `🔍 Scanner Loop: entering Row ${r}. Scanning row-wide.`,
      activeRow: r,
      activeCol: -1
    });

    for (let c = 0; c < cols; c++) {
      // 7.2. Column/Cell scan step (Line 15)
      steps.push({
        grid: cloneGrid(grid),
        queue: [...queue],
        freshOranges,
        minutes: 0,
        highlightedLine: 15,
        activePoint: null,
        activeNeighbors: [],
        rottedInThisRound: false,
        status: 'scan',
        message: `🔍 Column Loop: targeting cell [${r}, ${c}] in Row ${r}.`,
        activeRow: r,
        activeCol: c
      });

      // 7.3. Symmetrical cell check step (Line 16)
      steps.push({
        grid: cloneGrid(grid),
        queue: [...queue],
        freshOranges,
        minutes: 0,
        highlightedLine: 16,
        activePoint: null,
        activeNeighbors: [],
        rottedInThisRound: false,
        status: 'scan',
        message: `🔍 Checking cell [${r}, ${c}] value: it is ${grid[r][c] === 2 ? "Rotten (2)" : grid[r][c] === 1 ? "Fresh (1)" : "Empty (0)"}.`,
        activeRow: r,
        activeCol: c
      });

      if (grid[r][c] === 2) {
        queue.push([r, c]);
        // 7.4. Enqueue step (Line 17)
        steps.push({
          grid: cloneGrid(grid),
          queue: [...queue],
          freshOranges,
          minutes: 0,
          highlightedLine: 17,
          activePoint: null,
          activeNeighbors: [],
          rottedInThisRound: false,
          status: 'scan',
          message: `☣️ Rotten orange found! Adding coordinate [${r}, ${c}] to initial BFS queue.`,
          activeRow: r,
          activeCol: c
        });
      } else if (grid[r][c] === 1) {
        freshOranges++;
        // 7.5. Increment fresh step (Line 19)
        steps.push({
          grid: cloneGrid(grid),
          queue: [...queue],
          freshOranges,
          minutes: 0,
          highlightedLine: 19,
          activePoint: null,
          activeNeighbors: [],
          rottedInThisRound: false,
          status: 'scan',
          message: `🍊 Fresh orange found! Incrementing fresh oranges count to ${freshOranges}.`,
          activeRow: r,
          activeCol: c
        });
      }
    }
  }

  // Scan Completed State (Line 21 - close loop bracket)
  steps.push({
    grid: cloneGrid(grid),
    queue: [...queue],
    freshOranges,
    minutes: 0,
    highlightedLine: 21,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'scan',
    message: `⚙️ Scan complete: Found ${queue.length} rotten orange(s) as BFS seeds, and counted ${freshOranges} fresh orange(s).`
  });

  // 8. Early Exit Check (Line 25)
  steps.push({
    grid: cloneGrid(grid),
    queue: [...queue],
    freshOranges,
    minutes: 0,
    highlightedLine: 25,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'check-fresh',
    message: `🌱 Checking early exit: Do we have 0 fresh oranges? ${freshOranges === 0 ? "YES. Returning 0!" : "NO, preparing BFS rounds."}`
  });

  if (freshOranges === 0) {
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes: 0,
      highlightedLine: 25,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound: false,
      status: 'done',
      message: "🏁 Early Exit triggered: No fresh oranges to begin with. Return 0 minutes immediately."
    });
    return steps;
  }

  let minutes = 0;
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
  ];

  // Initialize minutes (Line 27)
  steps.push({
    grid: cloneGrid(grid),
    queue: [...queue],
    freshOranges,
    minutes,
    highlightedLine: 27,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'bfs-loop',
    message: `⚙️ Initialized minutes timer counter = 0.`
  });

  // Initialize directions (Line 29)
  steps.push({
    grid: cloneGrid(grid),
    queue: [...queue],
    freshOranges,
    minutes,
    highlightedLine: 29,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'bfs-loop',
    message: "⚙️ Initialized directions list for 4-directional spread: Up, Down, Left, Right."
  });

  // Multi-source BFS
  while (queue.length > 0) {
    const size = queue.length;
    let rottedInThisRound = false;

    // BFS loop header (Line 32)
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes,
      highlightedLine: 32,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound,
      status: 'bfs-loop',
      message: `🔄 BFS Queue active: current size = ${size}. Scanning this generation layer.`
    });

    // Caching generation size (Line 33)
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes,
      highlightedLine: 33,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound,
      status: 'bfs-loop',
      message: `👥 Caching layer generation size = ${size}.`
    });

    // Caching round infection flag (Line 34)
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes,
      highlightedLine: 34,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound,
      status: 'bfs-loop',
      message: `👥 Initializing round infection flag: rottedInThisRound = false.`
    });

    const nextQueue: [number, number][] = [];

    for (let i = 0; i < size; i++) {
      const point = queue[i];
      const r = point[0];
      const c = point[1];

      // Poll orange point (Line 37)
      steps.push({
        grid: cloneGrid(grid),
        queue: queue.slice(i), // show remaining in queue
        freshOranges,
        minutes,
        highlightedLine: 37,
        activePoint: [r, c],
        activeNeighbors: [],
        rottedInThisRound,
        status: 'pop-orange',
        message: `👥 Polled rotten orange coordinates from queue at index [${r}, ${c}].`
      });

      // Poll row index (Line 38)
      steps.push({
        grid: cloneGrid(grid),
        queue: queue.slice(i),
        freshOranges,
        minutes,
        highlightedLine: 38,
        activePoint: [r, c],
        activeNeighbors: [],
        rottedInThisRound,
        status: 'pop-orange',
        message: `⚙️ Read polled row coordinate: r = ${r}.`
      });

      // Poll col index (Line 39)
      steps.push({
        grid: cloneGrid(grid),
        queue: queue.slice(i),
        freshOranges,
        minutes,
        highlightedLine: 39,
        activePoint: [r, c],
        activeNeighbors: [],
        rottedInThisRound,
        status: 'pop-orange',
        message: `⚙️ Read polled column coordinate: c = ${c}.`
      });

      for (const dir of directions) {
        const nextR = r + dir[0];
        const nextC = c + dir[1];

        // Loop header (Line 41)
        steps.push({
          grid: cloneGrid(grid),
          queue: queue.slice(i),
          freshOranges,
          minutes,
          highlightedLine: 41,
          activePoint: [r, c],
          activeNeighbors: [[nextR, nextC]],
          rottedInThisRound,
          status: 'check-neighbors',
          message: `🧭 Querying next neighbor offset: [${dir[0]}, ${dir[1]}].`
        });

        // Compute nextR (Line 42)
        steps.push({
          grid: cloneGrid(grid),
          queue: queue.slice(i),
          freshOranges,
          minutes,
          highlightedLine: 42,
          activePoint: [r, c],
          activeNeighbors: [[nextR, nextC]],
          rottedInThisRound,
          status: 'check-neighbors',
          message: `📐 Computing neighbor row coordinate: nextR = r + (${dir[0]}) = ${nextR}.`
        });

        // Compute nextC (Line 43)
        steps.push({
          grid: cloneGrid(grid),
          queue: queue.slice(i),
          freshOranges,
          minutes,
          highlightedLine: 43,
          activePoint: [r, c],
          activeNeighbors: [[nextR, nextC]],
          rottedInThisRound,
          status: 'check-neighbors',
          message: `📐 Computing neighbor col coordinate: nextC = c + (${dir[1]}) = ${nextC}.`
        });

        // Check boundaries and check fresh orange (Line 46)
        const inBounds = nextR >= 0 && nextR < rows && nextC >= 0 && nextC < cols;
        const isNeighborFresh = inBounds && grid[nextR][nextC] === 1;

        steps.push({
          grid: cloneGrid(grid),
          queue: queue.slice(i),
          freshOranges,
          minutes,
          highlightedLine: 46,
          activePoint: [r, c],
          activeNeighbors: [[nextR, nextC]],
          rottedInThisRound,
          status: 'check-neighbors',
          message: `🔍 Evaluating adjacent neighbor [${nextR}, ${nextC}]: ${
            !inBounds 
              ? "Out of bounds 🚫" 
              : grid[nextR][nextC] === 0 
                ? "Empty space 🕳️" 
                : grid[nextR][nextC] === 2 || grid[nextR][nextC] === 3
                  ? "Already infected ☣️" 
                  : "Fresh orange! 🍊"
          }`
        });

        if (isNeighborFresh) {
          // Rot the fresh orange (using temporary value 3 for visual infection wavefront)
          grid[nextR][nextC] = 3;
          freshOranges--;
          nextQueue.push([nextR, nextC]);
          rottedInThisRound = true;

          // Infect fresh orange (Line 47)
          steps.push({
            grid: cloneGrid(grid),
            queue: queue.slice(i),
            freshOranges,
            minutes,
            highlightedLine: 47,
            activePoint: [r, c],
            activeNeighbors: [[nextR, nextC]],
            rottedInThisRound,
            status: 'rot-orange',
            message: `☣️ Infection spreads! Orange at [${nextR}, ${nextC}] decays to rotten.`
          });

          // Enqueue neighbor (Line 48)
          steps.push({
            grid: cloneGrid(grid),
            queue: [...queue.slice(i), ...nextQueue],
            freshOranges,
            minutes,
            highlightedLine: 48,
            activePoint: [r, c],
            activeNeighbors: [[nextR, nextC]],
            rottedInThisRound,
            status: 'rot-orange',
            message: `☣️ Enqueued newly infected orange [${nextR}, ${nextC}] for the next generation wave.`
          });

          // Decrement fresh count (Line 49)
          steps.push({
            grid: cloneGrid(grid),
            queue: [...queue.slice(i), ...nextQueue],
            freshOranges,
            minutes,
            highlightedLine: 49,
            activePoint: [r, c],
            activeNeighbors: [[nextR, nextC]],
            rottedInThisRound,
            status: 'rot-orange',
            message: `☣️ Decremented fresh orange count to ${freshOranges}.`
          });

          // Flag round rot (Line 50)
          steps.push({
            grid: cloneGrid(grid),
            queue: [...queue.slice(i), ...nextQueue],
            freshOranges,
            minutes,
            highlightedLine: 50,
            activePoint: [r, c],
            activeNeighbors: [[nextR, nextC]],
            rottedInThisRound,
            status: 'rot-orange',
            message: `☣️ Set rottedInThisRound = true.`
          });
        }
      }
    }

    // Convert newly rotten values (3) to permanent rotten (2) for next loop step
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 3) {
          grid[r][c] = 2;
        }
      }
    }

    // Update queue to the newly infected generation
    queue = [...queue.slice(size), ...nextQueue];

    // Timer check (Line 56)
    steps.push({
      grid: cloneGrid(grid),
      queue: [...queue],
      freshOranges,
      minutes,
      highlightedLine: 56,
      activePoint: null,
      activeNeighbors: [],
      rottedInThisRound,
      status: 'increment-time',
      message: `⏱️ Generation layer processed. Did we infect any fresh oranges in this round? ${rottedInThisRound ? "YES!" : "NO."}`
    });

    if (rottedInThisRound) {
      minutes++;
      // Increment minutes (Line 57)
      steps.push({
        grid: cloneGrid(grid),
        queue: [...queue],
        freshOranges,
        minutes,
        highlightedLine: 57,
        activePoint: null,
        activeNeighbors: [],
        rottedInThisRound,
        status: 'increment-time',
        message: `⏱️ Minute timer ticked! Elapsing time +1 min. Total elapsed time: ${minutes} minute(s).`
      });
    }
  }

  // Final check and return (Line 62)
  const allRotten = freshOranges === 0;
  steps.push({
    grid: cloneGrid(grid),
    queue: [],
    freshOranges,
    minutes,
    highlightedLine: 62,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'done',
    message: `🏁 BFS finished. Queue is empty. Remaining fresh count is ${freshOranges}. ${
      allRotten 
        ? `Success! All oranges rotted in ${minutes} minutes.` 
        : `Quarantine blockages: ${freshOranges} orange(s) isolated. Returning -1.`
    }`
  });

  return steps;
}
