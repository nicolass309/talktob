import React from 'react';
import { useApp } from '../../context/AppContext';
import { TalktoBLogo } from '../common/TalktoBLogo';
import type { AppScreen, SignWord } from '../../types';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Wifi, WifiOff, RefreshCw, Sparkles, Home, Target, Trophy, User, Video, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    userProfile,
    isOnline,
    toggleNetworkSimulation,
    offlineQueue,
    syncOfflineQueue,
    words,
    startContributionForWord
  } = useApp();

  const handleQuickRecord = () => {
    const priority = words.find((w: SignWord) => w.isPriority) || words[0];
    if (priority) {
      startContributionForWord(priority);
    } else {
      setScreen('capture');
    }
  };

  const navItems: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Aportes', icon: <Home size={18} /> },
    { screen: 'challenges', label: 'Desafíos', icon: <Target size={18} /> },
    { screen: 'ranking', label: 'Ranking', icon: <Trophy size={18} /> },
    { screen: 'profile', label: 'Perfil', icon: <User size={18} /> }
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Official Brand Logo */}
        <div className="header-logo-click" onClick={() => setScreen('home')}>
          <TalktoBLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                className={`desktop-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setScreen(item.screen)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <button className="desktop-record-cta" onClick={handleQuickRecord}>
            <Video size={16} />
            <span>Grabar</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-right-actions">
          {/* Connection Mode Selector Pill */}
          <button
            className={`network-pill ${isOnline ? 'online' : 'offline'}`}
            onClick={toggleNetworkSimulation}
            title={isOnline ? 'Conexión activa (Simular modo sin internet)' : 'Modo sin conexión'}
          >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="net-status-text">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {/* Pending Sync Count */}
          {offlineQueue.length > 0 && (
            <button
              className="pending-sync-pill"
              onClick={syncOfflineQueue}
              title={`${offlineQueue.length} aportes locales guardados. Sincronizar.`}
            >
              <RefreshCw size={13} className={isOnline ? 'spinning' : ''} />
              <span>{offlineQueue.length}</span>
            </button>
          )}

          {/* User Points Chip */}
          <div className="points-chip" onClick={() => setScreen('profile')}>
            <Sparkles size={14} className="sparkle-gold" />
            <span className="points-number">{userProfile.points}</span>
            <span className="points-label">pts</span>
          </div>

          {/* Clerk Auth Integration */}
          <div className="clerk-user-avatar-wrap">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="clerk-login-btn" title="Ingresar con Google">
                  <LogIn size={15} />
                  <span>Ingresar</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      <style>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 45;
          background: rgba(0, 38, 56, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 10px 20px;
        }

        .header-container {
          max-width: var(--max-content-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .header-logo-click {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .desktop-nav-links {
          display: none;
        }

        @media (min-width: 900px) {
          .desktop-nav-links {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(0, 54, 77, 0.6);
            padding: 4px 8px;
            border-radius: var(--radius-full);
            border: 1px solid var(--border-subtle);
          }

          .desktop-nav-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-family: var(--font-body);
            font-size: 0.88rem;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: var(--radius-full);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .desktop-nav-btn:hover {
            color: #ffffff;
          }

          .desktop-nav-btn.active {
            background: rgba(0, 178, 227, 0.2);
            color: var(--brand-cyan);
            border: 1px solid rgba(0, 178, 227, 0.3);
          }

          .desktop-record-cta {
            display: flex;
            align-items: center;
            gap: 6px;
            background: var(--brand-gradient-action);
            color: #ffffff;
            font-family: var(--font-display);
            font-size: 0.88rem;
            font-weight: 800;
            padding: 8px 18px;
            border-radius: var(--radius-full);
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-cyan);
          }
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .network-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .network-pill.online {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald-light);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .network-pill.offline {
          background: rgba(139, 92, 246, 0.2);
          color: #c084fc;
          border-color: rgba(139, 92, 246, 0.4);
        }

        .pending-sync-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.18);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .points-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .sparkle-gold {
          color: #fbbf24;
        }

        .points-number {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .points-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #fbbf24;
          text-transform: uppercase;
        }

        .clerk-user-avatar-wrap {
          display: flex;
          align-items: center;
          margin-left: 4px;
        }

        .clerk-login-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </header>
  );
};
