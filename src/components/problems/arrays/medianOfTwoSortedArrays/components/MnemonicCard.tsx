import React from 'react';

export const MnemonicCard: React.FC = () => {
  return (
    <div className="mnemonic-cheat-card">
      <div className="mnemonic-card-header">
        <span>⚔️</span>
        <span>Cross-Border Weigh-In Rules</span>
      </div>

      <div className="mnemonic-card-body">
        <div className="mnemonic-rule-row">
          <span className="mnemonic-emoji">⚖️</span>
          <div className="mnemonic-desc">
            <strong>The Weigh-In:</strong> Left Heaviest must be lighter than or equal to Right Lightest (
            <code>MaxLeft &le; MinRight</code>).
          </div>
        </div>

        <div className="mnemonic-rule-row">
          <span className="mnemonic-emoji">🚨</span>
          <div className="mnemonic-desc">
            <strong>Top-Left crushing Bottom-Right?</strong> (<code>MaxLeftA &gt; MinRightB</code>). Top array partition is too heavy! Search **LEFT** on the top array.
          </div>
        </div>

        <div className="mnemonic-rule-row">
          <span className="mnemonic-emoji">🚨</span>
          <div className="mnemonic-desc">
            <strong>Bottom-Left crushing Top-Right?</strong> (<code>MaxLeftB &gt; MinRightA</code>). Bottom array partition is too heavy! Search **RIGHT** on the top array.
          </div>
        </div>
      </div>
    </div>
  );
};
