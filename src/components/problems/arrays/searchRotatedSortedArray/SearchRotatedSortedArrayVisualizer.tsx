import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/searchRotatedSortedArrayData';
import searchRotatedSortedArrayJava from '../java_codes/SearchRotatedSortedArray.java?raw';
import { generateSteps } from './utils/searchRotatedSortedArrayGenerator';
import { useInterval } from '../../../../hooks/useInterval';
import './SearchRotatedSortedArrayVisualizer.css';

interface SearchRotatedSortedArrayVisualizerProps {
  celebrate: () => void;
}

export const SearchRotatedSortedArrayVisualizer: React.FC<SearchRotatedSortedArrayVisualizerProps> = ({
  celebrate,
}) => {
  const [currentNums, setCurrentNums] = useState<number[]>([4, 5, 6, 7, 0, 1, 2]);
  const [currentTarget, setCurrentTarget] = useState<number>(0);

  // Custom Input text boxes states
  const [customArrayInput, setCustomArrayInput] = useState<string>('4, 5, 6, 7, 0, 1, 2');
  const [customTargetInput, setCustomTargetInput] = useState<string>('0');

  const steps = useMemo(() => generateSteps(currentNums, currentTarget), [currentNums, currentTarget]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200); // ms per step

  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  // If input parameters change, reset playback index
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [currentNums, currentTarget]);

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

  // Celebrate with fireworks when target is successfully found at the final step
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.status === 'done' && currentStepIndex === steps.length - 1) {
      // Check if target was found (meaning mid pointer is valid and value matches target)
      if (currentStep.mid !== -1 && currentStep.nums[currentStep.mid] === currentStep.target) {
        celebrate();
      }
    }
  }, [currentStepIndex, steps, celebrate]);

  // Preset switch handler
  const handlePresetChange = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setCurrentNums(preset.nums);
      setCurrentTarget(preset.target);
      setCustomArrayInput(preset.nums.join(', '));
      setCustomTargetInput(preset.target.toString());
    }
  };

  // Generate a random rotated sorted array
  const generateRandom = () => {
    // 1. Generate sorted unique array
    const size = 6 + Math.floor(Math.random() * 4); // 6 to 9 elements
    const startVal = Math.floor(Math.random() * 20);
    const sorted: number[] = [];
    let currentVal = startVal;
    for (let i = 0; i < size; i++) {
      currentVal += 2 + Math.floor(Math.random() * 5);
      sorted.push(currentVal);
    }

    // 2. Rotate at a random pivot
    const rotateIndex = 1 + Math.floor(Math.random() * (size - 2)); // pivot not at ends
    const rotated = [...sorted.slice(rotateIndex), ...sorted.slice(0, rotateIndex)];

    // 3. Choose a random target (either present or random missing)
    let randomTarget = 0;
    if (Math.random() < 0.75) {
      // Present target
      const randIdx = Math.floor(Math.random() * size);
      randomTarget = rotated[randIdx];
    } else {
      // Missing target
      randomTarget = Math.floor(Math.random() * 50);
      while (rotated.includes(randomTarget)) {
        randomTarget += 1;
      }
    }

    setCurrentNums(rotated);
    setCurrentTarget(randomTarget);
    setCustomArrayInput(rotated.join(', '));
    setCustomTargetInput(randomTarget.toString());
  };

  // Handle custom sandbox form submission
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse comma-separated array
    const parsedNums = customArrayInput
      .split(',')
      .map(item => parseInt(item.trim(), 10))
      .filter(num => !isNaN(num));

    const parsedTarget = parseInt(customTargetInput.trim(), 10);

    if (parsedNums.length === 0) {
      alert("Please enter a valid list of comma-separated numbers.");
      return;
    }

    if (isNaN(parsedTarget)) {
      alert("Please enter a valid numeric target value.");
      return;
    }

    setCurrentNums(parsedNums);
    setCurrentTarget(parsedTarget);
  };

  const currentStep = steps[currentStepIndex] || {
    nums: currentNums,
    target: currentTarget,
    left: -1,
    right: -1,
    mid: -1,
    highlightedLine: 2,
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
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.15))',
          borderColor: 'rgba(6,182,212,0.3)',
          animation: '3s infinite alternate pulse-border',
        }}
      >
        <div className="game-title" style={{ color: '#06b6d4' }}>
          <span>📏</span>
          <span>Search in Rotated Sorted Array Sandbox</span>
        </div>
        <div className="game-stats">
          <div className="stat-item" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
            <span>Time Complexity:</span>
            <strong style={{ color: '#fbbf24' }}>O(log N) Time</strong>
          </div>
          <div className="stat-item" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
            <span>Algorithm:</span>
            <strong style={{ color: '#ec4899' }}>Binary Search</strong>
          </div>
        </div>
      </section>

      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          activeBoundaryTip={activeBoundaryTip}
          setActiveBoundaryTip={setActiveBoundaryTip}
          codeRaw={searchRotatedSortedArrayJava}
          boundaryLines={BOUNDARY_LINES}
          boundaryConditions={BOUNDARY_CONDITIONS}
        />

        {/* RIGHT COLUMN: Visualizer Workspace Sandbox */}
        <TraceSandbox
          steps={steps}
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          reset={reset}
          stepBackward={stepBackward}
          stepForward={stepForward}
          handlePresetChange={handlePresetChange}
          generateRandom={generateRandom}
          customArrayInput={customArrayInput}
          setCustomArrayInput={setCustomArrayInput}
          customTargetInput={customTargetInput}
          setCustomTargetInput={setCustomTargetInput}
          handleCustomSubmit={handleCustomSubmit}
          inputNums={currentNums}
          inputTarget={currentTarget}
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

export default SearchRotatedSortedArrayVisualizer;
