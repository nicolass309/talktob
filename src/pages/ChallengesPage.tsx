import React from 'react';
import { useApp } from '../context/AppContext';
import type { Challenge } from '../types';
import { Target, Sparkles, CheckCircle2, Video, ShieldAlert, MessageSquare, Activity } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { challenges, words, startContributionForWord } = useApp();

  const handleContinueChallenge = (challenge: Challenge) => {
    const matchingWord = words.find((w) => challenge.requiredWords.includes(w.word)) || words[0];
    if (matchingWord) {
      startContributionForWord(matchingWord);
    }
  };

  const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert size={22} className="chal-type-icon text-red" />;
      case 'MessageSquare': return <MessageSquare size={22} className="chal-type-icon text-cyan" />;
      case 'Activity': return <Activity size={22} className="chal-type-icon text-gold" />;
      default: return <Target size={22} className="chal-type-icon" />;
    }
  };

  return (
    <div className="challenges-screen-wrap">
      {/* HEADER */}
      <div className="challenges-header">
        <div className="challenge-icon-badge">
          <Target size={28} />
        </div>
        <h1 className="challenges-main-title">Desafíos de la comunidad</h1>
        <p className="challenges-sub">
          Completa conjuntos prioritarios de señas y obtén recompensas de puntos.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="challenges-grid">
        {challenges.map((chal: Challenge) => {
          const progressPercent = Math.min(100, Math.round((chal.currentCount / chal.targetCount) * 100));

          return (
            <div key={chal.id} className="challenge-card glass-card">
              <div className="challenge-top-row">
                <span className="challenge-category-tag">{chal.category}</span>
                <div className="challenge-icon-box">{getChallengeIcon(chal.icon)}</div>
              </div>

              <h2 className="challenge-card-title">{chal.title}</h2>
              <p className="challenge-card-desc">{chal.description}</p>

              {/* Progress Bar */}
              <div className="challenge-meter-wrap">
                <div className="meter-labels-row">
                  <span className="meter-caption">Progreso:</span>
                  <strong className="meter-fraction">
                    {chal.currentCount} / {chal.targetCount} señas
                  </strong>
                </div>
                <div className="challenge-track">
                  <div className="challenge-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Required Words */}
              <div className="required-words-chips">
                {chal.requiredWords.map((wordName: string) => (
                  <span key={wordName} className="req-word-chip">
                    {wordName}
                  </span>
                ))}
              </div>

              {/* Footer Row */}
              <div className="challenge-footer-row">
                <div className="reward-chip-gold">
                  <Sparkles size={16} />
                  <span>+{chal.bonusPoints} pts</span>
                </div>

                {chal.isCompleted ? (
                  <div className="completed-badge">
                    <CheckCircle2 size={16} />
                    <span>Completado</span>
                  </div>
                ) : (
                  <button
                    className="btn-action-primary continue-chal-btn"
                    onClick={() => handleContinueChallenge(chal)}
                  >
                    <Video size={16} />
                    <span>Continuar desafío</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .challenges-screen-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 20px calc(32px + var(--safe-bottom));
          animation: fadeIn 0.3s ease-out;
        }

        .challenges-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .challenge-icon-badge {
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

        .challenges-main-title {
          font-size: 1.8rem;
          color: #ffffff;
        }

        .challenges-sub {
          font-size: 0.92rem;
          color: var(--text-secondary);
          max-width: 440px;
        }

        .challenges-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 900px) {
          .challenges-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        .challenge-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .challenge-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .challenge-category-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brand-cyan);
          background: rgba(0, 178, 227, 0.15);
          padding: 3px 10px;
          border-radius: 4px;
        }

        .challenge-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chal-type-icon.text-red { color: #ef4444; }
        .chal-type-icon.text-cyan { color: var(--brand-cyan); }
        .chal-type-icon.text-gold { color: #fbbf24; }

        .challenge-card-title {
          font-size: 1.25rem;
          color: #ffffff;
        }

        .challenge-card-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .challenge-meter-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meter-labels-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .meter-caption { color: var(--text-secondary); }
        .meter-fraction { color: #fbbf24; font-family: var(--font-display); }

        .challenge-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .challenge-fill {
          height: 100%;
          background: var(--brand-gradient-action);
          border-radius: var(--radius-full);
        }

        .required-words-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .req-word-chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .challenge-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 4px;
        }

        .reward-chip-gold {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: var(--radius-full);
        }

        .continue-chal-btn {
          width: auto;
          min-height: 42px;
          padding: 6px 14px;
          font-size: 0.88rem;
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-emerald-light);
          font-size: 0.85rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
