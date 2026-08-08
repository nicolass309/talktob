import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { cameraService } from '../services/cameraService';
import { FrameGuide } from '../components/camera/FrameGuide';
import { CountdownOverlay } from '../components/camera/CountdownOverlay';
import { SingleTakeReview } from '../components/camera/SingleTakeReview';
import { ThreeTakesReview } from '../components/camera/ThreeTakesReview';
import { UploadProgressModal } from '../components/camera/UploadProgressModal';
import { OfflineBanner } from '../components/offline/OfflineBanner';
import { ArrowLeft, RefreshCw, Check, Video, Info } from 'lucide-react';

export const CapturePage: React.FC = () => {
  const {
    activeWord,
    currentTakes,
    currentTakeIndex,
    setCurrentTakeIndex,
    saveTakeData,
    retakeSingleTake,
    submitThreeTakes,
    uploadProgress,
    setScreen
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [countdownStep, setCountdownStep] = useState<'3' | '2' | '1' | '¡Ahora!' | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showSingleReview, setShowSingleReview] = useState(false);
  const [showThreeReview, setShowThreeReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const RECORDING_MAX_SECONDS = 4.5;

  // Initialize camera stream
  useEffect(() => {
    let isMounted = true;
    const initCam = async () => {
      const res = await cameraService.startCamera(facingMode);
      if (isMounted && res.stream && videoRef.current) {
        videoRef.current.srcObject = res.stream;
        setCameraReady(true);
      }
    };

    initCam();

    return () => {
      isMounted = false;
      cameraService.stopCamera();
    };
  }, [facingMode]);

  // Flip camera between front and back
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Recording countdown & automatic recording timer
  const handleStartCaptureFlow = () => {
    if (!cameraReady || isRecording || countdownStep) return;

    setCountdownStep('3');
    setTimeout(() => {
      setCountdownStep('2');
      setTimeout(() => {
        setCountdownStep('1');
        setTimeout(() => {
          setCountdownStep('¡Ahora!');
          setTimeout(() => {
            setCountdownStep(null);
            beginActualRecording();
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  };

  const beginActualRecording = () => {
    const started = cameraService.startRecording();
    if (!started) return;

    setIsRecording(true);
    setRecordingSeconds(0);

    const startTime = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setRecordingSeconds(Math.min(RECORDING_MAX_SECONDS, elapsed));

      if (elapsed >= RECORDING_MAX_SECONDS) {
        clearInterval(interval);
        finishRecordingTake();
      }
    }, 100);
  };

  const finishRecordingTake = async () => {
    try {
      const { blob, url } = await cameraService.stopRecording();
      setIsRecording(false);
      setRecordingSeconds(0);

      // Save take in context
      saveTakeData(currentTakeIndex, blob, url, RECORDING_MAX_SECONDS);
      setShowSingleReview(true);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setIsRecording(false);
    }
  };

  const handleAcceptSingleTake = () => {
    setShowSingleReview(false);
    if (currentTakeIndex < 3) {
      setCurrentTakeIndex((currentTakeIndex + 1) as 1 | 2 | 3);
    } else {
      // Completed all 3 takes -> Go to 3-takes review screen
      setShowThreeReview(true);
    }
  };

  const handleRetakeCurrent = () => {
    setShowSingleReview(false);
  };

  const handleRetakeFromThreeReview = (takeNumber: 1 | 2 | 3) => {
    setShowThreeReview(false);
    retakeSingleTake(takeNumber);
  };

  const handleSubmitAllTakes = async () => {
    setIsSubmitting(true);
    const result = await submitThreeTakes();
    setIsSubmitting(false);

    if (result.offline) {
      setShowOfflineModal(true);
    }
  };

  if (!activeWord) {
    return (
      <div className="empty-capture-screen">
        <p>No hay una seña seleccionada.</p>
        <button className="btn-action-primary" onClick={() => setScreen('home')}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // Three Takes Review Screen
  if (showThreeReview) {
    return (
      <div className="capture-page-wrap fit-no-scroll">
        <ThreeTakesReview
          word={activeWord}
          takes={currentTakes}
          onRetakeSingle={handleRetakeFromThreeReview}
          onSubmitAll={handleSubmitAllTakes}
          isSubmitting={isSubmitting}
        />
        {isSubmitting && <UploadProgressModal progress={uploadProgress} />}
        {showOfflineModal && (
          <OfflineBanner
            onDismiss={() => {
              setShowOfflineModal(false);
              setScreen('home');
            }}
          />
        )}
      </div>
    );
  }

  const currentTakeInfo = currentTakes[currentTakeIndex - 1];

  return (
    <div className="capture-page-wrap fit-no-scroll">
      {/* TOP HEADER */}
      <header className="capture-header">
        <button
          className="btn-back-round"
          onClick={() => setScreen('home')}
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="capture-word-pill">
          <h1 className="active-word-text">{activeWord.word}</h1>
          <span className="take-step-indicator">
            Toma {currentTakeIndex} de 3
          </span>
        </div>

        <button
          className="btn-flip-cam"
          onClick={toggleFacingMode}
          title="Cambiar cámara frontal/trasera"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* RESPONSIVE NO-SCROLL LAYOUT (SIDE-BY-SIDE ON DESKTOP) */}
      <div className="capture-desktop-layout">
        {/* LEFT COLUMN: CAMERA VIEWFINDER */}
        <div className="camera-viewport-card">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video-stream"
          />

          {/* Framing Guide */}
          <FrameGuide isRecording={isRecording} />

          {/* Countdown Overlay */}
          <CountdownOverlay step={countdownStep} />

          {/* Recording active timer badge */}
          {isRecording && (
            <div className="recording-timer-badge">
              <span className="red-record-dot" />
              <span>Grabando ({recordingSeconds.toFixed(1)}s / {RECORDING_MAX_SECONDS}s)</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN / CONTROL PANEL */}
        <div className="capture-controls-side">
          {/* 3 TAKES PROGRESS INDICATOR */}
          <div className="takes-indicator-bar">
            {[1, 2, 3].map((num) => {
              const isDone = currentTakes[num - 1]?.videoUrl !== null;
              const isCurrent = currentTakeIndex === num;
              return (
                <div
                  key={num}
                  className={`take-progress-slot ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  {isDone ? (
                    <Check size={14} className="check-done" />
                  ) : (
                    <span>Toma {num}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="desktop-instructions-card glass-card">
            <Info size={18} className="info-icon" />
            <div className="instruct-text">
              <strong>Instrucciones de encuadre</strong>
              <p>Muestra claramente tu rostro y tus manos frente a la cámara. Al presionar <em>Grabar</em>, la toma durará 4.5 segundos.</p>
            </div>
          </div>

          {/* MAIN RECORD ACTION BUTTON (ALWAYS VISIBLE IN VIEWPORT) */}
          <div className="capture-action-container">
            <button
              className={`btn-action-primary main-record-cta ${isRecording ? 'btn-recording-active' : ''}`}
              onClick={handleStartCaptureFlow}
              disabled={isRecording || countdownStep !== null}
            >
              <Video size={24} />
              <span>{isRecording ? 'Grabando seña...' : `Grabar toma ${currentTakeIndex}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE TAKE REVIEW MODAL */}
      {showSingleReview && currentTakeInfo.videoUrl && (
        <SingleTakeReview
          takeNumber={currentTakeIndex}
          videoUrl={currentTakeInfo.videoUrl}
          onRetake={handleRetakeCurrent}
          onAccept={handleAcceptSingleTake}
        />
      )}

      {/* UPLOAD PROGRESS & OFFLINE BUFFER */}
      {isSubmitting && <UploadProgressModal progress={uploadProgress} />}
      {showOfflineModal && (
        <OfflineBanner
          onDismiss={() => {
            setShowOfflineModal(false);
            setScreen('home');
          }}
        />
      )}

      <style>{`
        /* NO-SCROLL STRICT VIEWPORT FIT */
        .capture-page-wrap.fit-no-scroll {
          height: 100dvh;
          max-height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px 20px calc(16px + var(--safe-bottom));
          background: #001f2e;
          position: relative;
        }

        .capture-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          z-index: 20;
          flex-shrink: 0;
        }

        .btn-back-round, .btn-flip-cam {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-back-round:hover, .btn-flip-cam:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .capture-word-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 54, 77, 0.85);
          backdrop-filter: blur(12px);
          padding: 6px 20px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-brand);
          box-shadow: var(--shadow-cyan);
        }

        .active-word-text {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
        }

        .take-step-indicator {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--brand-cyan);
          text-transform: uppercase;
        }

        /* RESPONSIVE LAYOUT GRID FOR CAMERA AND CONTROLS */
        .capture-desktop-layout {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-height: 0; /* Critical CSS for flex child sizing */
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .capture-desktop-layout {
            display: grid;
            grid-template-columns: 1.3fr 0.9fr;
            gap: 24px;
            align-items: center;
            padding: 10px 0;
          }
        }

        .camera-viewport-card {
          position: relative;
          width: 100%;
          height: 100%;
          max-height: calc(100vh - 160px);
          background: #000000;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 2px solid var(--border-brand);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .camera-video-stream {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recording-timer-badge {
          position: absolute;
          top: 16px;
          background: rgba(239, 68, 68, 0.95);
          color: #ffffff;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          z-index: 25;
        }

        .red-record-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          animation: pulse-ring 1s infinite;
        }

        .capture-controls-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .takes-indicator-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .take-progress-slot {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 10px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .take-progress-slot.current {
          border-color: var(--brand-cyan);
          color: #ffffff;
          background: rgba(0, 178, 227, 0.18);
          box-shadow: 0 0 12px rgba(0, 178, 227, 0.25);
        }

        .take-progress-slot.done {
          background: rgba(16, 185, 129, 0.2);
          border-color: var(--accent-emerald);
          color: #34d399;
        }

        .check-done {
          color: #34d399;
        }

        .desktop-instructions-card {
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-icon {
          color: var(--brand-cyan);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .instruct-text strong {
          display: block;
          color: #ffffff;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .instruct-text p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .capture-action-container {
          width: 100%;
        }

        .main-record-cta {
          min-height: 56px;
          font-size: 1.1rem;
        }

        .btn-recording-active {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.7);
        }

        .empty-capture-screen {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  );
};
