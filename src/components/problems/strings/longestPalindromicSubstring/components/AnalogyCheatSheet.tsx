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
        <span>🦋 The Butterfly Wings Analogy (Expand Around Center in 30 Seconds!)</span>
        <span className={`accordion-toggle-icon ${accordionOpen ? 'open' : ''}`}>▼</span>
      </button>

      {accordionOpen && (
        <div className="accordion-content">
          <div className="accordion-grid">
            <div className="accordion-card">
              <div className="accordion-card-title anchor" style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                <span>🎯</span>
                <span>1. Fix Center (C)</span>
              </div>
              <p className="accordion-card-desc">
                Select a mirror axis. This can be a single character <code>s[i]</code> (Odd center) or the narrow gap between characters <code>s[i]...s[i+1]</code> (Even center).
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title cold" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>
                <span>🦋</span>
                <span>2. Expand Wings (L ⬅️ ➡️ R)</span>
              </div>
              <p className="accordion-card-desc">
                Stretch your wings symmetrically outward! Slide the Left pointer leftward (L--) and the Right pointer rightward (R++) at equal speeds.
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title harmony" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>🧬</span>
                <span>3. Symmetry Verification</span>
              </div>
              <p className="accordion-card-desc">
                As long as the characters touched by the wingtips are identical (<code>s[L] == s[R]</code>), the palindrome is valid. Squeeze further outward!
              </p>
            </div>

            <div className="accordion-card">
              <div className="accordion-card-title hot" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span>💥</span>
                <span>4. Mismatch Collapse</span>
              </div>
              <p className="accordion-card-desc">
                If the wingtips touch different characters or step out-of-bounds, the expansion halts immediately. Record the best wingspan achieved!
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
