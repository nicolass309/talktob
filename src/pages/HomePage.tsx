import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { SignWord } from '../types';
import { CreateWordModal } from '../components/common/CreateWordModal';
import {
  Video,
  Search,
  Zap,
  PlusCircle,
  AlertTriangle,
  Users,
  Activity,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    words,
    startContributionForWord,
    communityProgress,
    userProfile
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredWords = useMemo(() => {
    return words.filter((w: SignWord) => {
      const matchSearch = w.word.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchCat = selectedCategory === 'Todas' || w.category.includes(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [words, searchQuery, selectedCategory]);

  const priorityNeedWords = useMemo(() => {
    return [...words]
      .sort((a, b) => (a.currentVideos / a.targetVideos) - (b.currentVideos / b.targetVideos))
      .slice(0, 4);
  }, [words]);

  const handleQuickMainAction = () => {
    const priority = words.find((w: SignWord) => w.isPriority && w.currentVideos < w.targetVideos) || words[0];
    if (priority) {
      startContributionForWord(priority);
    }
  };

  const progressPercentage = Math.min(
    100,
    Math.round((communityProgress.totalContributions / communityProgress.targetContributions) * 100)
  );

  return (
    <div className="home-screen-wrap">
      {/* 6.1 HERO PROGRESO COMUNITARIO */}
      <div className="community-hero-card glass-card">
        <div className="hero-top-row">
          <div className="brand-chip">
            <Users size={15} />
            <span>Dataset Colectivo LSCH</span>
          </div>
          <div className="live-status-pill">
            <Activity size={12} className="pulse-icon" />
            <span>En línea</span>
          </div>
        </div>

        <div className="hero-body-grid">
          <div className="hero-main-text">
            <h1 className="hero-title">Estamos construyendo el dataset de LSCH</h1>
            <p className="hero-subtitle">
              Plataforma colaborativa para entrenar modelos de Inteligencia Artificial en Lengua de Señas Chilena.
            </p>
          </div>

          <div className="hero-metric-box">
            <span className="metric-number">
              {communityProgress.totalContributions.toLocaleString('es-CL')}
            </span>
            <span className="metric-sub">aportes recolectados</span>
            <span className="metric-goal">Meta: {communityProgress.targetContributions.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-area">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="progress-meta-row">
            <span>Progreso nacional: <strong>{progressPercentage}%</strong></span>
            <span>{userProfile.videosCount} videos aportados por ti</span>
          </div>
        </div>
      </div>

      {/* RESPONSIVE LAYOUT GRID FOR DESKTOP AND MOBILE */}
      <div className="home-content-grid">
        {/* COLUMN 1: URGENT WORDS & QUICK ACTION */}
        <div className="grid-column-left">
          {/* Quick CTA Box */}
          <div className="primary-action-card">
            <div className="action-text">
              <span className="action-tag">Aporte Recomendado</span>
              <h2 className="action-title">Contribuye a la seña más urgente</h2>
              <p className="action-sub">Priorizamos automáticamente las palabras con menor cantidad de videos.</p>
            </div>
            <button className="btn-action-primary cta-thumb-large" onClick={handleQuickMainAction}>
              <Video size={22} />
              <span>Hacer un aporte</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* 8. PALABRAS QUE NECESITAMOS */}
          <div className="section-block">
            <div className="section-header">
              <div className="section-title-wrap">
                <Zap size={18} className="zap-icon" />
                <h2>Palabras prioritarias</h2>
              </div>
              <span className="reward-tag">+45 pts por aporte</span>
            </div>

            <div className="urgency-stack">
              {priorityNeedWords.map((word: SignWord) => (
                <div key={word.id} className="urgency-item glass-card">
                  <div className="urgency-item-info">
                    <div className="item-title-row">
                      <h3 className="word-name">{word.word}</h3>
                      {word.isPriority && <span className="tag-urgent">Urgente</span>}
                    </div>
                    <p className="word-desc">{word.description}</p>
                    <div className="word-progress-mini">
                      <div className="mini-track">
                        <div
                          className="mini-fill"
                          style={{ width: `${(word.currentVideos / word.targetVideos) * 100}%` }}
                        />
                      </div>
                      <span className="mini-count">
                        {word.currentVideos} / {word.targetVideos} videos
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-action-primary btn-record-small"
                    onClick={() => startContributionForWord(word)}
                  >
                    <Video size={16} />
                    <span>Grabar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: CATALOGUE SEARCH & CUSTOM SIGN ADDITION */}
        <div className="grid-column-right">
          <div className="section-block">
            <div className="section-header">
              <div className="section-title-wrap">
                <Search size={18} className="search-icon" />
                <h2>Explorar catálogo</h2>
              </div>
            </div>

            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-input-icon" />
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar seña (ej: HOSPITAL, GRACIAS)..."
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="category-filters">
              {['Todas', 'Emergencias', 'Cotidiano', 'Salud', 'Educación'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {filteredWords.length > 0 ? (
              <div className="results-grid">
                {filteredWords.map((w: SignWord) => (
                  <div key={w.id} className="result-card glass-card">
                    <div className="result-info">
                      <h4 className="result-title">{w.word}</h4>
                      <span className="result-category">{w.category}</span>
                      <span className="result-videos-count">{w.currentVideos} videos registrados</span>
                    </div>
                    <button
                      className="btn-action-secondary btn-record-row"
                      onClick={() => startContributionForWord(w)}
                    >
                      <Video size={15} />
                      <span>Grabar esta seña</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* 9. PALABRA INEXISTENTE FALLBACK */
              <div className="not-found-card glass-card">
                <AlertTriangle size={28} className="alert-icon" />
                <h3>No encontramos esta seña</h3>
                <p>¿Quieres ayudarnos a incorporarla al dataset?</p>
                <button
                  className="btn-action-primary create-word-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusCircle size={18} />
                  <span>Crear nueva seña</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE WORD MODAL */}
      {showCreateModal && (
        <CreateWordModal
          initialSearchQuery={searchQuery}
          onClose={() => setShowCreateModal(false)}
          onWordCreated={(newWord: SignWord) => {
            setShowCreateModal(false);
            setSearchQuery('');
            startContributionForWord(newWord);
          }}
        />
      )}

      <style>{`
        .home-screen-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px 20px calc(32px + var(--safe-bottom));
          animation: fadeIn 0.3s ease-out;
        }

        .community-hero-card {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: radial-gradient(circle at 100% 0%, rgba(0, 178, 227, 0.2), var(--bg-card-solid) 80%);
          border-color: var(--border-brand);
        }

        .hero-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--brand-cyan);
        }

        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald-light);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .hero-body-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 900px) {
          .hero-body-grid {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .hero-title {
          font-size: 1.8rem;
          color: #ffffff;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 540px;
          margin-top: 4px;
        }

        .hero-metric-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: rgba(0, 38, 56, 0.6);
          padding: 14px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .metric-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .metric-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .metric-goal {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--brand-cyan);
          margin-top: 4px;
        }

        .progress-bar-area {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-track {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--brand-gradient-action);
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-cyan);
          transition: width 0.5s ease-out;
        }

        .progress-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Home Content Grid (Responsive Desktop Layout) */
        .home-content-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (min-width: 900px) {
          .home-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 28px;
            align-items: start;
          }
        }

        .grid-column-left, .grid-column-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .primary-action-card {
          background: linear-gradient(135deg, #005073 0%, #00364d 100%);
          border: 1px solid var(--border-brand);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-md);
        }

        .action-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand-cyan);
        }

        .action-title {
          font-size: 1.4rem;
          color: #ffffff;
        }

        .action-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .cta-thumb-large {
          min-height: 56px;
          font-size: 1.1rem;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .zap-icon { color: var(--accent-gold); }
        .search-icon { color: var(--brand-cyan); }

        .reward-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.15);
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .urgency-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .urgency-item {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .urgency-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .word-name {
          font-size: 1.15rem;
          color: #ffffff;
        }

        .tag-urgent {
          font-size: 0.68rem;
          font-weight: 800;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .word-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .word-progress-mini {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }

        .mini-track {
          width: 90px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .mini-fill {
          height: 100%;
          background: var(--brand-cyan);
          border-radius: var(--radius-full);
        }

        .mini-count {
          font-size: 0.76rem;
          color: var(--text-secondary);
        }

        .btn-record-small {
          width: auto;
          min-height: 42px;
          padding: 8px 18px;
          font-size: 0.9rem;
        }

        .search-box {
          position: relative;
          width: 100%;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          min-height: 50px;
          padding: 10px 38px 10px 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #ffffff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
        }

        .search-input:focus {
          border-color: var(--brand-cyan);
          box-shadow: 0 0 16px rgba(0, 178, 227, 0.25);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .category-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .filter-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .filter-pill.active {
          background: rgba(0, 178, 227, 0.2);
          border-color: var(--brand-cyan);
          color: var(--brand-cyan-light);
        }

        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .result-card {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .result-info {
          display: flex;
          flex-direction: column;
        }

        .result-title {
          font-size: 1.05rem;
          color: #ffffff;
        }

        .result-category {
          font-size: 0.78rem;
          color: var(--brand-cyan);
        }

        .result-videos-count {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .btn-record-row {
          width: auto;
          min-height: 40px;
          padding: 6px 14px;
          font-size: 0.85rem;
        }

        .not-found-card {
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }

        .alert-icon {
          color: #fbbf24;
        }

        .create-word-btn {
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
