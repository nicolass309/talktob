import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalktoBLogo } from '../components/common/TalktoBLogo';
import { Video, Users, ChevronRight, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setScreen, communityProgress } = useApp();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="landing-screen-wrap">
      {/* Top Banner */}
      <div className="hero-top-badge">
        <Sparkles size={14} className="sparkle-cyan" />
        <span>Iniciativa Comunitaria de Chile</span>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="landing-hero-grid">
        {/* Left Side: Brand Logo & Mission */}
        <div className="hero-left-column">
          <div className="logo-center-box">
            <TalktoBLogo size="lg" showSubtext />
          </div>

          <h1 className="landing-main-title">
            Ayúdanos a enseñar <span className="highlight-text">Lengua de Señas Chilena</span> a la IA.
          </h1>

          <p className="landing-description">
            Estamos construyendo un dataset colaborativo de Lengua de Señas Chilena con aportes de personas de todo Chile para impulsar la accesibilidad universal.
          </p>

          <div className="landing-cta-stack">
            <button
              className="btn-action-primary landing-main-cta"
              onClick={() => setScreen('onboarding')}
            >
              <Video size={22} />
              <span>Quiero aportar</span>
              <ChevronRight size={20} />
            </button>

            <button
              className="btn-action-secondary"
              onClick={() => setShowHowItWorks((prev) => !prev)}
            >
              <HelpCircle size={18} />
              <span>¿Cómo funciona?</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3 Steps Card */}
        <div className="hero-right-column">
          <div className="steps-container glass-card">
            <h2 className="steps-heading">¿Cómo funciona tu aporte?</h2>

            <div className="step-row">
              <div className="step-number">1</div>
              <div className="step-info">
                <h3 className="step-title">Elige una seña</h3>
                <p className="step-desc">Escoge una palabra o frase del catálogo.</p>
              </div>
            </div>

            <div className="step-divider" />

            <div className="step-row">
              <div className="step-number cyan">2</div>
              <div className="step-info">
                <h3 className="step-title">Grábala 3 veces</h3>
                <p className="step-desc">Muéstrala frente a tu cámara.</p>
              </div>
            </div>

            <div className="step-divider" />

            <div className="step-row">
              <div className="step-number gold">3</div>
              <div className="step-info">
                <h3 className="step-title">Ayuda a construir la IA</h3>
                <p className="step-desc">Tu aporte se suma al dataset verificado.</p>
              </div>
            </div>
          </div>

          <div className="impact-stats-row">
            <div className="impact-stat">
              <Users size={16} className="impact-icon" />
              <span>+{communityProgress.activeContributors > 0 ? communityProgress.activeContributors.toLocaleString('es-CL') : '0'} contribuidores</span>
            </div>
            <div className="impact-stat">
              <ShieldCheck size={16} className="impact-icon cyan" />
              <span>Validación comunitaria</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Modal */}
      {showHowItWorks && (
        <div className="how-it-works-modal glass-card">
          <h3>Sobre TalktoB y la IA en Lengua de Señas Chilena</h3>
          <p>
            Los modelos de visión artificial requieren múltiples muestras de cada seña con distintos ángulos, expresiones y velocidades.
          </p>
          <p>
            Al grabar 3 tomas por seña, permites que la IA aprenda la variación natural de nuestra comunidad chilena de manera inclusiva.
          </p>
          <button className="btn-action-subtle close-btn" onClick={() => setShowHowItWorks(false)}>
            Entendido, cerrar
          </button>
        </div>
      )}

      <style>{`
        .landing-screen-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 20px calc(40px + var(--safe-bottom));
          gap: 24px;
          min-height: 100dvh;
          justify-content: center;
          animation: fadeIn 0.4s ease-out;
        }

        .hero-top-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 178, 227, 0.15);
          color: var(--brand-cyan-light);
          border: 1px solid rgba(0, 178, 227, 0.3);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .sparkle-cyan { color: var(--brand-cyan); }

        .landing-hero-grid {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        @media (min-width: 900px) {
          .landing-hero-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 40px;
            align-items: center;
          }
        }

        .hero-left-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }

        @media (min-width: 900px) {
          .hero-left-column {
            align-items: flex-start;
            text-align: left;
          }
        }

        .logo-center-box {
          margin-bottom: 8px;
        }

        .landing-main-title {
          font-size: 2.2rem;
          line-height: 1.15;
        }

        @media (min-width: 900px) {
          .landing-main-title {
            font-size: 2.6rem;
          }
        }

        .highlight-text {
          color: var(--brand-cyan);
        }

        .landing-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.5;
        }

        .landing-cta-stack {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .landing-main-cta {
          min-height: 58px;
          font-size: 1.1rem;
        }

        .hero-right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .steps-container {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .steps-heading {
          font-size: 1.2rem;
          color: #ffffff;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-number.cyan {
          background: rgba(0, 178, 227, 0.2);
          border-color: var(--brand-cyan);
          color: var(--brand-cyan-light);
        }

        .step-number.gold {
          background: rgba(245, 158, 11, 0.2);
          border-color: var(--accent-gold);
          color: #fbbf24;
        }

        .step-info {
          display: flex;
          flex-direction: column;
        }

        .step-title {
          font-size: 1rem;
          color: #ffffff;
        }

        .step-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .step-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin-left: 56px;
        }

        .impact-stats-row {
          display: flex;
          justify-content: space-around;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .impact-stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .impact-icon { color: var(--brand-cyan); }

        .how-it-works-modal {
          max-width: 500px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .how-it-works-modal h3 {
          font-size: 1.15rem;
          color: #ffffff;
        }

        .close-btn {
          align-self: flex-end;
          color: var(--brand-cyan);
        }
      `}</style>
    </div>
  );
};
