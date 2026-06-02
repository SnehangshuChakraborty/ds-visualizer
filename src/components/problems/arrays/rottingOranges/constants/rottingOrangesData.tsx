export interface OrangePreset {
  name: string;
  grid: number[][];
  description: string;
}

export const PRESETS: OrangePreset[] = [
  {
    name: "Standard Decay (4 mins)",
    grid: [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1]
    ],
    description: "All fresh oranges rot within 4 minutes. A standard BFS propagation wavefront."
  },
  {
    name: "Impossible Survival (-1)",
    grid: [
      [2, 1, 1],
      [0, 1, 1],
      [1, 0, 1]
    ],
    description: "The fresh orange at s[2][0] is isolated behind empty blocks and can never rot. Returns -1."
  },
  {
    name: "No Fresh Oranges (0 mins)",
    grid: [
      [0, 2, 0],
      [0, 2, 2],
      [2, 0, 0]
    ],
    description: "No fresh oranges in grid to begin with. Halts immediately and returns 0 minutes."
  },
  {
    name: "Multiple Quarantine Cells (-1)",
    grid: [
      [2, 0, 1],
      [0, 0, 1],
      [1, 1, 1]
    ],
    description: "Multiple fresh oranges are locked away and isolated. Returns -1."
  }
];

export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  5: {
    icon: '🏁',
    title: 'Method Entry',
    mnemonic: 'orangesRotting Method Started! 🏁',
    why: 'The JVM enters the method. We receive the 2D grid matrix of oranges to trace.'
  },
  6: {
    icon: '🛡️',
    title: 'Validation Guard Clause',
    mnemonic: 'Safely guard against null or zero-dimension grids! 🛡️',
    why: 'If the input grid is null or has zero length, there are no oranges to rot. We immediately return 0.'
  },
  8: {
    icon: '📐',
    title: 'Grid Dimensions',
    mnemonic: 'Read the grid row count! 📐',
    why: 'Extracts grid.length to define rows. In BFS grid traversals, knowing dimensions is vital for out-of-bound checks.'
  },
  10: {
    icon: '⚙️',
    title: 'BFS Queue Allocation',
    mnemonic: 'Allocate FIFO Queue memory! ⚙️',
    why: 'Instantiates a double-ended Queue using a LinkedList. This queue will hold coordinates [r, c] for level-by-level decay waves.'
  },
  14: {
    icon: '🔍',
    title: 'Initial Scanner Loop',
    mnemonic: 'Scan grid for initial rotten seeds and count fresh! 🔍',
    why: 'Traverses the entire matrix coordinate system. Pushes all initially rotten orange locations into the queue and counts the fresh ones.'
  },
  25: {
    icon: '🌱',
    title: 'Zero-Infection Early Exit',
    mnemonic: 'If there are no fresh oranges, return 0 immediately! 🌱',
    why: 'If the fresh counter is 0, no fresh oranges exist to be decayed. We return 0 minutes immediately.'
  },
  27: {
    icon: '⏱️',
    title: 'Timer Initialization',
    mnemonic: 'Initialize minute timer = 0! ⏱️',
    why: 'Sets the timer minutes counter variable to 0. This tracks the total wavefront duration.'
  },
  29: {
    icon: '🧭',
    title: 'Directions Setup',
    mnemonic: 'Define 4-directional scan offsets! 🧭',
    why: 'Allocates direction vectors to query neighbor offsets cleanly: Up (-1,0), Down (1,0), Left (0,-1), and Right (0,1).'
  },
  32: {
    icon: '🔄',
    title: 'BFS Wavefront Loop Header',
    mnemonic: 'Iterate as long as zombies remain! 🔄',
    why: 'Runs while the queue is not empty. The queue holds active wavefront zombies who will infect neighbors in the current minute round.'
  },
  33: {
    icon: '👥',
    title: 'BFS Layer Size Caching',
    mnemonic: 'Process all current generation seeds together! 👥',
    why: 'Caches the current size of the queue. This ensures we process only the active generation of rotten oranges in this minute block before incrementing the timer.'
  },
  37: {
    icon: '👥',
    title: 'Queue Poll',
    mnemonic: 'Poll the active zombie from queue! 👥',
    why: 'Removes the first coordinate point [r, c] from the queue to scan its four surrounding adjacencies.'
  },
  46: {
    icon: '☣️',
    title: '4-Way Boundary & Fresh Check',
    mnemonic: 'In-bounds & Fresh target check! ☣️',
    why: 'Ensures the adjacent index coordinate [nextR, nextC] is within grid boundary limits and holds a fresh orange (1).'
  },
  47: {
    icon: '☣',
    title: 'Orange Infection',
    mnemonic: 'Orange decays to rotten! ☣️',
    why: 'Overwrites the fresh orange grid cell value to rotten (2), executing the infection spread.'
  },
  56: {
    icon: '⏱️',
    title: 'Generation Round Completed',
    mnemonic: 'Evaluate round infections! ⏱️',
    why: 'Evaluates if at least one fresh orange rotted in the current BFS layer. If so, we prepare to tick the minute timer.'
  },
  62: {
    icon: '🏁',
    title: 'Final Verdict Check',
    mnemonic: 'Success check! If isolated fresh exist, return -1. 🏁',
    why: 'Evaluates if any fresh oranges survived in quarantined pockets. Returns elapsed minutes if all rotted; otherwise -1.'
  }
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);
