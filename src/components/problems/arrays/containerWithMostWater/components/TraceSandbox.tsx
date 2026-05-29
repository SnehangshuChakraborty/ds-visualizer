import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ContainerStep } from '../../../../../types';
import { PRESETS } from '../constants/containerData';

interface TraceSandboxProps {
  steps: ContainerStep[];
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
  handleQuizAnswer: (choice: 'left' | 'right') => void;
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
  generateRandom: () => void;
  handleCustomSubmit: (e: React.FormEvent) => void;
  inputHeights: number[];
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
  inputHeights,
}) => {
  const currentStep = steps[currentStepIndex] || {
    heights: inputHeights,
    left: -1,
    right: -1,
    currentWidth: 0,
    currentHeight: 0,
    currentArea: 0,
    maxArea: 0,
    highlightedLine: 3,
    status: 'start',
    message: 'Loading...',
  };

  const sandboxRef = useRef<HTMLDivElement | null>(null);
  const [waterCoords, setWaterCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Measure and calculate the coordinates for the water overlay dynamically
  const updateWaterCoords = useCallback(() => {
    const sandbox = sandboxRef.current;
    if (!sandbox || currentStep.left === -1 || currentStep.right === -1) {
      setWaterCoords(null);
      return;
    }

    const sandboxRect = sandbox.getBoundingClientRect();
    const elLeft = document.getElementById(`water-bar-${currentStep.left}`);
    const elRight = document.getElementById(`water-bar-${currentStep.right}`);

    if (!elLeft || !elRight) {
      setWaterCoords(null);
      return;
    }

    const rectLeft = elLeft.getBoundingClientRect();
    const rectRight = elRight.getBoundingClientRect();

    // Center coordinates of both bars
    const xLeft = rectLeft.left - sandboxRect.left + rectLeft.width / 2;
    const xRight = rectRight.left - sandboxRect.left + rectRight.width / 2;

    // Baseline (bottom of the bars)
    const yBottom = rectLeft.bottom - sandboxRect.top;

    // Water level top is limited by the shorter of the two bars
    const yTopLeft = rectLeft.top - sandboxRect.top;
    const yTopRight = rectRight.top - sandboxRect.top;
    const yTop = Math.max(yTopLeft, yTopRight); // screen Y coordinate is inverted (max = lower height)

    setWaterCoords({
      x: xLeft,
      y: yTop,
      width: xRight - xLeft,
      height: Math.max(0, yBottom - yTop),
    });
  }, [currentStep.left, currentStep.right, currentStep.heights]);

  useEffect(() => {
    updateWaterCoords();
    const handle = requestAnimationFrame(updateWaterCoords);
    window.addEventListener('resize', updateWaterCoords);

    // measure again after 100ms safety buffer
    const timer = setTimeout(updateWaterCoords, 100);

    return () => {
      cancelAnimationFrame(handle);
      clearTimeout(timer);
      window.removeEventListener('resize', updateWaterCoords);
    };
  }, [currentStepIndex, currentStep.left, currentStep.right, updateWaterCoords]);

  const maxVal = Math.max(...currentStep.heights, 1);

  return (
    <section className="visualizer-workspace">
      {/* Simulation Box */}
      <div ref={sandboxRef} className="simulation-container" style={{ position: 'relative' }}>
        <div className="workspace-header">
          <h2 className="panel-title">📊 Water Basin Sandbox</h2>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Dynamic Water SVG Overlay */}
        {waterCoords && currentStep.status !== 'start' && currentStep.status !== 'done' && (
          <svg className="water-overlay-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Water Block */}
            <rect
              x={waterCoords.x}
              y={waterCoords.y}
              width={waterCoords.width}
              height={waterCoords.height}
              fill="url(#waterGrad)"
              className="water-basin-fill"
            />
            {/* Water Surface Glow Line */}
            <line
              x1={waterCoords.x}
              y1={waterCoords.y}
              x2={waterCoords.x + waterCoords.width}
              y2={waterCoords.y}
              stroke="#e0f2fe"
              strokeWidth="3"
              filter="url(#glow)"
              className="water-surface-line"
            />
          </svg>
        )}

        {/* Array Bars Container */}
        <div className="array-outer-wrapper" style={{ minHeight: '260px', zIndex: 2, position: 'relative' }}>
          <div className="array-container" style={{ alignItems: 'flex-end', height: '220px' }}>
            {currentStep.heights.map((val, idx) => {
              const isActiveLeft = idx === currentStep.left;
              const isActiveRight = idx === currentStep.right;
              const isShorter =
                (isActiveLeft || isActiveRight) &&
                val === currentStep.currentHeight;

              const barHeight = Math.max(15, Math.floor((val / maxVal) * 170));

              let wrapperClass = '';
              if (isActiveLeft) wrapperClass += ' active-left';
              if (isActiveRight) wrapperClass += ' active-right';
              if (isShorter && currentStep.status !== 'start' && currentStep.status !== 'done') wrapperClass += ' weak-link';

              return (
                <div
                  key={idx}
                  id={`water-bar-${idx}`}
                  className={`array-item-wrapper${wrapperClass}`}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <div
                    className="array-bar"
                    style={{
                      height: `${barHeight}px`,
                      background: isActiveLeft
                        ? 'linear-gradient(to top, #a855f7, #c084fc)'
                        : isActiveRight
                        ? 'linear-gradient(to top, #fbbf24, #fcd34d)'
                        : 'linear-gradient(to top, rgba(255,255,255,0.06), rgba(255,255,255,0.15))',
                      borderColor: isActiveLeft
                        ? '#c084fc'
                        : isActiveRight
                        ? '#fcd34d'
                        : 'rgba(255,255,255,0.1)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      boxShadow: (isActiveLeft || isActiveRight) ? '0 0 12px rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    <span className="array-value" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{val}</span>
                  </div>
                  <span className="array-index" style={{ color: 'var(--theme-text-muted)', fontSize: '0.75rem' }}>{idx}</span>

                  {/* Pointers badges */}
                  <div className="pointer-labels" style={{ minHeight: '22px' }}>
                    {isActiveLeft && <span className="pointer-badge left" style={{ background: '#a855f7' }}>L</span>}
                    {isActiveRight && <span className="pointer-badge right" style={{ background: '#fbbf24', color: '#1e1b4b' }}>R</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz panel overlay */}
        {quizMode && currentStep.status === 'evaluating' && currentStep.highlightedLine === 14 && quizAnswerState !== 'correct' ? (
          <div className="quiz-container" style={{ margin: '1.25rem 0', zIndex: 10, position: 'relative' }}>
            <div className="quiz-question">🎮 Time to decide which pointer to squeeze!</div>
            <div className="quiz-sub">
              Left wall height = <strong>{currentStep.heights[currentStep.left]}</strong> | Right wall height = <strong>{currentStep.heights[currentStep.right]}</strong>
              <br />
              Which pointer should we squeeze inward next?
            </div>

            {(() => {
              const leftVal = currentStep.heights[currentStep.left];
              const rightVal = currentStep.heights[currentStep.right];
              
              let leftSubtitle = 'Squeeze Left';
              let rightSubtitle = 'Squeeze Right';
              
              if (leftVal < rightVal) {
                leftSubtitle = `Squeeze Left (shorter: ${leftVal} < ${rightVal})`;
                rightSubtitle = `Squeeze Right (taller: ${rightVal} > ${leftVal})`;
              } else if (leftVal > rightVal) {
                leftSubtitle = `Squeeze Left (taller: ${leftVal} > ${rightVal})`;
                rightSubtitle = `Squeeze Right (shorter: ${rightVal} < ${leftVal})`;
              } else {
                leftSubtitle = `Heights equal: either is valid!`;
                rightSubtitle = `Heights equal: either is valid!`;
              }
              
              return (
                <div className="quiz-choices quiz-choices-2" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    className="quiz-choice-btn"
                    onClick={() => handleQuizAnswer('left')}
                    style={{ flex: 1, borderColor: '#a855f7' }}
                  >
                    <span style={{ fontSize: '1.2rem', color: '#c084fc' }}>L ➡️ (left++)</span>
                    <span className="quiz-btn-subtitle">{leftSubtitle}</span>
                  </button>

                  <button
                    className="quiz-choice-btn"
                    onClick={() => handleQuizAnswer('right')}
                    style={{ flex: 1, borderColor: '#fbbf24' }}
                  >
                    <span style={{ fontSize: '1.2rem', color: '#fcd34d' }}>⬅️ R (right--)</span>
                    <span className="quiz-btn-subtitle">{rightSubtitle}</span>
                  </button>
                </div>
              );
            })()}

            {quizAnswerState === 'incorrect' && (
              <div className="feedback-alert error" style={{ marginTop: '1rem' }}>{quizFeedback}</div>
            )}
          </div>
        ) : (
          <>
            {/* Calculation formulas panel */}
            <div className="calculator-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div className="equation-section" style={{ fontSize: '0.9rem' }}>
                <div className="eq-var">
                  <span className="eq-label" style={{ color: 'var(--theme-text-muted)' }}>Width (R - L)</span>
                  <span className="eq-val" style={{ color: 'var(--theme-text-secondary)', fontWeight: 600 }}>
                    {currentStep.left !== -1 && currentStep.right !== -1 ? currentStep.currentWidth : '?'}
                  </span>
                </div>
                <span style={{ margin: '0 0.5rem' }}>×</span>
                <div className="eq-var">
                  <span className="eq-label" style={{ color: 'var(--theme-text-muted)' }}>Bottleneck H</span>
                  <span className="eq-val" style={{ color: '#38bdf8', fontWeight: 600 }}>
                    {currentStep.left !== -1 && currentStep.right !== -1 ? currentStep.currentHeight : '?'}
                  </span>
                </div>
                <span style={{ margin: '0 0.5rem' }}>=</span>
                <div className="eq-var">
                  <span className="eq-label" style={{ color: 'var(--theme-text-muted)' }}>Current Area</span>
                  <span className="eq-val" style={{ color: '#06b6d4', fontWeight: 700 }}>
                    {currentStep.left !== -1 && currentStep.right !== -1 ? currentStep.currentArea : '?'}
                  </span>
                </div>
              </div>

              {/* Running max indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: currentStep.status === 'update-max' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  border: currentStep.status === 'update-max' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s ease',
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--theme-text-muted)' }}>Max Capacity:</span>
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>{currentStep.maxArea}</strong>
              </div>
            </div>

            {/* Explanation card narrative */}
            <div
              className="explanation-box"
              style={{
                marginTop: '1.25rem',
                borderLeft: '3px solid #38bdf8',
                background: 'rgba(56,189,248,0.04)',
                minHeight: '65px',
              }}
            >
              {quizAnswerState === 'correct' ? (
                <div style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      {/* Control panel buttons */}
      <div className="control-panel" style={{ marginTop: '1.5rem' }}>
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
            title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={stepForward} title="Step Forward (ArrowRight)">
            ▶⏭
          </button>
        </div>

        <div className="speed-control">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>Speed</span>
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

      {/* Custom input bar */}
      <div className="control-panel" style={{ padding: '0.75rem 1rem', marginTop: '1rem' }}>
        <form
          onSubmit={handleCustomSubmit}
          className="custom-input-box"
          style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}
        >
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
            ✏️ Custom Wall Heights:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'flex-end', minWidth: '220px' }}>
            <input
              type="text"
              className="custom-input-field"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="1, 8, 6, 2, 5, 4, 8, 3, 7"
              style={{ flex: 1, maxWidth: '280px' }}
            />
            <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem' }}>
              Load Heights
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
