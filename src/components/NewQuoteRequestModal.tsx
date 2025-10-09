'use client'

import React, { useEffect } from 'react';
import InstantQuoteForm from './InstantQuoteForm';

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

interface NewQuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCalculated: (data: any) => void;
  onProceedToDetailedQuote: () => void;
}

const NewQuoteRequestModal: React.FC<NewQuoteRequestModalProps> = ({ 
  isOpen, 
  onClose,
  onQuoteCalculated,
  onProceedToDetailedQuote
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="theme-card relative w-full max-w-5xl p-4 sm:p-6 lg:p-8 animate-slide-in-up max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request a New Quote</h2>
            <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
            aria-label="Close"
            >
                <XIcon />
            </button>
        </div>
        
        <InstantQuoteForm 
          onQuoteCalculated={onQuoteCalculated}
          onProceedToDetailedQuote={onProceedToDetailedQuote}
        />
      </div>
    </div>
  );
};

export default NewQuoteRequestModal;
