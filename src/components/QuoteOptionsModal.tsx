'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import OTPVerificationModal from './OTPVerificationModal';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-emerald-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertCircleIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;

interface QuoteOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (type: 'call_visit' | 'written') => void;
  quoteData?: any; // Data from InstantQuoteForm
}

const QuoteOptionsModal: React.FC<QuoteOptionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectOption,
  quoteData 
}) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpVerificationData, setOtpVerificationData] = useState<{
    phoneNumber: string;
    verificationId: string;
    expiresAt: Date;
  } | null>(null);
  const [pendingQuoteType, setPendingQuoteType] = useState<'call_visit' | 'written' | null>(null);

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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsSubmitting(false);
      setShowOTPModal(false);
      setOtpVerificationData(null);
      setPendingQuoteType(null);
    }
  }, [isOpen]);

  // Handle lead submission
  const handleSubmitLead = async (quoteType: 'call_visit' | 'written') => {
    if (!session?.user) {
      // Not logged in - pass to parent to show signup modal
      onSelectOption(quoteType);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setPendingQuoteType(quoteType);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteType,
          ...quoteData
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Lead created
        onSelectOption(quoteType);
      } else if (response.status === 403 && data.requiresVerification) {
        // Phone verification required - trigger OTP flow
        const phoneNumber = quoteData?.phone || quoteData?.phoneNumber || '';
        if (phoneNumber) {
          await handleSendOTP(phoneNumber);
        } else {
          setError('Phone number is required for verification.');
        }
      } else {
        // Other error
        setError(data.error || 'Failed to submit lead request. Please try again.');
      }
    } catch (err) {
      console.error('[QuoteOptionsModal] Submit error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send OTP for verification
  const handleSendOTP = async (phoneNumber: string) => {
    if (!phoneNumber) {
      setError('Phone number is required.');
      return;
    }

    try {
      const response = await fetch('/api/verification/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show OTP modal
        setOtpVerificationData({
          phoneNumber: phoneNumber,
          verificationId: data.verificationId,
          expiresAt: new Date(data.expiresAt)
        });
        setShowOTPModal(true);
      } else if (response.status === 429) {
        // Rate limited
        setError(data.error || 'Too many verification requests. Please try again later.');
      } else {
        setError(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('[QuoteOptionsModal] Send OTP error:', err);
      setError('Failed to send verification code. Please try again.');
    }
  };

  // Handle OTP verification success
  const handleOTPVerificationSuccess = async () => {
    setShowOTPModal(false);
    setOtpVerificationData(null);

    // Retry lead submission now that user is verified
    if (pendingQuoteType) {
      await handleSubmitLead(pendingQuoteType);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    const phoneNumber = otpVerificationData?.phoneNumber || quoteData?.phone || quoteData?.phoneNumber || '';
    if (!phoneNumber) {
      return { success: false, error: 'Phone number not found' };
    }

    try {
      const response = await fetch('/api/verification/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          verificationId: data.verificationId,
          expiresAt: new Date(data.expiresAt)
        };
      } else {
        return {
          success: false,
          error: data.error,
          retryAfter: data.retryAfter
        };
      }
    } catch (err) {
      console.error('[QuoteOptionsModal] Resend OTP error:', err);
      return {
        success: false,
        error: 'Failed to resend verification code'
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="theme-card max-w-3xl w-full p-8 relative animate-slide-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
        >
          <XIcon />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Quote Type</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select how you&apos;d like to receive quotes from our verified solar installers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Call/Visit Quote Option */}
          <div 
            className="theme-card p-6 cursor-pointer"
            onClick={() => onSelectOption('call_visit')}
          >
            <div className="bg-blue-500/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <PhoneIcon />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Call/Visit Quote</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Speak directly with installers who can call you or schedule a site visit
            </p>
            
            <ul className="space-y-2 mb-6">
              {[
                "Phone or on-site consultation",
                "Speak directly with installers",
                "Faster quote turnaround",
                "Personalized attention"
              ].map(item => (
                <li key={item} className="flex items-start space-x-2">
                  <span className="text-blue-500"><CheckCircleIcon /></span>
                  <span className="text-slate-600 dark:text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleSubmitLead('call_visit'); }}
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting && pendingQuoteType === 'call_visit' ? 'Submitting...' : 'Select Call/Visit Quote'}
            </button>
          </div>
          
          {/* Written Quote Option */}
          <div 
            className="theme-card p-6 cursor-pointer"
            onClick={() => !isSubmitting && handleSubmitLead('written')}
          >
            <div className="bg-emerald-500/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <FileTextIcon />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Written Quote</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Receive detailed written quotes through our secure platform
            </p>
            
            <ul className="space-y-2 mb-6">
               {[
                "No phone calls required",
                "Receive detailed written quotes",
                "Compare at your convenience",
                "Option to open bidding & negotiate"
              ].map(item => (
                <li key={item} className="flex items-start space-x-2">
                  <span className="text-emerald-500"><CheckCircleIcon /></span>
                  <span className="text-slate-600 dark:text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleSubmitLead('written'); }}
              disabled={isSubmitting}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting && pendingQuoteType === 'written' ? 'Submitting...' : 'Select Written Quote'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-2">
            <AlertCircleIcon className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        
        <div className="theme-card mt-6 p-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Both options connect you with our network of verified, licensed solar installers.
            Your information is secure and will only be shared with installers you choose to engage with.
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && otpVerificationData && (
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={() => {
            setShowOTPModal(false);
            setOtpVerificationData(null);
          }}
          phoneNumber={otpVerificationData.phoneNumber}
          verificationId={otpVerificationData.verificationId}
          expiresAt={otpVerificationData.expiresAt}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onResendOTP={handleResendOTP}
        />
      )}
    </div>
  );
};

export default QuoteOptionsModal;
