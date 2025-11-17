'use client';

import React from 'react';

// --- Icon Components ---
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-success">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-success">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

interface FirstQuoteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyContact: () => void;
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE';
  remainingQuotes: number;
  totalQuoteLimit: number;
}

const FirstQuoteSuccessModal: React.FC<FirstQuoteSuccessModalProps> = ({
  isOpen,
  onClose,
  onVerifyContact,
  quoteType,
  remainingQuotes,
  totalQuoteLimit,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="theme-card relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-muted transition-colors z-10"
          aria-label="Close"
        >
          <XIcon />
        </button>

        {/* Success Icon */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <CheckCircleIcon />
          <h2 className="text-heading-1 text-foreground mt-4 mb-2">
            Quote Request Submitted Successfully!
          </h2>
          <p className="text-muted text-center max-w-lg">
            We&apos;re matching you with verified solar installers in your area. You&apos;ll receive quotes soon.
          </p>
        </div>

        {/* Remaining Balance Card */}
        <div className="mx-6 mb-6 p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-primary">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-heading-4 text-foreground mb-1">
                Remaining Quote Balance
              </h3>
              <p className="text-muted text-body-small">
                You can submit more free quote requests
              </p>
            </div>
            <div className="text-right">
              <div className="text-heading-1 text-primary">
                {remainingQuotes}
              </div>
              <div className="text-body-small text-muted">
                of {totalQuoteLimit} total
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mx-6 mb-6 space-y-4">
          {/* Verification Benefits */}
          <div className="p-5 bg-success/10 rounded-xl border border-success/30">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <ShieldCheckIcon />
              </div>
              <div className="flex-1">
                <h4 className="text-foreground mb-2">
                  Verify Your Contact Number for More Free Quotes
                </h4>
                <p className="text-body-small text-muted mb-3">
                  Verify your phone number to unlock additional free quote requests and get priority matching with installers.
                </p>
                <button
                  onClick={onVerifyContact}
                  className="inline-flex items-center space-x-2 bg-success hover:bg-success/90 text-foreground-secondary px-4 py-2 rounded-lg transition-colors"
                >
                  <ShieldCheckIcon />
                  <span>Verify Contact Number</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bidding Info (only for Written Quotes) */}
          {quoteType === 'WRITTEN_QUOTE' && (
            <div className="p-5 bg-primary/10 rounded-xl border border-primary">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <InfoIcon />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-2">
                    Bidding Available for Written Quotes
                  </h4>
                  <p className="text-body-small text-muted">
                    Since you selected a <strong>Written Quote</strong>, you&apos;ll have the option to open bidding and negotiate with installers to get the best price for your solar installation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-foreground-secondary rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstQuoteSuccessModal;
