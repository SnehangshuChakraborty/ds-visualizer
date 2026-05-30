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
        <span>🫧 The Bubble Wrap Analogy (Sliding Window in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid">
            <div className="accordion-card">
              <div className="accordion-card-title anchor" style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                <span>🫧</span>
                <span>1. Inflate Bubble (R ➡️)</span>
              </div>
              <p className="accordion-card-desc">
                Move the leading edge <strong>Right pointer (R)</strong> forward to expand the window. Each new unique letter is added to our clean bubble.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span>💥</span>
                <span>2. Bubble Pop! (Collision)</span>
              </div>
              <p className="accordion-card-desc">
                Oh no! If the right pointer encounters a character that is <strong>already inside the HashSet</strong>, the bubble becomes unstable and pops!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
                <span>🧹</span>
                <span>3. Catch Up (L ➡️)</span>
              </div>
              <p className="accordion-card-desc">
                To patch the bubble, slide the trailing edge <strong>Left pointer (L)</strong> forward. Evict old characters from our HashSet until the duplicate is cleared out!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>📏</span>
                <span>4. Save the Record</span>
              </div>
              <p className="accordion-card-desc">
                Once all characters are unique again, measure the stable bubble's length: <code>right - left + 1</code>. Compare it and save it if it breaks your high score!
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
