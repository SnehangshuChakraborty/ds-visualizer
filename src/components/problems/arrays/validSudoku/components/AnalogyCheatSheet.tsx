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
        <span>🎛️ The Bitmask Lightswitch Analogy (Valid Sudoku in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            <div className="accordion-card">
              <div className="accordion-card-title harmony" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                <span>📦</span>
                <span>1. Three Tracker Arrays</span>
              </div>
              <p className="accordion-card-desc">
                Declare three 1D arrays of size 9: <code>rows</code>, <code>cols</code>, and <code>boxes</code>.
                Each holds bitmasks representing digits seen. <strong>Crucial:</strong> Do not name the tracking array <code>board</code> — that clashes with the input parameter <code>char[][] board</code>!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title anchor">
                <span>🎛️</span>
                <span>2. Bitmask = A Set of Switches</span>
              </div>
              <p className="accordion-card-desc">
                Each integer in our tracker arrays represents a panel of <strong>9 light switches</strong>.
                If a switch is already ON, the digit was seen before in that row/col/box — a conflict!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold">
                <span>⬅️</span>
                <span>3. Left Shift ({"<<"})</span>
              </div>
              <p className="accordion-card-desc">
                <code>1 {"<<"} val</code> is like walking <strong>val steps</strong> from the rightmost switch,
                then flipping only that one ON. It creates a number where <em>exactly one bit</em> is set — targeting
                the digit we're checking.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot">
                <span>🔍</span>
                <span>4. AND Check ({"&"})</span>
              </div>
              <p className="accordion-card-desc">
                Using <code>&</code> is like <strong>peeking</strong> at a switch without touching it.
                If the result is non-zero, that switch was already ON — a duplicate digit exists!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony">
                <span>✅</span>
                <span>5. OR Register ({"|="})</span>
              </div>
              <p className="accordion-card-desc">
                Using <code>|=</code> <strong>flips a switch ON permanently</strong>. It never turns OFF
                during the scan. This "registers" the digit so future cells can detect it as a duplicate.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title anchor" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                <span>🧩</span>
                <span>6. Box Index Formula</span>
              </div>
              <p className="accordion-card-desc">
                Formula: <code>(r / 3) * 3 + (c / 3)</code>. Think of a 3×3 grid of large blocks. Block-row is <code>r/3</code>, block-col is <code>c/3</code>. We map these 2D block coordinates to a 1D index using <code>row * width + col</code>, where width is 3.
              </p>
            </div>
          </div>

          {/* Pattern Spotlight */}
          <div className="pattern-spotlight">
            <div className="pattern-spotlight-header">
              <span>🔁</span>
              <span>Pattern Spotlight: Bitmask as Presence Set</span>
            </div>
            <p className="pattern-spotlight-desc">
              The <strong>"bitmask-as-presence-set"</strong> pattern appears in many problems beyond Valid Sudoku:
              <strong> N-Queens</strong> (tracking attacked columns and diagonals),
              <strong> Subset Generation</strong> (each bit = include/exclude),
              and <strong> Hamiltonian Path DP</strong> (visited node tracking).
              Mastering <code>1 {"<<"} val</code> gives you a tool that replaces <code>HashSet{"<"}Integer{">"}</code> with a single <code>int</code> — O(1) space, O(1) time per check.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
