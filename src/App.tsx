import { useState, useEffect } from 'react';
import './App.css';

// Types and Hooks
import type { Theme, ProblemType } from './types';
import { useParticles } from './hooks/useParticles';

// Common platform components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

// Modular problem-specific domains
import ThreeSumVisualizer from './components/problems/arrays/threeSum/ThreeSumVisualizer';
import MedianVisualizer from './components/problems/arrays/medianOfTwoSortedArrays/MedianVisualizer';
import CoinChange2Visualizer from './components/problems/arrays/coinChange2/CoinChange2Visualizer';

function App() {
  const [theme, setTheme] = useState<Theme>('purple');
  const [selectedProblem, setSelectedProblem] = useState<ProblemType>('3sum');
  const [quizMode, setQuizMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync active visual theme with the document element body dataset
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Global canvas firework particles hook
  const { canvasRef, celebrate } = useParticles(theme);

  return (
    <div className="app-container">
      {/* Visual Ambient Neon Blobs */}
      <div className="ambient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Celebration Particle Canvas */}
      <canvas ref={canvasRef} className="canvas-particles" />

      {/* Global Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        quizMode={quizMode}
        setQuizMode={setQuizMode}
        selectedProblem={selectedProblem}
      />

      {sidebarCollapsed && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarCollapsed(false)}
          title="Expand Sidebar"
        >
          📁 Problem Explorer
        </button>
      )}

      {/* CORE PLATFORM LAYOUT */}
      <div className={`platform-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar Problem Explorer Navigation */}
        <Sidebar
          selectedProblem={selectedProblem}
          setSelectedProblem={setSelectedProblem}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />

        {/* Dynamic Sandbox Workspace */}
        <div className="main-workspace-wrapper">
          {selectedProblem === '3sum' ? (
            <ThreeSumVisualizer celebrate={celebrate} quizMode={quizMode} />
          ) : selectedProblem === 'median' ? (
            <MedianVisualizer celebrate={celebrate} />
          ) : selectedProblem === 'coinchange2' ? (
            <CoinChange2Visualizer celebrate={celebrate} />
          ) : (
            /* ========================================================================= */
            /* TWO SUM COMING SOON PREVIEW */
            /* ========================================================================= */
            <div className="coming-soon-container">
              <div className="coming-soon-card">
                <div className="coming-soon-icon">🚀</div>
                <h2 className="coming-soon-title">Two Sum Visualizer</h2>
                <p className="coming-soon-desc">
                  We are actively crafting a highly interactive, state-of-the-art visual sandbox for
                  the classic <strong>Two Sum</strong> search problem. Get ready to master hash map
                  tracing and pointer sweeps!
                </p>

                <div className="coming-soon-teaser">
                  <div className="teaser-header">Preview: Two-Pointer Target Search</div>
                  <div className="teaser-mock-array">
                    <span className="teaser-mock-item">2</span>
                    <span className="teaser-mock-item left">7</span>
                    <span className="teaser-mock-item">11</span>
                    <span className="teaser-mock-item right">15</span>
                  </div>
                  <div className="teaser-mock-eq">
                    <span>nums[L] (7) + nums[R] (15) = 22</span>
                    <span className="teaser-tag-eq">Target (22) Found!</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Footer */}
      <footer className="app-footer">
        <div>
          Created with ❤️ by Antigravity. Keyboard Shortcuts: <kbd>Space</kbd> Play/Pause |{' '}
          <kbd>&larr;</kbd> Step Back | <kbd>&rarr;</kbd> Step Forward | <kbd>R</kbd> Reset.
        </div>
        <div className="tech-stack">
          <span className="tech-tag">React</span>
          <span className="tech-tag">TypeScript</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">HTML5 Canvas</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
