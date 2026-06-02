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
        <span>🧟 The Zombie Apocalypse Analogy (Multi-Source BFS in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid">
            <div className="accordion-card">
              <div className="accordion-card-title anchor" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span>☣️</span>
                <span>1. Multi-Source Seeds</span>
              </div>
              <p className="accordion-card-desc">
                In standard BFS, you start from a single zero node. In Rotting Oranges, we have a <strong>multi-source BFS</strong>: all rotten oranges (zombies) start infecting their neighbors simultaneously as a united first generation wave.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
                <span>🌊</span>
                <span>2. Level-by-Level Waves</span>
              </div>
              <p className="accordion-card-desc">
                Infection spreads in chronological wavefront levels (minutes). We cache the queue size at the start of each minute to process all current zombies before incrementing the time.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>🛡️</span>
                <span>3. Symmetrical 4-Way Spread</span>
              </div>
              <p className="accordion-card-desc">
                Each active zombie checks exactly 4 neighbors: Up, Down, Left, and Right. If a neighbor is fresh (uninfected), it collapses into a zombie and joins the queue for the next wave.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                <span>🧱</span>
                <span>4. Isolated Quarantine</span>
              </div>
              <p className="accordion-card-desc">
                If empty cells (walls) completely surround a fresh orange, it remains uninfected. At the end of the BFS, if any fresh orange survives, return -1.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
