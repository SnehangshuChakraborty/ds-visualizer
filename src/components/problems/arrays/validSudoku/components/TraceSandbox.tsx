import React from 'react';
import type { ValidSudokuStep } from '../../../../../types';
import { PRESETS } from '../constants/validSudokuData';

interface TraceSandboxProps {
  steps: ValidSudokuStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  quizMode: boolean;
  quizAnswerState: 'correct' | 'incorrect' | null;
  quizFeedback: string;
  handleQuizAnswer: (choice: number) => void;
  quizOptions: number[];
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
}

// Helper: format a 9-bit binary string
function toBin9(n: number): string {
  return n.toString(2).padStart(9, '0');
}

export const TraceSandbox: React.FC<TraceSandboxProps> = ({
  steps,
  currentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  quizMode,
  quizAnswerState,
  quizFeedback,
  handleQuizAnswer,
  quizOptions,
  reset,
  stepBackward,
  stepForward,
  handlePresetChange,
}) => {
  const [viewMode, setViewMode] = React.useState<'focus' | 'matrix'>('focus');
  const currentStep = steps[currentStepIndex] || {
    board: Array(9).fill(null).map(() => Array(9).fill('.')),
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: new Array(9).fill(0), cols: new Array(9).fill(0), boxes: new Array(9).fill(0),
    highlightedLine: 2,
    status: 'start' as const,
    message: 'Loading...',
    conflictType: null,
    isValid: true,
  };

  // Determine which cells to highlight on the grid
  const activeRow = currentStep.row;
  const activeCol = currentStep.col;
  const activeBoxIdx = currentStep.boxIdx;

  // Which bitmask row/col/box to emphasize
  const showBitmaskFor = (activeRow >= 0 && activeCol >= 0) ? {
    rowIdx: activeRow,
    colIdx: activeCol,
    boxIdx: activeBoxIdx >= 0 ? activeBoxIdx : -1,
  } : null;

  // Helper: render bitwise AND stack
  const renderBitwiseAnd = (label: string, value: number, maskValue: number, valIndex: number) => {
    const binaryVal = toBin9(value).split('');
    const binaryMask = toBin9(maskValue).split('');
    const result = value & maskValue;
    const binaryResult = toBin9(result).split('');
    const isConflict = result !== 0;

    return (
      <div className="bitwise-stack">
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name">{label}</span>
          <div className="bitwise-bits">
            {binaryVal.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${bit === '1' ? 'bit-active' : ''} ${isTarget && bit === '1' ? (isConflict ? 'bit-highlight-active' : 'bit-highlight-match') : ''}`}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bitwise-stack-row" style={{ height: '10px', marginTop: '-3px', marginBottom: '-3px' }}>
          <span className="bitwise-row-name" style={{ fontSize: '0.55rem', opacity: 0.4 }}>AND (&amp;)</span>
          <div className="bitwise-bits" style={{ justifyContent: 'center', opacity: 0.3, fontSize: '0.6rem' }}>
            &amp;
          </div>
        </div>
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name">mask</span>
          <div className="bitwise-bits">
            {binaryMask.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${bit === '1' ? 'bit-active' : ''} ${isTarget ? (isConflict ? 'bit-highlight-active' : 'bit-highlight-match') : ''}`}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bitwise-stack-divider" />
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name" style={{ color: isConflict ? '#ef4444' : '#10b981', fontWeight: 700 }}>result</span>
          <div className="bitwise-bits">
            {binaryResult.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${isTarget ? (isConflict ? 'bit-highlight-active' : 'bit-highlight-match') : ''}`} style={{ fontWeight: 800 }}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Helper: render bitwise OR stack
  const renderBitwiseOr = (label: string, beforeVal: number, maskValue: number, valIndex: number) => {
    const binaryBefore = toBin9(beforeVal).split('');
    const binaryMask = toBin9(maskValue).split('');
    const afterVal = beforeVal | maskValue;
    const binaryAfter = toBin9(afterVal).split('');

    return (
      <div className="bitwise-stack">
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name" style={{ fontSize: '0.7rem' }}>{label}</span>
          <div className="bitwise-bits">
            {binaryBefore.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${bit === '1' ? 'bit-active' : ''} ${isTarget ? 'bit-highlight-match' : ''}`}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bitwise-stack-row" style={{ height: '10px', marginTop: '-3px', marginBottom: '-3px' }}>
          <span className="bitwise-row-name" style={{ fontSize: '0.55rem', opacity: 0.4 }}>OR (|)</span>
          <div className="bitwise-bits" style={{ justifyContent: 'center', opacity: 0.3, fontSize: '0.6rem' }}>
            |
          </div>
        </div>
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name">mask</span>
          <div className="bitwise-bits">
            {binaryMask.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${bit === '1' ? 'bit-active' : ''} ${isTarget ? 'bit-highlight-match' : ''}`}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bitwise-stack-divider" />
        <div className="bitwise-stack-row">
          <span className="bitwise-row-name" style={{ color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }}>updated</span>
          <div className="bitwise-bits">
            {binaryAfter.map((bit, idx) => {
              const isTarget = (8 - idx) === valIndex;
              return (
                <div key={idx} className={`bitwise-bit-slot ${bit === '1' ? 'bit-active' : ''} ${isTarget ? 'bit-highlight-match' : ''}`} style={{ fontWeight: 800 }}>
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="visualizer-workspace">
      <div className="simulation-container">
        <div className="workspace-header">
          <h2 className="panel-title">🧩 Sudoku Trace Sandbox</h2>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* 9×9 Sudoku Grid */}
        <div className="sudoku-grid-wrapper">
          <div className="sudoku-grid">
            {currentStep.board.map((row, r) =>
              row.map((cell, c) => {
                const isActive = r === activeRow && c === activeCol;
                const isSameRow = r === activeRow && activeRow >= 0;
                const isSameCol = c === activeCol && activeCol >= 0;
                const cellBoxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                const isSameBox = cellBoxIdx === activeBoxIdx && activeBoxIdx >= 0;
                const isConflict = isActive && currentStep.status === 'conflict-found';
                const isDot = cell === '.';

                let cellClass = 'sudoku-cell';
                if (isActive) cellClass += ' sudoku-cell-active';
                if (isConflict) cellClass += ' sudoku-cell-conflict';
                if (!isActive && (isSameRow || isSameCol || isSameBox)) cellClass += ' sudoku-cell-highlight';
                if (isDot) cellClass += ' sudoku-cell-dot';

                // Sub-box border accents
                if (c % 3 === 0 && c !== 0) cellClass += ' sudoku-cell-box-left';
                if (r % 3 === 0 && r !== 0) cellClass += ' sudoku-cell-box-top';

                return (
                  <div key={`${r}-${c}`} className={cellClass}>
                    {isDot ? '·' : cell}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bitmask State Panel */}
        {showBitmaskFor && (
          <div className="bitmask-panel">
            <div className="bitmask-view-header">
              <span className="panel-title" style={{ fontSize: '0.8rem', margin: 0 }}>📊 Bitmask Tracker Arrays</span>
              <div className="bitmask-view-tabs">
                <button
                  className={`bitmask-view-tab ${viewMode === 'focus' ? 'active' : ''}`}
                  onClick={() => setViewMode('focus')}
                  type="button"
                >
                  Active Cell
                </button>
                <button
                  className={`bitmask-view-tab ${viewMode === 'matrix' ? 'active' : ''}`}
                  onClick={() => setViewMode('matrix')}
                  type="button"
                >
                  All Trackers
                </button>
              </div>
            </div>

            {viewMode === 'matrix' ? (
              <div className="tracker-matrix-grid">
                {/* Rows Tracker Array */}
                <div className="tracker-matrix-column">
                  <div className="matrix-column-title" style={{ color: 'var(--theme-accent)' }}>Rows</div>
                  {currentStep.rows.map((rowVal, r) => {
                    const isActive = r === activeRow;
                    return (
                      <div key={r} className={`matrix-row ${isActive ? 'active-matrix-row' : ''}`}>
                        <span className="matrix-row-label">R{r}</span>
                        <div className="matrix-bits">
                          {toBin9(rowVal).split('').map((bit, idx) => (
                            <div
                              key={idx}
                              className={`matrix-bit-dot ${bit === '1' ? 'bit-on' : 'bit-off'}`}
                              title={`Row ${r}, digit ${9 - idx} is ${bit === '1' ? 'SEEN' : 'EMPTY'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cols Tracker Array */}
                <div className="tracker-matrix-column">
                  <div className="matrix-column-title" style={{ color: 'var(--theme-accent-secondary)' }}>Cols</div>
                  {currentStep.cols.map((colVal, c) => {
                    const isActive = c === activeCol;
                    return (
                      <div key={c} className={`matrix-row ${isActive ? 'active-matrix-row' : ''}`}>
                        <span className="matrix-row-label">C{c}</span>
                        <div className="matrix-bits">
                          {toBin9(colVal).split('').map((bit, idx) => (
                            <div
                              key={idx}
                              className={`matrix-bit-dot ${bit === '1' ? 'bit-on' : 'bit-off'}`}
                              title={`Col ${c}, digit ${9 - idx} is ${bit === '1' ? 'SEEN' : 'EMPTY'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Boxes Tracker Array */}
                <div className="tracker-matrix-column">
                  <div className="matrix-column-title" style={{ color: 'var(--theme-highlight)' }}>Boxes</div>
                  {currentStep.boxes.map((boxVal, b) => {
                    const isActive = b === activeBoxIdx;
                    return (
                      <div key={b} className={`matrix-row ${isActive ? 'active-matrix-row' : ''}`}>
                        <span className="matrix-row-label">B{b}</span>
                        <div className="matrix-bits">
                          {toBin9(boxVal).split('').map((bit, idx) => (
                            <div
                              key={idx}
                              className={`matrix-bit-dot ${bit === '1' ? 'bit-on' : 'bit-off'}`}
                              title={`Box ${b}, digit ${9 - idx} is ${bit === '1' ? 'SEEN' : 'EMPTY'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="bitmask-row-group">
                  <span className="bitmask-label">Row {showBitmaskFor.rowIdx}</span>
                  <div className="bit-strip">
                    {toBin9(currentStep.rows[showBitmaskFor.rowIdx]).split('').map((bit, i) => (
                      <div
                        key={i}
                        className={`bit-slot ${bit === '1' ? 'bit-on' : 'bit-off'} ${
                          currentStep.status === 'set-bits' && currentStep.val === (8 - i) ? 'bit-just-set' : ''
                        }`}
                        title={`Bit ${8 - i} → digit ${9 - i}`}
                      >
                        <span className="bit-digit-label">{9 - i}</span>
                        <span className="bit-digit-value">{bit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bitmask-row-group">
                  <span className="bitmask-label">Col {showBitmaskFor.colIdx}</span>
                  <div className="bit-strip">
                    {toBin9(currentStep.cols[showBitmaskFor.colIdx]).split('').map((bit, i) => (
                      <div
                        key={i}
                        className={`bit-slot ${bit === '1' ? 'bit-on' : 'bit-off'} ${
                          currentStep.status === 'set-bits' && currentStep.val === (8 - i) ? 'bit-just-set' : ''
                        }`}
                      >
                        <span className="bit-digit-label">{9 - i}</span>
                        <span className="bit-digit-value">{bit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {showBitmaskFor.boxIdx >= 0 && (
                  <div className="bitmask-row-group">
                    <span className="bitmask-label">Box {showBitmaskFor.boxIdx}</span>
                    <div className="bit-strip">
                      {toBin9(currentStep.boxes[showBitmaskFor.boxIdx]).split('').map((bit, i) => (
                        <div
                          key={i}
                          className={`bit-slot ${bit === '1' ? 'bit-on' : 'bit-off'} ${
                            currentStep.status === 'set-bits' && currentStep.val === (8 - i) ? 'bit-just-set' : ''
                          }`}
                        >
                          <span className="bit-digit-label">{9 - i}</span>
                          <span className="bit-digit-value">{bit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Bitmask Shift Visualizer — shown only on calc-mask step when quiz is not active/answered */}
        {currentStep.status === 'calc-mask' && currentStep.val >= 0 && (!quizMode || quizAnswerState === 'correct') && (
          <div className="bitmask-shift-visualizer">
            <div className="shift-title">🎛️ Visualizing: <code>1 &lt;&lt; {currentStep.val}</code></div>
            <div className="shift-animation-row">
              <div className="shift-before">
                <span className="shift-label">1 =</span>
                <div className="bit-strip shift-strip">
                  {toBin9(1).split('').map((bit, i) => (
                    <div key={i} className={`bit-slot ${bit === '1' ? 'bit-on' : 'bit-off'}`}>
                      <span className="bit-digit-value">{bit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shift-arrow">⬅️ shift {currentStep.val}</div>
              <div className="shift-after">
                <span className="shift-label">{currentStep.mask} =</span>
                <div className="bit-strip shift-strip">
                  {toBin9(currentStep.mask).split('').map((bit, i) => (
                    <div key={i} className={`bit-slot ${bit === '1' ? 'bit-on bit-shifted' : 'bit-off'}`}>
                      <span className="bit-digit-value">{bit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="shift-analogy">
              💡 Think of 9 light switches numbered 1–9. <strong>"1 &lt;&lt; {currentStep.val}"</strong> walks to switch #{currentStep.val} from the right and flips only that one ON. Result = 2<sup>{currentStep.val}</sup> = {currentStep.mask}.
            </div>
          </div>
        )}

        {/* Box Index Visualizer — shown only on calc-box step when quiz is not active/answered */}
        {currentStep.status === 'calc-box' && currentStep.boxIdx >= 0 && (!quizMode || quizAnswerState === 'correct') && (
          <div className="box-index-visualizer">
            <div className="box-visualizer-title">
              📦 Visualizing Box Index: <code>boxIdx = (r / 3) * 3 + (c / 3)</code>
            </div>
            <div className="box-visualizer-content">
              <div className="box-math-card">
                <div className="box-math-row">
                  <span>Row (r):</span>
                  <span className="box-math-highlight">{activeRow}</span>
                  <span>→ blockRow = Math.floor({activeRow} / 3) =</span>
                  <span className="box-math-highlight" style={{ color: 'var(--theme-accent)' }}>{Math.floor(activeRow / 3)}</span>
                </div>
                <div className="box-math-row">
                  <span>Col (c):</span>
                  <span className="box-math-highlight">{activeCol}</span>
                  <span>→ blockCol = Math.floor({activeCol} / 3) =</span>
                  <span className="box-math-highlight" style={{ color: 'var(--theme-accent-secondary)' }}>{Math.floor(activeCol / 3)}</span>
                </div>
                <div className="box-math-row" style={{ marginTop: '0.4rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.4rem' }}>
                  <span>Formula:</span>
                  <span>({Math.floor(activeRow / 3)} * 3) + {Math.floor(activeCol / 3)} =</span>
                  <span className="box-math-result">{currentStep.boxIdx}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div className="mini-box-grid">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`mini-box-cell ${idx === currentStep.boxIdx ? 'active-box-cell' : ''}`}
                    >
                      {idx}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '0.6rem', color: 'var(--theme-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  3×3 Sub-Boxes (0–8)
                </span>
              </div>
            </div>
            <div className="shift-analogy" style={{ borderLeftColor: 'var(--theme-accent-secondary)' }}>
              💡 <strong>Why this formula?</strong> We simplify the 9×9 grid into a <strong>3×3 grid of large blocks</strong>. The vertical coordinate is <code>r / 3</code>, and the horizontal coordinate is <code>c / 3</code>. We flatten this 2D coordinate into a 1D index using <code>row * width + col</code>, which is <code>(r / 3) * 3 + (c / 3)</code>!
            </div>
          </div>
        )}

        {/* Bitwise AND Visualizer — shown on check-conflict and conflict-found steps */}
        {(currentStep.status === 'check-conflict' || currentStep.status === 'conflict-found') && activeRow >= 0 && activeCol >= 0 && (
          <div className="bitwise-op-visualizer">
            <div className="bitwise-op-title">
              🔍 Bitwise AND Conflict Check: <code>(tracker &amp; mask) ≠ 0</code>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'space-around', margin: '0.25rem 0' }}>
              {renderBitwiseAnd(`rows[${activeRow}]`, currentStep.rows[activeRow], currentStep.mask, currentStep.val)}
              {renderBitwiseAnd(`cols[${activeCol}]`, currentStep.cols[activeCol], currentStep.mask, currentStep.val)}
              {activeBoxIdx >= 0 && renderBitwiseAnd(`boxes[${activeBoxIdx}]`, currentStep.boxes[activeBoxIdx], currentStep.mask, currentStep.val)}
            </div>
            <div className="shift-analogy" style={{ borderLeftColor: 'var(--theme-highlight)' }}>
              💡 <strong>How it works:</strong> Bitwise AND (<code>&amp;</code>) returns <code>1</code> only if a bit is <code>1</code> in <strong>both</strong> numbers. By ANDing the tracker with our 1-bit mask, we "peek" at that specific switch. If the result is not zero, that switch was already ON, meaning the digit is a duplicate!
            </div>
          </div>
        )}

        {/* Bitwise OR Visualizer — shown on set-bits step */}
        {currentStep.status === 'set-bits' && activeRow >= 0 && activeCol >= 0 && (
          <div className="bitwise-op-visualizer">
            <div className="bitwise-op-title">
              ✅ Bitwise OR Register: <code>tracker |= mask</code>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'space-around', margin: '0.25rem 0' }}>
              <div style={{
                opacity: currentStep.highlightedLine === 23 ? 1 : 0.35,
                transition: 'all 0.3s ease',
                transform: currentStep.highlightedLine === 23 ? 'scale(1.02)' : 'none',
                border: currentStep.highlightedLine === 23 ? '1.5px solid rgba(var(--theme-accent-rgb), 0.3)' : '1.5px solid transparent',
                borderRadius: '10px',
                padding: '4px 8px',
                background: currentStep.highlightedLine === 23 ? 'rgba(var(--theme-accent-rgb), 0.03)' : 'transparent'
              }}>
                {renderBitwiseOr(`rows[${activeRow}]`, currentStep.rows[activeRow] & ~currentStep.mask, currentStep.mask, currentStep.val)}
              </div>
              <div style={{
                opacity: currentStep.highlightedLine === 24 ? 1 : 0.35,
                transition: 'all 0.3s ease',
                transform: currentStep.highlightedLine === 24 ? 'scale(1.02)' : 'none',
                border: currentStep.highlightedLine === 24 ? '1.5px solid rgba(var(--theme-accent-rgb), 0.3)' : '1.5px solid transparent',
                borderRadius: '10px',
                padding: '4px 8px',
                background: currentStep.highlightedLine === 24 ? 'rgba(var(--theme-accent-rgb), 0.03)' : 'transparent'
              }}>
                {renderBitwiseOr(`cols[${activeCol}]`, currentStep.cols[activeCol] & ~currentStep.mask, currentStep.mask, currentStep.val)}
              </div>
              {activeBoxIdx >= 0 && (
                <div style={{
                  opacity: currentStep.highlightedLine === 25 ? 1 : 0.35,
                  transition: 'all 0.3s ease',
                  transform: currentStep.highlightedLine === 25 ? 'scale(1.02)' : 'none',
                  border: currentStep.highlightedLine === 25 ? '1.5px solid rgba(var(--theme-accent-rgb), 0.3)' : '1.5px solid transparent',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  background: currentStep.highlightedLine === 25 ? 'rgba(var(--theme-accent-rgb), 0.03)' : 'transparent'
                }}>
                  {renderBitwiseOr(`boxes[${activeBoxIdx}]`, currentStep.boxes[activeBoxIdx] & ~currentStep.mask, currentStep.mask, currentStep.val)}
                </div>
              )}
            </div>
            <div className="shift-analogy" style={{ borderLeftColor: 'var(--theme-accent)' }}>
              💡 <strong>How it works:</strong> Bitwise OR (<code>|</code>) returns <code>1</code> if a bit is <code>1</code> in <strong>either</strong> number. By ORing the tracker with our 1-bit mask, we flip that specific switch ON permanently. This registers the digit for future checks.
            </div>
          </div>
        )}

        {/* Quiz Overlay */}
        {quizMode && (currentStep.status === 'calc-mask' || currentStep.status === 'calc-box') && quizAnswerState !== 'correct' ? (
          <div className="quiz-container">
            <div className="quiz-question">🎮 {currentStep.status === 'calc-mask' ? 'Bitmask Challenge!' : 'Sub-Box Challenge!'}</div>
            
            {currentStep.status === 'calc-mask' ? (
              <div className="quiz-sub">
                Given <strong>val = {currentStep.val}</strong>, what is the decimal value of <code>1 &lt;&lt; {currentStep.val}</code>?
              </div>
            ) : (
              <div className="quiz-sub">
                Given row <strong>r = {currentStep.row}</strong> and col <strong>c = {currentStep.col}</strong>, what is the value of <code>boxIdx = (r / 3) * 3 + (c / 3)</code>?
              </div>
            )}

            <div className="quiz-choices">
              {quizOptions.map((option, idx) => (
                <button
                  key={idx}
                  className="quiz-choice-btn"
                  onClick={() => handleQuizAnswer(option)}
                  style={{ borderColor: 'rgba(var(--theme-accent-rgb), 0.3)' }}
                >
                  <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{option}</span>
                  {currentStep.status === 'calc-mask' && (
                    <span className="quiz-btn-subtitle">
                      binary: {toBin9(option)}
                    </span>
                  )}
                  {currentStep.status === 'calc-box' && (
                    <span className="quiz-btn-subtitle">
                      box index
                    </span>
                  )}
                </button>
              ))}
            </div>

            {quizAnswerState === 'incorrect' && (
              <div className="feedback-alert error">{quizFeedback}</div>
            )}
          </div>
        ) : (
          <>
            {/* Validity Status */}
            <div className="calculator-box">
              <div className="equation-section">
                <div className="eq-var">
                  <span className="eq-label">Cell</span>
                  <span className="eq-val i">
                    {activeRow >= 0 && activeCol >= 0 ? `[${activeRow}][${activeCol}]` : '—'}
                  </span>
                </div>
                <span style={{ color: 'var(--theme-text-muted)' }}>→</span>
                <div className="eq-var">
                  <span className="eq-label">Val</span>
                  <span className="eq-val left">
                    {currentStep.val >= 0 ? currentStep.val : '—'}
                  </span>
                </div>
                <span style={{ color: 'var(--theme-text-muted)' }}>→</span>
                <div className="eq-var">
                  <span className="eq-label">Mask</span>
                  <span className="eq-val right" style={{ fontFamily: 'var(--font-mono)' }}>
                    {currentStep.mask > 0 ? toBin9(currentStep.mask) : '—'}
                  </span>
                </div>
                <span>=</span>
                <span className="eq-sum">
                  {currentStep.status === 'done-valid' ? '✅' :
                   currentStep.status === 'done-invalid' || currentStep.status === 'conflict-found' ? '❌' :
                   '🔄'}
                </span>
              </div>

              <div>
                {currentStep.status === 'conflict-found' || currentStep.status === 'done-invalid' ? (
                  <span className="sum-status too-large">INVALID</span>
                ) : currentStep.status === 'done-valid' ? (
                  <span className="sum-status match">VALID</span>
                ) : currentStep.status === 'skip-dot' ? (
                  <span className="sum-status none">skip (.)</span>
                ) : (
                  <span className="sum-status none">scanning</span>
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
        </div>
      </div>

      {/* Results Panel */}
      <div className="results-container">
        <div className="results-header">
          <span className="results-title">
            🔎 Board Validation Result
          </span>
        </div>
        <div className="triplet-tags">
          {currentStep.status === 'done-valid' ? (
            <span className="triplet-tag new-find" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ✅ Board is Valid
            </span>
          ) : currentStep.status === 'done-invalid' || currentStep.status === 'conflict-found' ? (
            <span className="triplet-tag new-find" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>
              ❌ Board is Invalid — Conflict in {currentStep.conflictType} {currentStep.conflictType === 'row' ? currentStep.row : currentStep.conflictType === 'col' ? currentStep.col : currentStep.boxIdx}
            </span>
          ) : (
            <span className="no-results">Scanning board... watch the validation trace.</span>
          )}
        </div>
      </div>
    </section>
  );
};
