import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { GameBanner } from '../../../common/GameBanner';
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/threeSumData';
import threeSumJava from '../java_codes/ThreeSum.java?raw';
import { generateSteps } from './utils/algoGenerator';
import { useInterval } from '../../../../hooks/useInterval';

interface ThreeSumVisualizerProps {
  celebrate: () => void;
  quizMode: boolean;
}

export const ThreeSumVisualizer: React.FC<ThreeSumVisualizerProps> = ({
  celebrate,
  quizMode,
}) => {
  const [inputArray, setInputArray] = useState<number[]>([-1, 0, 1, 2, -1, -4]);
  const steps = useMemo(() => generateSteps(inputArray), [inputArray]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step
  const [customInputText, setCustomInputText] = useState('-1, 0, 1, 2, -1, -4');

  // Game & Gamification states
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quizAnswerState, setQuizAnswerState] = useState<'correct' | 'incorrect' | null>(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [wrongLineHighlight, setWrongLineHighlight] = useState<number | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  const [prevInputArray, setPrevInputArray] = useState(inputArray);
  if (inputArray !== prevInputArray) {
    setPrevInputArray(inputArray);
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

  // Auto playback timer hook with built-in quiz-pause checking
  useInterval(
    () => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const nextStep = steps[prev + 1];
        if (quizMode && nextStep && nextStep.status === 'compare-sum') {
          setIsPlaying(false);
        }
        return prev + 1;
      });
    },
    isPlaying ? speed : null
  );

  // Keyboard navigation shortcuts controls
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

  // Handle Preset Array switch
  const handlePresetChange = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setInputArray(preset.array);
      setCustomInputText(preset.array.join(', '));
    }
  };

  // Handle Custom Input Submit
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = customInputText
      .split(',')
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    if (numbers.length < 3) {
      alert('Please enter at least 3 valid integers to run 3Sum algorithm.');
      return;
    }

    if (numbers.length > 10) {
      alert('For the best visual experience, input length is capped at 10 items.');
      return;
    }

    setInputArray(numbers);
  };

  // Generate random integers
  const generateRandom = () => {
    const length = 5 + Math.floor(Math.random() * 4); // 5 to 8 elements
    const randoms: number[] = [];
    for (let i = 0; i < length; i++) {
      randoms.push(Math.floor(Math.random() * 15) - 7); // -7 to 7
    }
    setInputArray(randoms);
    setCustomInputText(randoms.join(', '));
  };

  // Gamified Game Choice Evaluator
  const handleQuizAnswer = (choice: 'left' | 'right' | 'found') => {
    const step = steps[currentStepIndex];
    if (!step || step.sum === null) return;

    let correctChoice: 'left' | 'right' | 'found' = 'found';
    if (step.sum < 0) correctChoice = 'left';
    else if (step.sum > 0) correctChoice = 'right';

    if (choice === correctChoice) {
      setQuizAnswerState('correct');
      setWrongLineHighlight(null);
      setQuizFeedback('🎯 Spot on! That is correct!');
      setGameScore((prev) => prev + 10);
      setGameStreak((prev) => {
        const next = prev + 1;
        if (next > highScore) setHighScore(next);
        return next;
      });
      celebrate();

      // Auto-advance after 1.2 seconds so the user remains engaged!
      setTimeout(() => {
        setQuizAnswerState(null);
        setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      }, 1200);
    } else {
      setQuizAnswerState('incorrect');
      setGameStreak(0);

      // Highlight the precise code line explaining their error in the IDE
      if (correctChoice === 'left') {
        setWrongLineHighlight(24); // Left++
        setQuizFeedback(
          '❄️ Incorrect. Since the sum is negative (< 0), we need a larger value. Squeeze the Left pointer rightward (L++)! Look at line 24 inside the IDE.'
        );
      } else if (correctChoice === 'right') {
        setWrongLineHighlight(26); // Right--
        setQuizFeedback(
          '🔥 Incorrect. Since the sum is positive (> 0), we need a smaller value. Squeeze the Right pointer leftward (R--)! Look at line 26 inside the IDE.'
        );
      } else {
        setWrongLineHighlight(18); // Found match
        setQuizFeedback(
          '🎉 Incorrect. The sum adds up exactly to 0! That is a Jackpot! Look at line 18 in the IDE.'
        );
      }
    }
  };

  const currentStep = steps[currentStepIndex] || {
    nums: inputArray,
    i: -1,
    left: -1,
    right: -1,
    highlightedLine: 4,
    sum: null,
    message: 'Loading...',
    foundTriplets: [],
    activePointers: [],
    status: 'start',
  };

  return (
    <>
      {/* Gamified Live Stats Banner */}
      <GameBanner
        quizMode={quizMode}
        gameScore={gameScore}
        gameStreak={gameStreak}
        highScore={highScore}
      />

      {/* Dual Column Layout Board */}
      <div className="visualizer-board" style={{ width: '100%' }}>
        {/* LEFT COLUMN: IDE Java Code Editor */}
        <CodeEditor
          currentStepHighlightLine={currentStep.highlightedLine}
          wrongLineHighlight={wrongLineHighlight}
          activeBoundaryTip={activeBoundaryTip}
          setActiveBoundaryTip={setActiveBoundaryTip}
          codeRaw={threeSumJava}
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
          inputArray={inputArray}
        />
      </div>

      {/* Bottom Scannable Analogy Cheat Sheet Section */}
      <AnalogyCheatSheet
        accordionOpen={accordionOpen}
        setAccordionOpen={setAccordionOpen}
      />
    </>
  );
};

export default ThreeSumVisualizer;
