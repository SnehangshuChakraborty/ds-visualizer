// Note: JSX transform is enabled — no explicit React import needed

// ── Presets ──────────────────────────────────────────────────────────────────
export const COIN_CHANGE2_PRESETS = [
  { name: 'Classic — 4 ways (coins=[1,2,5], amt=5)',  coins: [1, 2, 5], amount: 5 },
  { name: 'Small — 4 ways (coins=[1,2,3], amt=4)',   coins: [1, 2, 3], amount: 4 },
  { name: 'Large coins (coins=[2,5,10], amt=10)',    coins: [2, 5, 10], amount: 10 },
  { name: 'Single coin (coins=[3], amt=9)',           coins: [3], amount: 9 },
  { name: 'No way (coins=[2], amt=3)',                coins: [2], amount: 3 },
];
