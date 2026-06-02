import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/longestPalindromeData';
import longestPalindromeJava from '../java_codes/LongestPalindrome.java?raw';
import { generateSteps } from './utils/longestPalindromeGenerator';
import { useInterval } from '../../../../hooks/useInterval';
import './LongestPalindromeVisualizer.css';

interface LongestPalindromeVisualizerProps {
  celebrate: () => void;
}

export const LongestPalindromeVisualizer: React.FC<LongestPalindromeVisualizerProps> = ({
  celebrate,
}) => {
  const [inputString, setInputString] = useState<string>('babad');
  const steps = useMemo(() => generateSteps(inputString), [inputString]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step
  const [customInputText, setCustomInputText] = useState('babad');

  // Interactive tooltip/cheat sheet states
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  // If input string changes, reset playback
  const [prevInputString, setPrevInputString] = useState(inputString);
  if (inputString !== prevInputString) {
    setPrevInputString(inputString);
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

  // Keyboard hotkey event listeners
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

  // Celebrate with fireworks when trace achieves the complete final frame
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.status === 'done' && currentStepIndex === steps.length - 1) {
      celebrate();
    }
  }, [currentStepIndex, steps, celebrate]);

  // Preset switch handler
  const handlePresetChange = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setInputString(preset.string);
      setCustomInputText(preset.string);
    }
  };

  // Submit custom string
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStr = customInputText.trim();

    if (cleanStr.length === 0) {
      alert('Please enter a non-empty string.');
      return;
    }

    if (cleanStr.length > 20) {
      alert('For the best visual workspace rendering, input string length is capped at 20 characters.');
      return;
    }

    setInputString(cleanStr);
  };

  // Generate a random string with symmetric characters
  const generateRandom = () => {
    const chars = 'abcd';
    const length = 5 + Math.floor(Math.random() * 6); // 5 to 10 characters
    let randomStr = '';
    for (let i = 0; i < length; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputString(randomStr);
    setCustomInputText(randomStr);
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Dynamic top complexity banner */}
      <section
        className="game-mode-banner"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))',
          borderColor: 'rgba(6,182,212,0.3)',
          animation: '3s infinite alternate pulse-border',
        }}
      >
        <div className="game-title" style={{ color: 'var(--theme-accent)' }}>
          <span>🦋</span>
          <span>The Ripple Wings Palindrome Sandbox</span>
        </div>
        <div className="game-stats">
          <div className="stat-item" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
            <span>Task:</span>
            <strong style={{ color: '#fbbf24' }}>Find Substring O(n²)</strong>
          </div>
          <div className="stat-item" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
            <span>Algorithm:</span>
            <strong style={{ color: '#06b6d4' }}>Expand Around Center</strong>
          </div>
        </div>
      </section>

      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          activeBoundaryTip={activeBoundaryTip}
          setActiveBoundaryTip={setActiveBoundaryTip}
          codeRaw={longestPalindromeJava}
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
          customInputText={customInputText}
          setCustomInputText={setCustomInputText}
          reset={reset}
          stepBackward={stepBackward}
          stepForward={stepForward}
          handlePresetChange={handlePresetChange}
          generateRandom={generateRandom}
          handleCustomSubmit={handleCustomSubmit}
          inputString={inputString}
        />
      </div>

      {/* Analogy accordion */}
      <AnalogyCheatSheet
        accordionOpen={accordionOpen}
        setAccordionOpen={setAccordionOpen}
      />
    </div>
  );
};

export default LongestPalindromeVisualizer;
