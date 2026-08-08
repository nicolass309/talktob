import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface UploadProgressModalProps {
  progress: number;
}

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({ progress }) => {
  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal-card glass-card">
        <div className="upload-icon-pulse">
          <Sparkles size={28} className="upload-sparkle" />
        </div>

        <h2 className="upload-title">Guardando tu aporte...</h2>
        <p className="upload-sub">Estamos preparando tus videos para la comunidad de LSCH.</p>

        {/* Progress Bar Container */}
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-info">
            <span className="progress-status">Procesando videos</span>
            <span className="progress-pct">{progress}%</span>
          </div>
        </div>

        <div className="security-notice">
          <ShieldCheck size={14} />
          <span>Aporte seguro y validado para el dataset</span>
        </div>
      </div>

      <style>{`
        .upload-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 10, 18, 0.95);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .upload-modal-card {
          width: 100%;
          max-width: 380px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-xl);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          box-shadow: var(--shadow-glow);
          animation: popModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popModal {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .upload-icon-pulse {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--brand-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.6);
          animation: pulse-ring 2s infinite;
        }

        .upload-title {
          font-size: 1.4rem;
          color: #ffffff;
          margin-top: 4px;
        }

        .upload-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 280px;
        }

        .progress-bar-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .progress-bar-track {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--brand-gradient-warm);
          border-radius: var(--radius-full);
          transition: width 0.35s ease-out;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.7);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .progress-status {
          color: var(--text-secondary);
        }

        .progress-pct {
          color: #fbbf24;
          font-family: var(--font-display);
        }

        .security-notice {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #34d399;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
