import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Badge, Contribution } from '../types';
import { Award, Video, FileText, Sparkles, MapPin, Heart, Clock, CheckCircle2, CloudOff, Trophy, Zap, Flame } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userProfile, pastContributions, offlineQueue } = useApp();
  const [activeTab, setActiveTab] = useState<'estadisticas' | 'historial'>('estadisticas');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award size={20} className="badge-svg text-cyan" />;
      case 'Zap': return <Zap size={20} className="badge-svg text-gold" />;
      case 'Flame': return <Flame size={20} className="badge-svg text-emerald" />;
      default: return <Award size={20} className="badge-svg" />;
    }
  };

  return (
    <div className="profile-screen-wrap">
      {/* 19. PERFIL DE USUARIO */}
      <div className="profile-header-card glass-card">
        <div className="profile-avatar-wrap">
          <img src={userProfile.avatar} alt={userProfile.name} className="profile-avatar-img" />
          <span className="profile-level-badge">Nivel {userProfile.level}</span>
        </div>

        <div className="profile-user-info">
          <h1 className="profile-name">{userProfile.name}</h1>
          <div className="profile-tags-row">
            <span className="profile-tag">
              <MapPin size={12} />
              {userProfile.specificRegion || userProfile.regionZone}
            </span>
            <span className="profile-tag">
              <Heart size={12} />
              {userProfile.relationWithLSCH}
            </span>
          </div>
        </div>
      </div>

      {/* 19. ESTADÍSTICAS EN 4 BLOQUES */}
      <div className="stats-four-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon-gold"><Sparkles size={20} /></div>
          <strong className="stat-num">{userProfile.points}</strong>
          <span className="stat-lbl">Puntos</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-cyan"><Award size={20} /></div>
          <strong className="stat-num">{userProfile.contributionsCount}</strong>
          <span className="stat-lbl">Aportes</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-purple"><Video size={20} /></div>
          <strong className="stat-num">{userProfile.videosCount}</strong>
          <span className="stat-lbl">Videos</span>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-emerald"><FileText size={20} /></div>
          <strong className="stat-num">{userProfile.wordsCount}</strong>
          <span className="stat-lbl">Palabras</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-row">
        <button
          className={`profile-tab-btn ${activeTab === 'estadisticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('estadisticas')}
        >
          Tu contribución
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial de aportes
          {offlineQueue.length > 0 && (
            <span className="queue-counter">{offlineQueue.length}</span>
          )}
        </button>
      </div>

      {/* TAB 1: TU CONTRIBUCIÓN */}
      {activeTab === 'estadisticas' && (
        <div className="tab-content-stack">
          {/* Insignias */}
          <div className="badges-section glass-card">
            <h3 className="section-title">Insignias obtenidas</h3>
            <div className="badges-list">
              {userProfile.badges.map((b: Badge) => (
                <div key={b.id} className="badge-item">
                  <div className="badge-icon-box">{getBadgeIcon(b.icon)}</div>
                  <div className="badge-info">
                    <span className="badge-name">{b.name}</span>
                    <span className="badge-desc">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posición de Ranking */}
          <div className="ranking-position-card glass-card">
            <div className="ranking-badge-gold">
              <Trophy size={18} />
              <span>#5 en Chile</span>
            </div>
            <div className="ranking-pos-info">
              <span className="pos-title">Top 10 de Contribuidores Semanales</span>
              <span className="pos-sub">Estás a solo 3 aportes de subir al #4 lugar.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL DE APORTES */}
      {activeTab === 'historial' && (
        <div className="history-list-stack">
          {pastContributions.length > 0 ? (
            pastContributions.map((contrib: Contribution) => (
              <div key={contrib.id} className="history-item-card glass-card">
                <div className="history-item-left">
                  <div className="history-word-name">{contrib.wordName}</div>
                  <span className="history-category">{contrib.category}</span>
                  <div className="history-time">
                    <Clock size={12} />
                    <span>{new Date(contrib.createdAt).toLocaleDateString('es-CL')}</span>
                  </div>
                </div>

                <div className="history-item-right">
                  <span className="points-pill-gold">+{contrib.pointsEarned} pts</span>
                  {contrib.status === 'guardado_localmente' && (
                    <span className="status-offline-tag">
                      <CloudOff size={12} />
                      <span>Guardado localmente</span>
                    </span>
                  )}
                  {contrib.status === 'procesando' && (
                    <span className="status-processing-tag">
                      <Clock size={12} />
                      <span>En revisión (procesando)</span>
                    </span>
                  )}
                  {contrib.status === 'completado' && (
                    <span className="status-done-tag">
                      <CheckCircle2 size={12} />
                      <span>Aporte validado</span>
                    </span>
                  )}
                  {contrib.status === 'error' && (
                    <span className="status-error-tag">
                      <span>Error en aporte</span>
                    </span>
                  )}
                  {!['guardado_localmente', 'procesando', 'completado', 'error'].includes(contrib.status) && (
                    <span className="status-processing-tag">
                      <Clock size={12} />
                      <span>{contrib.status}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-history glass-card">
              <p>Aún no tienes aportes grabados.</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .profile-screen-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 20px calc(32px + var(--safe-bottom));
          animation: fadeIn 0.3s ease-out;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .profile-header-card {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-color: var(--border-brand);
        }

        .profile-avatar-wrap {
          position: relative;
          width: 76px;
          height: 76px;
          flex-shrink: 0;
        }

        .profile-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--brand-cyan);
        }

        .profile-level-badge {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--brand-gradient-action);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .profile-user-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .profile-name {
          font-size: 1.6rem;
          color: #ffffff;
          line-height: 1.1;
        }

        .profile-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .profile-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .stats-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .stat-card {
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
        }

        .stat-icon-gold { color: #fbbf24; }
        .stat-icon-cyan { color: var(--brand-cyan); }
        .stat-icon-purple { color: #c084fc; }
        .stat-icon-emerald { color: var(--accent-emerald-light); }

        .stat-num {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .stat-lbl {
          font-size: 0.76rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .profile-tabs-row {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 8px;
        }

        .profile-tab-btn {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .profile-tab-btn.active {
          background: rgba(0, 178, 227, 0.18);
          border-color: var(--brand-cyan);
          color: var(--brand-cyan-light);
        }

        .queue-counter {
          background: #8b5cf6;
          color: #fff;
          font-size: 0.72rem;
          padding: 1px 8px;
          border-radius: 10px;
        }

        .tab-content-stack, .history-list-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .badges-section {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .badges-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .badge-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.04);
          padding: 12px 14px;
          border-radius: var(--radius-md);
        }

        .badge-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-svg.text-cyan { color: var(--brand-cyan); }
        .badge-svg.text-gold { color: #fbbf24; }
        .badge-svg.text-emerald { color: var(--accent-emerald-light); }

        .badge-info {
          display: flex;
          flex-direction: column;
        }

        .badge-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }

        .badge-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .ranking-position-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ranking-badge-gold {
          background: var(--brand-gradient-action);
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 800;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ranking-pos-info {
          display: flex;
          flex-direction: column;
        }

        .pos-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }

        .pos-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .history-item-card {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .history-word-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .history-category {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .history-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .history-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .points-pill-gold {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 800;
          color: #fbbf24;
        }

        .status-done-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: var(--accent-emerald-light);
        }

        .status-processing-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: #fbbf24;
        }

        .status-error-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: #ef4444;
        }

        .status-offline-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: #c084fc;
        }

        .empty-history {
          padding: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
