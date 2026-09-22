import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { ChileanZone, LearningOrigin, RelationWithLSCH, SignWord } from '../types';
import { CHILEAN_REGIONS } from '../services/mockDataService';
import { TalktoBLogo } from '../components/common/TalktoBLogo';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { isClerkEnabled } from '../services/authMode';
import { Check, ArrowRight, UserCheck, MapPin, BookOpen, Heart, Sparkles, UserPlus } from 'lucide-react';

interface ClerkAuthStep1Props {
  onContinue: () => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
}

const ClerkAuthStep1: React.FC<ClerkAuthStep1Props> = ({ onContinue, setName, setEmail }) => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      setName(user.fullName || user.firstName || 'Contribuidor');
      setEmail(user.primaryEmailAddress?.emailAddress || 'usuario@talktob.cl');
    }
  }, [isSignedIn, user, setName, setEmail]);

  return (
    <div className="onboarding-step-card glass-card">
      <div className="step-icon-wrap">
        <UserCheck size={28} />
      </div>
      <h1 className="step-title">Crear cuenta o ingresar</h1>
      <p className="step-subtitle">Autentícate con Clerk para guardar tus contribuciones en el dataset real.</p>

      <div className="auth-btn-stack">
        {isSignedIn ? (
          <button className="btn-action-primary submit-auth-btn" onClick={onContinue}>
            <span>Continuar como {user?.firstName || 'Contribuidor'}</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <>
            {/* Sign In via Clerk */}
            <SignInButton mode="modal">
              <button className="btn-action-primary google-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Iniciar sesión con Clerk</span>
              </button>
            </SignInButton>

            {/* Sign Up via Clerk */}
            <SignUpButton mode="modal">
              <button className="btn-action-secondary">
                <UserPlus size={18} />
                <span>Crear cuenta en Clerk</span>
              </button>
            </SignUpButton>

            <button className="btn-action-subtle" onClick={onContinue}>
              <span>Continuar como invitado / desarrollo local</span>
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const OnboardingPage: React.FC = () => {
  const { completeOnboarding, setScreen, words, startContributionForWord } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Onboarding Form states
  const [name, setName] = useState('Contribuidor');
  const [email, setEmail] = useState('usuario@talktob.cl');
  const [regionZone, setRegionZone] = useState<ChileanZone>('Centro');
  const [specificRegion, setSpecificRegion] = useState('Metropolitana de Santiago');
  const [learningOrigin, setLearningOrigin] = useState<LearningOrigin>('Nativo');
  const [relationWithLSCH, setRelationWithLSCH] = useState<RelationWithLSCH>('Persona sorda');

  const handleFinishOnboarding = async () => {
    await completeOnboarding({
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      regionZone,
      specificRegion,
      learningOrigin,
      relationWithLSCH,
      isOnboarded: true
    });

    const priority = words.find((w: SignWord) => w.isPriority) || words[0];
    if (priority) {
      startContributionForWord(priority);
    } else {
      setScreen('home');
    }
  };

  return (
    <div className="onboarding-screen-wrap">
      {/* Header Logo */}
      <div className="onboarding-logo-box">
        <TalktoBLogo size="md" />
      </div>

      {/* Step Indicator Header */}
      <div className="onboarding-header">
        <div className="step-dots">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`dot ${step === i ? 'active' : ''} ${step > i ? 'completed' : ''}`}
            />
          ))}
        </div>
        <span className="step-count">Paso {step} de 5</span>
      </div>

      {/* STEP 1: AUTHENTICATION */}
      {step === 1 && (
        isClerkEnabled() ? (
          <ClerkAuthStep1
            onContinue={() => setStep(2)}
            setName={setName}
            setEmail={setEmail}
          />
        ) : (
          <div className="onboarding-step-card glass-card">
            <div className="step-icon-wrap">
              <UserCheck size={28} />
            </div>
            <h1 className="step-title">Modo Desarrollo</h1>
            <p className="step-subtitle">Autenticado con token local de desarrollo.</p>

            <div className="auth-btn-stack">
              <button className="btn-action-primary submit-auth-btn" onClick={() => setStep(2)}>
                <span>Continuar a la encuesta de perfil</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )
      )}

      {/* STEP 2: REGION */}
      {step === 2 && (
        <div className="onboarding-step-card glass-card">
          <div className="step-icon-wrap">
            <MapPin size={28} />
          </div>
          <h1 className="step-title">¿De qué zona de Chile eres?</h1>
          <p className="step-subtitle">Nos permite registrar la variación lingüística territorial de la Lengua de Señas Chilena.</p>

          <div className="options-grid">
            {(['Norte', 'Centro', 'Sur', 'Otra'] as ChileanZone[]).map((zone) => (
              <button
                key={zone}
                className={`option-card ${regionZone === zone ? 'selected' : ''}`}
                onClick={() => setRegionZone(zone)}
              >
                <span className="option-name">{zone}</span>
                {regionZone === zone && <Check size={18} className="check-cyan" />}
              </button>
            ))}
          </div>

          <div className="sub-region-select">
            <label className="sub-label">¿En qué región de Chile?</label>
            <select
              className="form-select"
              value={specificRegion}
              onChange={(e) => setSpecificRegion(e.target.value)}
            >
              {CHILEAN_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-action-primary next-btn" onClick={() => setStep(3)}>
            <span>Continuar</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 3: LEARNING ORIGIN */}
      {step === 3 && (
        <div className="onboarding-step-card glass-card">
          <div className="step-icon-wrap">
            <BookOpen size={28} />
          </div>
          <h1 className="step-title">¿Dónde aprendiste Lengua de Señas Chilena?</h1>
          <p className="step-subtitle">Nos ayuda a contextualizar la procedencia de tu aprendizaje.</p>

          <div className="options-grid">
            {(['Nativo', 'Escuela', 'Familia', 'Asociación', 'Cursos', 'Por mi cuenta', 'Otro'] as LearningOrigin[]).map((origin) => (
              <button
                key={origin}
                className={`option-card ${learningOrigin === origin ? 'selected' : ''}`}
                onClick={() => setLearningOrigin(origin)}
              >
                <span className="option-name">{origin}</span>
                {learningOrigin === origin && <Check size={18} className="check-cyan" />}
              </button>
            ))}
          </div>

          <button className="btn-action-primary next-btn" onClick={() => setStep(4)}>
            <span>Continuar</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 4: RELATION WITH LSCH */}
      {step === 4 && (
        <div className="onboarding-step-card glass-card">
          <div className="step-icon-wrap">
            <Heart size={28} />
          </div>
          <h1 className="step-title">¿Cuál es tu relación con la comunidad?</h1>
          <p className="step-subtitle">Queremos representar adecuadamente a toda la comunidad sorda y oyente de Chile.</p>

          <div className="options-grid">
            {(['Persona sorda', 'CODA', 'Intérprete', 'Estudiante', 'Familiar', 'Otra'] as RelationWithLSCH[]).map((rel) => (
              <button
                key={rel}
                className={`option-card ${relationWithLSCH === rel ? 'selected' : ''}`}
                onClick={() => setRelationWithLSCH(rel)}
              >
                <span className="option-name">{rel}</span>
                {relationWithLSCH === rel && <Check size={18} className="check-cyan" />}
              </button>
            ))}
          </div>

          <button className="btn-action-primary next-btn" onClick={() => setStep(5)}>
            <span>Continuar</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 5: FINAL READY */}
      {step === 5 && (
        <div className="onboarding-step-card glass-card ready-step">
          <div className="ready-icon-box">
            <Sparkles size={38} />
          </div>
          <h1 className="step-title ready-title">¡Listo! Ya puedes comenzar a aportar.</h1>
          <p className="step-subtitle">
            Tu perfil de <strong>{name}</strong> está configurado. Te asignamos una seña prioritaria para que ganes tus primeros <strong>+45 puntos</strong>.
          </p>

          <div className="profile-summary-pill">
            <span>Región: {specificRegion} • {relationWithLSCH}</span>
          </div>

          <button
            className="btn-action-primary first-contrib-btn"
            onClick={handleFinishOnboarding}
          >
            <span>Hacer mi primer aporte</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      <style>{`
        .onboarding-screen-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px calc(40px + var(--safe-bottom));
          gap: 20px;
          min-height: 100dvh;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }

        .onboarding-logo-box {
          margin-bottom: 4px;
        }

        .onboarding-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 28px;
          height: 5px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .dot.active {
          background: var(--brand-cyan);
          box-shadow: 0 0 10px var(--brand-cyan);
        }

        .dot.completed {
          background: var(--accent-emerald);
        }

        .step-count {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .onboarding-step-card {
          width: 100%;
          max-width: 460px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .step-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: var(--brand-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: var(--shadow-cyan);
        }

        .step-title {
          font-size: 1.5rem;
          color: #ffffff;
        }

        .step-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 360px;
        }

        .auth-btn-stack {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .google-btn {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }

        .submit-auth-btn {
          margin-top: 4px;
        }

        .options-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 6px;
        }

        .option-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 12px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
        }

        .option-card.selected {
          background: rgba(0, 178, 227, 0.18);
          border-color: var(--brand-cyan);
          box-shadow: 0 0 16px rgba(0, 178, 227, 0.3);
        }

        .check-cyan {
          color: var(--brand-cyan);
        }

        .sub-region-select {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          margin-top: 4px;
        }

        .sub-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-select {
          width: 100%;
          min-height: 48px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #ffffff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
        }

        .form-select option {
          background: #00364d;
          color: #fff;
        }

        .next-btn, .first-contrib-btn {
          margin-top: 10px;
          min-height: 54px;
        }

        .ready-icon-box {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: var(--brand-gradient-action);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: var(--shadow-cyan);
        }

        .profile-summary-pill {
          background: rgba(0, 178, 227, 0.15);
          border: 1px solid rgba(0, 178, 227, 0.3);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--brand-cyan);
        }
      `}</style>
    </div>
  );
};
