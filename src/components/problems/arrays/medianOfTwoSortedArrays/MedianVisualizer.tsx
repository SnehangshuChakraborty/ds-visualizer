import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './MedianVisualizer.css';

// Types, Constants, Utilities
import { MEDIAN_PRESETS } from './constants/medianData';
import medianJava from '../java_codes/Median.java?raw';
import { generateMedianSteps } from './utils/medianGenerator';
import { useInterval } from '../../../../hooks/useInterval';

// Sub-components
import { ChampionArrays } from './components/ChampionArrays';
import { LaserClash } from './components/LaserClash';
import { MnemonicCard } from './components/MnemonicCard';
import { CodeEditor } from '../../../common/CodeEditor';

interface MedianVisualizerProps {
  celebrate: () => void;
}

export const MedianVisualizer: React.FC<MedianVisualizerProps> = ({
  celebrate,
}) => {
  const [arrayA, setArrayA] = useState<number[]>([1, 3, 8, 9, 15]);
  const [arrayB, setArrayB] = useState<number[]>([7, 11, 18, 19, 21, 25]);

  const steps = useMemo(() => generateMedianSteps(arrayA, arrayB), [arrayA, arrayB]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step

  const [customTextA, setCustomTextA] = useState('1, 3, 8, 9, 15');
  const [customTextB, setCustomTextB] = useState('7, 11, 18, 19, 21, 25');

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Reset steps state on arrays swap / change
  const [prevArrayA, setPrevArrayA] = useState(arrayA);
  const [prevArrayB, setPrevArrayB] = useState(arrayB);
  if (arrayA !== prevArrayA || arrayB !== prevArrayB) {
    setPrevArrayA(arrayA);
    setPrevArrayB(arrayB);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  // Auto playback loop timing
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

  const currentStep = steps[currentStepIndex] || {
    numsA: arrayA,
    numsB: arrayB,
    cutA: 0,
    cutB: 0,
    low: 0,
    high: arrayA.length,
    highlightedLine: 6,
    champions: { maxLeftA: -Infinity, minRightA: Infinity, maxLeftB: -Infinity, minRightB: Infinity },
    status: 'evaluating',
    narrative: 'Loading steps...',
    median: null,
  };

  // Celebrate with canvas firework particles when a perfect cut is achieved!
  useEffect(() => {
    if (currentStep.status === 'perfect-cut') {
      celebrate();
    }
  }, [currentStepIndex, currentStep.status, celebrate]);

  // Controls Event Actions
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

  // Keyboard navigation shortcuts
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

  // Presets selector handler
  const handlePresetChange = (idx: number) => {
    const preset = MEDIAN_PRESETS[idx];
    if (preset) {
      setArrayA(preset.arrayA);
      setArrayB(preset.arrayB);
      setCustomTextA(preset.arrayA.join(', '));
      setCustomTextB(preset.arrayB.join(', '));
    }
  };

  // Custom arrays submissions parser
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parseArray = (text: string) => {
      return text
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b); // Must ensure inputs are sorted!
    };

    const parsedA = parseArray(customTextA);
    const parsedB = parseArray(customTextB);

    if (parsedA.length === 0 || parsedB.length === 0) {
      alert('Please enter at least 1 valid integer in each array.');
      return;
    }

    if (parsedA.length > 7 || parsedB.length > 7) {
      alert('For the best visual experience, array length is capped at 7 items.');
      return;
    }

    setArrayA(parsedA);
    setArrayB(parsedB);
  };

  // Randomizer generator
  const generateRandom = () => {
    const makeRandomSorted = () => {
      const length = 3 + Math.floor(Math.random() * 4); // 3 to 6 items
      const items: number[] = [];
      for (let i = 0; i < length; i++) {
        items.push(Math.floor(Math.random() * 25) + 1);
      }
      return items.sort((a, b) => a - b);
    };

    const parsedA = makeRandomSorted();
    const parsedB = makeRandomSorted();

    setArrayA(parsedA);
    setArrayB(parsedB);
    setCustomTextA(parsedA.join(', '));
    setCustomTextB(parsedB.join(', '));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Dynamic top info banner, matching 3Sum's GameBanner visual format */}
      <section
        className="game-mode-banner"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))',
          borderColor: 'rgba(236,72,153,0.3)',
          animation: '3s infinite alternate pulse-border',
        }}
      >
        <div className="game-title" style={{ color: '#ec4899' }}>
          <span>⚔️</span>
          <span>The Cross-Border Champions Partition Sandbox</span>
        </div>
        <div className="game-stats">
          <div className="stat-item" style={{ borderColor: 'rgba(236,72,153,0.2)' }}>
            <span>Task:</span>
            <strong style={{ color: '#fbbf24' }}>Find Median O(log(m+n))</strong>
          </div>
          <div className="stat-item" style={{ borderColor: 'rgba(236,72,153,0.2)' }}>
            <span>Algorithm:</span>
            <strong style={{ color: '#06b6d4' }}>Binary Search</strong>
          </div>
        </div>
      </section>

      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          codeRaw={medianJava}
        />

        {/* RIGHT COLUMN: Visualizer Workspace Sandbox */}
        <section className="visualizer-workspace">
          
          {/* Card 1: Main Simulation Container */}
          <div ref={boardRef} className="simulation-container" style={{ position: 'relative', height: 'auto' }}>
            <div className="workspace-header">
              <h2 className="panel-title">⚔️ The Cross-Border Champions</h2>
              <div className="step-counter">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>

            {/* Binary search bounds display */}
            {(currentStep.highlightedLine >= 7 || currentStep.status === 'perfect-cut') && (
              <div className="binary-bounds-panel">
                <div className="bound-stat-item">
                  Low index on top array: <strong>{currentStep.low}</strong>
                </div>
                <div className="bound-stat-item">
                  High index on top array: <strong>{currentStep.high}</strong>
                </div>
                {(currentStep.highlightedLine >= 10 || currentStep.status === 'perfect-cut') && (
                  <div className="bound-stat-item">
                    Partition top: <strong>{currentStep.cutA}</strong>
                  </div>
                )}
                {(currentStep.highlightedLine >= 11 || currentStep.status === 'perfect-cut') && (
                  <div className="bound-stat-item">
                    Partition bottom: <strong>{currentStep.cutB}</strong>
                  </div>
                )}
              </div>
            )}

            {/* 1. Champion Arrays Visualizer */}
            <ChampionArrays
              numsA={currentStep.numsA}
              numsB={currentStep.numsB}
              cutA={currentStep.cutA}
              cutB={currentStep.cutB}
              status={currentStep.status}
              low={currentStep.low}
              high={currentStep.high}
              highlightedLine={currentStep.highlightedLine}
            />

            {/* 2. Absolute SVG laser overlay clashing champions */}
            <LaserClash
              parentRef={boardRef}
              cutA={currentStep.cutA}
              cutB={currentStep.cutB}
              status={currentStep.status}
              highlightedLine={currentStep.highlightedLine}
            />

            {/* 3. Pointer Weigh-In Comparison Calculator board (3Sum style!) */}
            {(currentStep.highlightedLine >= 18 || currentStep.status === 'perfect-cut') && (
              <div className="calculator-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch', padding: '0.85rem 1.25rem', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  {/* COMPARISON 1: MaxLeftA <= MinRightB */}
                  <div className="equation-section" style={{ fontSize: '0.9rem' }}>
                    <div className="eq-var">
                      <span className="eq-label">MaxLeft A</span>
                      <span className="eq-val i" style={{ color: 'var(--theme-accent)' }}>
                        {currentStep.champions.maxLeftA === -Infinity ? '-∞' : currentStep.champions.maxLeftA}
                      </span>
                    </div>
                    <span style={{ margin: '0 0.4rem', fontWeight: 'bold' }}>&le;</span>
                    <div className="eq-var">
                      <span className="eq-label">MinRight B</span>
                      <span className="eq-val right" style={{ color: 'var(--theme-accent-secondary)' }}>
                        {currentStep.champions.minRightB === Infinity ? '∞' : currentStep.champions.minRightB}
                      </span>
                    </div>
                    <span style={{ margin: '0 0.4rem', color: 'var(--theme-text-muted)' }}>&rarr;</span>
                    {currentStep.champions.maxLeftA <= currentStep.champions.minRightB ? (
                      <span className="sum-status match" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: '4px' }}>Valid</span>
                    ) : (
                      <span className="sum-status too-large" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: '4px' }}>🚨 Heavy A</span>
                    )}
                  </div>

                  {/* Vertical Separator */}
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', height: '24px' }} />

                  {/* COMPARISON 2: MaxLeftB <= MinRightA */}
                  <div className="equation-section" style={{ fontSize: '0.9rem' }}>
                    <div className="eq-var">
                      <span className="eq-label">MaxLeft B</span>
                      <span className="eq-val i" style={{ color: 'var(--theme-accent)' }}>
                        {currentStep.champions.maxLeftB === -Infinity ? '-∞' : currentStep.champions.maxLeftB}
                      </span>
                    </div>
                    <span style={{ margin: '0 0.4rem', fontWeight: 'bold' }}>&le;</span>
                    <div className="eq-var">
                      <span className="eq-label">MinRight A</span>
                      <span className="eq-val right" style={{ color: 'var(--theme-accent-secondary)' }}>
                        {currentStep.champions.minRightA === Infinity ? '∞' : currentStep.champions.minRightA}
                      </span>
                    </div>
                    <span style={{ margin: '0 0.4rem', color: 'var(--theme-text-muted)' }}>&rarr;</span>
                    {currentStep.champions.maxLeftB <= currentStep.champions.minRightA ? (
                      <span className="sum-status match" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: '4px' }}>Valid</span>
                    ) : (
                      <span className="sum-status too-large" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: '4px' }}>🚨 Heavy B</span>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Step Narrative explanation log */}
            <div className="explanation-box" style={{ minHeight: '75px', marginTop: '1.25rem', borderLeft: '3px solid var(--theme-accent)' }}>
              {currentStep.narrative}
            </div>
          </div>

          {/* Card 2: Playback Controls Panel */}
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
                <option value={2500}>Slow (2.5s)</option>
                <option value={1500}>Normal (1.5s)</option>
                <option value={800}>Fast (0.8s)</option>
              </select>
            </div>

            <div className="dataset-controls">
              <select
                className="dataset-select"
                onChange={(e) => handlePresetChange(Number(e.target.value))}
                defaultValue={0}
              >
                {MEDIAN_PRESETS.map((p, idx) => (
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

          {/* Card 3: Custom Kingdoms Input panel bar (3Sum style!) */}
          <div className="control-panel" style={{ padding: '0.75rem 1rem' }}>
            <form
              onSubmit={handleCustomSubmit}
              className="custom-input-box"
              style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
                ✏️ Custom Sorted Kingdoms:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>Top (A):</span>
                <input
                  type="text"
                  className="custom-input-field"
                  style={{ width: '110px' }}
                  value={customTextA}
                  onChange={(e) => setCustomTextA(e.target.value)}
                  placeholder="1, 3, 8, 9, 15"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', marginLeft: '0.25rem' }}>Bottom (B):</span>
                <input
                  type="text"
                  className="custom-input-field"
                  style={{ width: '110px' }}
                  value={customTextB}
                  onChange={(e) => setCustomTextB(e.target.value)}
                  placeholder="7, 11, 18..."
                />
                <button className="random-btn" type="submit" style={{ padding: '0.35rem 0.75rem', marginLeft: '0.25rem' }}>
                  Load Sorted Kingdoms
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Calculated Median Result Panel (3Sum style!) */}
          {(currentStep.highlightedLine === 20 || currentStep.highlightedLine === 22 || currentStep.status === 'perfect-cut') && (
            <div className="results-container">
              <div className="results-header" style={{ paddingBottom: '0.35rem', marginBottom: '0.4rem' }}>
                <span className="results-title" style={{ fontSize: '0.85rem' }}>
                  🎯 Calculated Median Result
                </span>
              </div>
              <div className="triplet-tags">
                {currentStep.median !== null ? (
                  <span className="triplet-tag new-find" style={{ fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
                    Median = {currentStep.median}
                  </span>
                ) : (
                  <span className="no-results" style={{ fontSize: '0.75rem' }}>Searching for perfect partition...</span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 3. Mnemonic Cheat Rules Card - Spans full width at the bottom (matching 3Sum cheat sheet!) */}
      <MnemonicCard />
    </div>
  );
};

export default MedianVisualizer;
