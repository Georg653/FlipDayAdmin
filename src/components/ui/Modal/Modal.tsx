// --- Путь: src/components/ui/Modal/Modal.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container modal-size-${size}`} onClick={(e) => e.stopPropagation()}>
        {title && (
            <div className="modal-header-bar">
                <h3 className="modal-title">{title}</h3>
            </div>
        )}
        <button onClick={onClose} className="modal-close-button" aria-label="Закрыть">
            ×
        </button>
        
        <div className="modal-body">
            {children}
        </div>
        
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};