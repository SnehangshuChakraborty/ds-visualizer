import React from 'react';

interface AnalogyCheatSheetProps {
  accordionOpen: boolean;
  setAccordionOpen: (open: boolean) => void;
}

export const AnalogyCheatSheet: React.FC<AnalogyCheatSheetProps> = ({
  accordionOpen,
  setAccordionOpen,
}) => {
  return (
    <section className="accordion-wrapper">
      <button
        className="accordion-header-toggle"
        onClick={() => setAccordionOpen(!accordionOpen)}
      >
        <span>🌊 The Valley Reservoir Analogy Cheat Sheet (Most Water in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid">
            <div className="accordion-card">
              <div className="accordion-card-title anchor" style={{ color: 'var(--theme-accent-secondary)' }}>
                <span>📐</span>
                <span>1. Maximize the Span (Start Wide)</span>
              </div>
              <p className="accordion-card-desc">
                Place <code>L</code> at the far left and <code>R</code> at the far right. This gives you the <strong>absolute maximum width</strong> possible at the start.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold" style={{ color: '#06b6d4' }}>
                <span>🧱</span>
                <span>2. The Shorter Wall Bottleneck</span>
              </div>
              <p className="accordion-card-desc">
                Water cannot rise higher than the **shorter** of the two walls. The shorter wall is the ultimate bottleneck for container height.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot" style={{ color: '#f59e0b' }}>
                <span>🚨</span>
                <span>3. Eliminate Weak Links</span>
              </div>
              <p className="accordion-card-desc">
                Moving the taller wall inward shrinks the width without any chance of lifting the water level. We **must squeeze the shorter wall inward** to look for taller walls.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony" style={{ color: '#10b981' }}>
                <span>🎯</span>
                <span>4. Record the Jackpot</span>
              </div>
              <p className="accordion-card-desc">
                For each pointer configuration, compute the water capacity (<code>width * height</code>). Keep a running tally of the **maximum capacity** observed.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
