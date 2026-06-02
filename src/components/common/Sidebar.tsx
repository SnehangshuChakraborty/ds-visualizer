import React from 'react';
import type { ProblemType } from '../../types';

interface SidebarProps {
  selectedProblem: ProblemType;
  setSelectedProblem: (problem: ProblemType) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedProblem,
  setSelectedProblem,
  collapsed,
  onCollapse,
}) => {
  return (
    <aside className={`sidebar-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
        <span className="sidebar-title" style={{ margin: 0, border: 'none', padding: 0 }}>📁 Problem Explorer</span>
        <button className="sidebar-collapse-btn" onClick={() => onCollapse(true)} title="Collapse Sidebar">
          ◀
        </button>
      </div>

      <div className="sidebar-category">
        <div className="category-title">
          <span className="category-icon">📚</span>
          <span>Arrays</span>
        </div>

        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === '3sum' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('3sum')}
            >
              <span>Three Sum (3Sum)</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'median' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('median')}
            >
              <span>Median of 2 Sorted Arrays</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'coinchange2' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('coinchange2')}
            >
              <span>Coin Change II (518)</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'container' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('container')}
            >
              <span>Container with Most Water (11)</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'rotting-oranges' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('rotting-oranges')}
            >
              <span>Rotting Oranges (994)</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === '2sum' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('2sum')}
            >
              <span>Two Sum (2Sum)</span>
              <span className="coming-soon-badge">Soon</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-category" style={{ marginTop: '1.5rem' }}>
        <div className="category-title">
          <span className="category-icon">🔤</span>
          <span>Strings</span>
        </div>

        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'longest-substring' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('longest-substring')}
            >
              <span>Longest Substring</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item-btn ${selectedProblem === 'palindrome' ? 'active' : ''}`}
              onClick={() => setSelectedProblem('palindrome')}
            >
              <span>Longest Palindrome</span>
              <span className="sidebar-item-bullet"></span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
export default Sidebar;
