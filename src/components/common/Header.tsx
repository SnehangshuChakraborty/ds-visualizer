import React from 'react';
import type { Theme, ProblemType } from '../../types';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  quizMode: boolean;
  setQuizMode: (mode: boolean) => void;
  selectedProblem: ProblemType;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  quizMode,
  setQuizMode,
  selectedProblem,
}) => {
  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
            <line x1="12" y1="22" x2="12" y2="15.5"></line>
            <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
            <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
            <line x1="12" y1="2" x2="12" y2="8.5"></line>
          </svg>
        </div>
        <span className="logo-text">DS Visualizer</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Active gamified quiz toggle (Only show when 3Sum is active) */}
        {(selectedProblem === '3sum' || selectedProblem === 'valid-sudoku') && (
          <button
            className={`random-btn ${quizMode ? 'active' : ''}`}
            onClick={() => {
              setQuizMode(!quizMode);
            }}
            style={{
              background: quizMode ? 'rgba(251,191,36,0.15)' : '',
              borderColor: quizMode ? '#fbbf24' : '',
              color: quizMode ? '#fbbf24' : '',
              fontSize: '0.85rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              boxShadow: quizMode ? '0 0 15px rgba(251,191,36,0.2)' : ''
            }}
          >
            {quizMode ? '🎮 Game Mode: ON' : '🎮 Game Mode: OFF'}
          </button>
        )}

        <div className="theme-controls">
          {(['purple', 'cyan', 'amber', 'aurora'] as Theme[]).map((t) => (
            <button
              key={t}
              className={`theme-btn ${theme === t ? 'active' : ''}`}
              onClick={() => setTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
export default Header;
