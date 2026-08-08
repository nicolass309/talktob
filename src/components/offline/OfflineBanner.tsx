import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

interface OfflineBannerProps {
  onDismiss: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onDismiss }) => {
  return (
    <div className="offline-modal-overlay">
      <div className="offline-card glass-card">
        <div className="offline-icon-box">
          <WifiOff size={32} className="offline-wifi-icon" />
        </div>

        <div className="offline-texts">
          <h2 className="offline-title">Sin conexión</h2>
          <p className="offline-message">
            Tu aporte está guardado. Lo enviaremos automáticamente cuando vuelva la conexión.
          </p>
        </div>

        <div className="safe-storage-badge">
          <CheckCircle2 size={16} />
          <span>Videos protegidos en tu dispositivo</span>
        </div>

        <button className="btn-action-primary offline-btn" onClick={onDismiss}>
          <span>Seguir explorando</span>
        </button>
      </div>

      <style>{`
        .offline-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 10, 18, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 65;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .offline-card {
          width: 100%;
          max-width: 380px;
          background: var(--bg-card-solid);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: var(--radius-xl);
          padding: 30px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.25);
        }

        .offline-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.18);
          border: 1px solid rgba(168, 85, 247, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
        }

        .offline-texts {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .offline-title {
          font-size: 1.5rem;
          color: #ffffff;
        }

        .offline-message {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .safe-storage-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .offline-btn {
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};
