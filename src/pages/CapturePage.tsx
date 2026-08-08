import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { cameraService } from '../services/cameraService';
import { FrameGuide } from '../components/camera/FrameGuide';
import { CountdownOverlay } from '../components/camera/CountdownOverlay';
import { SingleTakeReview } from '../components/camera/SingleTakeReview';
import { ThreeTakesReview } from '../components/camera/ThreeTakesReview';
import { UploadProgressModal } from '../components/camera/UploadProgressModal';
import { OfflineBanner } from '../components/offline/OfflineBanner';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react';

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
      // Completed all 3 takes -> Go to 3-takes review screen (Section 14)
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

  // Section 14: Three Takes Review Screen
  if (showThreeReview) {
    return (
      <div className="capture-page-wrap">
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
    <div className="capture-page-wrap">
      {/* HEADER WITH WORD & 3 TAKES INDICATOR (Section 10 & 13) */}
      <header className="capture-header">
        <button
          className="btn-back-round"
          onClick={() => setScreen('home')}
          aria-label="Volver"
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

      {/* 3 TAKES PROGRESS BAR INDICATOR (Section 13) */}
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

      {/* CAMERA VIEWPORT WITH ERGONOMIC FRAME GUIDE (Section 10) */}
      <div className="camera-viewport-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video-stream"
        />

        {/* Framing Guide for Head, Torso & Dual Hands */}
        <FrameGuide isRecording={isRecording} />

        {/* Countdown 3-2-1-¡Ahora! Overlay */}
        <CountdownOverlay step={countdownStep} />

        {/* Recording active timer bar */}
        {isRecording && (
          <div className="recording-timer-badge">
            <span className="red-record-dot" />
            <span>Grabando ({recordingSeconds.toFixed(1)}s / {RECORDING_MAX_SECONDS}s)</span>
          </div>
        )}
      </div>

      {/* SECTION 11: MAIN RECORDING ACTION BUTTON */}
      <div className="capture-bottom-action">
        <button
          className={`btn-action-primary main-record-cta ${isRecording ? 'btn-recording-active' : ''}`}
          onClick={handleStartCaptureFlow}
          disabled={isRecording || countdownStep !== null}
        >
          <div className="record-circle-inner" />
          <span>{isRecording ? 'Grabando seña...' : 'Grabar'}</span>
        </button>
      </div>

      {/* SECTION 12: SINGLE TAKE REVIEW MODAL */}
      {showSingleReview && currentTakeInfo.videoUrl && (
        <SingleTakeReview
          takeNumber={currentTakeIndex}
          videoUrl={currentTakeInfo.videoUrl}
          onRetake={handleRetakeCurrent}
          onAccept={handleAcceptSingleTake}
        />
      )}

      {/* SECTION 15 & 16: UPLOAD PROGRESS & OFFLINE BUFFER */}
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
        .capture-page-wrap {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          padding: 12px 16px calc(16px + var(--safe-bottom));
          position: relative;
          background: #020617;
          gap: 12px;
        }

        .capture-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          z-index: 20;
        }

        .btn-back-round, .btn-flip-cam {
          width: 44px;
          height: 44px;
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

        .btn-back-round:active, .btn-flip-cam:active {
          background: rgba(255, 255, 255, 0.2);
        }

        .capture-word-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          padding: 6px 18px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glow);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.25);
        }

        .active-word-text {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .take-step-indicator {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--brand-primary-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .takes-indicator-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .take-progress-slot {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-sm);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .take-progress-slot.current {
          border-color: var(--brand-primary);
          color: #ffffff;
          background: rgba(6, 182, 212, 0.15);
        }

        .take-progress-slot.done {
          background: rgba(16, 185, 129, 0.2);
          border-color: var(--accent-emerald);
          color: #34d399;
        }

        .check-done {
          color: #34d399;
        }

        .camera-viewport-card {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 420px;
          background: #000000;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-video-stream {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recording-timer-badge {
          position: absolute;
          top: 16px;
          background: rgba(239, 68, 68, 0.9);
          color: #ffffff;
          padding: 6px 14px;
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

        .capture-bottom-action {
          padding-top: 6px;
          z-index: 20;
        }

        .main-record-cta {
          min-height: 60px;
          font-size: 1.25rem;
          background: var(--brand-gradient-warm);
          box-shadow: var(--shadow-gold);
        }

        .btn-recording-active {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.7);
        }

        .record-circle-inner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid rgba(0, 0, 0, 0.3);
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
