import React from 'react';

interface CountdownOverlayProps {
  step: '3' | '2' | '1' | '¡Ahora!' | null;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ step }) => {
  if (!step) return null;

  const isNow = step === '¡Ahora!';

  return (
    <div className="countdown-overlay-container">
      <div className={`countdown-box ${isNow ? 'countdown-now' : ''}`}>
        <span className="countdown-number">{step}</span>
        {isNow && <span className="countdown-sub">¡Muestra tu seña!</span>}
      </div>

      <style>{`
        .countdown-overlay-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(7, 10, 18, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 30;
          pointer-events: none;
        }

        .countdown-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: var(--brand-gradient);
          box-shadow: 0 0 50px rgba(6, 182, 212, 0.8), 0 0 100px rgba(59, 130, 246, 0.4);
          animation: countdown-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 4px solid rgba(255, 255, 255, 0.4);
        }

        .countdown-now {
          width: 220px;
          height: 100px;
          border-radius: 30px;
          background: var(--brand-gradient-warm);
          box-shadow: 0 0 60px rgba(245, 158, 11, 0.9);
        }

        .countdown-number {
          font-family: var(--font-display);
          font-size: 3.8rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
        }

        .countdown-now .countdown-number {
          font-size: 2.2rem;
        }

        .countdown-sub {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};
