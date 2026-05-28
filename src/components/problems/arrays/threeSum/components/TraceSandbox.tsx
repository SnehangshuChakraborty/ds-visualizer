import React from 'react';
import type { AlgoStep } from '../../../../../types';
import { PRESETS } from '../constants/threeSumData';

interface TraceSandboxProps {
  steps: AlgoStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  customInputText: string;
  setCustomInputText: (text: string) => void;
  quizMode: boolean;
  quizAnswerState: 'correct' | 'incorrect' | null;
  quizFeedback: string;
  handleQuizAnswer: (choice: 'left' | 'right' | 'found') => void;
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
  generateRandom: () => void;
  handleCustomSubmit: (e: React.FormEvent) => void;
  inputArray: number[];
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
  quizMode,
  quizAnswerState,
  quizFeedback,
  handleQuizAnswer,
  reset,
  stepBackward,
  stepForward,
  handlePresetChange,
  generateRandom,
  handleCustomSubmit,
  inputArray,
}) => {
  // Active step fields
  const currentStep = steps[currentStepIndex] || {
    nums: inputArray,
    i: -1,
    left: -1,
    right: -1,
    highlightedLine: 4,
    sum: null,
    message: 'Loading...',
    foundTriplets: [],
    activePointers: [],
    status: 'start',
  };

  // Calculations for dynamic graph bars
  const maxVal = Math.max(...currentStep.nums.map(Math.abs), 1);

  return (
    <section className="visualizer-workspace">
      <div className="simulation-container">
        <div className="workspace-header">
          <h2 className="panel-title">📊 Array Trace Sandbox</h2>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Visual Number Columns/Bars */}
        <div className="array-outer-wrapper">
          <div className="array-container">
            {currentStep.nums.map((val, idx) => {
              const isActiveI = idx === currentStep.i;
              const isActiveLeft = idx === currentStep.left;
              const isActiveRight = idx === currentStep.right;

              const barHeight = Math.max(50, Math.floor((Math.abs(val) / maxVal) * 110));

              let wrapperClass = '';
              if (isActiveI) wrapperClass += ' active-i';
              if (isActiveLeft) wrapperClass += ' active-left';
              if (isActiveRight) wrapperClass += ' active-right';

              return (
                <div key={idx} className={`array-item-wrapper${wrapperClass}`}>
                  <div
                    className="array-bar"
                    style={{
                      height: `${barHeight}px`,
                      borderBottom: val < 0 ? '4px solid var(--theme-highlight)' : 'none',
                    }}
                  >
                    <span className="array-value">{val}</span>
                  </div>
                  <span className="array-index">{idx}</span>

                  {/* Display Pointers Badges below respective bars */}
                  <div className="pointer-labels">
                    {isActiveI && <span className="pointer-badge i">i</span>}
                    {isActiveLeft && <span className="pointer-badge left">L</span>}
                    {isActiveRight && <span className="pointer-badge right">R</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Quiz Overlays when calculating sums */}
        {quizMode && currentStep.status === 'compare-sum' && quizAnswerState !== 'correct' ? (
          <div className="quiz-container">
            <div className="quiz-question">🎮 Time to Squeeze the Accordion!</div>
            <div className="quiz-sub">
              Sum is <strong>{currentStep.sum}</strong>. What should the solver do next?
            </div>

            <div className="quiz-choices quiz-choices-3">
              <button
                className="quiz-choice-btn"
                onClick={() => handleQuizAnswer('left')}
                style={{ borderColor: 'rgba(6,182,212,0.3)' }}
              >
                <span style={{ fontSize: '1.2rem' }}>❄️ L ➡️</span>
                <span className="quiz-btn-subtitle">Sum Too Small</span>
              </button>

              <button
                className="quiz-choice-btn"
                onClick={() => handleQuizAnswer('right')}
                style={{ borderColor: 'rgba(245,158,11,0.3)' }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔥 ⬅️ R</span>
                <span className="quiz-btn-subtitle">Sum Too Large</span>
              </button>

              <button
                className="quiz-choice-btn"
                onClick={() => handleQuizAnswer('found')}
                style={{ borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <span style={{ fontSize: '1.2rem' }}>🎉 Jackpot!</span>
                <span className="quiz-btn-subtitle">Sum equals 0</span>
              </button>
            </div>

            {quizAnswerState === 'incorrect' && (
              <div className="feedback-alert error">{quizFeedback}</div>
            )}
          </div>
        ) : (
          <>
            {/* Pointer Sum Calculator panel */}
            <div className="calculator-box">
              <div className="equation-section">
                <div className="eq-var">
                  <span className="eq-label">nums[i]</span>
                  <span className="eq-val i">
                    {currentStep.i !== -1 ? currentStep.nums[currentStep.i] : '?'}
                  </span>
                </div>
                <span>+</span>
                <div className="eq-var">
                  <span className="eq-label">nums[left]</span>
                  <span className="eq-val left">
                    {currentStep.left !== -1 ? currentStep.nums[currentStep.left] : '?'}
                  </span>
                </div>
                <span>+</span>
                <div className="eq-var">
                  <span className="eq-label">nums[right]</span>
                  <span className="eq-val right">
                    {currentStep.right !== -1 ? currentStep.nums[currentStep.right] : '?'}
                  </span>
                </div>
                <span>=</span>
                <span className="eq-sum">{currentStep.sum !== null ? currentStep.sum : '?'}</span>
              </div>

              <div>
                {currentStep.sum === null ? (
                  <span className="sum-status none">idle</span>
                ) : currentStep.sum === 0 ? (
                  <span className="sum-status match">Jackpot! (0)</span>
                ) : currentStep.sum < 0 ? (
                  <span className="sum-status too-small">Too Cold (&lt; 0)</span>
                ) : (
                  <span className="sum-status too-large">Too Hot (&gt; 0)</span>
                )}
              </div>
            </div>

            {/* Explanation box */}
            <div className="explanation-box">
              {quizAnswerState === 'correct' ? (
                <div
                  style={{
                    color: '#10b981',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>🎉 CORRECT! +10 XP</span>
                  <span style={{ fontWeight: 400, color: 'var(--theme-text-secondary)' }}>
                    {currentStep.message}
                  </span>
                </div>
              ) : (
                currentStep.message
              )}
            </div>
          </>
        )}
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

      {/* Custom Array Input Bar */}
      <div className="control-panel" style={{ padding: '0.75rem 1rem' }}>
        <form
          onSubmit={handleCustomSubmit}
          className="custom-input-box"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
            ✏️ Custom Array:
          </label>
          <input
            type="text"
            className="custom-input-field"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="-1, 0, 1, 2, -1, -4"
          />
          <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem' }}>
            Load Array
          </button>
        </form>
      </div>

      {/* Found Triplets panel */}
      <div className="results-container">
        <div className="results-header">
          <span className="results-title">
            🎯 Found Triplets ({currentStep.foundTriplets.length})
          </span>
        </div>
        <div className="triplet-tags">
          {currentStep.foundTriplets.length === 0 ? (
            <span className="no-results">No triplets found yet. Watch the solver trace...</span>
          ) : (
            currentStep.foundTriplets.map((triplet, idx) => {
              const isNewest =
                idx === currentStep.foundTriplets.length - 1 && currentStep.status === 'found';
              return (
                <span key={idx} className={`triplet-tag ${isNewest ? 'new-find' : ''}`}>
                  [{triplet[0]}, {triplet[1]}, {triplet[2]}]
                </span>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
