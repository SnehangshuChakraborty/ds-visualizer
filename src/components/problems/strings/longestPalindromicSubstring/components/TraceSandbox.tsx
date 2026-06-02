import React from 'react';
import type { LongestPalindromeStep } from '../../../../../types';
import { PRESETS } from '../constants/longestPalindromeData';

interface TraceSandboxProps {
  steps: LongestPalindromeStep[];
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
    center: -1,
    isEven: false,
    left: -1,
    right: -1,
    start: 0,
    end: 0,
    maxLength: 1,
    highlightedLine: 4,
    status: 'init',
    message: 'Loading...',
  };

  const characters = currentStep.s.split('');

  const getComparisonHistory = () => {
    const history: { leftChar: string; rightChar: string; indexL: number; indexR: number; isMatch: boolean }[] = [];
    let scanIndex = 0;
    while (scanIndex <= currentStepIndex) {
      const step = steps[scanIndex];
      if (step && step.center === currentStep.center && step.isEven === currentStep.isEven) {
        if (step.status === 'match' && step.left !== -1 && step.right !== -1) {
          history.push({
            leftChar: step.s[step.left],
            rightChar: step.s[step.right],
            indexL: step.left,
            indexR: step.right,
            isMatch: true
          });
        } else if (step.status === 'mismatch' && step.left !== -1 && step.right !== -1) {
          history.push({
            leftChar: step.s[step.left],
            rightChar: step.s[step.right],
            indexL: step.left,
            indexR: step.right,
            isMatch: false
          });
        }
      }
      scanIndex++;
    }
    return history;
  };

  const comparisonHistory = getComparisonHistory();

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
          <div className="string-bubble-container" style={{ position: 'relative', minHeight: '120px', alignItems: 'center' }}>
            {/* Even Center Indicator Gap Markers */}
            {currentStep.center !== -1 && currentStep.isEven && (
              <div 
                className="even-center-gap-indicator animate-pop" 
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: `${currentStep.center * 68 + 84}px`, // aligns perfectly in the gap between center and center + 1
                  width: '4px',
                  height: '44px',
                  background: 'var(--theme-accent)',
                  boxShadow: '0 0 10px var(--theme-accent)',
                  borderRadius: '2px',
                  zIndex: 2
                }}
                title="Even center axis"
              />
            )}

            {/* Symmetrical Ripple Connecting Bridge (SVG Arch) */}
            {currentStep.left !== -1 && currentStep.right !== -1 && currentStep.left !== currentStep.right && (
              <svg 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              >
                <path
                  d={`M ${currentStep.left * 68 + 52} 42 Q ${(currentStep.left * 68 + 52 + currentStep.right * 68 + 52) / 2} ${24 - Math.min(30, (currentStep.right - currentStep.left) * 6)} ${currentStep.right * 68 + 52} 42`}
                  fill="none"
                  stroke={currentStep.status === 'match' ? '#10b981' : currentStep.status === 'mismatch' ? '#ef4444' : 'var(--theme-accent)'}
                  strokeWidth="2.5"
                  strokeDasharray={currentStep.status === 'expanding' ? '4,4' : 'none'}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: `drop-shadow(0 0 4px ${currentStep.status === 'match' ? '#10b981' : currentStep.status === 'mismatch' ? '#ef4444' : 'var(--theme-accent)'})`
                  }}
                />
              </svg>
            )}

            {characters.map((char, idx) => {
              const isActiveCenter = currentStep.center !== -1 && !currentStep.isEven && idx === currentStep.center;
              const isActiveLeft = currentStep.left !== -1 && idx === currentStep.left;
              const isActiveRight = currentStep.right !== -1 && idx === currentStep.right;
              
              // In-bounds confirmed palindrome window (exclusive of expanding pointers)
              const isConfirmedPalindrome = 
                currentStep.left !== -1 && 
                currentStep.right !== -1 && 
                idx > currentStep.left && 
                idx < currentStep.right;

              // Persistent best champion palindrome highlight
              const isBestChampion = 
                idx >= currentStep.start && 
                idx <= currentStep.end && 
                currentStep.start <= currentStep.end;

              // Active start/end pointer badges
              const isStart = currentStep.start !== -1 && idx === currentStep.start;
              const isEnd = currentStep.end !== -1 && idx === currentStep.end;

              // Expansion states highlights
              const isMatch = (isActiveLeft || isActiveRight) && currentStep.status === 'match';
              const isMismatch = (isActiveLeft || isActiveRight) && currentStep.status === 'mismatch';

              let bubbleClass = 'char-bubble';
              if (isActiveCenter) bubbleClass += ' border-center-active';
              if (isConfirmedPalindrome) bubbleClass += ' in-palindrome-glow';
              if (isBestChampion) bubbleClass += ' best-champion-border';
              if (isMatch) bubbleClass += ' match-glow';
              if (isMismatch) bubbleClass += ' mismatch-glow';

              return (
                <div key={idx} className="char-item-wrapper" style={{ width: '50px', margin: '0 3px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Top Pointer Labels (S & E - Champion boundaries) */}
                  <div className="top-pointer-labels" style={{ height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.35rem' }}>
                    {isStart && isEnd ? (
                      <span className="pointer-badge start-end-combined animate-pop" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: '#fff', fontSize: '0.6rem', padding: '0.05rem 0.35rem', fontWeight: 800, borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }} title="Start & End index of best palindrome">S & E</span>
                    ) : isStart ? (
                      <span className="pointer-badge start-badge animate-pop" style={{ background: '#10b981', color: '#fff', fontSize: '0.6rem', padding: '0.05rem 0.35rem', fontWeight: 800, borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }} title="Start index of best palindrome">S</span>
                    ) : isEnd ? (
                      <span className="pointer-badge end-badge animate-pop" style={{ background: '#3b82f6', color: '#fff', fontSize: '0.6rem', padding: '0.05rem 0.35rem', fontWeight: 800, borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }} title="End index of best palindrome">E</span>
                    ) : null}
                  </div>

                  <div className={bubbleClass}>
                    <span className="char-value">{char}</span>
                  </div>
                  <span className="char-index" style={{ marginTop: '0.35rem' }}>{idx}</span>

                  {/* Bottom Pointer Labels (C, L, R - Active wing expansion) */}
                  <div className="pointer-labels" style={{ display: 'flex', gap: '0.15rem', justifyContent: 'center', marginTop: '0.35rem', minHeight: '18px' }}>
                    {isActiveCenter && isActiveLeft && isActiveRight ? (
                      <span className="pointer-badge center-badge animate-pop" style={{ background: 'linear-gradient(135deg, #fbbf24, #a855f7)', color: '#000', fontSize: '0.65rem', padding: '0.05rem 0.35rem', fontWeight: 800, borderRadius: '4px' }} title="Center pivot and both Left/Right wing pointers">C [L,R]</span>
                    ) : isActiveCenter && isActiveLeft ? (
                      <span className="pointer-badge center-badge animate-pop" style={{ background: 'linear-gradient(135deg, #fbbf24, #ec4899)', color: '#000', fontSize: '0.65rem', padding: '0.05rem 0.35rem', fontWeight: 800, borderRadius: '4px' }} title="Center pivot and Left wing pointer">C [L]</span>
                    ) : isActiveCenter ? (
                      <span className="pointer-badge center-badge animate-pop" title="Center scanning pivot">C</span>
                    ) : isActiveLeft ? (
                      <span className="pointer-badge left animate-pop" title="Left wing pointer">L</span>
                    ) : isActiveRight ? (
                      <span className="pointer-badge right animate-pop" title="Right wing pointer">R</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Calculations: Palindrome Specs */}
        <div className="calculator-box" style={{ margin: '1.25rem 0' }}>
          <div className="equation-section" style={{ fontSize: '0.85rem' }}>
            <div className="eq-var">
              <span className="eq-label">Champion Palindrome</span>
              <span className="eq-val font-mono" style={{ color: '#10b981' }}>
                {currentStep.start <= currentStep.end
                  ? `"${currentStep.s.substring(currentStep.start, currentStep.end + 1)}"`
                  : '""'}
              </span>
            </div>
            <span>|</span>
            <div className="eq-var">
              <span className="eq-label">Max Length</span>
              <span className="eq-val right" style={{ color: '#10b981' }}>{currentStep.maxLength}</span>
            </div>
            <span>|</span>
            <div className="eq-var">
              <span className="eq-label">Active Substring</span>
              <span className="eq-val font-mono" style={{ color: 'var(--theme-accent)' }}>
                {currentStep.left !== -1 && currentStep.right !== -1 && currentStep.left < currentStep.right - 1
                  ? `"${currentStep.s.substring(currentStep.left + 1, currentStep.right)}"`
                  : currentStep.center !== -1
                    ? `"${currentStep.isEven ? '' : currentStep.s[currentStep.center]}"`
                    : '""'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Validation Guard (Line 5) */}
        {currentStep.highlightedLine === 5 && (
          <div className="math-comparison-card animate-pop" style={{ border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.02)' }}>
            <div className="math-card-header">
              <span className="math-card-title" style={{ color: '#06b6d4' }}>🛡️ Validation Guard Status</span>
              <span className="math-card-subtitle">if (s == null || s.length() &lt; 1) return "";</span>
            </div>
            <div className="math-card-body" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start', padding: '0.5rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>Null Check (<code>s == null</code>):</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>❌ False</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>Length Check (<code>s.length() = {currentStep.s.length}</code>):</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>❌ False ({currentStep.s.length} &ge; 1)</span>
              </div>
            </div>
            <div className="math-card-footer" style={{ color: '#06b6d4', fontWeight: 600 }}>
              Verdict: Safe & Non-Empty. Proceeding to find the longest palindrome!
            </div>
          </div>
        )}

        {/* Boundary Initializers (Line 6 and 7) */}
        {(currentStep.highlightedLine === 6 || currentStep.highlightedLine === 7) && (
          <div className="math-comparison-card animate-pop" style={{ border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.02)' }}>
            <div className="math-card-header">
              <span className="math-card-title" style={{ color: '#fbbf24' }}>⚙️ Boundary Index Initialization</span>
              <span className="math-card-subtitle">int start = 0; int end = 0;</span>
            </div>
            <div className="math-card-body" style={{ justifyContent: 'space-around', padding: '0.75rem 0' }}>
              <div className="math-card-node">
                <span className="math-node-label" style={{ color: '#10b981' }}>start</span>
                <div className={`math-node-box ${currentStep.highlightedLine === 6 ? 'active' : ''}`} style={{ borderColor: '#10b981', color: '#10b981' }}>
                  {currentStep.start === -1 ? '?' : currentStep.start}
                </div>
              </div>
              <div className="math-card-node">
                <span className="math-node-label" style={{ color: '#3b82f6' }}>end</span>
                <div className={`math-node-box ${currentStep.highlightedLine === 7 ? 'active' : ''}`} style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                  {currentStep.end === -1 ? '?' : currentStep.end}
                </div>
              </div>
            </div>
            <div className="math-card-footer">
              {currentStep.highlightedLine === 6 ? (
                <span>Declared <code>start = 0</code>. Pointer <code>S</code> is positioned at index 0.</span>
              ) : (
                <span>Declared <code>end = 0</code>. Pointer <code>E</code> is positioned at index 0. Baseline palindrome set to <code>s[0..0]</code> ("{currentStep.s[0]}").</span>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Math.max Record Check Panel (Line 14) */}
        {currentStep.highlightedLine === 14 && (
          <div className="math-comparison-card animate-pop">
            <div className="math-card-header">
              <span className="math-card-title">👑 Symmetry Record Check</span>
              <span className="math-card-subtitle">if (len &gt; end - start + 1)</span>
            </div>
            
            <div className="math-card-body">
              <div className="math-card-node">
                <span className="math-node-label">Previous Record</span>
                <div className="math-node-box">
                  {currentStepIndex > 0 ? steps[currentStepIndex - 1].end - steps[currentStepIndex - 1].start + 1 : 1}
                </div>
              </div>

              <span className="math-node-vs">vs</span>

              <div className="math-card-node">
                <span className="math-node-label">Current Candidate</span>
                <div className="math-node-box active">
                  {/* Find active expanded length from steps or computed variables */}
                  {currentStep.left !== -1 && currentStep.right !== -1 ? currentStep.right - currentStep.left - 1 : 1}
                </div>
              </div>

              <span className="math-node-vs">➡️</span>

              <div className="math-card-node">
                <span className="math-node-label green">New Record Max</span>
                <div className={`math-node-box result ${currentStep.maxLength > (currentStepIndex > 0 ? steps[currentStepIndex - 1].maxLength : 1) ? 'pulse-active' : ''}`}>
                  {currentStep.maxLength}
                </div>
              </div>
            </div>

            <div className="math-card-footer">
              {currentStep.maxLength > (currentStepIndex > 0 ? steps[currentStepIndex - 1].maxLength : 1) ? (
                <span>🎉 <strong>Record Broken!</strong> Expanded length is strictly larger than the previous max. We update start and end!</span>
              ) : (
                <span>⚖️ <strong>Hold Record:</strong> The expanded length does not exceed our current champion record of <code>{currentStep.maxLength}</code>.</span>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Window Boundary Update Panel (Line 15) */}
        {currentStep.highlightedLine === 15 && (
          <div className="math-comparison-card animate-pop" style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.02)' }}>
            <div className="math-card-header">
              <span className="math-card-title" style={{ color: '#10b981' }}>🎉 Boundary Window Update</span>
              <span className="math-card-subtitle">start = i - (len - 1) / 2;  end = i + len / 2;</span>
            </div>
            <div className="math-card-body" style={{ flexDirection: 'column', gap: '0.6rem', padding: '0.5rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>Center Index (<code>i</code>):</span>
                <span style={{ fontWeight: 600, color: 'var(--theme-accent)' }}>{currentStep.center}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>Wingspan Length (<code>len</code>):</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>{currentStep.maxLength}</span>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', width: '100%', margin: '0.25rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>New start index (<code>{currentStep.center} - ({currentStep.maxLength} - 1) / 2</code>):</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{currentStep.start}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>New end index (<code>{currentStep.center} + {currentStep.maxLength} / 2</code>):</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{currentStep.end}</span>
              </div>
            </div>
            <div className="math-card-footer">
              Symmetrical span indices updated! Pointer <code>S</code> is at index {currentStep.start}, and <code>E</code> is at index {currentStep.end}.
            </div>
          </div>
        )}

        {/* Dynamic Active Comparison Card */}
        {currentStep.left !== -1 && currentStep.right !== -1 && (
          currentStep.left === currentStep.right ? (
            /* 🎯 CENTER PIVOT BASECASE CARD */
            <div className="math-comparison-card animate-pop" style={{ border: '1.5px solid var(--theme-accent)', background: 'rgba(168, 85, 247, 0.02)' }}>
              <div className="math-card-header">
                <span className="math-card-title" style={{ color: 'var(--theme-accent)' }}>🎯 Center Pivot Baseline</span>
                <span className="math-card-subtitle">Odd center pivot established at index {currentStep.center}</span>
              </div>
              
              <div className="math-card-body" style={{ justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }}>
                <div className="math-card-node">
                  <span className="math-node-label" style={{ color: 'var(--theme-accent)', marginBottom: '0.35rem' }}>Pivot Character (L = R = {currentStep.center})</span>
                  <div className="math-node-box active" style={{ width: '64px', height: '64px', fontSize: '1.5rem', borderColor: 'var(--theme-accent)', color: 'var(--theme-accent)', boxShadow: '0 0 15px rgba(168, 85, 247, 0.35)', fontWeight: 800 }}>
                    {currentStep.s[currentStep.center]}
                  </div>
                </div>
              </div>

              <div className="math-card-footer" style={{ textAlign: 'center', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
                🌱 <strong>Base Case:</strong> A single character is always a valid palindrome of length 1. Symmetrical wing expansion will start from this pivot!
              </div>
            </div>
          ) : (
            /* 🔍 ACTIVE SYMMETRICAL WING CHECK CARD */
            <div className="math-comparison-card animate-pop" style={{ border: '1.5px solid var(--theme-accent)', background: 'rgba(168, 85, 247, 0.02)' }}>
              <div className="math-card-header">
                <span className="math-card-title" style={{ color: 'var(--theme-accent)' }}>🔍 Symmetry Wing Check</span>
                <span className="math-card-subtitle">s.charAt(L) == s.charAt(R)</span>
              </div>
              
              <div className="math-card-body" style={{ justifyContent: 'space-around', alignItems: 'center', padding: '0.75rem 0' }}>
                <div className="math-card-node">
                  <span className="math-node-label" style={{ color: 'var(--theme-accent)' }}>Left Wing (L = {currentStep.left})</span>
                  <div className={`math-node-box ${currentStep.status === 'match' ? 'result pulse-active' : currentStep.status === 'mismatch' ? 'result' : 'active'}`} style={{ borderStyle: currentStep.left < 0 ? 'dashed' : 'solid', borderColor: currentStep.left < 0 ? '#ef4444' : '' }}>
                    {currentStep.left >= 0 && currentStep.left < currentStep.s.length ? currentStep.s[currentStep.left] : '🚫'}
                  </div>
                </div>

                <span className="math-node-vs" style={{ fontSize: '1.5rem', color: currentStep.status === 'match' ? '#10b981' : currentStep.status === 'mismatch' ? '#ef4444' : 'var(--theme-text-muted)', fontWeight: 800 }}>
                  {currentStep.status === 'match' ? '==' : currentStep.status === 'mismatch' ? '!=' : '?='}
                </span>

                <div className="math-card-node">
                  <span className="math-node-label" style={{ color: 'var(--theme-secondary, #ec4899)' }}>Right Wing (R = {currentStep.right})</span>
                  <div className={`math-node-box ${currentStep.status === 'match' ? 'result pulse-active' : currentStep.status === 'mismatch' ? 'result' : 'active'}`} style={{ borderStyle: currentStep.right >= currentStep.s.length ? 'dashed' : 'solid', borderColor: currentStep.right >= currentStep.s.length ? '#ef4444' : '' }}>
                    {currentStep.right >= 0 && currentStep.right < currentStep.s.length ? currentStep.s[currentStep.right] : '🚫'}
                  </div>
                </div>
              </div>

              <div className="math-card-footer" style={{ textAlign: 'center', fontWeight: 600 }}>
                {currentStep.status === 'match' ? (
                  <span style={{ color: '#10b981' }}>✅ Symmetric Match! The palindrome continues expanding.</span>
                ) : currentStep.status === 'mismatch' ? (
                  <span style={{ color: '#ef4444' }}>❌ Mismatch! Symmetry broken. Halting expansion.</span>
                ) : currentStep.status === 'out-of-bounds' ? (
                  <span style={{ color: '#ef4444' }}>🚫 Pointer out of bounds! Wingtips crossed the edge. Halting expansion.</span>
                ) : (
                  <span>🔄 Checking characters at wingtips...</span>
                )}
              </div>

              {/* Symmetry check stream history logs for the active center scanner */}
              {comparisonHistory.length > 0 && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--theme-text-muted)', marginBottom: '0.45rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    🧬 Symmetrical Wings Match Stream for Center {currentStep.center} {currentStep.isEven ? '(Even Axis)' : '(Odd Axis)'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {comparisonHistory.map((item, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.15rem 0.4rem', 
                          borderRadius: '4px', 
                          background: item.isMatch ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', 
                          border: item.isMatch ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          color: item.isMatch ? '#10b981' : '#ef4444',
                          fontFamily: 'monospace',
                          fontWeight: 600
                        }}
                      >
                        s[{item.indexL}] ('{item.leftChar}') {item.isMatch ? '==' : '!='} s[{item.indexR}] ('{item.rightChar}')
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* Narrative Log */}
        <div className="explanation-box">
          {currentStep.message}
        </div>
      </div>

      {/* Playback Controls Panel */}
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
            placeholder="babad"
          />
          <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem' }}>
            Load String
          </button>
        </form>
      </div>
    </section>
  );
};
