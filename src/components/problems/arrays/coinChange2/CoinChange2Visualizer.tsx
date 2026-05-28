import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './CoinChange2Visualizer.css';

import { COIN_CHANGE2_PRESETS, COIN_CHANGE2_JAVA_CODE_LINES } from './constants/coinChange2Data';
import { generateCoinChange2Steps } from './utils/coinChange2Generator';
import { useInterval } from '../../../../hooks/useInterval';
import { CodeEditor } from '../../../common/CodeEditor';

interface CoinChange2VisualizerProps {
  celebrate: () => void;
}

const CoinChange2Visualizer: React.FC<CoinChange2VisualizerProps> = ({ celebrate }) => {
  const [coins, setCoins] = useState<number[]>([1, 2, 5]);
  const [amount, setAmount] = useState<number>(5);
  const [customCoinsText, setCustomCoinsText] = useState('1, 2, 5');
  const [customAmount, setCustomAmount] = useState('5');

  const steps = useMemo(
    () => generateCoinChange2Steps(coins, amount),
    [coins, amount]
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [showMemoryTrick, setShowMemoryTrick] = useState(false);

  // Reset when problem changes
  const [prevCoins, setPrevCoins] = useState(coins);
  const [prevAmount, setPrevAmount] = useState(amount);
  if (coins !== prevCoins || amount !== prevAmount) {
    setPrevCoins(coins);
    setPrevAmount(amount);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  useInterval(
    () => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    },
    isPlaying ? speed : null
  );

  const step = steps[currentStepIndex] || steps[0];

  // Celebrate on finish
  useEffect(() => {
    if (step.phase === 'done') {
      celebrate();
    }
  }, [currentStepIndex, step.phase, celebrate]);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((p) => Math.min(p + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((p) => Math.max(p - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === ' ') { e.preventDefault(); setIsPlaying((p) => !p); }
      else if (e.key === 'ArrowRight') stepForward();
      else if (e.key === 'ArrowLeft') stepBackward();
      else if (e.key === 'r' || e.key === 'R') reset();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stepForward, stepBackward, reset]);

  const handlePresetChange = (idx: number) => {
    const p = COIN_CHANGE2_PRESETS[idx];
    if (p) {
      setCoins(p.coins);
      setAmount(p.amount);
      setCustomCoinsText(p.coins.join(', '));
      setCustomAmount(String(p.amount));
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCoins = customCoinsText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
    const parsedAmount = parseInt(customAmount, 10);
    if (parsedCoins.length === 0 || isNaN(parsedAmount) || parsedAmount < 0) {
      alert('Please enter valid positive coin denominations and a non-negative amount.');
      return;
    }
    if (parsedCoins.length > 6 || parsedAmount > 15) {
      alert('For best visuals: max 6 coin types and amount ≤ 15.');
      return;
    }
    setCoins(parsedCoins);
    setAmount(parsedAmount);
  };

  const handleRandomize = () => {
    const n = 2 + Math.floor(Math.random() * 3); // 2-4 coins
    const coinSet = new Set<number>();
    while (coinSet.size < n) coinSet.add(1 + Math.floor(Math.random() * 8));
    const newCoins = [...coinSet].sort((a, b) => a - b);
    const newAmount = 4 + Math.floor(Math.random() * 7); // 4-10
    setCoins(newCoins);
    setAmount(newAmount);
    setCustomCoinsText(newCoins.join(', '));
    setCustomAmount(String(newAmount));
  };

  // Derive rendering data from current step
  const { dp, currentRow, currentCol, phase, revealed } = step;
  const n = coins.length;

  // Which cells to mark as source contributors for current cell
  const sourceAboveRow = currentRow > 0 && currentCol >= 0 ? currentRow - 1 : -1;
  const sourceAboveCol = currentCol;
  const sourceLeftRow = currentRow > 0 && currentCol >= coins[currentRow - 1] ? currentRow : -1;
  const sourceLeftCol = currentRow > 0 && currentCol >= coins[currentRow - 1]
    ? currentCol - coins[currentRow - 1]
    : -1;

  const coin = currentRow > 0 ? coins[currentRow - 1] : 0;
  const canInclude = currentCol >= coin;

  const isDone = phase === 'done';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

      {/* ── Banner ─────────────────────────────────────────────── */}
      <section
        className="game-mode-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))',
          borderColor: 'rgba(16,185,129,0.35)',
        }}
      >
        <div className="game-title" style={{ color: '#10b981' }}>
          <span>🪙</span>
          <span>Coin Change II — Count Combinations</span>
        </div>
        <div className="game-stats">
          <div className="stat-item" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <span>Strategy:</span>
            <strong style={{ color: '#fbbf24' }}>Bottom-Up 2D DP</strong>
          </div>
          <div className="stat-item" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <span>LeetCode:</span>
            <strong style={{ color: '#06b6d4' }}>#518 · Medium</strong>
          </div>
        </div>
      </section>

      {/* ── Two-column layout ──────────────────────────────────── */}
      <div className="visualizer-board" style={{ width: '100%' }}>

        {/* LEFT: Code Editor */}
        <CodeEditor
          currentStepHighlightLine={step.highlightedLine}
          codeLines={COIN_CHANGE2_JAVA_CODE_LINES}
        />

        {/* RIGHT: DP Table Sandbox */}
        <section className="visualizer-workspace">

          {/* Card 1: Main simulation */}
          <div className="simulation-container cc2-board" style={{ position: 'relative', height: 'auto' }}>
            <div className="workspace-header">
              <h2 className="panel-title">🗂️ DP Table — dp[coin][amount]</h2>
              <div className="step-counter">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
            </div>

            {/* Coin chips display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Coin Denominations:
              </span>
              <div className="cc2-coins-row">
                {coins.map((c, idx) => {
                  const coinRowActive = currentRow === idx + 1;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className={`cc2-coin-chip ${coinRowActive ? 'active-coin' : ''}`}>
                        {c}
                      </div>
                      <span className="cc2-coin-chip-label">
                        coins[{idx}]
                      </span>
                    </div>
                  );
                })}
                <div style={{ marginLeft: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--theme-text-secondary)' }}>
                  <span>→ amount =</span>
                  <span style={{ color: 'var(--theme-accent)', fontWeight: 800, fontSize: '1rem' }}>{amount}</span>
                </div>
              </div>
            </div>

            {/* DP Table — shown only once the dp array is declared (line 4+) */}
            {step.highlightedLine >= 4 && (
              <div className="cc2-table-wrapper">
                <table className="cc2-table">
                  <thead>
                    <tr>
                      <th className="cc2-th cc2-th-coin">Row i \ Col j</th>
                      {Array.from({ length: amount + 1 }, (_, j) => (
                        <th key={j} className={`cc2-th cc2-th-amount ${currentCol === j ? 'active-col-header' : ''}`}>
                          {j}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: n + 1 }, (_, i) => (
                      <tr key={i}>
                        {/* Row label */}
                        <td className={`cc2-row-label ${currentRow === i ? 'active-row' : ''}`}>
                          {i === 0 ? 'i=0 (base)' : `i=${i} coin=${coins[i - 1]}`}
                        </td>
                        {/* DP cells */}
                        {Array.from({ length: amount + 1 }, (_, j) => {
                          const val = dp[i]?.[j] ?? 0;
                          const isCellAssigning = step.highlightedLine === 6 || step.highlightedLine === 10 || step.highlightedLine === 12;
                          const isActive = currentRow === i && currentCol === j && isCellAssigning;
                          const isAnswer = isDone && i === n && j === amount;

                          const isAbove = (sourceAboveRow === i && sourceAboveCol === j);
                          const isLeft = (sourceLeftRow === i && sourceLeftCol === j);

                          // A cell is revealed iff the generator has explicitly declared it visible
                          const isCellRevealed = revealed[i]?.[j] ?? false;

                          let cellClass = 'cc2-td';
                          if (isAnswer) cellClass += ' answer-cell';
                          else if (isActive) cellClass += ' active-cell';
                          else if (isAbove) cellClass += ' source-above';
                          else if (isLeft) cellClass += ' source-left';
                          else if (isCellRevealed && val > 0) cellClass += ' nonzero';
                          else if (isCellRevealed) cellClass += ' filled';

                          return (
                            <td key={j} className={cellClass}>
                              {isCellRevealed || isActive || isAnswer ? val : 0}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend — shown only alongside the table */}
            {step.highlightedLine >= 4 && (
              <div className="cc2-legend">
                <span>
                  <span className="cc2-legend-dot" style={{ background: 'rgba(168,85,247,0.4)', border: '1px solid rgba(168,85,247,0.7)' }} />
                  dp[i-1][j] (skip coin)
                </span>
                <span>
                  <span className="cc2-legend-dot" style={{ background: 'rgba(6,182,212,0.4)', border: '1px solid rgba(6,182,212,0.7)' }} />
                  dp[i][j-coin] (use coin)
                </span>
                <span>
                  <span className="cc2-legend-dot" style={{ background: 'rgba(251,191,36,0.4)', border: '1px solid #fbbf24' }} />
                  active cell
                </span>
                <span>
                  <span className="cc2-legend-dot" style={{ background: 'rgba(16,185,129,0.4)', border: '1px solid #10b981' }} />
                  answer
                </span>
              </div>
            )}

            {/* Formula Breakdown Card — shown for main transition/assignment lines */}
            {currentRow > 0 && currentCol > 0 && (step.highlightedLine === 10 || step.highlightedLine === 11 || step.highlightedLine === 12) && (
              <div className="cc2-formula-breakdown-card">
                <div className="cc2-breakdown-title">
                  <span>💡 Why do we do this?</span>
                  <span>Target Amount: <strong>{currentCol}</strong> · Coin: <strong>{coin}</strong></span>
                </div>
                
                <div className="cc2-breakdown-branches">
                  {/* Branch 1: Exclude */}
                  <div className={`cc2-branch-item exclude ${step.highlightedLine === 10 ? 'highlight-branch' : ''}`}>
                    <div className="cc2-branch-header" style={{ justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="cc2-branch-dot purple" />
                        <strong>Exclude Coin {coin}</strong>
                      </div>
                      <span className="cc2-pill purple-pill">🚫 Row i-1 (Banned)</span>
                    </div>
                    <div className="cc2-branch-desc">
                      Ways to make amount <strong>{currentCol}</strong> without using the current coin <code>{coin}</code> (look at the row above).
                    </div>
                    <div className="cc2-branch-math">
                      <code>dp[{currentRow - 1}][{currentCol}]</code> = <span className="math-val purple-text">{dp[currentRow - 1]?.[currentCol] ?? 0}</span>
                    </div>
                  </div>

                  {/* Operator */}
                  <div className="cc2-branch-operator">+</div>

                  {/* Branch 2: Include */}
                  <div className={`cc2-branch-item include ${(step.highlightedLine === 11 || step.highlightedLine === 12) ? 'highlight-branch' : ''} ${!canInclude ? 'disabled' : ''}`}>
                    <div className="cc2-branch-header" style={{ justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="cc2-branch-dot cyan" />
                        <strong>Include Coin {coin}</strong>
                      </div>
                      {canInclude && <span className="cc2-pill cyan-pill">♾️ Row i (Allowed)</span>}
                    </div>
                    {canInclude ? (
                      <>
                        <div className="cc2-branch-desc">
                          Decide to use at least one coin <code>{coin}</code>. Remaining amount to make is <code>{currentCol} - {coin} = {currentCol - coin}</code>.
                        </div>
                        <div className="cc2-branch-math">
                          <code>dp[{currentRow}][{currentCol - coin}]</code> = <span className="math-val cyan-text">{dp[currentRow]?.[currentCol - coin] ?? 0}</span>
                        </div>
                      </>
                    ) : (
                      <div className="cc2-branch-desc disabled-msg">
                        ❌ Amount <strong>{currentCol}</strong> is less than coin <strong>{coin}</strong>, so we cannot include this coin.
                      </div>
                    )}
                  </div>
                </div>

                {/* Result summary */}
                <div className="cc2-breakdown-result">
                  {step.highlightedLine === 10 || step.highlightedLine === 11 ? (
                    <>
                      <div className="cc2-result-formula">
                        Current Cell Value (Exclude Only)
                      </div>
                      <div className="cc2-result-math">
                        <code>dp[{currentRow}][{currentCol}]</code> = Exclude = <strong className="gold-text">{dp[currentRow - 1]?.[currentCol] ?? 0}</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cc2-result-formula">
                        Total Ways = Exclude + Include
                      </div>
                      <div className="cc2-result-math">
                        {dp[currentRow - 1]?.[currentCol] ?? 0} + {canInclude ? (dp[currentRow]?.[currentCol - coin] ?? 0) : 0} = <strong className="gold-text">{dp[currentRow]?.[currentCol] ?? 0}</strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Memory toggle */}
                <div className="cc2-memory-toggle" onClick={() => setShowMemoryTrick(!showMemoryTrick)}>
                  <span>🧠 Memory Shortcut: Why stay in Row <code>{currentRow}</code>?</span>
                  <span>{showMemoryTrick ? '▲ Collapse' : '▼ Expand Shortcut'}</span>
                </div>
                {showMemoryTrick && (
                  <div className="cc2-memory-body">
                    <div className="cc2-memory-row">
                      <div className="cc2-memory-col">
                        <strong>Exclude Coin (looks UP ⬆️):</strong>
                        <p>Looks at Row <code>{currentRow - 1}</code>. This row represents <em>not using</em> coin <code>{coin}</code> (effectively banning it from this calculation).</p>
                      </div>
                      <div className="cc2-memory-col">
                        <strong>Include Coin (looks LEFT ⬅️):</strong>
                        <p>Looks at Row <code>{currentRow}</code>. Because you have an <strong>unlimited supply</strong>, the remaining amount is still allowed to use coin <code>{coin}</code>, so we stay in the same row <code>i</code>!</p>
                      </div>
                    </div>
                    <div className="cc2-memory-comparison">
                      <strong>💡 The Golden DP Rule:</strong>
                      <ul>
                        <li><strong>Unlimited Supply</strong> (Unbounded Knapsack) ➡️ Stay in the **Current Row `i`** (reusable).</li>
                        <li><strong>Single Use</strong> (0/1 Knapsack) ➡️ Go to the **Previous Row `i-1`** (consumed).</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Narrative */}
            <div className="cc2-narrative">{step.narrative}</div>

            {/* Answer panel */}
            {isDone && step.answer !== null && (
              <div className="cc2-result-panel">
                <div className="cc2-result-number">{step.answer}</div>
                <div className="cc2-result-label">
                  <strong style={{ color: 'var(--theme-text-primary)' }}>
                    way{step.answer !== 1 ? 's' : ''}
                  </strong>
                  {' '}to make amount{' '}
                  <span style={{ color: 'var(--theme-accent)', fontWeight: 700 }}>{amount}</span>
                  {' '}using coins{' '}
                  <span style={{ color: 'var(--theme-accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                    [{coins.join(', ')}]
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Playback Controls */}
          <div className="control-panel">
            <div className="playback-controls">
              <button className="control-btn" onClick={reset} title="Reset (R)">⏮</button>
              <button className="control-btn" onClick={stepBackward} title="Step Back (←)">◀</button>
              <button
                className="control-btn play-btn"
                onClick={() => setIsPlaying((p) => !p)}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="control-btn" onClick={stepForward} title="Step Forward (→)">▶</button>
              <button className="control-btn" onClick={() => { setIsPlaying(false); setCurrentStepIndex(steps.length - 1); }} title="Skip to End">⏭</button>
            </div>

            <div className="speed-control">
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>Speed</span>
              <select className="speed-select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={2000}>Slow (2s)</option>
                <option value={900}>Normal (0.9s)</option>
                <option value={400}>Fast (0.4s)</option>
                <option value={150}>Turbo (0.15s)</option>
              </select>
            </div>

            <div className="dataset-controls">
              <select
                className="dataset-select"
                onChange={(e) => handlePresetChange(Number(e.target.value))}
                defaultValue={0}
              >
                {COIN_CHANGE2_PRESETS.map((p, idx) => (
                  <option key={idx} value={idx}>{p.name}</option>
                ))}
              </select>
              <button className="random-btn" onClick={handleRandomize}>Randomize 🎲</button>
            </div>
          </div>

          {/* Card 3: Custom input */}
          <div className="control-panel" style={{ padding: '0.75rem 1rem' }}>
            <form
              onSubmit={handleCustomSubmit}
              className="custom-input-box"
              style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
                🪙 Custom Problem:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>Coins:</span>
                <input
                  type="text"
                  className="custom-input-field"
                  style={{ width: '110px' }}
                  value={customCoinsText}
                  onChange={(e) => setCustomCoinsText(e.target.value)}
                  placeholder="1, 2, 5"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', marginLeft: '0.25rem' }}>Amount:</span>
                <input
                  type="number"
                  className="custom-input-field"
                  style={{ width: '70px' }}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min={0}
                  max={15}
                  placeholder="5"
                />
                <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem', marginLeft: '0.25rem' }}>
                  Visualize DP →
                </button>
              </div>
            </form>
          </div>

        </section>
      </div>
    </div>
  );
};

export default CoinChange2Visualizer;
