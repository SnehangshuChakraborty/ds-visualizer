import React from 'react';
import type { SearchRotatedSortedArrayStep } from '../../../../../types';
import { PRESETS } from '../constants/searchRotatedSortedArrayData';

interface TraceSandboxProps {
  steps: SearchRotatedSortedArrayStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
  generateRandom: () => void;
  customArrayInput: string;
  setCustomArrayInput: (val: string) => void;
  customTargetInput: string;
  setCustomTargetInput: (val: string) => void;
  handleCustomSubmit: (e: React.FormEvent) => void;
  inputNums: number[];
  inputTarget: number;
}

export const TraceSandbox: React.FC<TraceSandboxProps> = ({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  reset,
  stepBackward,
  stepForward,
  handlePresetChange,
  generateRandom,
  customArrayInput,
  setCustomArrayInput,
  customTargetInput,
  setCustomTargetInput,
  handleCustomSubmit,
  inputNums,
  inputTarget
}) => {
  const currentStep = steps[currentStepIndex] || {
    nums: inputNums,
    target: inputTarget,
    left: -1,
    right: -1,
    mid: -1,
    highlightedLine: 2,
    status: 'init',
    message: 'Loading...',
  };

  const nums = currentStep.nums;
  const target = currentStep.target;
  const left = currentStep.left;
  const right = currentStep.right;
  const mid = currentStep.mid;

  const maxVal = Math.max(...nums.map(Math.abs), 1);

  // Helper to check if index is inside current search boundary [left, right]
  const isIndexInSearchRange = (idx: number) => {
    if (left === -1 || right === -1) return false;
    return idx >= left && idx <= right;
  };

  // Find the pivot index (the point where nums[i] > nums[i+1])
  const getPivotIndex = () => {
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] > nums[i + 1]) return i;
    }
    return -1;
  };
  const pivotIdx = getPivotIndex();

  // Decision Logic Navigator computations
  const decisionBlockLines = [16, 18, 19, 21, 27, 28, 30];
  const isInDecisionBlock = mid !== -1 && decisionBlockLines.includes(currentStep.highlightedLine);
  const isOnLeftPath = currentStep.status === 'left-sorted' || currentStep.status === 'target-in-left' ||
    currentStep.highlightedLine === 19 || currentStep.highlightedLine === 21;
  const decisionStage = currentStep.highlightedLine === 16 ? 1
    : (currentStep.highlightedLine === 18 || currentStep.highlightedLine === 27) ? 2 : 3;
  const targetInSortedHalf = isOnLeftPath
    ? (left >= 0 && mid >= 0 && nums[left] <= target && target < nums[mid])
    : (mid >= 0 && right >= 0 && nums[mid] < target && target <= nums[right]);

  return (
    <section className="visualizer-workspace">
      <div className="simulation-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="panel-title" style={{ margin: 0 }}>📊 Rotated Array Sandbox</h2>
          </div>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Rotated Array Column Visualization */}
        <div className="array-outer-wrapper" style={{ minHeight: '180px', padding: '1rem 0' }}>
          <div className="array-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '0.75rem', height: '140px', position: 'relative' }}>
            {nums.map((val, idx) => {
              const isActiveLeft = idx === left;
              const isActiveRight = idx === right;
              const isActiveMid = idx === mid;
              const inRange = isIndexInSearchRange(idx);
              const isPivot = idx === pivotIdx;

              const barHeight = Math.max(45, Math.floor((Math.abs(val) / maxVal) * 90));

              // Compute color codes for Left Half vs Right Half partitions
              let borderCol = 'rgba(255,255,255,0.08)';
              let bgCol = 'rgba(255,255,255,0.02)';
              
              if (inRange) {
                if (pivotIdx === -1 || idx <= pivotIdx) {
                  // Left Zone (Zone A) - Cool Cyan Tint
                  bgCol = 'rgba(6, 182, 212, 0.08)';
                  borderCol = 'rgba(6, 182, 212, 0.3)';
                } else {
                  // Right Zone (Zone B) - Warm Orange/Fuchsia Tint
                  bgCol = 'rgba(236, 72, 153, 0.08)';
                  borderCol = 'rgba(236, 72, 153, 0.3)';
                }
              }

              // Pointer overlays
              if (isActiveMid) {
                bgCol = 'rgba(251, 191, 36, 0.2)';
                borderCol = '#fbbf24';
              } else if (isActiveLeft) {
                bgCol = 'rgba(6, 182, 212, 0.2)';
                borderCol = '#06b6d4';
              } else if (isActiveRight) {
                bgCol = 'rgba(244, 63, 94, 0.2)';
                borderCol = '#f43f5e';
              }

              return (
                <div 
                  key={idx} 
                  className={`array-item-wrapper ${isActiveLeft ? 'active-left' : ''} ${isActiveRight ? 'active-right' : ''} ${isActiveMid ? 'active-mid' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                >
                  {/* Pivot indicator badge */}
                  {isPivot && (
                    <div style={{ position: 'absolute', top: '-18px', fontSize: '0.6rem', background: '#b91c1c', color: '#fff', padding: '1px 4px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.4px', zIndex: 10 }}>
                      PIVOT
                    </div>
                  )}

                  {/* Array value block */}
                  <div
                    className="array-bar"
                    style={{
                      height: `${barHeight}px`,
                      width: '42px',
                      background: bgCol,
                      border: `1.5px solid ${borderCol}`,
                      boxShadow: isActiveMid ? '0 0 14px rgba(251, 191, 36, 0.45)' : isActiveLeft ? '0 0 12px rgba(6, 182, 212, 0.35)' : isActiveRight ? '0 0 12px rgba(244, 63, 94, 0.35)' : 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: val === target ? '#10b981' : 'var(--theme-text-primary)',
                      fontWeight: val === target ? 800 : 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {val === target && (
                      <div className="target-pulse" style={{ position: 'absolute', inset: -2, border: '2px solid #10b981', borderRadius: '8px', animation: 'ping 1.5s infinite' }} />
                    )}
                    {val}
                  </div>

                  {/* Index Label */}
                  <span className="array-index" style={{ fontSize: '0.7rem', marginTop: '0.35rem', color: 'var(--theme-text-muted)', fontWeight: 500 }}>
                    {idx}
                  </span>

                  {/* Pointers badges */}
                  <div className="pointer-labels" style={{ display: 'flex', gap: '3px', marginTop: '0.2rem', minHeight: '18px' }}>
                    {isActiveLeft && <span className="pointer-badge left" style={{ background: '#06b6d4', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>L</span>}
                    {isActiveMid && <span className="pointer-badge mid" style={{ background: '#fbbf24', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '4px' }}>M</span>}
                    {isActiveRight && <span className="pointer-badge right" style={{ background: '#f43f5e', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '1px 4px', borderRadius: '4px' }}>R</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Trace Inspector Cards */}
        
        {/* Card 0: Loop condition check console (Line 8) */}
        {currentStep.highlightedLine === 8 && left !== -1 && right !== -1 && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #a855f7', boxShadow: '0 0 15px rgba(168, 85, 247, 0.25)', maxWidth: '400px', margin: '0 auto' }}>
            <div className="inspector-title" style={{ color: '#a855f7' }}>🔄 Loop Condition Evaluation (Line 8)</div>
            <div className="inspector-eq" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
              <code>while (left &lt;= right)</code>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <code style={{ fontSize: '0.65rem' }}>left pointer (L)</code><br />
                <strong style={{ color: '#06b6d4' }}>{left}</strong>
              </div>
              <div>
                <code style={{ fontSize: '0.65rem' }}>right pointer (R)</code><br />
                <strong style={{ color: '#f43f5e' }}>{right}</strong>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', marginTop: '0.45rem', lineHeight: 1.4 }}>
              Evaluation: <code>{left} &le; {right}</code> &rarr; <strong style={{ color: left <= right ? '#10b981' : '#f43f5e' }}>{(left <= right).toString().toUpperCase()}</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)', marginTop: '0.35rem' }}>
              {left <= right ? (
                <span>💡 The search range is valid. We continue searching.</span>
              ) : (
                <span>🛑 <strong>Pointers crossed!</strong> The condition evaluates to <strong>FALSE</strong>, and the loop terminates. Target not found.</span>
              )}
            </div>
          </div>
        )}

        {/* Card 1: Midpoint calculation console (Line 9) */}
        {mid !== -1 && currentStep.highlightedLine === 9 && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #fbbf24', boxShadow: '0 0 15px rgba(251, 191, 36, 0.25)', maxWidth: '400px', margin: '0 auto' }}>
            <div className="inspector-title" style={{ color: '#fbbf24' }}>📐 Midpoint Evaluation (Line 9)</div>
            <div className="inspector-eq" style={{ marginBottom: '0.45rem', fontSize: '0.75rem' }}>
              <code>int mid = left + (right - left) / 2;</code>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.4 }}>
              Substitution: <br />
              <code>mid = {left} + ({right} - {left}) / 2 = </code> <strong style={{ color: '#fbbf24', fontSize: '0.8rem' }}>{mid}</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)', marginTop: '0.35rem' }}>
              💡 Value at mid: <code>nums[{mid}]</code> = <strong>{nums[mid]}</strong>. Target seeking: <strong>{target}</strong>.
            </div>
          </div>
        )}

        {/* Card 2: Sorted half detector console (Line 16) */}
        {mid !== -1 && currentStep.highlightedLine === 16 && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #06b6d4', boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)', maxWidth: '420px', margin: '0 auto' }}>
            <div className="inspector-title" style={{ color: '#06b6d4' }}>⚖️ Partition Sorting Check (Line 16)</div>
            <div className="inspector-eq" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
              <code>if (nums[left] &lt;= nums[mid])</code>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <code style={{ fontSize: '0.65rem' }}>nums[left] (nums[{left}])</code><br />
                <strong style={{ color: '#06b6d4' }}>{nums[left]}</strong>
              </div>
              <div>
                <code style={{ fontSize: '0.65rem' }}>nums[mid] (nums[{mid}])</code><br />
                <strong style={{ color: '#fbbf24' }}>{nums[mid]}</strong>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', marginTop: '0.45rem', lineHeight: 1.4 }}>
              Evaluation: <code>{nums[left]} &lt;= {nums[mid]}</code> &rarr; <strong style={{ color: nums[left] <= nums[mid] ? '#10b981' : '#f43f5e' }}>{(nums[left] <= nums[mid]).toString().toUpperCase()}</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)', marginTop: '0.35rem' }}>
              {nums[left] <= nums[mid] ? (
                <span>💡 <strong>Left half is sorted normally.</strong> The rotation pivot point resides in the right half.</span>
              ) : (
                <span>💡 <strong>Right half is sorted normally.</strong> The rotation pivot point resides in the left half.</span>
              )}
            </div>
          </div>
        )}

        {/* Decision Logic Navigator — Memory Aid Card */}
        {isInDecisionBlock && (
          <div className="trace-inspector-card animate-pop" style={{
            border: '1.5px solid #8b5cf6',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
            maxWidth: '460px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.04), rgba(6,182,212,0.02))'
          }}>
            <div className="inspector-title" style={{ color: '#8b5cf6', marginBottom: '0.6rem' }}>
              🧭 Decision Logic Navigator
            </div>

            {/* 3-Step Progress Stepper */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              marginBottom: '0.75rem', padding: '0.45rem 0.5rem',
              background: 'rgba(0,0,0,0.15)', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{
                padding: '0.25rem 0.55rem', borderRadius: '6px',
                background: decisionStage === 1 ? 'rgba(139,92,246,0.25)' : 'rgba(16,185,129,0.12)',
                border: decisionStage === 1 ? '1.5px solid #8b5cf6' : '1px solid rgba(16,185,129,0.3)',
                fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap',
                color: decisionStage === 1 ? '#c4b5fd' : '#6ee7b7',
                boxShadow: decisionStage === 1 ? '0 0 8px rgba(139,92,246,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {decisionStage > 1 ? '✓' : '①'} Sorted half?
              </div>
              <span style={{ color: 'var(--theme-text-muted)', fontSize: '0.65rem' }}>→</span>
              <div style={{
                padding: '0.25rem 0.55rem', borderRadius: '6px',
                background: decisionStage === 2 ? 'rgba(236,72,153,0.25)' : decisionStage > 2 ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                border: decisionStage === 2 ? '1.5px solid #ec4899' : decisionStage > 2 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap',
                color: decisionStage === 2 ? '#f9a8d4' : decisionStage > 2 ? '#6ee7b7' : 'var(--theme-text-muted)',
                boxShadow: decisionStage === 2 ? '0 0 8px rgba(236,72,153,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {decisionStage > 2 ? '✓' : '②'} Target in range?
              </div>
              <span style={{ color: 'var(--theme-text-muted)', fontSize: '0.65rem' }}>→</span>
              <div style={{
                padding: '0.25rem 0.55rem', borderRadius: '6px',
                background: decisionStage === 3 ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.03)',
                border: decisionStage === 3 ? '1.5px solid #fbbf24' : '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap',
                color: decisionStage === 3 ? '#fde68a' : 'var(--theme-text-muted)',
                boxShadow: decisionStage === 3 ? '0 0 8px rgba(251,191,36,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                ③ Narrow window
              </div>
            </div>

            {/* Visual Search Window Topology */}
            <div style={{
              padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.2)',
              borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '0.65rem'
            }}>
              <div style={{ fontSize: '0.55rem', color: 'var(--theme-text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Search Window Topology
              </div>

              {/* Range bar: Left Half | Mid | Right Half */}
              <div style={{ display: 'flex', alignItems: 'stretch', height: '36px', position: 'relative', marginBottom: '0.1rem' }}>
                {/* Left half segment */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px 0 0 8px',
                  background: isOnLeftPath ? 'linear-gradient(90deg, rgba(16,185,129,0.22), rgba(16,185,129,0.12))' : 'rgba(255,255,255,0.03)',
                  border: isOnLeftPath ? '1.5px solid rgba(16,185,129,0.45)' : '1px solid rgba(255,255,255,0.08)',
                  borderRight: 'none',
                  fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3px',
                  color: isOnLeftPath ? '#6ee7b7' : 'var(--theme-text-muted)',
                  transition: 'all 0.35s ease'
                }}>
                  {isOnLeftPath ? '✓ SORTED' : '⟳ ROTATED'}
                </div>

                {/* Mid divider */}
                <div style={{
                  width: '3px', background: '#fbbf24', position: 'relative', zIndex: 2, flexShrink: 0
                }}>
                  <div style={{
                    position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
                    fontSize: '0.52rem', fontWeight: 800, color: '#fbbf24', whiteSpace: 'nowrap',
                    background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: '3px'
                  }}>
                    M={mid}
                  </div>
                </div>

                {/* Right half segment */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0 8px 8px 0',
                  background: !isOnLeftPath ? 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(16,185,129,0.22))' : 'rgba(255,255,255,0.03)',
                  border: !isOnLeftPath ? '1.5px solid rgba(16,185,129,0.45)' : '1px solid rgba(255,255,255,0.08)',
                  borderLeft: 'none',
                  fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3px',
                  color: !isOnLeftPath ? '#6ee7b7' : 'var(--theme-text-muted)',
                  transition: 'all 0.35s ease'
                }}>
                  {!isOnLeftPath ? '✓ SORTED' : '⟳ ROTATED'}
                </div>
              </div>

              {/* L and R labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#06b6d4' }}>L={left} ({nums[left]})</span>
                <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#f43f5e' }}>R={right} ({nums[right]})</span>
              </div>

              {/* Target position indicator */}
              {decisionStage >= 2 && (
                <div style={{
                  padding: '0.3rem 0.5rem', borderRadius: '6px',
                  background: targetInSortedHalf ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                  border: `1px solid ${targetInSortedHalf ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
                  fontSize: '0.63rem', textAlign: 'center',
                  color: targetInSortedHalf ? '#6ee7b7' : '#fca5a5',
                  transition: 'all 0.3s ease'
                }}>
                  🎯 Target (<strong>{target}</strong>) is <strong>{targetInSortedHalf ? 'INSIDE' : 'OUTSIDE'}</strong> the sorted {isOnLeftPath ? 'left' : 'right'} half
                  {decisionStage === 3 && (
                    <span style={{ display: 'block', marginTop: '0.2rem', color: '#fde68a', fontSize: '0.6rem' }}>
                      {(currentStep.highlightedLine === 19 || currentStep.highlightedLine === 30)
                        ? '⬅️ Narrowing: right = mid − 1'
                        : '➡️ Narrowing: left = mid + 1'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mirror Pattern Recognition Box */}
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{ fontSize: '0.55rem', color: 'var(--theme-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Mirror Pattern — Both Branches
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {/* Left Sorted Column */}
                <div style={{
                  padding: '0.45rem 0.5rem', borderRadius: '8px',
                  background: isOnLeftPath ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.015)',
                  border: isOnLeftPath ? '1.5px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: isOnLeftPath ? 1 : 0.45,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#06b6d4', marginBottom: '0.3rem', textAlign: 'center' }}>
                    Left Sorted
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--theme-text-secondary)', lineHeight: 1.7, fontFamily: 'monospace' }}>
                    <div style={{ color: isOnLeftPath && decisionStage >= 1 ? '#6ee7b7' : 'inherit' }}>nums[L] ≤ nums[M]</div>
                    <div style={{ marginTop: '0.15rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.15rem' }}>
                      <div style={{
                        color: isOnLeftPath && decisionStage >= 2 && targetInSortedHalf ? '#10b981' : 'inherit',
                        fontWeight: isOnLeftPath && decisionStage >= 2 && targetInSortedHalf ? 700 : 400
                      }}>
                        L≤t{'<'}M → R=M-1
                      </div>
                      <div style={{
                        color: isOnLeftPath && decisionStage >= 2 && !targetInSortedHalf ? '#f43f5e' : 'inherit',
                        fontWeight: isOnLeftPath && decisionStage >= 2 && !targetInSortedHalf ? 700 : 400
                      }}>
                        else → L=M+1
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sorted Column */}
                <div style={{
                  padding: '0.45rem 0.5rem', borderRadius: '8px',
                  background: !isOnLeftPath ? 'rgba(236,72,153,0.08)' : 'rgba(255,255,255,0.015)',
                  border: !isOnLeftPath ? '1.5px solid rgba(236,72,153,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: !isOnLeftPath ? 1 : 0.45,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#ec4899', marginBottom: '0.3rem', textAlign: 'center' }}>
                    Right Sorted
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--theme-text-secondary)', lineHeight: 1.7, fontFamily: 'monospace' }}>
                    <div style={{ color: !isOnLeftPath && decisionStage >= 1 ? '#6ee7b7' : 'inherit' }}>nums[L] {'>'} nums[M]</div>
                    <div style={{ marginTop: '0.15rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.15rem' }}>
                      <div style={{
                        color: !isOnLeftPath && decisionStage >= 2 && targetInSortedHalf ? '#10b981' : 'inherit',
                        fontWeight: !isOnLeftPath && decisionStage >= 2 && targetInSortedHalf ? 700 : 400
                      }}>
                        M{'<'}t≤R → L=M+1
                      </div>
                      <div style={{
                        color: !isOnLeftPath && decisionStage >= 2 && !targetInSortedHalf ? '#f43f5e' : 'inherit',
                        fontWeight: !isOnLeftPath && decisionStage >= 2 && !targetInSortedHalf ? 700 : 400
                      }}>
                        else → R=M-1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contextual Memory Hook */}
            <div style={{
              padding: '0.4rem 0.6rem', borderRadius: '8px',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.2)',
              fontSize: '0.63rem', color: '#c4b5fd', lineHeight: 1.55, textAlign: 'center'
            }}>
              {decisionStage === 1 && (
                <span>🧠 <strong>Remember:</strong> "Only a sorted half has <em>trustworthy boundaries</em>. Check <code style={{ color: '#e9d5ff' }}>nums[L] ≤ nums[M]</code> to find the clean side."</span>
              )}
              {decisionStage === 2 && (
                <span>🧠 <strong>Remember:</strong> "Ask the sorted half first — can your target live here? <em>Mid is always excluded</em> (already checked), <em>endpoints included.</em>"</span>
              )}
              {decisionStage === 3 && (
                <span>🧠 <strong>Remember:</strong> "Target IN sorted half → <em>narrow to it.</em> Target NOT in sorted half → <em>go the other way.</em> Binary elimination!"</span>
              )}
            </div>
          </div>
        )}

        {/* Card 3: Target scope boundary checker (Line 18 & 27) */}
        {mid !== -1 && (currentStep.highlightedLine === 18 || currentStep.highlightedLine === 27) && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #ec4899', boxShadow: '0 0 15px rgba(236, 72, 153, 0.25)', maxWidth: '420px', margin: '0 auto' }}>
            <div className="inspector-title" style={{ color: '#ec4899' }}>🔍 Target Scope Range Guard</div>
            <div className="inspector-eq" style={{ marginBottom: '0.5rem', fontSize: '0.72rem' }}>
              {currentStep.highlightedLine === 18 ? (
                <code>if (nums[left] &lt;= target && target &lt; nums[mid])</code>
              ) : (
                <code>if (nums[mid] &lt; target && target &lt;= nums[right])</code>
              )}
            </div>

            {/* Substitution table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.45rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.7rem' }}>
              {currentStep.highlightedLine === 18 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4px', textAlign: 'center' }}>
                  <div>nums[left]: <strong style={{ color: '#06b6d4' }}>{nums[left]}</strong></div>
                  <div>&le; target: <strong style={{ color: '#10b981' }}>{target}</strong></div>
                  <div>&lt; nums[mid]: <strong style={{ color: '#fbbf24' }}>{nums[mid]}</strong></div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4px', textAlign: 'center' }}>
                  <div>nums[mid]: <strong style={{ color: '#fbbf24' }}>{nums[mid]}</strong></div>
                  <div>&lt; target: <strong style={{ color: '#10b981' }}>{target}</strong></div>
                  <div>&le; nums[right]: <strong style={{ color: '#f43f5e' }}>{nums[right]}</strong></div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', marginTop: '0.45rem', lineHeight: 1.45 }}>
              Evaluation: {currentStep.highlightedLine === 18 ? (
                <code>{nums[left]} &le; {target} && {target} &lt; {nums[mid]}</code>
              ) : (
                <code>{nums[mid]} &lt; {target} && {target} &le; {nums[right]}</code>
              )} &rarr; <strong style={{ color: (currentStep.highlightedLine === 18 ? (nums[left] <= target && target < nums[mid]) : (nums[mid] < target && target <= nums[right])) ? '#10b981' : '#f43f5e' }}>
                {(currentStep.highlightedLine === 18 ? (nums[left] <= target && target < nums[mid]) : (nums[mid] < target && target <= nums[right])).toString().toUpperCase()}
              </strong>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)', marginTop: '0.35rem' }}>
              {currentStep.highlightedLine === 18 ? (
                nums[left] <= target && target < nums[mid] ? (
                  <span>💡 Target lies inside the sorted left half. Shift <strong>right = mid - 1</strong>.</span>
                ) : (
                  <span>💡 Target lies outside the sorted left half. Search the right half: shift <strong>left = mid + 1</strong>.</span>
                )
              ) : (
                nums[mid] < target && target <= nums[right] ? (
                  <span>💡 Target lies inside the sorted right half. Shift <strong>left = mid + 1</strong>.</span>
                ) : (
                  <span>💡 Target lies outside the sorted right half. Search the left half: shift <strong>right = mid - 1</strong>.</span>
                )
              )}
            </div>
          </div>
        )}

        {/* Telemetry Dashboard Counters */}
        <div className="calculator-box" style={{ margin: 0, padding: '0.75rem 1rem' }}>
          <div className="equation-section" style={{ fontSize: '0.8rem', justifyContent: 'space-around', width: '100%' }}>
            
            <div 
              className="eq-var" 
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 5 || currentStep.highlightedLine === 21 || currentStep.highlightedLine === 28) ? '1.5px solid #06b6d4' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 5 || currentStep.highlightedLine === 21 || currentStep.highlightedLine === 28) ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 5 || currentStep.highlightedLine === 21 || currentStep.highlightedLine === 28) ? '0 0 10px rgba(6, 182, 212, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Left Pointer:</span>
              <strong style={{ color: '#06b6d4', fontSize: '0.9rem' }}>{left !== -1 ? left : 'N/A'}</strong>
            </div>

            <div 
              className="eq-var" 
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 9) ? '1.5px solid #fbbf24' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 9) ? 'rgba(251, 191, 36, 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 9) ? '0 0 10px rgba(251, 191, 36, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Midpoint Index:</span>
              <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>{mid !== -1 ? mid : 'N/A'}</strong>
            </div>

            <div 
              className="eq-var" 
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 6 || currentStep.highlightedLine === 19 || currentStep.highlightedLine === 30) ? '1.5px solid #f43f5e' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 6 || currentStep.highlightedLine === 19 || currentStep.highlightedLine === 30) ? 'rgba(244, 63, 94, 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 6 || currentStep.highlightedLine === 19 || currentStep.highlightedLine === 30) ? '0 0 10px rgba(244, 63, 94, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Right Pointer:</span>
              <strong style={{ color: '#f43f5e', fontSize: '0.9rem' }}>{right !== -1 ? right : 'N/A'}</strong>
            </div>

            <div 
              className="eq-var" 
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: '1.5px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Target seeking:</span>
              <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>{target}</strong>
            </div>

          </div>
        </div>

        {/* Narrative Step Log Description */}
        <div className="explanation-box" style={{ margin: 0, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1rem' }}>💬</span>
            <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--theme-text-secondary)' }}>Narrative Log</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.45, color: 'var(--theme-text-primary)' }}>
            {currentStep.message}
          </p>
        </div>

        {/* Playback Control Panel */}
        <div className="control-panel">
          <div className="playback-controls">
            <button className="control-btn" onClick={reset} title="Reset Trace (R)">
              ⏮
            </button>
            <button className="control-btn" onClick={stepBackward} title="Step Back (Left Arrow)">
              ◀
            </button>
            <button 
              className="control-btn play-btn" 
              onClick={() => setIsPlaying(!isPlaying)}
              title="Play/Pause (Space)"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="control-btn" onClick={stepForward} title="Step Forward (Right Arrow)">
              ▶
            </button>
            <button 
              className="control-btn" 
              onClick={() => { setIsPlaying(false); setCurrentStepIndex(steps.length - 1); }} 
              title="Skip to End"
            >
              ⏭
            </button>
          </div>

          <div className="speed-control">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>Speed</span>
            <select className="speed-select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={2000}>Slow (2.0s)</option>
              <option value={1200}>Normal (1.2s)</option>
              <option value={600}>Fast (0.6s)</option>
              <option value={300}>Hyper (0.3s)</option>
            </select>
          </div>

          <div className="dataset-controls">
            <select
              className="dataset-select"
              onChange={(e) => handlePresetChange(Number(e.target.value))}
              defaultValue={0}
            >
              {PRESETS.map((p, idx) => (
                <option key={idx} value={idx}>{p.name}</option>
              ))}
            </select>
            <button className="random-btn" onClick={generateRandom}>Randomize 🎲</button>
          </div>
        </div>

        {/* Custom Sandbox Problem Input */}
        <div className="control-panel" style={{ padding: '0.75rem 1rem' }}>
          <form
            onSubmit={handleCustomSubmit}
            className="custom-input-box"
            style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', display: 'flex' }}
          >
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
              📏 Custom Problem:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>Array:</span>
              <input
                type="text"
                className="custom-input-field"
                style={{ width: '130px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#fff', fontFamily: 'monospace' }}
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                placeholder="4, 5, 6, 7, 0, 1, 2"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', marginLeft: '0.25rem' }}>Target:</span>
              <input
                type="number"
                className="custom-input-field"
                style={{ width: '60px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#fff', textAlign: 'center' }}
                value={customTargetInput}
                onChange={(e) => setCustomTargetInput(e.target.value)}
                placeholder="0"
              />
              <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem', marginLeft: '0.25rem' }}>
                Search Array →
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
