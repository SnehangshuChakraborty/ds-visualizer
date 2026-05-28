import React, { useState, useEffect, useCallback } from 'react';

interface LaserClashProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  cutA: number;
  cutB: number;
  status: 'evaluating' | 'invalid-heavy-top' | 'invalid-heavy-bottom' | 'perfect-cut';
  highlightedLine: number;
}

export const LaserClash: React.FC<LaserClashProps> = ({
  parentRef,
  cutA,
  cutB,
  status,
  highlightedLine,
}) => {
  const [coords, setCoords] = useState({
    maxLeftA: { x: 0, y: 0 },
    minRightA: { x: 0, y: 0 },
    maxLeftB: { x: 0, y: 0 },
    minRightB: { x: 0, y: 0 },
  });

  const updateCoords = useCallback(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();

    const getCenter = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top + rect.height / 2,
      };
    };

    setCoords({
      maxLeftA: getCenter('champ-maxLeftA'),
      minRightA: getCenter('champ-minRightA'),
      maxLeftB: getCenter('champ-maxLeftB'),
      minRightB: getCenter('champ-minRightB'),
    });
  }, [parentRef]);

  useEffect(() => {
    updateCoords();
    // Request animation frame to ensure the DOM finishes layout drawing
    const handle = requestAnimationFrame(updateCoords);
    window.addEventListener('resize', updateCoords);
    
    // Also re-measure after 100ms as a safety buffer for flex layout changes
    const timer = setTimeout(updateCoords, 100);

    return () => {
      cancelAnimationFrame(handle);
      clearTimeout(timer);
      window.removeEventListener('resize', updateCoords);
    };
  }, [cutA, cutB, status, updateCoords]);

  // Determine active dynamic styles for the clashing SVG laser lines
  const getLaserClassTop = () => {
    if (status === 'perfect-cut') return 'laser-line success-laser';
    if (status === 'invalid-heavy-top') return 'laser-line error-laser-top';
    return 'laser-line evaluating-laser';
  };

  const getLaserClassBottom = () => {
    if (status === 'perfect-cut') return 'laser-line success-laser';
    if (status === 'invalid-heavy-bottom') return 'laser-line error-laser-bottom';
    return 'laser-line evaluating-laser';
  };

  const { maxLeftA, minRightA, maxLeftB, minRightB } = coords;

  // Hide clashing lasers during initial loading/partition phases (before cross-check starts at line 18)
  if (highlightedLine < 18 && status !== 'perfect-cut') {
    return null;
  }

  // Render SVG laser overlays
  return (
    <svg className="median-laser-svg">
      {/* Laser line 1: MaxLeft A to MinRight B (Top-Left to Bottom-Right) */}
      {maxLeftA.x !== 0 && minRightB.x !== 0 && (
        <line
          x1={maxLeftA.x}
          y1={maxLeftA.y}
          x2={minRightB.x}
          y2={minRightB.y}
          className={getLaserClassTop()}
        />
      )}

      {/* Laser line 2: MaxLeft B to MinRight A (Bottom-Left to Top-Right) */}
      {maxLeftB.x !== 0 && minRightA.x !== 0 && (
        <line
          x1={maxLeftB.x}
          y1={maxLeftB.y}
          x2={minRightA.x}
          y2={minRightA.y}
          className={getLaserClassBottom()}
        />
      )}
    </svg>
  );
};
export default LaserClash;
