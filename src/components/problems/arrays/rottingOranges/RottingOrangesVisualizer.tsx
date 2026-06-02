import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/rottingOrangesData';
import rottingOrangesJava from '../java_codes/RottingOranges.java?raw';
import { generateSteps } from './utils/rottingOrangesGenerator';
import { useInterval } from '../../../../hooks/useInterval';
import './RottingOrangesVisualizer.css';

interface RottingOrangesVisualizerProps {
  celebrate: () => void;
}

export const RottingOrangesVisualizer: React.FC<RottingOrangesVisualizerProps> = ({
  celebrate,
}) => {
  const [currentGrid, setCurrentGrid] = useState<number[][]>([
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1]
  ]);

  const steps = useMemo(() => generateSteps(currentGrid), [currentGrid]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200); // ms per step

  // Sandbox Mode toggles
  const isCustomGridMode = true;
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  // If currentGrid changes, reset playback index
  const [prevGrid, setPrevGrid] = useState(currentGrid);
  if (JSON.stringify(currentGrid) !== JSON.stringify(prevGrid)) {
    setPrevGrid(currentGrid);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  // Auto playback loop
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

  // Keyboard navigation shortcuts
  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Keyboard hotkey listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        stepForward();
      } else if (e.key === 'ArrowLeft') {
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepForward, stepBackward, reset]);

  // Celebrate with fireworks when trace achieves the complete final frame successfully
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.status === 'done' && currentStepIndex === steps.length - 1) {
      // Check if success (no fresh oranges left)
      if (currentStep.freshOranges === 0) {
        celebrate();
      }
    }
  }, [currentStepIndex, steps, celebrate]);

  // Preset switch handler
  const handlePresetChange = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setCurrentGrid(preset.grid);
    }
  };

  // Generate a random matrix of oranges
  const generateRandom = () => {
    const rows = 3 + Math.floor(Math.random() * 2); // 3 to 4 rows
    const cols = 3 + Math.floor(Math.random() * 2); // 3 to 4 cols
    
    const randomGrid = Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => {
        const rand = Math.random();
        if (rand < 0.25) return 0; // 25% empty
        if (rand < 0.8) return 1;  // 55% fresh
        return 2;                  // 20% rotten seeds
      })
    );

    // Make sure at least one rotten seed exists, otherwise place one
    let hasRotten = randomGrid.some(row => row.includes(2));
    if (!hasRotten) {
      randomGrid[0][0] = 2;
    }

    setCurrentGrid(randomGrid);
  };

  // Toggle grid cell values during Sandbox Mode (cycles 0 -> 1 -> 2 -> 0)
  const toggleGridCell = (r: number, c: number) => {
    setIsPlaying(false);
    const updated = currentGrid.map((row, rIdx) => 
      row.map((val, cIdx) => {
        if (rIdx === r && cIdx === c) {
          return (val + 1) % 3;
        }
        return val;
      })
    );
    setCurrentGrid(updated);
  };

  const currentStep = steps[currentStepIndex] || {
    grid: currentGrid,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top dynamic header banner */}
      <section
        className="game-mode-banner"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(16,185,129,0.15))',
          borderColor: 'rgba(16,185,129,0.3)',
          animation: '3s infinite alternate pulse-border',
        }}
      >
        <div className="game-title" style={{ color: '#10b981' }}>
          <span>🍊</span>
          <span>The Multi-Source BFS Zombie Infection sandbox</span>
        </div>
        <div className="game-stats">
          <div className="stat-item" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <span>Task:</span>
            <strong style={{ color: '#fbbf24' }}>Rot all Oranges O(R*C)</strong>
          </div>
          <div className="stat-item" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <span>Algorithm:</span>
            <strong style={{ color: '#06b6d4' }}>Multi-Source BFS</strong>
          </div>
        </div>
      </section>

      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          activeBoundaryTip={activeBoundaryTip}
          setActiveBoundaryTip={setActiveBoundaryTip}
          codeRaw={rottingOrangesJava}
          boundaryLines={BOUNDARY_LINES}
          boundaryConditions={BOUNDARY_CONDITIONS}
        />

        {/* RIGHT COLUMN: Visualizer Workspace Sandbox */}
        <TraceSandbox
          steps={steps}
          currentStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          reset={reset}
          stepBackward={stepBackward}
          stepForward={stepForward}
          handlePresetChange={handlePresetChange}
          generateRandom={generateRandom}
          toggleGridCell={toggleGridCell}
          isCustomGridMode={isCustomGridMode}
        />
      </div>

      {/* Accordion cheat sheet */}
      <AnalogyCheatSheet
        accordionOpen={accordionOpen}
        setAccordionOpen={setAccordionOpen}
      />
    </div>
  );
};

export default RottingOrangesVisualizer;
