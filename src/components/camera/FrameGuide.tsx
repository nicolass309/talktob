import React from 'react';

interface FrameGuideProps {
  isRecording?: boolean;
}

export const FrameGuide: React.FC<FrameGuideProps> = ({ isRecording = false }) => {
  return (
    <div className={`frame-guide-container ${isRecording ? 'recording' : ''}`}>
      {/* SVG Silhouette overlay */}
      <svg className="frame-guide-svg" viewBox="0 0 400 560" fill="none" preserveAspectRatio="xMidYMid meet">
        {/* Head Silhouette Circle & Target */}
        <circle
          cx="200"
          cy="130"
          r="65"
          className="guide-stroke guide-head"
          strokeDasharray="6 6"
        />

        {/* Torso & Shoulder curve */}
        <path
          d="M 100 350 C 120 230, 280 230, 300 350 L 320 540 L 80 540 Z"
          className="guide-stroke guide-torso"
          strokeDasharray="8 6"
        />

        {/* Left Hand Zone Indicator */}
        <g className="guide-hand left-hand">
          <circle cx="95" cy="310" r="45" className="guide-stroke hand-circle" />
          <text x="95" y="315" textAnchor="middle" className="hand-text">MANO</text>
        </g>

        {/* Right Hand Zone Indicator */}
        <g className="guide-hand right-hand">
          <circle cx="305" cy="310" r="45" className="guide-stroke hand-circle" />
          <text x="305" y="315" textAnchor="middle" className="hand-text">MANO</text>
        </g>

        {/* Framing Corner Accents */}
        <path d="M 20 50 L 20 20 L 50 20" className="guide-corner" />
        <path d="M 380 50 L 380 20 L 350 20" className="guide-corner" />
        <path d="M 20 510 L 20 540 L 50 540" className="guide-corner" />
        <path d="M 380 510 L 380 540 L 350 540" className="guide-corner" />
      </svg>

      {/* Short compulsory instruction text */}
      <div className="frame-guide-badge">
        <span className="guide-pulse-dot" />
        <span>Coloca tu rostro y tus manos dentro del cuadro.</span>
      </div>

      <style>{`
        .frame-guide-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .frame-guide-svg {
          width: 100%;
          height: 85%;
          max-height: 520px;
        }

        .guide-stroke {
          stroke: rgba(6, 182, 212, 0.65);
          stroke-width: 2.5;
          transition: stroke 0.3s ease;
        }

        .guide-head {
          fill: rgba(6, 182, 212, 0.05);
        }

        .guide-torso {
          fill: rgba(6, 182, 212, 0.03);
        }

        .hand-circle {
          stroke: rgba(245, 158, 11, 0.7);
          stroke-dasharray: 4 4;
          fill: rgba(245, 158, 11, 0.08);
        }

        .hand-text {
          fill: rgba(255, 255, 255, 0.75);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .guide-corner {
          stroke: #22d3ee;
          stroke-width: 4;
          stroke-linecap: round;
        }

        .frame-guide-container.recording .guide-stroke {
          stroke: rgba(239, 68, 68, 0.8);
        }

        .frame-guide-container.recording .guide-corner {
          stroke: #ef4444;
        }

        .frame-guide-badge {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          margin-bottom: 8px;
          text-align: center;
        }

        .guide-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px #22d3ee;
          display: inline-block;
        }

        .frame-guide-container.recording .guide-pulse-dot {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pulse-ring 1s infinite;
        }
      `}</style>
    </div>
  );
};
