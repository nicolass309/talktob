import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Video, CheckCircle2 } from 'lucide-react';

interface CelebrationModalProps {
  pointsEarned: number;
  wordName: string;
  totalPoints: number;
  isPriority: boolean;
  onMakeAnother: () => void;
  onViewProgress: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  pointsEarned,
  wordName,
  totalPoints,
  isPriority,
  onMakeAnother,
  onViewProgress
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00b2e3', '#0076a5', '#f59e0b', '#10b981', '#ffffff']
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="celebration-overlay">
      <div className="celebration-card glass-card">
        {/* Trophy Icon */}
        <div className="medal-badge-box">
          <Trophy size={44} className="trophy-brand" />
        </div>

        {/* Texts */}
        <div className="celebration-texts">
          <h1 className="celebration-main-title">¡Aporte completado!</h1>
          <p className="celebration-main-sub">
            Tus 3 videos de <strong>{wordName}</strong> ya forman parte del dataset oficial de LSCH.
          </p>
        </div>

        {/* Points Banner */}
        <div className="points-award-card">
          <div className="points-award-value">
            <Sparkles size={22} className="sparkle-gold" />
            <span>+{pointsEarned} puntos</span>
          </div>
          {isPriority && (
            <span className="priority-bonus-tag">
              <CheckCircle2 size={13} /> Incluye bonus por seña prioritaria
            </span>
          )}
          <div className="total-points-meter">
            <span>Progreso acumulado:</span>
            <strong className="total-highlight">Llevas {totalPoints} puntos</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="celebration-actions">
          <button className="btn-action-primary celebrate-primary-btn" onClick={onMakeAnother}>
            <Video size={18} />
            <span>Hacer otro aporte</span>
          </button>

          <button className="btn-action-secondary celebrate-secondary-btn" onClick={onViewProgress}>
            <span>Ver mi progreso</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .celebration-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 38, 56, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 70;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .celebration-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card-solid);
          border: 2px solid var(--brand-cyan);
          border-radius: var(--radius-xl);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          box-shadow: var(--shadow-cyan);
          animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes bounceIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .medal-badge-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--brand-gradient-action);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: var(--shadow-cyan);
        }

        .trophy-brand {
          color: #ffffff;
        }

        .celebration-texts {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .celebration-main-title {
          font-size: 1.8rem;
          color: #ffffff;
        }

        .celebration-main-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .celebration-main-sub strong {
          color: var(--brand-cyan);
        }

        .points-award-card {
          width: 100%;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .points-award-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 900;
          color: #fbbf24;
        }

        .sparkle-gold {
          color: #fbbf24;
        }

        .priority-bonus-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent-emerald-light);
          background: rgba(16, 185, 129, 0.15);
          padding: 3px 10px;
          border-radius: 6px;
        }

        .total-points-meter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .total-highlight {
          color: #ffffff;
          font-family: var(--font-display);
        }

        .celebration-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }

        .celebrate-primary-btn {
          min-height: 54px;
        }
      `}</style>
    </div>
  );
};
