import React from 'react';

interface CodeLine {
  number: number;
  content: React.ReactNode;
}

interface CodeEditorProps {
  currentStepHighlightLine: number;
  wrongLineHighlight?: number | null;
  activeBoundaryTip?: number | null;
  setActiveBoundaryTip?: (line: number | null) => void;
  codeLines: CodeLine[];
  boundaryLines?: number[];
  boundaryConditions?: Record<number, { icon: string; title: string; mnemonic: string; why: string }>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  currentStepHighlightLine,
  wrongLineHighlight = null,
  activeBoundaryTip = null,
  setActiveBoundaryTip = () => {},
  codeLines,
  boundaryLines = [],
  boundaryConditions = {},
}) => {
  return (
    <section className="editor-container">
      <div className="editor-header">
        <div className="window-dots">
          <div className="dot red" />
          <div className="dot yellow" />
          <div className="dot green" />
        </div>
        <div className="file-tab">
          <span className="file-icon">☕</span>
          <span>Solution.java</span>
        </div>
        <div className="lang-badge">JAVA</div>
      </div>

      <div className="editor-body">
        {codeLines.map((line) => {
          const isActive = currentStepHighlightLine === line.number;
          const isWrongHighlight = wrongLineHighlight === line.number;
          const hasBoundary = boundaryLines.includes(line.number);
          const isTipOpen = activeBoundaryTip === line.number;

          let lineClass = 'code-line';
          if (isActive) lineClass += ' active';
          if (isWrongHighlight) lineClass += ' error-shake';

          return (
            <div key={line.number}>
              <div className={lineClass}>
                <div className="line-number">{line.number}</div>
                <div className="line-content">
                  {line.content}
                  {hasBoundary && (
                    <span
                      className={`boundary-alert-badge ${isTipOpen ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBoundaryTip(isTipOpen ? null : line.number);
                      }}
                      title="Click to reveal boundary condition mnemonic"
                    >
                      ⚠️
                    </span>
                  )}
                </div>
              </div>
              {hasBoundary && isTipOpen && (() => {
                const bc = boundaryConditions[line.number];
                if (!bc) return null;
                return (
                  <div className="boundary-tooltip-box">
                    <div className="boundary-tooltip-header">
                      <span>{bc.icon}</span>
                      <span>{bc.title}</span>
                    </div>
                    <div className="boundary-tooltip-desc">
                      <strong style={{ color: '#fbbf24' }}>{bc.mnemonic}</strong>
                      <br />
                      {bc.why}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default CodeEditor;
