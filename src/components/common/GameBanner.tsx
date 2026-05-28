import React from 'react';

interface GameBannerProps {
  quizMode: boolean;
  gameScore: number;
  gameStreak: number;
  highScore: number;
}

export const GameBanner: React.FC<GameBannerProps> = ({
  quizMode,
  gameScore,
  gameStreak,
  highScore,
}) => {
  if (!quizMode) return null;

  return (
    <section className="game-mode-banner" style={{ width: '100%' }}>
      <div className="game-title">
        <span>🎮</span>
        <span>3Sum Accordion Squeeze Game</span>
      </div>
      <div className="game-stats">
        <div className="stat-item">
          <span>Score:</span>
          <strong style={{ color: '#fbbf24' }}>{gameScore} XP</strong>
        </div>
        <div className="stat-item">
          <span>Streak:</span>
          <strong style={{ color: '#ef4444' }}>
            <span className="streak-fire">🔥</span> {gameStreak}
          </strong>
        </div>
        <div className="stat-item">
          <span>High Score:</span>
          <strong style={{ color: '#10b981' }}>{highScore}</strong>
        </div>
      </div>
    </section>
  );
};
export default GameBanner;
