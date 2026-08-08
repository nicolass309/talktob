import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { SignWord } from '../../types';
import { PlusCircle, AlertCircle, X, Sparkles, Check } from 'lucide-react';

interface CreateWordModalProps {
  initialSearchQuery?: string;
  onClose: () => void;
  onWordCreated: (word: SignWord) => void;
}

export const CreateWordModal: React.FC<CreateWordModalProps> = ({
  initialSearchQuery = '',
  onClose,
  onWordCreated
}) => {
  const { words, addNewWord } = useApp();
  const [wordInput, setWordInput] = useState(initialSearchQuery.toUpperCase());
  const [category, setCategory] = useState('Emergencias y Salud');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for near-duplicates in real time
  const duplicates = words.filter((w) =>
    w.word.toLowerCase().includes(wordInput.trim().toLowerCase()) && wordInput.trim().length > 1
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput.trim()) return;

    setIsSubmitting(true);
    try {
      const newWord = await addNewWord(wordInput.trim(), category, description);
      onWordCreated(newWord);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-modal-overlay">
      <div className="create-card glass-card">
        <div className="create-card-header">
          <div className="create-header-left">
            <PlusCircle size={22} className="plus-icon" />
            <h2>Crear nueva seña</h2>
          </div>
          <button className="btn-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="create-sub">
          Ayúdanos a incorporar nuevas palabras y frases de la comunidad LSCH.
        </p>

        <form onSubmit={handleSubmit} className="create-form">
          {/* Word Input */}
          <div className="form-group">
            <label className="form-label">Palabra o frase:</label>
            <input
              type="text"
              className="form-input"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value.toUpperCase())}
              placeholder="Ej: AMBULANCIA, SALUDO..."
              required
              autoFocus
            />
          </div>

          {/* Duplicates Alert */}
          {duplicates.length > 0 && wordInput.trim().length > 1 && (
            <div className="duplicates-alert">
              <div className="alert-head">
                <AlertCircle size={15} />
                <span>¿Te refieres a alguna de estas señas existentes?</span>
              </div>
              <div className="duplicates-list">
                {duplicates.slice(0, 3).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="duplicate-pill"
                    onClick={() => onWordCreated(d)}
                  >
                    <strong>{d.word}</strong> ({d.currentVideos}/{d.targetVideos} videos)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Select */}
          <div className="form-group">
            <label className="form-label">Categoría:</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Emergencias y Salud">Emergencias y Salud</option>
              <option value="Cotidiano y Cortesía">Cotidiano y Cortesía</option>
              <option value="Relaciones y Personas">Relaciones y Personas</option>
              <option value="Educación">Educación</option>
              <option value="Geografía de Chile">Geografía de Chile</option>
              <option value="Comunidad LSCH">Comunidad LSCH</option>
            </select>
          </div>

          {/* Optional context */}
          <div className="form-group">
            <label className="form-label">Contexto o variación (opcional):</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Seña usada en la zona central o variante formal."
            />
          </div>

          {/* Reward banner */}
          <div className="create-reward-banner">
            <Sparkles size={16} className="gold-icon" />
            <span>Recibirás <strong>+45 puntos</strong> por ser el primero en grabarla.</span>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="btn-action-primary"
            disabled={!wordInput.trim() || isSubmitting}
          >
            <Check size={20} />
            <span>{isSubmitting ? 'Guardando seña...' : 'Crear y grabar ahora'}</span>
          </button>
        </form>
      </div>

      <style>{`
        .create-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 10, 18, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .create-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-xl);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-glow);
          animation: slideUp 0.3s ease-out;
        }

        .create-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .create-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .plus-icon {
          color: var(--brand-primary-light);
        }

        .create-card-header h2 {
          font-size: 1.3rem;
          color: #fff;
        }

        .btn-close-icon {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
        }

        .create-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input, .form-select {
          width: 100%;
          min-height: 48px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          color: #ffffff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--brand-primary);
        }

        .form-select option {
          background: #0f172a;
          color: #fff;
        }

        .duplicates-alert {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .alert-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #fbbf24;
        }

        .duplicates-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .duplicate-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          font-size: 0.74rem;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .create-reward-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.82rem;
          color: var(--brand-primary-light);
        }

        .gold-icon {
          color: #fbbf24;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
