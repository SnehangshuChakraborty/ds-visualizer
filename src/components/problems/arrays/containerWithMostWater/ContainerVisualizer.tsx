import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { GameBanner } from '../../../common/GameBanner';
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/containerData';
import containerJava from '../java_codes/ContainerWithMostWater.java?raw';
import { generateContainerSteps } from './utils/containerGenerator';
import { useInterval } from '../../../../hooks/useInterval';
import './ContainerVisualizer.css';

interface ContainerVisualizerProps {
  celebrate: () => void;
  quizMode: boolean;
}

export const ContainerVisualizer: React.FC<ContainerVisualizerProps> = ({
  celebrate,
  quizMode,
}) => {
  const [inputHeights, setInputHeights] = useState<number[]>([1, 8, 6, 2, 5, 4, 8, 3, 7]);
  const steps = useMemo(() => generateContainerSteps(inputHeights), [inputHeights]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step
  const [customInputText, setCustomInputText] = useState('1, 8, 6, 2, 5, 4, 8, 3, 7');

  // Gamification states
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quizAnswerState, setQuizAnswerState] = useState<'correct' | 'incorrect' | null>(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [wrongLineHighlight, setWrongLineHighlight] = useState<number | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  const [prevInputHeights, setPrevInputHeights] = useState(inputHeights);
  if (inputHeights !== prevInputHeights) {
    setPrevInputHeights(inputHeights);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setQuizAnswerState(null);
    setWrongLineHighlight(null);
  }

  // Reset quiz state when quizMode is turned off globally
  const [prevQuizMode, setPrevQuizMode] = useState(quizMode);
  if (quizMode !== prevQuizMode) {
    setPrevQuizMode(quizMode);
    if (!quizMode) {
      setQuizAnswerState(null);
      setWrongLineHighlight(null);
    }
  }

  // Auto playback loop with quiz mode checking
  useInterval(
    () => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const nextStep = steps[prev + 1];
        // In Quiz Mode, pause the playback right before pointer updates on line 14
        if (quizMode && nextStep && nextStep.status === 'evaluating' && nextStep.highlightedLine === 14) {
          setIsPlaying(false);
        }
        return prev + 1;
      });
    },
    isPlaying ? speed : null
  );

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setQuizAnswerState(null);
    setWrongLineHighlight(null);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setQuizAnswerState(null);
    setWrongLineHighlight(null);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setQuizAnswerState(null);
    setWrongLineHighlight(null);
    setCurrentStepIndex(0);
    setGameScore(0);
    setGameStreak(0);
  }, []);

  // Keyboard shortcut keys
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

  // Handle dropdown selection
  const handlePresetChange = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setInputHeights(preset.heights);
      setCustomInputText(preset.heights.join(', '));
    }
  };

  // Submit custom heights array
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = customInputText
      .split(',')
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (numbers.length < 2) {
      alert('Please enter at least 2 positive integers to build a container.');
      return;
    }

    if (numbers.length > 10) {
      alert('For the best visual experience, input length is capped at 10 items.');
      return;
    }

    setInputHeights(numbers);
  };

  // Random dataset generator
  const generateRandom = () => {
    const length = 6 + Math.floor(Math.random() * 4); // 6 to 9 heights
    const randoms: number[] = [];
    for (let i = 0; i < length; i++) {
      randoms.push(Math.floor(Math.random() * 9) + 1); // 1 to 9
    }
    setInputHeights(randoms);
    setCustomInputText(randoms.join(', '));
  };

  // Gamified Quiz selector validation
  const handleQuizAnswer = (choice: 'left' | 'right') => {
    const step = steps[currentStepIndex];
    if (!step) return;

    const leftVal = step.heights[step.left];
    const rightVal = step.heights[step.right];
    
    // If values are equal, both choices are mathematically valid!
    const isCorrect = (leftVal === rightVal) || (choice === (leftVal < rightVal ? 'left' : 'right'));

    if (isCorrect) {
      setQuizAnswerState('correct');
      setWrongLineHighlight(null);
      setQuizFeedback(leftVal === rightVal
        ? '🎯 Spot on! Since both walls have equal height (8 = 8), moving either pointer is mathematically correct!'
        : '🎯 Spot on! That is correct!'
      );
      setGameScore((prev) => prev + 10);
      setGameStreak((prev) => {
        const next = prev + 1;
        if (next > highScore) setHighScore(next);
        return next;
      });
      celebrate();

      // Automatically advance after 1.2 seconds!
      setTimeout(() => {
        setQuizAnswerState(null);
        setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      }, 1200);
    } else {
      const correctChoice: 'left' | 'right' = leftVal < rightVal ? 'left' : 'right';
      setQuizAnswerState('incorrect');
      setGameStreak(0);

      // Highlight the precise code line explaining their error in the IDE
      if (correctChoice === 'left') {
        setWrongLineHighlight(15); // left++
        setQuizFeedback(
          '🧱 Incorrect! Since heights[L] is shorter, moving the right pointer inward can NEVER expand the bottleneck height but will shrink the width. We must step left++! Look at line 15 inside the IDE.'
        );
      } else {
        setWrongLineHighlight(17); // right--
        setQuizFeedback(
          '🧱 Incorrect! Since heights[R] is shorter or equal, moving the left pointer inward can NEVER expand the bottleneck height but will shrink the width. We must step right--! Look at line 17 inside the IDE.'
        );
      }
    }
  };

  const currentStep = steps[currentStepIndex] || {
    heights: inputHeights,
    left: -1,
    right: -1,
    currentWidth: 0,
    currentHeight: 0,
    currentArea: 0,
    maxArea: 0,
    highlightedLine: 3,
    status: 'start',
    message: 'Loading...',
  };

  return (
    <>
      {/* Dynamic top information banner */}
      <GameBanner
        quizMode={quizMode}
        gameScore={gameScore}
        gameStreak={gameStreak}
        highScore={highScore}
      />

      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          wrongLineHighlight={wrongLineHighlight}
          activeBoundaryTip={activeBoundaryTip}
          setActiveBoundaryTip={setActiveBoundaryTip}
          codeRaw={containerJava}
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
          quizMode={quizMode}
          quizAnswerState={quizAnswerState}
          quizFeedback={quizFeedback}
          handleQuizAnswer={handleQuizAnswer}
          reset={reset}
          stepBackward={stepBackward}
          stepForward={stepForward}
          handlePresetChange={handlePresetChange}
          generateRandom={generateRandom}
          handleCustomSubmit={handleCustomSubmit}
          inputHeights={inputHeights}
        />
      </div>

      {/* Accordion cheat sheet */}
      <AnalogyCheatSheet
        accordionOpen={accordionOpen}
        setAccordionOpen={setAccordionOpen}
      />
    </>
  );
};

export default ContainerVisualizer;
