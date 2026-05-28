import React from 'react';

interface ChampionArraysProps {
  numsA: number[];
  numsB: number[];
  cutA: number;
  cutB: number;
  status: 'evaluating' | 'invalid-heavy-top' | 'invalid-heavy-bottom' | 'perfect-cut';
  low: number;
  high: number;
  highlightedLine: number;
}

export const ChampionArrays: React.FC<ChampionArraysProps> = ({
  numsA,
  numsB,
  cutA,
  cutB,
  status,
  low,
  high,
  highlightedLine,
}) => {
  // Create visual arrays with virtual -Infinity and Infinity boundaries prepended/appended
  const visualA = [-Infinity, ...numsA, Infinity];
  const visualB = [-Infinity, ...numsB, Infinity];

  // Helper to find absolute max value to scale the bars correctly
  const allNums = [...numsA, ...numsB].filter((x) => isFinite(x));
  const maxVal = allNums.length > 0 ? Math.max(...allNums.map(Math.abs), 1) : 1;

  // Determine visibility states based on the highlighted execution line
  const showLabelM = highlightedLine >= 6 || status === 'perfect-cut';
  const showLabelN = highlightedLine >= 7 || status === 'perfect-cut';
  const showLowHigh = highlightedLine >= 7 || status === 'perfect-cut';
  const showCutA = highlightedLine >= 10 || status === 'perfect-cut';
  const showCutB = highlightedLine >= 11 || status === 'perfect-cut';
  const showMaxLeftA = highlightedLine >= 13 || status === 'perfect-cut';
  const showMinRightA = highlightedLine >= 14 || status === 'perfect-cut';
  const showMaxLeftB = highlightedLine >= 15 || status === 'perfect-cut';
  const showMinRightB = highlightedLine >= 16 || status === 'perfect-cut';

  // Helper to check if a node in Row A is a champion and show its badge
  const checkChampionA = (idx: number) => {
    const isMaxLeft = idx === cutA && showMaxLeftA;
    const isMinRight = idx === cutA + 1 && showMinRightA;
    return { isChamp: isMaxLeft || isMinRight, isLeft: isMaxLeft, isRight: isMinRight };
  };

  // Helper to check if a node in Row B is a champion and show its badge
  const checkChampionB = (idx: number) => {
    const isMaxLeft = idx === cutB && showMaxLeftB;
    const isMinRight = idx === cutB + 1 && showMinRightB;
    return { isChamp: isMaxLeft || isMinRight, isLeft: isMaxLeft, isRight: isMinRight };
  };

  // Dynamic classes for styling clashing nodes with physical shaking
  const getShakeClass = (isRowA: boolean, isLeft: boolean) => {
    if (status === 'invalid-heavy-top' && isRowA && isLeft) return ' error-shake';
    if (status === 'invalid-heavy-top' && !isRowA && !isLeft) return ' error-shake';
    if (status === 'invalid-heavy-bottom' && !isRowA && isLeft) return ' error-shake';
    if (status === 'invalid-heavy-bottom' && isRowA && !isLeft) return ' error-shake';
    return '';
  };

  return (
    <div className="median-arrays-stack" style={{ gap: '4.5rem' }}>
      {/* ROW A (TOP ARRAY) */}
      <div className="median-row-wrapper" style={{ minHeight: '175px' }}>
        <div className="median-row-label">
          {showLabelM ? `Array A (m = ${numsA.length})` : 'Array A'}
        </div>
        <div className="median-array-container" style={{ borderBottom: '1px dashed #ffffff14', paddingBottom: '1.25rem' }}>
          {visualA.map((val, idx) => {
            const { isChamp, isLeft, isRight } = checkChampionA(idx);
            // Champion elements should glow only when actively highlighted as champion
            const isDimmed = status !== 'perfect-cut' && !isChamp;

            let nodeClass = 'median-item-node';
            if (isDimmed) nodeClass += ' dimmed';
            if (isChamp) {
              nodeClass += ' champion';
              nodeClass += isLeft ? ' left-champ' : ' right-champ';
              nodeClass += getShakeClass(true, isLeft);
            }
            if (val === -Infinity || val === Infinity) nodeClass += ' infinity-node';

            // Assign unique ID to champion nodes for Laser overlays calculations
            const elementId = isLeft ? 'champ-maxLeftA' : isRight ? 'champ-minRightA' : undefined;

            const isInfinite = val === -Infinity || val === Infinity;
            const barHeight = isInfinite
              ? 50
              : Math.max(50, Math.floor((Math.abs(val) / maxVal) * 110));

            return (
              <div
                key={idx}
                className="median-item-wrapper"
                style={{
                  width: '48px',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'relative',
                }}
              >
                <div
                  id={elementId}
                  className={nodeClass}
                  style={{
                    height: `${barHeight}px`,
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: !isInfinite && val < 0 ? '3px solid var(--theme-highlight)' : undefined,
                  }}
                >
                  <span className="median-value" style={{ zIndex: 2 }}>
                    {val === -Infinity ? '-∞' : val === Infinity ? '∞' : val}
                  </span>
                </div>

                {/* Index label under the element */}
                <span
                  className="median-index"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--theme-text-muted)',
                    marginTop: '0.4rem',
                    fontSize: '0.75rem',
                    height: '18px',
                    lineHeight: '18px',
                    visibility: isInfinite ? 'hidden' : 'visible',
                  }}
                >
                  {idx - 1}
                </span>

                {/* Champion, Low, and High Pointer Badges */}
                <div
                  className="pointer-labels"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    position: 'absolute',
                    bottom: '-1.45rem',
                    width: '100%',
                    zIndex: 25,
                  }}
                >
                  {isChamp && (
                    isLeft ? (
                      <span className="pointer-badge left" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', whiteSpace: 'nowrap' }}>
                        maxLeftA
                      </span>
                    ) : (
                      <span className="pointer-badge right" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', backgroundColor: 'var(--theme-accent-secondary)', whiteSpace: 'nowrap' }}>
                        minRightA
                      </span>
                    )
                  )}

                  {/* Binary Search low boundary badge under index low */}
                  {showLowHigh && !isInfinite && (idx - 1) === low && (
                    <span className="pointer-badge i" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', backgroundColor: '#06b6d4', boxShadow: '0 0 8px rgba(6,182,212,0.4)', marginTop: isChamp ? '2px' : '0px', whiteSpace: 'nowrap' }}>
                      low
                    </span>
                  )}

                  {/* Binary Search high boundary badge under index high (capped at last element) */}
                  {showLowHigh && !isInfinite && (idx - 1) === Math.min(high, numsA.length - 1) && (
                    <span className="pointer-badge right" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', backgroundColor: '#eab308', boxShadow: '0 0 8px rgba(234,179,8,0.4)', marginTop: isChamp ? '2px' : '0px', whiteSpace: 'nowrap' }}>
                      high
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Vertical Partition Border Wall with cutA label tag */}
          {showCutA && (
            <div
              className="median-border-wall"
              style={{
                left: `${16 + (cutA + 1) * (48 + 12) - 2}px`, // Align wall exactly on the left boundary of the cell labeled cutA (directly above index cutA)
                bottom: '24px',
                overflow: 'visible',
              }}
            >
              <div
                className="pulse-border-wall-label"
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #fbbf24, #ef4444)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.625rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 10px rgba(251,191,36,0.6)',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 40,
                }}
              >
                cutA = {cutA}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROW B (BOTTOM ARRAY) */}
      <div className="median-row-wrapper" style={{ minHeight: '175px' }}>
        <div className="median-row-label">
          {showLabelN ? `Array B (n = ${numsB.length})` : 'Array B'}
        </div>
        <div className="median-array-container" style={{ borderBottom: '1px dashed #ffffff14', paddingBottom: '1.25rem' }}>
          {visualB.map((val, idx) => {
            const { isChamp, isLeft, isRight } = checkChampionB(idx);
            const isDimmed = status !== 'perfect-cut' && !isChamp;

            let nodeClass = 'median-item-node';
            if (isDimmed) nodeClass += ' dimmed';
            if (isChamp) {
              nodeClass += ' champion';
              nodeClass += isLeft ? ' left-champ' : ' right-champ';
              nodeClass += getShakeClass(false, isLeft);
            }
            if (val === -Infinity || val === Infinity) nodeClass += ' infinity-node';

            const elementId = isLeft ? 'champ-maxLeftB' : isRight ? 'champ-minRightB' : undefined;

            const isInfinite = val === -Infinity || val === Infinity;
            const barHeight = isInfinite
              ? 50
              : Math.max(50, Math.floor((Math.abs(val) / maxVal) * 110));

            return (
              <div
                key={idx}
                className="median-item-wrapper"
                style={{
                  width: '48px',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'relative',
                }}
              >
                <div
                  id={elementId}
                  className={nodeClass}
                  style={{
                    height: `${barHeight}px`,
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: !isInfinite && val < 0 ? '3px solid var(--theme-highlight)' : undefined,
                  }}
                >
                  <span className="median-value" style={{ zIndex: 2 }}>
                    {val === -Infinity ? '-∞' : val === Infinity ? '∞' : val}
                  </span>
                </div>

                {/* Index label under the element — centered, same as Row A */}
                <span
                  className="median-index"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--theme-text-muted)',
                    marginTop: '0.4rem',
                    fontSize: '0.75rem',
                    height: '18px',
                    lineHeight: '18px',
                    visibility: isInfinite ? 'hidden' : 'visible',
                  }}
                >
                  {idx - 1}
                </span>

                {/* Champion Pointer Badges */}
                <div
                  className="pointer-labels"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    position: 'absolute',
                    bottom: '-1.45rem',
                    width: '100%',
                    zIndex: 25,
                  }}
                >
                  {isChamp && (
                    isLeft ? (
                      <span className="pointer-badge left" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', whiteSpace: 'nowrap' }}>
                        maxLeftB
                      </span>
                    ) : (
                      <span className="pointer-badge right" style={{ fontSize: '0.525rem', padding: '0.1rem 0.25rem', backgroundColor: 'var(--theme-accent-secondary)', whiteSpace: 'nowrap' }}>
                        minRightB
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}

          {/* Vertical Partition Border Wall with cutB label tag */}
          {showCutB && (
            <div
              className="median-border-wall"
              style={{
                left: `${16 + (cutB + 1) * (48 + 12) - 2}px`, // Align wall exactly on the left boundary of the cell labeled cutB
                bottom: '24px',
                overflow: 'visible',
              }}
            >
              <div
                className="pulse-border-wall-label"
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #fbbf24, #ef4444)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.625rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 10px rgba(251,191,36,0.6)',
                  fontFamily: 'var(--font-mono)',
                  zIndex: 40,
                }}
              >
                cutB = {cutB}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
