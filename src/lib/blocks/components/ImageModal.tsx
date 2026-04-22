"use client";

import { useCallback, useEffect, useRef } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Simple focus trap
  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl || !isOpen) return;

    const focusableElements = modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    modalEl.addEventListener('keydown', handleTab);
    return () => modalEl.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      <div 
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-8 modal-overlay" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Image modal"
        onClick={handleOverlayClick}
        ref={modalRef}
      >
        <div className="relative w-full max-w-6xl max-h-[95vh] flex items-center justify-center">
          <button
            ref={closeButtonRef}
            className="absolute -top-4 -right-4 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center text-white text-xl font-bold shadow-2xl hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 ring-white/50 ring-offset-2 ring-offset-black/50"
            onClick={handleCloseClick}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-auto max-h-[95vh] max-w-full object-contain rounded-2xl shadow-2xl"
            loading="eager"
            onError={(e) => {
              console.error('Image load failed:', imageUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
        </div>
      </div>
    </>
  );
}