import React from 'react';
import type { TakeData, SignWord } from '../../types';
import { RotateCcw, Send, CheckCircle2, Sparkles } from 'lucide-react';

interface ThreeTakesReviewProps {
  word: SignWord;
  takes: TakeData[];
  onRetakeSingle: (takeNumber: 1 | 2 | 3) => void;
  onSubmitAll: () => void;
  isSubmitting: boolean;
}

export const ThreeTakesReview: React.FC<ThreeTakesReviewProps> = ({
  word,
  takes,
  onRetakeSingle,
  onSubmitAll,
  isSubmitting
}) => {
  return (
    <div className="three-takes-container">
      {/* Title Header */}
      <div className="review-header">
        <div className="celebration-chip">
          <CheckCircle2 size={16} className="check-icon" />
          <span>¡Las 3 tomas están listas!</span>
        </div>
        <h1 className="word-title">{word.word}</h1>
        <p className="review-sub">Revisa tus videos antes de enviarlos.</p>
      </div>

      {/* 3 Video Cards Grid */}
      <div className="takes-grid">
        {takes.map((take) => {
          return (
            <div key={take.takeNumber} className="take-card glass-card">
              <div className="take-card-media">
                {take.videoUrl ? (
                  <video
                    src={take.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="take-thumbnail"
                  />
                ) : (
                  <div className="empty-take-placeholder">Toma {take.takeNumber}</div>
                )}
                <div className="take-badge-label">
                  <span>Toma {take.takeNumber}</span>
                  <span className="check-mini">✓</span>
                </div>
              </div>

              <div className="take-card-actions">
                <button
                  className="btn-retake-small"
                  onClick={() => onRetakeSingle(take.takeNumber)}
                  disabled={isSubmitting}
                >
                  <RotateCcw size={13} />
                  <span>Volver a grabar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reward Estimation Card */}
      <div className="reward-summary-card">
        <div className="reward-info">
          <Sparkles size={18} className="gold-sparkle" />
          <div>
            <span className="reward-value">+{word.basePoints + (word.isPriority ? word.priorityBonus : 0)} puntos</span>
            <span className="reward-note">
              {word.isPriority ? 'Incluye +15 pts por seña prioritaria' : 'Aporte de 3 tomas verificado'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Submit Action CTA */}
      <div className="submit-action-area">
        <button
          className="btn-action-primary submit-btn"
          onClick={onSubmitAll}
          disabled={isSubmitting}
        >
          <Send size={20} />
          <span>{isSubmitting ? 'Enviando...' : 'Enviar aporte'}</span>
        </button>
      </div>

      <style>{`
        .three-takes-container {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 20px 18px calc(40px + var(--safe-bottom));
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .review-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .celebration-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.16);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .check-icon {
          color: #10b981;
        }

        .word-title {
          font-size: 2.1rem;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .review-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .takes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .take-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg-card-solid);
          border-radius: var(--radius-md);
        }

        .take-card-media {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #020617;
          overflow: hidden;
        }

        .take-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .take-badge-label {
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(6px);
          padding: 3px 6px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
        }

        .check-mini {
          color: #34d399;
          font-weight: 900;
        }

        .take-card-actions {
          padding: 6px;
        }

        .btn-retake-small {
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          font-size: 0.68rem;
          font-weight: 600;
          padding: 6px 4px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .btn-retake-small:active {
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
        }

        .reward-summary-card {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-md);
          padding: 14px 18px;
        }

        .reward-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gold-sparkle {
          color: #fbbf24;
          flex-shrink: 0;
        }

        .reward-value {
          display: block;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: #fbbf24;
        }

        .reward-note {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .submit-action-area {
          margin-top: 10px;
        }

        .submit-btn {
          min-height: 60px;
          font-size: 1.15rem;
          background: var(--brand-gradient-warm);
          box-shadow: var(--shadow-gold);
        }
      `}</style>
    </div>
  );
};
