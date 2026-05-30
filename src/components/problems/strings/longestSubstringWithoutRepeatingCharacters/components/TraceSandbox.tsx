import React from 'react';
import type { LongestSubstringStep } from '../../../../../types';
import { PRESETS } from '../constants/longestSubstringData';

interface TraceSandboxProps {
  steps: LongestSubstringStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  customInputText: string;
  setCustomInputText: (text: string) => void;
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
  generateRandom: () => void;
  handleCustomSubmit: (e: React.FormEvent) => void;
  inputString: string;
}

export const TraceSandbox: React.FC<TraceSandboxProps> = ({
  steps,
  currentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  customInputText,
  setCustomInputText,
  reset,
  stepBackward,
  stepForward,
  handlePresetChange,
  generateRandom,
  handleCustomSubmit,
  inputString,
}) => {
  const currentStep = steps[currentStepIndex] || {
    s: inputString,
    left: -1,
    right: -1,
    charSet: [],
    maxLength: 0,
    currentLength: 0,
    highlightedLine: 4,
    status: 'init',
    message: 'Loading...',
  };

  const characters = currentStep.s.split('');

  return (
    <section className="visualizer-workspace">
      <div className="simulation-container">
        <div className="workspace-header">
          <h2 className="panel-title">🔤 String Trace Sandbox</h2>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Dynamic Bubble String Tracing */}
        <div className="string-outer-wrapper">
          <div className="string-bubble-container">
            {characters.map((char, idx) => {
              const isInWindow = idx >= currentStep.left && idx <= currentStep.right && currentStep.left !== -1;
              const isActiveLeft = idx === currentStep.left && currentStep.left !== -1;
              const isActiveRight = idx === currentStep.right && currentStep.right !== -1;

              // Highlight character red if it's the duplicate explorer match
              const isDuplicateRight =
                isActiveRight &&
                currentStep.status === 'duplicate';

              // Highlight window bubbles emerald green if they form a record-breaking unique substring!
              const isRecordBreaking =
                currentStep.highlightedLine === 23 &&
                currentStep.currentLength === currentStep.maxLength &&
                isInWindow &&
                currentStep.currentLength > 0;

              let bubbleClass = 'char-bubble';
              if (isInWindow) bubbleClass += ' in-window';
              if (isActiveLeft) bubbleClass += ' border-left-active';
              if (isActiveRight) bubbleClass += ' border-right-active';
              if (isDuplicateRight) bubbleClass += ' duplicate-error';
              if (isRecordBreaking) bubbleClass += ' record-break';

              return (
                <div key={idx} className="char-item-wrapper">
                  <div className={bubbleClass}>
                    <span className="char-value">{char}</span>
                  </div>
                  <span className="char-index">{idx}</span>

                  {/* Pointer labels underneath */}
                  <div className="pointer-labels">
                    {isActiveLeft && <span className="pointer-badge left">L</span>}
                    {isActiveRight && <span className="pointer-badge right">R</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Memory Grid: HashSet Visual Capsule */}
        <div className="hashset-capsule">
          <div className="hashset-header">
            <span className="hashset-title">🔮 HashSet Memory Capsule</span>
            <span className="hashset-count">{currentStep.charSet.length} elements</span>
          </div>
          <div className="hashset-body">
            {currentStep.charSet.length === 0 ? (
              <span className="hashset-empty">set = &#123; &#125; (empty memory)</span>
            ) : (
              <div className="hashset-items">
                {currentStep.charSet.map((char, index) => (
                  <span key={index} className="hashset-tag animate-pop">
                    {char}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Math.max Comparison Card (Line 23 Math.max Breakdown) */}
        {currentStep.highlightedLine === 23 && (
          <div className="math-comparison-card animate-pop">
            <div className="math-card-header">
              <span className="math-card-title">🧮 Math.max Equation Breakdown</span>
              <span className="math-card-subtitle">maxLength = Math.max(prevMax, currentLength)</span>
            </div>
            
            <div className="math-card-body">
              <div className="math-card-node">
                <span className="math-node-label">Previous Max</span>
                <div className="math-node-box">
                  {currentStepIndex > 0 ? steps[currentStepIndex - 1].maxLength : 0}
                </div>
              </div>

              <span className="math-node-vs">vs</span>

              <div className="math-card-node">
                <span className="math-node-label">Current Window</span>
                <div className="math-node-box active">
                  {currentStep.currentLength}
                </div>
              </div>

              <span className="math-node-vs">➡️</span>

              <div className="math-card-node">
                <span className="math-node-label green">New Max</span>
                <div className={`math-node-box result ${currentStep.currentLength >= (currentStepIndex > 0 ? steps[currentStepIndex - 1].maxLength : 0) ? 'pulse-active' : ''}`}>
                  {currentStep.maxLength}
                </div>
              </div>
            </div>

            <div className="math-card-footer">
              {currentStep.currentLength > (currentStepIndex > 0 ? steps[currentStepIndex - 1].maxLength : 0) ? (
                <span>🎉 <strong>New Record!</strong> Substring <code>"{currentStep.s.substring(currentStep.left, currentStep.right + 1)}"</code> breaks the previous record! We update <code>maxLength = {currentStep.maxLength}</code>.</span>
              ) : (
                <span>⚖️ <strong>No Change:</strong> The current window length of <code>{currentStep.currentLength}</code> does not beat the previous record of <code>{currentStep.maxLength}</code>.</span>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Calculations and Log */}
        <div className="calculator-box" style={{ marginTop: '1.25rem' }}>
          <div className="equation-section">
            <div className="eq-var">
              <span className="eq-label">Window s[L...R]</span>
              <span className="eq-val font-mono" style={{ color: 'var(--theme-accent)' }}>
                {currentStep.left !== -1 && currentStep.right !== -1 && currentStep.left <= currentStep.right
                  ? `"${currentStep.s.substring(currentStep.left, currentStep.right + 1)}"`
                  : '""'}
              </span>
            </div>
            <span>|</span>
            <div className="eq-var">
              <span className="eq-label">Current Length</span>
              <span className="eq-val left">{currentStep.currentLength}</span>
            </div>
            <span>|</span>
            <div className="eq-var">
              <span className="eq-label">Max Length</span>
              <span className="eq-val right" style={{ color: '#10b981' }}>{currentStep.maxLength}</span>
            </div>
          </div>
        </div>

        {/* Message Log narrative */}
        <div className="explanation-box">
          {currentStep.message}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="control-panel">
        <div className="playback-controls">
          <button className="control-btn" onClick={reset} title="Reset Visualizer (R)">
            ⏮
          </button>
          <button className="control-btn" onClick={stepBackward} title="Step Backward (ArrowLeft)">
            ◀
          </button>
          <button
            className="control-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause (Spacebar)' : 'Play Visualizer (Spacebar)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={stepForward} title="Step Forward (ArrowRight)">
            ▶⏭
          </button>
        </div>

        <div className="speed-control">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--theme-text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Speed
          </span>
          <select
            className="speed-select"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value={2200}>Slow (2.2s)</option>
            <option value={1500}>Normal (1.5s)</option>
            <option value={800}>Fast (0.8s)</option>
            <option value={400}>Hyper (0.4s)</option>
          </select>
        </div>

        <div className="dataset-controls">
          <select
            className="dataset-select"
            onChange={(e) => handlePresetChange(Number(e.target.value))}
            defaultValue={0}
          >
            {PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="random-btn" onClick={generateRandom}>
            Randomize 🎲
          </button>
        </div>
      </div>

      {/* Custom String Input Bar */}
      <div className="control-panel" style={{ padding: '0.75rem 1rem' }}>
        <form
          onSubmit={handleCustomSubmit}
          className="custom-input-box"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
            ✏️ Custom String:
          </label>
          <input
            type="text"
            className="custom-input-field"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="abcabcbb"
          />
          <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem' }}>
            Load String
          </button>
        </form>
      </div>
    </section>
  );
};
