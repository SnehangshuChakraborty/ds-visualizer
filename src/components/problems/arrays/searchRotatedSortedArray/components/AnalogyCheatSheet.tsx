import React, { useState } from 'react';

interface AnalogyCheatSheetProps {
  accordionOpen: boolean;
  setAccordionOpen: (open: boolean) => void;
}

export const AnalogyCheatSheet: React.FC<AnalogyCheatSheetProps> = ({
  accordionOpen,
  setAccordionOpen,
}) => {
  const [revealLevel, setRevealLevel] = useState(0); // 0 = skeleton, 1 = hints, 2 = full code
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});

  const quizQuestions = [
    {
      q: 'After computing mid, the first thing we check is:',
      options: ['Which half is sorted', 'If nums[mid] == target', 'If left < right'],
      correct: 1,
      explanation: 'Always check if you found the target first! Only then determine sorted halves.'
    },
    {
      q: 'In the left-sorted branch, the target scope check uses:',
      options: ['nums[left] < target && target < nums[mid]', 'nums[left] <= target && target < nums[mid]', 'nums[left] <= target && target <= nums[mid]'],
      correct: 1,
      explanation: 'Left endpoint inclusive (≤), mid exclusive (<) because mid was already checked and didn\'t match.'
    },
    {
      q: 'If target is NOT in the sorted half, you should:',
      options: ['Return -1', 'Search the other (unsorted) half', 'Restart the search'],
      correct: 1,
      explanation: 'Binary elimination — if it\'s not in the sorted half, it must be in the other half (if it exists at all).'
    }
  ];

  return (
    <section 
      className="analogy-cheat-sheet" 
      style={{ 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.01)', 
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        borderRadius: '16px', 
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header clickable toggle */}
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: 'none',
          borderBottom: accordionOpen ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: 'var(--theme-text-primary)',
          textAlign: 'left',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🧠</span>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px' }}>
            Code Reconstruction Blueprint & Memory Aid
          </span>
        </div>
        <span style={{ transform: accordionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', fontSize: '0.75rem' }}>
          ▼
        </span>
      </button>

      {/* Accordion Content Panel */}
      {accordionOpen && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'slide-down 0.3s ease-out' }}>
          
          {/* ========== SECTION 1: Code Skeleton Blueprint ========== */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>🏗️</span>
                <strong style={{ fontSize: '0.82rem', color: 'var(--theme-text-primary)' }}>
                  Algorithm Skeleton — 6 Blocks to Remember
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[0, 1, 2].map(level => (
                  <button 
                    key={level}
                    onClick={() => setRevealLevel(level)}
                    style={{
                      padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                      fontSize: '0.6rem', fontWeight: 700, fontFamily: 'inherit',
                      background: revealLevel === level ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)',
                      border: revealLevel === level ? '1.5px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
                      color: revealLevel === level ? '#c4b5fd' : 'var(--theme-text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {level === 0 ? 'Skeleton' : level === 1 ? 'Hints' : 'Full Code'}
                  </button>
                ))}
              </div>
            </div>

            {/* The 6 blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              
              {/* Block 1: Guard */}
              <div style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 1</span>
                  <span style={{ fontSize: '0.62rem', color: '#fca5a5', fontWeight: 600 }}>🛡️ Guard Clause</span>
                </div>
                <code style={{ color: 'var(--theme-text-secondary)' }}>
                  if (nums == null || nums.length == 0) return -1;
                </code>
              </div>

              {/* Block 2: Pointers */}
              <div style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
                fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#06b6d4', background: 'rgba(6,182,212,0.15)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 2</span>
                  <span style={{ fontSize: '0.62rem', color: '#67e8f9', fontWeight: 600 }}>👈👉 Init Pointers</span>
                </div>
                <code style={{ color: 'var(--theme-text-secondary)' }}>
                  int left = 0, right = nums.length - 1;
                </code>
              </div>

              {/* Block 3: Loop + Mid + Match */}
              <div style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
                fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251,191,36,0.15)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 3</span>
                  <span style={{ fontSize: '0.62rem', color: '#fde68a', fontWeight: 600 }}>🔄 Loop + Mid + Match Check</span>
                </div>
                <code style={{ color: 'var(--theme-text-secondary)' }}>
                  {'while (left <= right) {'}<br />
                  {'  int mid = left + (right - left) / 2;'}<br />
                  {'  '}
                  <span style={{ color: revealLevel >= 1 ? '#fde68a' : 'var(--theme-text-muted)' }}>
                    {revealLevel >= 1 ? (
                      <span>if (nums[mid] == target) return mid; <span style={{ color: '#10b981', fontSize: '0.65rem' }}>← Don't forget this!</span></span>
                    ) : (
                      <span style={{ background: 'rgba(251,191,36,0.15)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #fbbf24' }}>
                        ??? check if found ???
                      </span>
                    )}
                  </span>
                </code>
              </div>

              {/* Block 4: Sorted Half Detection — THE HARD PART */}
              <div style={{
                padding: '0.6rem 0.75rem', borderRadius: '8px',
                background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.25)',
                fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.7,
                boxShadow: '0 0 12px rgba(139,92,246,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#8b5cf6', background: 'rgba(139,92,246,0.2)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 4</span>
                  <span style={{ fontSize: '0.62rem', color: '#c4b5fd', fontWeight: 600 }}>⚖️ Which Half is Sorted?</span>
                  <span style={{ fontSize: '0.55rem', color: '#f43f5e', fontWeight: 700, marginLeft: 'auto' }}>★ KEY DECISION</span>
                </div>
                <code style={{ color: 'var(--theme-text-secondary)' }}>
                  {'  '}
                  <span style={{ color: revealLevel >= 1 ? '#c4b5fd' : 'var(--theme-text-muted)' }}>
                    {revealLevel >= 1 ? (
                      <>if (nums[left] <span style={{ color: '#10b981', fontWeight: 800 }}>{'<='}</span> nums[mid]) {'{'}</>
                    ) : (
                      <span style={{ background: 'rgba(139,92,246,0.15)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #8b5cf6' }}>
                        if (nums[left] ??? nums[mid]) {'{'}
                      </span>
                    )}
                  </span>
                </code>
                {revealLevel >= 1 && (
                  <div style={{ fontSize: '0.6rem', color: '#a78bfa', marginTop: '0.15rem', marginLeft: '1rem', fontFamily: 'system-ui', fontStyle: 'italic' }}>
                    💡 Use ≤ (not {'<'}) because when left == mid, that single-element slice IS sorted
                  </div>
                )}
              </div>

              {/* Block 5: Target Scope Check — THE HARDEST PART */}
              <div style={{
                padding: '0.6rem 0.75rem', borderRadius: '8px',
                background: 'rgba(236,72,153,0.08)', border: '1.5px solid rgba(236,72,153,0.25)',
                fontFamily: 'monospace', fontSize: '0.7rem', lineHeight: 1.7,
                boxShadow: '0 0 12px rgba(236,72,153,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#ec4899', background: 'rgba(236,72,153,0.2)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 5</span>
                  <span style={{ fontSize: '0.62rem', color: '#f9a8d4', fontWeight: 600 }}>🎯 Is Target in the Sorted Half?</span>
                  <span style={{ fontSize: '0.55rem', color: '#f43f5e', fontWeight: 700, marginLeft: 'auto' }}>★★ HARDEST</span>
                </div>
                
                {/* Left sorted branch */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.58rem', color: '#06b6d4', fontWeight: 700, marginBottom: '0.15rem', fontFamily: 'system-ui' }}>
                    ↳ Inside left-sorted branch:
                  </div>
                  <code style={{ color: 'var(--theme-text-secondary)', display: 'block', paddingLeft: '0.5rem' }}>
                    {'    '}
                    <span style={{ color: revealLevel >= 2 ? '#f9a8d4' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? (
                        <>if (nums[left] <span style={{ color: '#10b981', fontWeight: 800 }}>{'<='}</span> target <span style={{ color: '#fbbf24', fontWeight: 800 }}>{'&&'}</span> target <span style={{ color: '#f43f5e', fontWeight: 800 }}>{'<'}</span> nums[mid]) {'{'}</>
                      ) : revealLevel >= 1 ? (
                        <span style={{ background: 'rgba(236,72,153,0.12)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #ec4899' }}>
                          if (nums[left] <span style={{ color: '#10b981' }}>≤</span> target && target <span style={{ color: '#f43f5e' }}>{'<'}</span> nums[mid]) {'{'}
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(236,72,153,0.12)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #ec4899' }}>
                          if (??? target in [L..M) ???) {'{'}
                        </span>
                      )}
                    </span><br />
                    {'      '}
                    <span style={{ color: revealLevel >= 2 ? '#67e8f9' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? 'right = mid - 1;' : revealLevel >= 1 ? 'right = mid - 1;  ← narrow TO sorted half' : '??? = mid - 1;'}
                    </span><br />
                    {'    '}{'}'}  else {'{'}<br />
                    {'      '}
                    <span style={{ color: revealLevel >= 2 ? '#67e8f9' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? 'left = mid + 1;' : revealLevel >= 1 ? 'left = mid + 1;   ← search OTHER half' : '??? = mid + 1;'}
                    </span><br />
                    {'    '}{'}'}
                  </code>
                </div>

                {/* Right sorted branch */}
                <div>
                  <div style={{ fontSize: '0.58rem', color: '#ec4899', fontWeight: 700, marginBottom: '0.15rem', fontFamily: 'system-ui' }}>
                    ↳ Inside right-sorted branch (else):
                  </div>
                  <code style={{ color: 'var(--theme-text-secondary)', display: 'block', paddingLeft: '0.5rem' }}>
                    {'    '}
                    <span style={{ color: revealLevel >= 2 ? '#f9a8d4' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? (
                        <>if (nums[mid] <span style={{ color: '#f43f5e', fontWeight: 800 }}>{'<'}</span> target <span style={{ color: '#fbbf24', fontWeight: 800 }}>{'&&'}</span> target <span style={{ color: '#10b981', fontWeight: 800 }}>{'<='}</span> nums[right]) {'{'}</>
                      ) : revealLevel >= 1 ? (
                        <span style={{ background: 'rgba(236,72,153,0.12)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #ec4899' }}>
                          if (nums[mid] <span style={{ color: '#f43f5e' }}>{'<'}</span> target && target <span style={{ color: '#10b981' }}>≤</span> nums[right]) {'{'}
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(236,72,153,0.12)', padding: '0 4px', borderRadius: '3px', borderBottom: '2px dashed #ec4899' }}>
                          if (??? target in (M..R] ???) {'{'}
                        </span>
                      )}
                    </span><br />
                    {'      '}
                    <span style={{ color: revealLevel >= 2 ? '#67e8f9' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? 'left = mid + 1;' : revealLevel >= 1 ? 'left = mid + 1;   ← narrow TO sorted half' : '??? = mid + 1;'}
                    </span><br />
                    {'    '}{'}'}  else {'{'}<br />
                    {'      '}
                    <span style={{ color: revealLevel >= 2 ? '#67e8f9' : 'var(--theme-text-muted)' }}>
                      {revealLevel >= 2 ? 'right = mid - 1;' : revealLevel >= 1 ? 'right = mid - 1;  ← search OTHER half' : '??? = mid - 1;'}
                    </span><br />
                    {'    '}{'}'}
                  </code>
                </div>

                {/* Operator pattern box */}
                {revealLevel >= 1 && (
                  <div style={{
                    marginTop: '0.5rem', padding: '0.4rem 0.6rem', borderRadius: '6px',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.62rem', lineHeight: 1.6, fontFamily: 'system-ui'
                  }}>
                    <strong style={{ color: '#f9a8d4' }}>🔑 Operator Pattern to Remember:</strong><br />
                    <span style={{ color: 'var(--theme-text-secondary)' }}>
                      • <strong style={{ color: '#10b981' }}>≤</strong> on the <em>endpoint side</em> (left for left-sorted, right for right-sorted)<br />
                      • <strong style={{ color: '#f43f5e' }}>{'<'}</strong> (strict) on the <em>mid side</em> — because <code>mid</code> was already checked and didn't match<br />
                      • Mirror pattern: left branch = <code>[L ≤ t {'<'} M]</code>, right branch = <code>[M {'<'} t ≤ R]</code>
                    </span>
                  </div>
                )}
              </div>

              {/* Block 6: Return -1 */}
              <div style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px',
                background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(107,114,128,0.15)',
                fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#9ca3af', background: 'rgba(107,114,128,0.15)', padding: '1px 5px', borderRadius: '4px' }}>BLOCK 6</span>
                  <span style={{ fontSize: '0.62rem', color: '#d1d5db', fontWeight: 600 }}>❌ Not Found</span>
                </div>
                <code style={{ color: 'var(--theme-text-secondary)' }}>
                  return -1;
                </code>
              </div>
            </div>
          </div>

          {/* ========== SECTION 2: Recall Checkpoint Quiz ========== */}
          <div style={{
            padding: '0.85rem 1rem', borderRadius: '12px',
            background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '1rem' }}>🧪</span>
              <strong style={{ fontSize: '0.82rem', color: '#fde68a' }}>Recall Checkpoint — Test Yourself</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {quizQuestions.map((qq, qi) => (
                <div key={qi} style={{
                  padding: '0.5rem 0.65rem', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--theme-text-primary)', marginBottom: '0.35rem' }}>
                    Q{qi + 1}: {qq.q}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {qq.options.map((opt, oi) => {
                      const isSelected = quizAnswers[qi] === oi;
                      const isRevealed = quizAnswers[qi] !== undefined && quizAnswers[qi] !== null;
                      const isCorrect = oi === qq.correct;
                      
                      let optBg = 'rgba(255,255,255,0.02)';
                      let optBorder = '1px solid rgba(255,255,255,0.06)';
                      let optColor = 'var(--theme-text-secondary)';
                      
                      if (isRevealed && isCorrect) {
                        optBg = 'rgba(16,185,129,0.12)';
                        optBorder = '1.5px solid rgba(16,185,129,0.4)';
                        optColor = '#6ee7b7';
                      } else if (isRevealed && isSelected && !isCorrect) {
                        optBg = 'rgba(244,63,94,0.12)';
                        optBorder = '1.5px solid rgba(244,63,94,0.4)';
                        optColor = '#fca5a5';
                      }

                      return (
                        <button
                          key={oi}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                          disabled={isRevealed}
                          style={{
                            padding: '0.3rem 0.5rem', borderRadius: '6px',
                            background: optBg, border: optBorder,
                            cursor: isRevealed ? 'default' : 'pointer',
                            fontSize: '0.65rem', fontFamily: 'monospace',
                            color: optColor, textAlign: 'left',
                            transition: 'all 0.2s ease',
                            opacity: isRevealed && !isCorrect && !isSelected ? 0.4 : 1
                          }}
                        >
                          {isRevealed && isCorrect ? '✓ ' : isRevealed && isSelected && !isCorrect ? '✗ ' : ''}{opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswers[qi] !== undefined && quizAnswers[qi] !== null && (
                    <div style={{
                      marginTop: '0.3rem', fontSize: '0.62rem', fontStyle: 'italic',
                      color: quizAnswers[qi] === qq.correct ? '#6ee7b7' : '#fca5a5',
                      lineHeight: 1.4
                    }}>
                      {quizAnswers[qi] === qq.correct ? '✅ ' : '💡 '}{qq.explanation}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Reset quiz button */}
              {Object.keys(quizAnswers).length > 0 && (
                <button
                  onClick={() => setQuizAnswers({})}
                  style={{
                    padding: '0.3rem 0.6rem', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer', fontSize: '0.62rem', fontFamily: 'inherit',
                    color: 'var(--theme-text-muted)', alignSelf: 'flex-end',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🔄 Reset Quiz
                </button>
              )}
            </div>
          </div>

          {/* ========== SECTION 3: Original Fractured Tape Measure Analogy ========== */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '1rem' }}>💡</span>
              <strong style={{ fontSize: '0.82rem', color: 'var(--theme-text-primary)' }}>
                Conceptual Mnemonic: The Fractured Tape Measure
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '2rem', padding: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                📏
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--theme-text-primary)' }}>Why Rotated Search is Still O(log N)</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--theme-text-secondary)', lineHeight: 1.45 }}>
                  Imagine a standard tape measure showing numbers from 1 to 10. If you slice it at some index and shift the pieces (e.g. 5,6,7,8,9,10,1,2,3,4), you break the global sort order. However, <strong>no matter where you choose to cut it in half, at least one of the two pieces will always remain perfectly sorted and contiguous!</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.1)', padding: '0.85rem 1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>🧭</span>
                  <strong style={{ fontSize: '0.78rem', color: '#06b6d4' }}>Step 1: Find the Sorted Half</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.4 }}>
                  We inspect `nums[left]` and `nums[mid]`. If the left boundary is less than or equal to mid, the left half is clean. Otherwise, the right half is sorted. One half is guaranteed to be clean!
                </p>
              </div>

              <div style={{ background: 'rgba(236, 72, 153, 0.03)', border: '1px solid rgba(236, 72, 153, 0.1)', padding: '0.85rem 1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>🎯</span>
                  <strong style={{ fontSize: '0.78rem', color: '#ec4899' }}>Step 2: Check Scope & Jump</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.4 }}>
                  Once we locate the clean sorted half, we query if our target lies within its bounds. If it does, we discard the other half. If it doesn't, we jump into the other half!
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.7rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--theme-text-primary)' }}>💡 Memory Anchor:</span> In binary search on rotated arrays, you can never get lost as long as you <strong>always anchor to the sorted segment</strong> first before checking if the target lies in its range.
          </div>

        </div>
      )}
    </section>
  );
};
