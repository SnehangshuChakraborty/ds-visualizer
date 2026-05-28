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
        <span>🪗 The Accordion Analogy Cheat Sheet (3Sum in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid">
            <div className="accordion-card">
              <div className="accordion-card-title anchor">
                <span>⚓</span>
                <span>1. Lock the Anchor (i)</span>
              </div>
              <p className="accordion-card-desc">
                Pick one element at index <code>i</code> and glue it to the floor. We search the remaining elements to combine with this anchor.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold">
                <span>❄️</span>
                <span>2. Too Cold? (L ➡️)</span>
              </div>
              <p className="accordion-card-desc">
                If the sum is <strong>negative (&lt; 0)</strong>, it is too cold! Squeeze your Left hand inward to step into larger numbers.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot">
                <span>🔥</span>
                <span>3. Too Hot? (⬅️ R)</span>
              </div>
              <p className="accordion-card-desc">
                If the sum is <strong>positive (&gt; 0)</strong>, it is too hot! Squeeze your Right hand inward to step into smaller numbers.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony">
                <span>🎉</span>
                <span>4. Harmony! (L & R Squeeze)</span>
              </div>
              <p className="accordion-card-desc">
                If sum is <strong>exactly 0</strong>, you found a match! Lock the triplet, celebrate, and squeeze both pointers inward to look for more.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
