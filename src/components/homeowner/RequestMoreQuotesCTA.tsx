import React from 'react';

interface RequestMoreQuotesCTAProps {
  remaining: number;
  quoteLimit: number;
  totalSubmitted: number;
  requiresVerification: boolean;
  onRequest: () => void;
  onVerifyContact: () => void;
  isProcessing?: boolean;
  className?: string;
}

const RequestMoreQuotesCTA: React.FC<RequestMoreQuotesCTAProps> = ({
  remaining,
  quoteLimit,
  totalSubmitted,
  requiresVerification,
  onRequest,
  onVerifyContact,
  isProcessing = false,
  className = '',
}) => {
  const isFirstQuote = totalSubmitted === 0;
  const used = Math.max(0, quoteLimit - remaining);
  const progress = quoteLimit > 0 ? Math.min(100, (used / quoteLimit) * 100) : 0;
  const hasRemaining = remaining > 0;

  const baseButtonClasses =
    'w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const disabledButtonClasses = 'bg-muted text-muted-foreground cursor-not-allowed';
  const primaryButtonClasses = 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary';
  const secondaryButtonClasses = 'bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:outline-warning';

  return (
    <section className={`theme-card p-4 sm:p-6 ${className}`}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-caption uppercase tracking-wide text-muted-foreground">Quote Requests</p>
          <h2 className="text-body-large font-semibold text-foreground">
            {isFirstQuote 
              ? 'Request Your First Quote'
              : requiresVerification 
                ? 'Verify your phone to unlock more quotes' 
                : 'Request additional quotes'}
          </h2>
          <p className="text-body-small text-muted-foreground mt-1">
            {isFirstQuote 
              ? 'Get started with your solar journey - request your first quote from verified installers.'
              : `You have used ${used} of your ${quoteLimit} available quote requests.`}
          </p>
        </div>
        {!isFirstQuote && (
          <div className="text-right">
            <p className="text-caption text-muted-foreground">Remaining balance</p>
            <p className="text-2xl font-bold text-primary">{Math.max(remaining, 0)}</p>
          </div>
        )}
      </header>

      {!isFirstQuote && (
        <div className="mb-4">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-2 flex justify-between text-caption text-muted-foreground">
            <span>{used} used</span>
            <span>{remaining} remaining</span>
          </div>
        </div>
      )}

      {isFirstQuote ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-body-small text-muted-foreground">
            Welcome! You&apos;re ready to get quotes from verified solar installers. No phone verification required for your first quote.
          </p>
          <button
            type="button"
            onClick={onRequest}
            disabled={isProcessing}
            className={`${baseButtonClasses} ${primaryButtonClasses}`}
          >
            {isProcessing ? 'Opening…' : 'Get Started'}
          </button>
        </div>
      ) : requiresVerification ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-body-small text-warning">
            Your phone number must be verified before you can request more quotes. This keeps the marketplace fair and secure.
          </p>
          <button
            type="button"
            onClick={onVerifyContact}
            disabled={isProcessing}
            className={`${baseButtonClasses} ${secondaryButtonClasses}`}
          >
            {isProcessing ? 'Opening…' : 'Verify phone number'}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-body-small text-muted-foreground">
            {hasRemaining
              ? 'Ready to explore more installers? Launch the quote request wizard to tailor your next project.'
              : 'You have reached your current quote limit. Increase your allowance or check with support for options.'}
          </p>
          <button
            type="button"
            onClick={hasRemaining ? onRequest : undefined}
            disabled={!hasRemaining || isProcessing}
            className={`${baseButtonClasses} ${hasRemaining ? primaryButtonClasses : disabledButtonClasses}`}
          >
            {hasRemaining ? (isProcessing ? 'Opening…' : 'Request more quotes') : 'Limit reached'}
          </button>
        </div>
      )}
    </section>
  );
};

export default RequestMoreQuotesCTA;
