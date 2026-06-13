import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Sub-components
import { GameBanner } from '../../../common/GameBanner';
import { CodeEditor } from '../../../common/CodeEditor';
import { TraceSandbox } from './components/TraceSandbox';
import { AnalogyCheatSheet } from './components/AnalogyCheatSheet';

// Constants, utils, hooks
import { PRESETS, BOUNDARY_LINES, BOUNDARY_CONDITIONS } from './constants/validSudokuData';
import validSudokuJava from '../java_codes/ValidSudoku.java?raw';
import { generateSteps } from './utils/algoGenerator';
import { useInterval } from '../../../../hooks/useInterval';

interface ValidSudokuVisualizerProps {
  celebrate: () => void;
  quizMode: boolean;
}

// Generate quiz distractors for 1 << val
function generateQuizOptions(val: number): number[] {
  const correct = 1 << val;
  const distractors = new Set<number>();

  // Add some plausible wrong answers
  if (val > 0) distractors.add(1 << (val - 1));   // off-by-one left
  if (val < 8) distractors.add(1 << (val + 1));   // off-by-one right
  distractors.add(val);                             // common mistake: confusing val with 1<<val
  distractors.add(val + 1);                         // confusing digit with mask
  distractors.add(2 * val);                         // multiplication confusion
  distractors.add(correct + 1);                     // close but wrong
  if (val >= 2) distractors.add(1 << (val - 2));

  // Remove the correct answer and zero from distractors
  distractors.delete(correct);
  distractors.delete(0);

  // Pick 3 distractors
  const distractorArr = Array.from(distractors).slice(0, 3);

  // Combine and shuffle
  const options = [correct, ...distractorArr];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Generate quiz options for box index
function generateQuizBoxOptions(r: number, c: number): number[] {
  const correct = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  const distractors = new Set<number>();

  // Add some plausible wrong answers
  distractors.add(r); // Row instead of box
  distractors.add(c); // Col instead of box
  distractors.add(Math.floor(r / 3) + Math.floor(c / 3)); // Forgetting * 3
  distractors.add(Math.floor(r % 3) * 3 + Math.floor(c % 3)); // Modulo instead of div
  distractors.add(Math.floor(r / 3) * 3); // Forgetting col block
  distractors.add((r * 3 + c) % 9); // Direct 2D coordinates modulo 9
  
  // Fill remainder to make 3 distractors
  for (let i = 0; i < 9; i++) {
    if (distractors.size >= 4) break; // Need 3 wrong options + correct
    if (i !== correct) distractors.add(i);
  }

  // Remove the correct answer
  distractors.delete(correct);

  // Pick 3 distractors
  const distractorArr = Array.from(distractors).slice(0, 3);

  // Combine and shuffle
  const options = [correct, ...distractorArr];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}


export const ValidSudokuVisualizer: React.FC<ValidSudokuVisualizerProps> = ({
  celebrate,
  quizMode,
}) => {
  const [board, setBoard] = useState<string[][]>(PRESETS[0].board);
  const steps = useMemo(() => generateSteps(board), [board]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  // Game & Gamification states
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quizAnswerState, setQuizAnswerState] = useState<'correct' | 'incorrect' | null>(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [wrongLineHighlight, setWrongLineHighlight] = useState<number | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeBoundaryTip, setActiveBoundaryTip] = useState<number | null>(null);

  // Quiz options for the current calc-mask step
  const [quizOptions, setQuizOptions] = useState<number[]>([]);

  const [prevBoard, setPrevBoard] = useState(board);
  if (board !== prevBoard) {
    setPrevBoard(board);
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

  // Generate quiz options when we enter a calc-mask or calc-box step
  useEffect(() => {
    const step = steps[currentStepIndex];
    if (step && quizMode) {
      if (step.status === 'calc-mask' && step.val >= 0) {
        setQuizOptions(generateQuizOptions(step.val));
      } else if (step.status === 'calc-box' && step.boxIdx >= 0) {
        setQuizOptions(generateQuizBoxOptions(step.row, step.col));
      }
    }
  }, [currentStepIndex, steps, quizMode]);

  // Auto playback timer hook with quiz-pause
  useInterval(
    () => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const nextStep = steps[prev + 1];
        if (quizMode && nextStep && (nextStep.status === 'calc-mask' || nextStep.status === 'calc-box')) {
          setIsPlaying(false);
        }
        return prev + 1;
      });
    },
    isPlaying ? speed : null
  );

  // Keyboard navigation shortcuts
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
      setBoard(preset.board);
    }
  };

  // Gamified Quiz Evaluator
  const handleQuizAnswer = (choice: number) => {
    const step = steps[currentStepIndex];
    if (!step) return;

    if (step.status === 'calc-mask') {
      if (step.val < 0) return;
      const correctAnswer = 1 << step.val;

      if (choice === correctAnswer) {
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

        // Auto-advance after 1.2 seconds
        setTimeout(() => {
          setQuizAnswerState(null);
          setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
        }, 1200);
      } else {
        setQuizAnswerState('incorrect');
        setGameStreak(0);
        setWrongLineHighlight(15); // The mask = 1 << val line
        setQuizFeedback(
          `❌ Not quite! 1 << ${step.val} means shifting the number 1 leftward by ${step.val} positions. That's 2^${step.val} = ${correctAnswer}. Look at line 15 in the IDE!`
        );
      }
    } else if (step.status === 'calc-box') {
      if (step.boxIdx < 0) return;
      const correctAnswer = step.boxIdx;

      if (choice === correctAnswer) {
        setQuizAnswerState('correct');
        setWrongLineHighlight(null);
        setQuizFeedback('🎯 Correct! Sub-box index calculations mapped successfully!');
        setGameScore((prev) => prev + 10);
        setGameStreak((prev) => {
          const next = prev + 1;
          if (next > highScore) setHighScore(next);
          return next;
        });
        celebrate();

        // Auto-advance after 1.2 seconds
        setTimeout(() => {
          setQuizAnswerState(null);
          setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
        }, 1200);
      } else {
        setQuizAnswerState('incorrect');
        setGameStreak(0);
        setWrongLineHighlight(12); // The boxIdx = (r/3)*3 + (c/3) line
        setQuizFeedback(
          `❌ Oops! Cell [${step.row}][${step.col}] lies in sub-box ${correctAnswer}. Remember the formula: (r/3)*3 + (c/3) = (${Math.floor(step.row/3)}*3) + ${Math.floor(step.col/3)} = ${correctAnswer}. Look at line 12 in the IDE!`
        );
      }
    }
  };

  const currentStep = steps[currentStepIndex] || {
    board: PRESETS[0].board,
    row: -1, col: -1, val: -1, boxIdx: -1, mask: 0,
    rows: new Array(9).fill(0), cols: new Array(9).fill(0), boxes: new Array(9).fill(0),
    highlightedLine: 2,
    status: 'start' as const,
    message: 'Loading...',
    conflictType: null,
    isValid: true,
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
          codeRaw={validSudokuJava}
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
          quizMode={quizMode}
          quizAnswerState={quizAnswerState}
          quizFeedback={quizFeedback}
          handleQuizAnswer={handleQuizAnswer}
          quizOptions={quizOptions}
          reset={reset}
          stepBackward={stepBackward}
          stepForward={stepForward}
          handlePresetChange={handlePresetChange}
        />
      </div>

      {/* Bottom Analogy Cheat Sheet Section */}
      <AnalogyCheatSheet
        accordionOpen={accordionOpen}
        setAccordionOpen={setAccordionOpen}
      />
    </>
  );
};

export default ValidSudokuVisualizer;
