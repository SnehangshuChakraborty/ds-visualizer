import React, { useMemo } from 'react';

// Central regex-based syntax highlighter for Java code
function highlightJavaLine(line: string): React.ReactNode[] {
  if (!line.trim()) return [line]; // preserve indentation spaces for empty lines

  // Match comments first
  const commentRegex = /(\/\/.*)$/;
  const commentMatch = line.match(commentRegex);
  let codePart = line;
  let commentPart = '';
  if (commentMatch) {
    codePart = line.substring(0, commentMatch.index);
    commentPart = commentMatch[0];
  }

  const keywords = ['class', 'public', 'private', 'new', 'for', 'while', 'if', 'else', 'return', 'import', 'void'];
  const types = ['int', 'double', 'boolean', 'char', 'float', 'Integer', 'Math', 'List', 'ArrayList'];

  // Token regex matching:
  // Group 1: Numbers (literals)
  // Group 2: Words (identifiers, keywords, types)
  // Group 3: Braces/Brackets/Punctuation
  // Group 4: Whitespace
  // Group 5: Operators or fallback
  const tokenRegex = /(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([{}()\[\];,.])|(\s+)|([^A-Za-z0-9_\s{}()\[\];,.#]+)/g;

  const result: React.ReactNode[] = [];
  let keyIndex = 0;

  const addSpan = (text: string, className?: string) => {
    result.push(
      className ? (
        <span key={keyIndex++} className={className}>{text}</span>
      ) : (
        text
      )
    );
  };

  const matches = Array.from(codePart.matchAll(tokenRegex));
  for (const match of matches) {
    const text = match[0];
    const num = match[1];
    const word = match[2];

    if (num) {
      addSpan(text, 'syntax-literal');
    } else if (word) {
      if (keywords.includes(text)) {
        addSpan(text, 'syntax-keyword');
      } else if (types.includes(text)) {
        addSpan(text, 'syntax-type');
      } else if (text === 'Solution') {
        addSpan(text, 'syntax-class');
      } else {
        // Look ahead to check if this is a method call
        const nextIndex = match.index! + text.length;
        const remainder = codePart.substring(nextIndex).trimStart();
        if (remainder.startsWith('(')) {
          addSpan(text, 'syntax-method');
        } else {
          addSpan(text);
        }
      }
    } else {
      addSpan(text);
    }
  }

  if (commentPart) {
    addSpan(commentPart, 'syntax-comment');
  }

  return result;
}

interface CodeEditorProps {
  currentStepHighlightLine: number;
  wrongLineHighlight?: number | null;
  activeBoundaryTip?: number | null;
  setActiveBoundaryTip?: (line: number | null) => void;
  codeRaw: string;
  boundaryLines?: number[];
  boundaryConditions?: Record<number, { icon: string; title: string; mnemonic: string; why: string }>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  currentStepHighlightLine,
  wrongLineHighlight = null,
  activeBoundaryTip = null,
  setActiveBoundaryTip = () => {},
  codeRaw,
  boundaryLines = [],
  boundaryConditions = {},
}) => {
  // Dynamically parse raw Java text into highlighted code line structures
  const codeLines = useMemo(() => {
    return codeRaw.split('\n').map((lineText, idx) => {
      const lineNum = idx + 1;
      return {
        number: lineNum,
        content: <>{highlightJavaLine(lineText)}</>,
      };
    });
  }, [codeRaw]);

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
