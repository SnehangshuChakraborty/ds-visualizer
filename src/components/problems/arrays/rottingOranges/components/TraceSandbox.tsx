import React from 'react';
import type { RottingOrangesStep } from '../../../../../types';
import { PRESETS } from '../constants/rottingOrangesData';

interface TraceSandboxProps {
  steps: RottingOrangesStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  reset: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  handlePresetChange: (index: number) => void;
  generateRandom: () => void;
  toggleGridCell: (r: number, c: number) => void;
  isCustomGridMode: boolean;
}

export const TraceSandbox: React.FC<TraceSandboxProps> = ({
  steps,
  currentStepIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  reset,
  stepBackward,
  stepForward,
  handlePresetChange,
  generateRandom,
  toggleGridCell,
  isCustomGridMode
}) => {
  const [is3DGrid, setIs3DGrid] = React.useState(true);

  const currentStep = steps[currentStepIndex] || {
    grid: [],
    queue: [],
    freshOranges: 0,
    minutes: 0,
    highlightedLine: 5,
    activePoint: null,
    activeNeighbors: [],
    rottedInThisRound: false,
    status: 'init',
    message: 'Loading...',
  };

  const grid = currentStep.grid;
  const numRows = grid.length;
  const numCols = numRows > 0 ? grid[0].length : 0;

  // Active checking highlights
  const activeR = currentStep.activePoint ? currentStep.activePoint[0] : -1;
  const activeC = currentStep.activePoint ? currentStep.activePoint[1] : -1;

  const isScanningNeighbor = (r: number, c: number) => {
    return currentStep.activeNeighbors.some(n => n[0] === r && n[1] === c);
  };

  // Dynamically compute active scanning direction offset
  let activeDirR = 0;
  let activeDirC = 0;
  if (currentStep.activePoint && currentStep.activeNeighbors && currentStep.activeNeighbors.length > 0) {
    activeDirR = currentStep.activeNeighbors[0][0] - currentStep.activePoint[0];
    activeDirC = currentStep.activeNeighbors[0][1] - currentStep.activePoint[1];
  }

  // Helper to dynamically calculate pictorial badges showing exactly how current java code line influences grid
  const getCellLabel = (rIdx: number, cIdx: number): { text: string; bg: string; color: string; animation?: string } | null => {
    const line = currentStep.highlightedLine;
    const isThisActive = rIdx === activeR && cIdx === activeC;
    const isThisNeighbor = isScanningNeighbor(rIdx, cIdx);
    
    // Intersection scanner cell
    const isThisCellScanning = (currentStep.highlightedLine === 15 || currentStep.highlightedLine === 16 || currentStep.highlightedLine === 17 || currentStep.highlightedLine === 19) 
      && cIdx === currentStep.activeCol && rIdx === currentStep.activeRow;

    // 1. Initial scanning loop badges (Lines 14-21)
    if (isThisCellScanning) {
      if (line === 15) return { text: `grid[${rIdx}][${cIdx}]`, bg: 'rgba(6, 182, 212, 0.95)', color: '#fff' };
      if (line === 16) return { text: `🔍 CHECK: grid[${rIdx}][${cIdx}] == 2?`, bg: 'rgba(168, 85, 247, 0.95)', color: '#fff', animation: 'scanning-cell-pulse 1.2s infinite ease-in-out' };
      if (line === 17) return { text: '☣️ SEED ENQUEUED', bg: 'linear-gradient(135deg, #ff8c00, #ff4500)', color: '#fff' };
      if (line === 19) return { text: '🍊 FRESH COUNT +1', bg: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff' };
      return { text: `grid[${rIdx}][${cIdx}]`, bg: 'var(--theme-accent)', color: '#fff' };
    }

    // 2. BFS pop steps badges (Lines 37-39)
    if (isThisActive) {
      if (line === 37) return { text: '📤 POLL ZOMBIE', bg: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#000', animation: 'scanning-cell-pulse 1.2s infinite ease-in-out' };
      if (line === 38) return { text: `📐 activeRow r = ${rIdx}`, bg: '#fbbf24', color: '#000' };
      if (line === 39) return { text: `📐 activeCol c = ${cIdx}`, bg: '#fbbf24', color: '#000' };
      return { text: 'Polled', bg: '#fbbf24', color: '#000' };
    }

    // 3. BFS neighbor spread steps badges (Lines 41-50)
    if (isThisNeighbor) {
      if (line === 41) return { text: '🧭 TARGET OFFSET', bg: 'rgba(6, 182, 212, 0.9)', color: '#fff' };
      if (line === 42) return { text: `📐 nextR = r + dir[0] = ${rIdx}`, bg: 'rgba(6, 182, 212, 0.9)', color: '#fff' };
      if (line === 43) return { text: `📐 nextC = c + dir[1] = ${cIdx}`, bg: 'rgba(6, 182, 212, 0.9)', color: '#fff' };
      if (line === 46) return { text: '🔍 IN-BOUNDS & FRESH?', bg: 'rgba(168, 85, 247, 0.95)', color: '#fff', animation: 'scanning-cell-pulse 1.2s infinite ease-in-out' };
      if (line === 47) return { text: '☣️ ROT (grid = 2)', bg: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', animation: 'toxic-glow-pulse 1.8s infinite ease-in-out' };
      if (line === 48) return { text: '📥 ENQUEUED WAVEROT', bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff' };
      if (line === 49) return { text: '📉 FRESH COUNT -1', bg: 'linear-gradient(135deg, #ff8c00, #ff4500)', color: '#fff' };
      if (line === 50) return { text: '✔️ WaveRotated = true', bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' };
      return { text: 'Scan', bg: 'var(--theme-accent)', color: '#000' };
    }

    return null;
  };

  return (
    <section className="visualizer-workspace">
      <div className="simulation-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="panel-title" style={{ margin: 0 }}>☣️ Zombie Decay Orange Grid</h2>
            <button 
              className="random-btn" 
              onClick={() => setIs3DGrid(prev => !prev)}
              style={{ 
                fontSize: '0.65rem', 
                padding: '0.2rem 0.55rem', 
                borderRadius: '6px', 
                background: is3DGrid ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)', 
                borderColor: is3DGrid ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                color: is3DGrid ? '#06b6d4' : 'var(--theme-text-muted)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {is3DGrid ? '📐 3D Radar' : '⬜ 2D Grid'}
            </button>
          </div>
          <div className="step-counter">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Active Grid Sandbox Matrix */}
        <div className="orange-grid-outer-wrapper" style={{ position: 'relative', width: '100%' }}>
          {isCustomGridMode && (
            <div className="custom-mode-tip animate-pop" style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(251,191,36,0.08)', padding: '0.35rem 0.75rem', borderRadius: '6px', textAlign: 'center', marginBottom: '0.5rem', border: '1px solid rgba(251,191,36,0.2)', width: '100%', maxWidth: '360px', margin: '0 auto 0.5rem auto' }}>
              ✏️ <strong>Sandbox Mode:</strong> Click any cell to cycle values: 🕳️ Empty ➡️ 🍊 Fresh ➡️ ☣️ Rotten. (Resets steps)
            </div>
          )}

          <div 
            className="orange-grid-container" 
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${numRows}, 1fr)`,
              gridTemplateColumns: `repeat(${numCols}, 1fr)`,
              gap: '12px',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '16px',
              border: (currentStep.highlightedLine === 8 || currentStep.highlightedLine === 9)
                ? '2px solid #fbbf24'
                : '1px solid rgba(255,255,255,0.05)',
              boxShadow: currentStep.highlightedLine === 8 
                ? '0 0 25px rgba(251, 191, 36, 0.35)' 
                : currentStep.highlightedLine === 9
                  ? '0 0 25px rgba(6, 182, 212, 0.35)'
                  : '0 20px 40px rgba(0,0,0,0.5)',
              maxWidth: '360px',
              width: '100%',
              margin: '0 auto',
              aspectRatio: numCols > 0 ? `${numCols}/${numRows}` : '1',
              position: 'relative',
              transform: is3DGrid 
                ? 'perspective(1000px) rotateX(18deg) rotateY(0deg) scale(0.96)' 
                : 'perspective(none) rotateX(0deg) scale(1)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            {/* SVG Laser Beam Connectors Overlay inside preserve-3d grid container */}
            {currentStep.activePoint && currentStep.activeNeighbors && currentStep.activeNeighbors.length > 0 && (
              <svg 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  pointerEvents: 'none', 
                  zIndex: 2,
                  transform: 'translateZ(6px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {currentStep.activeNeighbors.map((n, idx) => {
                  const neighborR = n[0];
                  const neighborC = n[1];
                  
                  if (neighborR < 0 || neighborR >= numRows || neighborC < 0 || neighborC >= numCols) return null;
                  
                  const x1 = `${((activeC + 0.5) / numCols) * 100}%`;
                  const y1 = `${((activeR + 0.5) / numRows) * 100}%`;
                  const x2 = `${((neighborC + 0.5) / numCols) * 100}%`;
                  const y2 = `${((neighborR + 0.5) / numRows) * 100}%`;

                  return (
                    <g key={idx}>
                      <line 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="rgba(6, 182, 212, 0.4)" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        className="laser-glow-beam"
                      />
                      <line 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#06b6d4" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>
            )}
            {grid.map((row, rIdx) => 
              row.map((val, cIdx) => {
                const isActive = rIdx === activeR && cIdx === activeC;
                const isNeighbor = isScanningNeighbor(rIdx, cIdx);
                
                // Cross-hair scan grid sweeps
                const isRowScanning = currentStep.highlightedLine === 14 && rIdx === (currentStep.activeRow !== undefined ? currentStep.activeRow : -1);
                const isColScanning = (currentStep.highlightedLine === 15 || currentStep.highlightedLine === 16 || currentStep.highlightedLine === 17 || currentStep.highlightedLine === 19) && cIdx === (currentStep.activeCol !== undefined ? currentStep.activeCol : -1);
                const isCellScanning = isColScanning && rIdx === (currentStep.activeRow !== undefined ? currentStep.activeRow : -1);

                let cellClass = 'orange-cell';
                if (val === 0) cellClass += ' cell-empty';
                else if (val === 1) cellClass += ' cell-fresh';
                else if (val === 2) cellClass += ' cell-rotten animate-toxic-pulsing';
                else if (val === 3) cellClass += ' cell-newly-rotten animate-pop';

                if (isCellScanning) cellClass += ' cell-active-scanning';
                else if (isRowScanning) cellClass += ' cell-row-scanning';
                else if (isColScanning) cellClass += ' cell-col-scanning';

                if (isActive) cellClass += ' border-active-orange';
                if (isNeighbor) cellClass += ' border-scanning-neighbor';

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    className={cellClass}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: isCustomGridMode ? 'pointer' : 'default',
                      zIndex: isCellScanning ? 3 : (isRowScanning || isColScanning ? 2 : 1),
                      border: isActive 
                        ? '2.5px solid #fbbf24' 
                        : isNeighbor 
                          ? '2.5px dashed var(--theme-accent)' 
                          : (isCellScanning || isRowScanning || isColScanning)
                            ? undefined
                            : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isActive 
                        ? '0 0 14px rgba(251, 191, 36, 0.55)' 
                        : isNeighbor 
                          ? '0 0 10px var(--theme-accent)' 
                          : (isCellScanning || isRowScanning || isColScanning)
                            ? undefined
                            : 'none',
                      background: (isCellScanning || isRowScanning || isColScanning)
                        ? undefined
                        : undefined,
                      transform: (isCellScanning || isRowScanning || isColScanning)
                        ? undefined
                        : 'scale(1)',
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => toggleGridCell(rIdx, cIdx)}
                    title={`Orange at [${rIdx}, ${cIdx}]`}
                    disabled={!isCustomGridMode}
                  >
                    {/* Visual orange sphere rendering with 3D Pop translateZ */}
                    {val === 1 && (
                      <div className="orange-sphere fresh" style={{ width: '65%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ff8c00, #ff4500)', boxShadow: '0 4px 10px rgba(255, 69, 0, 0.4)', transform: is3DGrid ? 'translateZ(15px)' : 'none', transformStyle: 'preserve-3d' }} />
                    )}
                    {val === 2 && (
                      <div className="orange-sphere rotten" style={{ width: '65%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #556b2f, #1e3f20)', boxShadow: '0 4px 10px rgba(30, 63, 32, 0.6)', filter: 'hue-rotate(30deg) brightness(1.2)', transform: is3DGrid ? 'translateZ(15px)' : 'none', transformStyle: 'preserve-3d' }} />
                    )}
                    {val === 3 && (
                      <div className="orange-sphere newly-rotten" style={{ width: '65%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fbbf24, #10b981)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.6)', transform: is3DGrid ? 'translateZ(15px)' : 'none', transformStyle: 'preserve-3d' }} />
                    )}

                    {/* Coordinates Label */}
                    <span style={{ fontSize: '0.55rem', position: 'absolute', bottom: '2px', color: 'var(--theme-text-muted)', fontFamily: 'monospace' }}>
                      {rIdx},{cIdx}
                    </span>

                    {/* Interactive Pictorial Badges based on active execution line */}
                    {(() => {
                      const label = getCellLabel(rIdx, cIdx);
                      if (!label) return null;
                      return (
                        <span 
                          className="pointer-badge active-action-badge" 
                          style={{ 
                            position: 'absolute', 
                            top: '-16px', 
                            fontSize: '0.52rem', 
                            zIndex: 10, 
                            background: label.bg, 
                            color: label.color, 
                            padding: '2px 6px', 
                            borderRadius: '5px', 
                            fontWeight: 800,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 255, 255, 0.05)',
                            whiteSpace: 'nowrap',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            letterSpacing: '0.2px',
                            textTransform: 'uppercase',
                            animation: label.animation || 'none'
                          }}
                        >
                          {label.text}
                        </span>
                      );
                    })()}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* HUD 4-Directional Compass Widget */}
        {currentStep.activePoint && (currentStep.highlightedLine >= 41 && currentStep.highlightedLine <= 50) && (
          <div 
            className="hud-compass-container animate-pop" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1.5px solid #06b6d4', 
              borderRadius: '16px', 
              padding: '0.85rem 1.25rem', 
              margin: '0 auto',
              maxWidth: '360px',
              width: '100%',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)'
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--theme-text-muted)', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 700 }}>
              🧭 4-Directional Scan Radar (Line 41)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '150px', height: '150px', alignItems: 'center', justifyItems: 'center', position: 'relative' }}>
              
              {/* TOP Node (UP) */}
              <div />
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (activeDirR === -1 && activeDirC === 0) ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.02)',
                  border: (activeDirR === -1 && activeDirC === 0) ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: (activeDirR === -1 && activeDirC === 0) ? '0 0 12px rgba(6, 182, 212, 0.45)' : 'none',
                  color: (activeDirR === -1 && activeDirC === 0) ? '#06b6d4' : 'var(--theme-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease'
                }}
                title="UP: [-1, 0]"
              >
                U
              </div>
              <div />

              {/* LEFT, CENTER (Polled Seed), RIGHT */}
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (activeDirR === 0 && activeDirC === -1) ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.02)',
                  border: (activeDirR === 0 && activeDirC === -1) ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: (activeDirR === 0 && activeDirC === -1) ? '0 0 12px rgba(6, 182, 212, 0.45)' : 'none',
                  color: (activeDirR === 0 && activeDirC === -1) ? '#06b6d4' : 'var(--theme-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease'
                }}
                title="LEFT: [0, -1]"
              >
                L
              </div>
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 0 14px rgba(251, 191, 36, 0.35)',
                  color: '#fbbf24',
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  fontWeight: 800
                }}
                title={`Active Seed Cell [${activeR}, ${activeC}]`}
              >
                [{activeR},{activeC}]
              </div>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (activeDirR === 0 && activeDirC === 1) ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.02)',
                  border: (activeDirR === 0 && activeDirC === 1) ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: (activeDirR === 0 && activeDirC === 1) ? '0 0 12px rgba(6, 182, 212, 0.45)' : 'none',
                  color: (activeDirR === 0 && activeDirC === 1) ? '#06b6d4' : 'var(--theme-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease'
                }}
                title="RIGHT: [0, 1]"
              >
                R
              </div>

              {/* BOTTOM Node (DOWN) */}
              <div />
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (activeDirR === 1 && activeDirC === 0) ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.02)',
                  border: (activeDirR === 1 && activeDirC === 0) ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: (activeDirR === 1 && activeDirC === 0) ? '0 0 12px rgba(6, 182, 212, 0.45)' : 'none',
                  color: (activeDirR === 1 && activeDirC === 0) ? '#06b6d4' : 'var(--theme-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease'
                }}
                title="DOWN: [1, 0]"
              >
                D
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Trace Inspector Cards for Queue Unpacking & Equation Offsets */}
        {currentStep.highlightedLine === 29 && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #06b6d4', boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)', maxWidth: '400px' }}>
            <div className="inspector-title" style={{ color: '#06b6d4' }}>🧭 Setup Directions Matrix (Line 29)</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.45, marginBottom: '0.5rem' }}>
              We declare a <strong>2D array</strong> to store the coordinate offsets for 4-directional traversal (Up, Down, Left, Right):
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '0.5rem' }}>
              <code style={{ fontSize: '0.75rem', color: '#06b6d4', display: 'block', fontWeight: 600 }}>
                int[][] directions = &#123;
              </code>
              <code style={{ fontSize: '0.75rem', color: '#fbbf24', paddingLeft: '1.25rem', display: 'block' }}>
                &#123;-1, 0&#125;,  // Up (row - 1, col + 0)
              </code>
              <code style={{ fontSize: '0.75rem', color: '#fbbf24', paddingLeft: '1.25rem', display: 'block' }}>
                &#123;1, 0&#125;,   // Down (row + 1, col + 0)
              </code>
              <code style={{ fontSize: '0.75rem', color: '#fbbf24', paddingLeft: '1.25rem', display: 'block' }}>
                &#123;0, -1&#125;,  // Left (row + 0, col - 1)
              </code>
              <code style={{ fontSize: '0.75rem', color: '#fbbf24', paddingLeft: '1.25rem', display: 'block' }}>
                &#123;0, 1&#125;    // Right (row + 0, col + 1)
              </code>
              <code style={{ fontSize: '0.75rem', color: '#06b6d4', display: 'block', fontWeight: 600 }}>
                &#125;;
              </code>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)', lineHeight: 1.35 }}>
              💡 <em>Recall tip:</em> In a 2D grid, moving Up decreases row index (`-1`), moving Down increases row index (`+1`), Left decreases column (`-1`), and Right increases column (`+1`).
            </div>
          </div>
        )}

        {currentStep.activePoint && (currentStep.highlightedLine >= 37 && currentStep.highlightedLine <= 39) && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #fbbf24', boxShadow: '0 0 15px rgba(251, 191, 36, 0.25)' }}>
            <div className="inspector-title" style={{ color: '#fbbf24' }}>📥 Queue Element Unpacking (Line 37)</div>
            <div className="inspector-eq" style={{ marginBottom: '0.5rem' }}>
              <code>int[] point = queue.poll();</code> &rarr; <span className="highlight-tag">[{activeR}, {activeC}]</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', padding: '0.15rem 0.25rem' }}>
              <div className={currentStep.highlightedLine === 38 ? "text-active-var" : "text-muted"}>
                <code>int r = point[0];</code> &rarr; <strong>{activeR}</strong>
              </div>
              <div className={currentStep.highlightedLine === 39 ? "text-active-var" : "text-muted"}>
                <code>int c = point[1];</code> &rarr; <strong>{activeC}</strong>
              </div>
            </div>
          </div>
        )}

        {currentStep.activePoint && (currentStep.highlightedLine >= 41 && currentStep.highlightedLine <= 43) && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #06b6d4', boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)', maxWidth: '400px' }}>
            <div className="inspector-title" style={{ color: '#06b6d4' }}>🧭 Direction For-Loop Structure (Line 41)</div>
            
            {/* Enhanced For-Loop Breakdown */}
            <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '0.5rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#06b6d4', fontWeight: 700, marginBottom: '0.25rem' }}>Java Enhanced For-Loop Syntax</div>
              <code style={{ fontSize: '0.75rem', color: '#fff', display: 'block', padding: '0.2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                for (<span style={{ color: '#fbbf24', fontWeight: 600 }}>int[] dir</span> : <span style={{ color: '#06b6d4', fontWeight: 600 }}>directions</span>) &#123;
              </code>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--theme-text-secondary)', lineHeight: 1.35 }}>
                <span style={{ color: '#06b6d4', fontWeight: 600 }}>directions</span>
                <span>The 2D matrix of all 4 direction offsets (`int[][]`)</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>:</span>
                <span>Operator meaning <em>"for each element inside"</em></span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>dir</span>
                <span>The active 1D vector representing <code>[rowOffset, colOffset]</code> (`int[]`)</span>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.4, marginBottom: '0.4rem' }}>
              Active Iteration: <strong style={{ color: '#06b6d4' }}>{activeDirR === -1 ? 'UP' : activeDirR === 1 ? 'DOWN' : activeDirC === -1 ? 'LEFT' : 'RIGHT'} offset vector dir = [{activeDirR}, {activeDirC}]</strong>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <div className={currentStep.highlightedLine === 42 ? "text-active-var" : "text-muted"} style={{ fontSize: '0.72rem' }}>
                <code>int nextR = r + dir[0];</code><br />
                <code>nextR = {activeR} + ({activeDirR}) = </code> <strong style={{ color: '#06b6d4' }}>{activeR + activeDirR}</strong>
              </div>
              <div className={currentStep.highlightedLine === 43 ? "text-active-var" : "text-muted"} style={{ fontSize: '0.72rem' }}>
                <code>int nextC = c + dir[1];</code><br />
                <code>nextC = {activeC} + ({activeDirC}) = </code> <strong style={{ color: '#06b6d4' }}>{activeC + activeDirC}</strong>
              </div>
            </div>
          </div>
        )}

        {currentStep.activePoint && (currentStep.highlightedLine >= 46 && currentStep.highlightedLine <= 50) && (
          <div className="trace-inspector-card animate-pop" style={{ border: '1.5px solid #ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.35)', maxWidth: '420px', background: 'rgba(15, 5, 5, 0.85)', margin: '0 auto 0.5rem auto' }}>
            <div className="inspector-title" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚠️ BFS Weakspot Alert: Parent vs. Child
            </div>
            
            <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', lineHeight: 1.45, marginBottom: '0.6rem' }}>
              Notice how easily parent indices (popped cell) and child indices (neighbor offsets) get swapped in code. Review this comparison:
            </div>

            {/* Loop Comparison */}
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.45rem 0.6rem', borderRadius: '8px', marginBottom: '0.6rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.2rem' }}>1. Flow Control Statement</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.7rem' }}>
                <div>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Infinite Loop</span><br />
                  <code>while (nextR &gt;= 0 && ...)</code>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✔️ Correct Branch</span><br />
                  <code>if (nextR &gt;= 0 && ...)</code>
                </div>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)', marginTop: '0.25rem', lineHeight: 1.3 }}>
                💡 <em>Why:</em> A <code>while</code> loop will run infinitely since <code>nextR</code> never changes inside. BFS checks each neighbor exactly once using <code>if</code>.
              </div>
            </div>

            {/* Index Comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              
              {/* Check Condition */}
              <div style={{ fontSize: '0.7rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <div>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ grid[r][c] == 1</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Checks popped orange (already rotten)</span>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✔️ grid[nextR][nextC] == 1</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Checks neighbor (must be fresh)</span>
                </div>
              </div>

              {/* Grid Rotting */}
              <div style={{ fontSize: '0.7rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
                <div>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ grid[r][c] = 2;</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Rots parent orange again</span>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✔️ grid[nextR][nextC] = 2;</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Rots the fresh neighbor</span>
                </div>
              </div>

              {/* Queue Offer */}
              <div style={{ fontSize: '0.7rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ queue.offer(new int[]&#123;r, c&#125;)</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Re-enqueues parent (infinite loop)</span>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✔️ queue.offer(new int[]&#123;nextR, nextC&#125;)</span><br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--theme-text-muted)' }}>Enqueues neighbor to spread next round</span>
                </div>
              </div>

            </div>

            {/* Current Active Variables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', marginTop: '0.5rem', fontSize: '0.68rem' }}>
              <div>
                <span style={{ color: '#fbbf24' }}>Parent [r, c]:</span> <strong>[{activeR}, {activeC}]</strong>
              </div>
              <div>
                <span style={{ color: '#06b6d4' }}>Child [nextR, nextC]:</span> <strong>[{activeR + activeDirR}, {activeC + activeDirC}]</strong>
              </div>
            </div>

          </div>
        )}

        {/* Large Dashboard Telemetry Panel */}
        <div className="calculator-box" style={{ margin: 0, padding: '0.75rem 1rem' }}>
          <div className="equation-section" style={{ fontSize: '0.8rem', justifyContent: 'space-around', width: '100%' }}>
            
            {/* Fresh Remaining Widget with dynamic variable glows */}
            <div 
              className="eq-var" 
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 11 || currentStep.highlightedLine === 25 || currentStep.highlightedLine === 49) ? '1.5px solid #ff8c00' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 11 || currentStep.highlightedLine === 25 || currentStep.highlightedLine === 49) ? 'rgba(255, 140, 0, 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 11 || currentStep.highlightedLine === 25 || currentStep.highlightedLine === 49) ? '0 0 10px rgba(255, 140, 0, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="eq-label">Fresh Remaining</span>
              <span className="eq-val font-mono" style={{ color: currentStep.freshOranges > 0 ? '#ff8c00' : '#10b981' }}>
                {currentStep.freshOranges}
              </span>
            </div>
            
            <span>|</span>
            
            {/* BFS Queue Size Widget */}
            <div 
              className="eq-var"
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) ? '1.5px solid var(--theme-accent)' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) ? 'rgba(var(--theme-accent-rgb, 168, 85, 247), 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) ? '0 0 10px rgba(var(--theme-accent-rgb, 168, 85, 247), 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="eq-label">BFS Queue Size</span>
              <span className="eq-val font-mono" style={{ color: 'var(--theme-accent)' }}>
                {currentStep.queue.length}
              </span>
            </div>
            
            <span>|</span>
            
            {/* Minutes Elapsed Widget */}
            <div 
              className="eq-var"
              style={{ 
                padding: '0.25rem 0.6rem', 
                borderRadius: '8px', 
                border: (currentStep.highlightedLine === 27 || currentStep.highlightedLine === 56 || currentStep.highlightedLine === 57) ? '1.5px solid #fbbf24' : '1.5px solid transparent',
                background: (currentStep.highlightedLine === 27 || currentStep.highlightedLine === 56 || currentStep.highlightedLine === 57) ? 'rgba(251, 191, 36, 0.08)' : 'transparent',
                boxShadow: (currentStep.highlightedLine === 27 || currentStep.highlightedLine === 56 || currentStep.highlightedLine === 57) ? '0 0 10px rgba(251, 191, 36, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="eq-label">Minutes Elapsed</span>
              <span className="eq-val font-mono" style={{ color: '#fbbf24' }}>
                ⏱️ {currentStep.minutes}m
              </span>
            </div>
            
          </div>
        </div>

        {/* Interactive BFS Queue visual list slider */}
        <div 
          className="math-comparison-card animate-pop" 
          style={{ 
            border: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) 
              ? '1.5px solid var(--theme-accent)' 
              : '1px dashed rgba(255,255,255,0.1)', 
            background: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) 
              ? 'rgba(var(--theme-accent-rgb, 168, 85, 247), 0.02)' 
              : 'rgba(255,255,255,0.01)', 
            boxShadow: (currentStep.highlightedLine === 10 || currentStep.highlightedLine === 32 || currentStep.highlightedLine === 33 || currentStep.highlightedLine === 48) 
              ? '0 0 15px rgba(var(--theme-accent-rgb, 168, 85, 247), 0.15)' 
              : 'none',
            padding: '0.85rem 1.25rem', 
            margin: 0,
            transition: 'all 0.3s ease'
          }}
        >
          <div className="math-card-header" style={{ marginBottom: '0.6rem' }}>
            <span className="math-card-title" style={{ color: 'var(--theme-accent)', fontSize: '0.75rem' }}>👥 Active BFS Queue Coordinates Slider</span>
            <span className="math-card-subtitle" style={{ fontSize: '0.65rem' }}>FIFO (First In, First Out) array queue</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto', padding: '0.35rem 0', minHeight: '44px' }}>
            {currentStep.queue.length === 0 ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', fontStyle: 'italic' }}>Queue is empty. BFS generation complete.</span>
            ) : (
              currentStep.queue.map((pt, idx) => {
                const isGenerationCohort = currentStep.highlightedLine === 33;
                return (
                  <div 
                    key={idx} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: idx === 0 
                        ? 'rgba(251,191,36,0.15)' 
                        : isGenerationCohort
                          ? 'rgba(168, 85, 247, 0.15)'
                          : 'rgba(255,255,255,0.04)',
                      border: idx === 0 
                        ? '1.5px solid #fbbf24' 
                        : isGenerationCohort
                          ? '1.5px solid var(--theme-accent)'
                          : '1px solid rgba(255,255,255,0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: idx === 0 
                        ? '#fbbf24' 
                        : isGenerationCohort
                          ? 'var(--theme-accent)'
                          : 'var(--theme-text-secondary)',
                      boxShadow: idx === 0 
                        ? '0 0 8px rgba(251,191,36,0.2)' 
                        : isGenerationCohort
                          ? '0 0 8px rgba(168, 85, 247, 0.2)'
                          : 'none',
                      minWidth: '55px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    title={idx === 0 ? "First element in queue (next to be polled)" : "BFS queue coordinate"}
                  >
                    [{pt[0]}, {pt[1]}]
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Narrative Log */}
        <div className="explanation-box" style={{ margin: 0, padding: '0.85rem 1rem' }}>
          {currentStep.message}
        </div>
      </div>

      {/* Playback Controls Panel */}
      <div className="control-panel" style={{ marginTop: '1.25rem' }}>
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
            <option value={2000}>Slow (2s)</option>
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
    </section>
  );
};
