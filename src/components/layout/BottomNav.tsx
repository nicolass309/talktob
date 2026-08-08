import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppScreen, SignWord } from '../../types';
import { Home, Trophy, User, Target, Video } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen, words, startContributionForWord } = useApp();

  const handleQuickRecord = () => {
    const priorityWord = words.find((w: SignWord) => w.isPriority) || words[0];
    if (priorityWord) {
      startContributionForWord(priorityWord);
    } else {
      setScreen('capture');
    }
  };

  const navItems: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Aportes', icon: <Home size={22} /> },
    { screen: 'challenges', label: 'Desafíos', icon: <Target size={22} /> },
    { screen: 'ranking', label: 'Ranking', icon: <Trophy size={22} /> },
    { screen: 'profile', label: 'Perfil', icon: <User size={22} /> }
  ];

  return (
    <nav className="bottom-nav-bar">
      <div className="bottom-nav-container">
        {navItems.slice(0, 2).map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              className={`nav-button ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.screen)}
            >
              <div className="nav-icon-wrap">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating CTA */}
        <div className="fab-container">
          <button
            className="fab-record-btn"
            onClick={handleQuickRecord}
            aria-label="Grabar aporte de seña LSCH"
          >
            <div className="fab-pulse-effect" />
            <Video size={24} className="fab-icon" />
            <span className="fab-text">Grabar</span>
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              className={`nav-button ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.screen)}
            >
              <div className="nav-icon-wrap">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .bottom-nav-bar {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 38, 56, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-subtle);
          padding: 8px 12px calc(8px + var(--safe-bottom));
          z-index: 50;
        }

        /* Hide bottom nav on desktop screens since top nav handles it */
        @media (min-width: 900px) {
          .bottom-nav-bar {
            display: none;
          }
        }

        .bottom-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          max-width: var(--max-content-width);
          margin: 0 auto;
          position: relative;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 60px;
        }

        .nav-button:active {
          transform: scale(0.92);
        }

        .nav-button.active {
          color: var(--brand-cyan);
        }

        .nav-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 600;
        }

        .fab-container {
          position: relative;
          top: -18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fab-record-btn {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: var(--brand-gradient-action);
          border: 3px solid #002638;
          box-shadow: var(--shadow-cyan);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          position: relative;
          outline: none;
        }

        .fab-record-btn:active {
          transform: scale(0.92);
        }

        .fab-pulse-effect {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(0, 178, 227, 0.35);
          z-index: -1;
          animation: pulse-ring 2.2s infinite;
        }

        .fab-icon {
          color: #ffffff;
        }

        .fab-text {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
        }
      `}</style>
    </nav>
  );
};
