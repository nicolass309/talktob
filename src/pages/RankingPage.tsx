import React, { useState } from 'react';
import { RANKING_WEEKLY, RANKING_ALL_TIME } from '../services/mockDataService';
import type { RankingUser } from '../types';
import { Trophy, Medal, Sparkles, MapPin, Crown } from 'lucide-react';

export const RankingPage: React.FC = () => {
  const [tab, setTab] = useState<'semanal' | 'historico'>('semanal');
  const rankingList = tab === 'semanal' ? RANKING_WEEKLY : RANKING_ALL_TIME;

  return (
    <div className="ranking-screen-wrap">
      {/* Header */}
      <div className="ranking-header">
        <div className="ranking-trophy-badge">
          <Trophy size={28} />
        </div>
        <h1 className="ranking-main-title">Top contribuidores</h1>
        <p className="ranking-sub">Reconocimiento a quienes hacen posible el dataset comunitario de LSCH.</p>
      </div>

      {/* Tabs */}
      <div className="ranking-tabs-bar">
        <button
          className={`ranking-tab-pill ${tab === 'semanal' ? 'active' : ''}`}
          onClick={() => setTab('semanal')}
        >
          Esta semana
        </button>
        <button
          className={`ranking-tab-pill ${tab === 'historico' ? 'active' : ''}`}
          onClick={() => setTab('historico')}
        >
          Histórico
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="podium-container">
        {rankingList.slice(0, 3).map((u: RankingUser, idx: number) => {
          const podiumOrder = idx === 0 ? 'first' : idx === 1 ? 'second' : 'third';
          return (
            <div key={u.name} className={`podium-card glass-card ${podiumOrder}`}>
              <div className="podium-rank-badge">
                {idx === 0 && <Crown size={14} className="crown-icon" />}
                {idx === 1 && <Medal size={14} className="silver-icon" />}
                {idx === 2 && <Medal size={14} className="bronze-icon" />}
                <span>#{u.rank}</span>
              </div>
              <img src={u.avatar} alt={u.name} className="podium-avatar" />
              <span className="podium-name">{u.name.split(' ')[0]}</span>
              <strong className="podium-points">{u.points.toLocaleString('es-CL')} pts</strong>
              <span className="podium-region">{u.region}</span>
            </div>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <div className="ranking-list-stack">
        {rankingList.map((user: RankingUser) => {
          return (
            <div
              key={user.name}
              className={`ranking-row glass-card ${user.isCurrentUser ? 'current-user-highlight' : ''}`}
            >
              <div className="ranking-rank-num">
                {user.rank === 1 && <Crown size={18} className="gold-icon" />}
                {user.rank === 2 && <Medal size={18} className="silver-icon" />}
                {user.rank === 3 && <Medal size={18} className="bronze-icon" />}
                {user.rank > 3 && <span>#{user.rank}</span>}
              </div>

              <img src={user.avatar} alt={user.name} className="ranking-row-avatar" />

              <div className="ranking-row-info">
                <div className="ranking-row-name">
                  <span>{user.name}</span>
                  {user.isCurrentUser && <span className="you-chip">Tú</span>}
                </div>
                <div className="ranking-row-meta">
                  <MapPin size={11} />
                  <span>{user.region} • {user.videos} videos</span>
                </div>
              </div>

              <div className="ranking-row-points">
                <Sparkles size={14} className="sparkle-gold" />
                <span>{user.points.toLocaleString('es-CL')} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .ranking-screen-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 20px calc(32px + var(--safe-bottom));
          animation: fadeIn 0.3s ease-out;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .ranking-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .ranking-trophy-badge {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--brand-gradient-action);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: var(--shadow-cyan);
        }

        .ranking-main-title {
          font-size: 1.8rem;
          color: #ffffff;
        }

        .ranking-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .ranking-tabs-bar {
          display: flex;
          background: rgba(0, 54, 77, 0.6);
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          max-width: 400px;
          margin: 0 auto;
          width: 100%;
        }

        .ranking-tab-pill {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ranking-tab-pill.active {
          background: var(--brand-gradient-action);
          color: #ffffff;
          box-shadow: var(--shadow-cyan);
        }

        .podium-container {
          display: grid;
          grid-template-columns: 1fr 1.15fr 1fr;
          gap: 12px;
          align-items: flex-end;
          margin-top: 6px;
        }

        .podium-card {
          padding: 16px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          position: relative;
        }

        .podium-card.first {
          border-color: rgba(0, 178, 227, 0.5);
          background: radial-gradient(circle at 50% 0%, rgba(0, 178, 227, 0.25), var(--bg-card-solid) 80%);
          padding-bottom: 24px;
        }

        .podium-rank-badge {
          position: absolute;
          top: -10px;
          background: var(--brand-gradient-action);
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .podium-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-subtle);
        }

        .podium-card.first .podium-avatar {
          width: 64px;
          height: 64px;
          border-color: var(--brand-cyan);
        }

        .podium-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .podium-points {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: var(--brand-cyan);
        }

        .podium-region {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .ranking-list-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ranking-row {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .current-user-highlight {
          border-color: var(--brand-cyan);
          background: rgba(0, 178, 227, 0.15);
        }

        .ranking-rank-num {
          width: 32px;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crown-icon, .gold-icon { color: #fbbf24; }
        .silver-icon { color: #cbd5e1; }
        .bronze-icon { color: #f97316; }

        .ranking-row-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .ranking-row-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ranking-row-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .you-chip {
          background: var(--brand-cyan);
          color: #002638;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .ranking-row-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .ranking-row-points {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: var(--brand-cyan);
        }
      `}</style>
    </div>
  );
};
