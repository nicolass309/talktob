import React from 'react';
import { RotateCcw, Check } from 'lucide-react';

interface SingleTakeReviewProps {
  takeNumber: 1 | 2 | 3;
  videoUrl: string;
  onRetake: () => void;
  onAccept: () => void;
}

export const SingleTakeReview: React.FC<SingleTakeReviewProps> = ({
  takeNumber,
  videoUrl,
  onRetake,
  onAccept
}) => {
  return (
    <div className="take-review-overlay">
      <div className="take-review-card">
        {/* Header Badge */}
        <div className="take-badge-header">
          <span className="badge-tag">¡Toma {takeNumber} lista!</span>
          <span className="badge-sub">Revisa tu seña antes de continuar</span>
        </div>

        {/* Video Preview Player */}
        <div className="video-player-container">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="video-player"
          />
          <div className="video-pill-indicator">
            <span className="dot-live" />
            <span>Toma {takeNumber} de 3</span>
          </div>
        </div>

        {/* Action Buttons with exact UX action verbs */}
        <div className="take-review-actions">
          <button className="btn-action-secondary" onClick={onRetake}>
            <RotateCcw size={18} />
            <span>Volver a grabar</span>
          </button>

          <button className="btn-action-primary" onClick={onAccept}>
            <Check size={20} />
            <span>Usar esta toma</span>
          </button>
        </div>
      </div>

      <style>{`
        .take-review-overlay {
          position: absolute;
          inset: 0;
          background: rgba(7, 10, 18, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .take-review-card {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .take-badge-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .badge-tag {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .badge-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .video-player-container {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #020617;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 2px solid var(--border-glow);
          box-shadow: var(--shadow-glow);
        }

        .video-player {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-pill-indicator {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .dot-live {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .take-review-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};
