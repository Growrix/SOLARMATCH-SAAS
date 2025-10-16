import React from 'react';

interface RequestMoreQuotesCTAProps {
  remaining: number;
  quoteLimit: number;
  requiresVerification: boolean;
  onRequest: () => void;
  onVerifyContact: () => void;
  isProcessing?: boolean;
  className?: string;
}

const RequestMoreQuotesCTA: React.FC<RequestMoreQuotesCTAProps> = ({
  remaining,
  quoteLimit,
  requiresVerification,
  onRequest,
  onVerifyContact,
  isProcessing = false,
  className = '',
}) => {
  const used = Math.max(0, quoteLimit - remaining);
  const progress = quoteLimit > 0 ? Math.min(100, (used / quoteLimit) * 100) : 0;
  const hasRemaining = remaining > 0;

  const baseButtonClasses =
    'w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const disabledButtonClasses = 'bg-slate-300 text-slate-600 cursor-not-allowed';
  const primaryButtonClasses = 'bg-primary text-white hover:bg-teal-700 focus-visible:outline-primary';
  const secondaryButtonClasses = 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:outline-amber-500';

  return (
    <section className={`theme-card p-4 sm:p-6 ${className}`}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Quote Requests</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {requiresVerification ? 'Verify your phone to unlock more quotes' : 'Request additional quotes'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            You have used <strong>{used}</strong> of your <strong>{quoteLimit}</strong> available quote requests.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Remaining balance</p>
          <p className="text-2xl font-bold text-primary">{Math.max(remaining, 0)}</p>
        </div>
      </header>

      <div className="mb-4">
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-primary/80 transition-all"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{used} used</span>
          <span>{remaining} remaining</span>
        </div>
      </div>

      {requiresVerification ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-sm text-amber-600 dark:text-amber-400">
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
          <p className="text-sm text-slate-600 dark:text-slate-400">
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
