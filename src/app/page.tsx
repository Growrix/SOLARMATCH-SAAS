'use client'

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Hero from '../components/Hero';
import InstantQuoteForm from '../components/InstantQuoteForm';
import RebateCalculatorForm from '../components/RebateCalculatorForm';
import QuoteOptionsModal from '../components/QuoteOptionsModal';
import QuoteSuccessModal from '../components/QuoteSuccessModal';
import HomeownerSignupModal from '../components/HomeownerSignupModal';
import Footer from '../components/Footer';
import BlogSection from '../components/BlogSection';
import NewsletterSignup from '../components/NewsletterSignup';
import type { Post } from '../types/blog';

// Icon components
const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="16" x2="16" y1="14" y2="18"/>
    <path d="M16 10h.01"/>
    <path d="M12 10h.01"/>
    <path d="M8 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M8 14h.01"/>
    <path d="M12 18h.01"/>
    <path d="M8 18h.01"/>
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
    <path d="M7 7h.01"/>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeCalculator, setActiveCalculator] = useState<'quote' | 'rebate'>('quote');
  const [isQuoteOptionsModalOpen, setIsQuoteOptionsModalOpen] = useState(false);
  const [isHomeownerSignupModalOpen, setIsHomeownerSignupModalOpen] = useState(false);
  const [isQuoteSuccessModalOpen, setIsQuoteSuccessModalOpen] = useState(false);
  const [selectedQuoteType, setSelectedQuoteType] = useState<'call_visit' | 'written' | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [pendingQuoteData, setPendingQuoteData] = useState<any>(null);
  const [homeownerLeadCount, setHomeownerLeadCount] = useState<number>(0);
  const [isLoadingLeadCount, setIsLoadingLeadCount] = useState<boolean>(false);

  // Ensure page starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch homeowner's lead count if authenticated
  useEffect(() => {
    const fetchLeadCount = async () => {
      if (status === 'authenticated' && session?.user?.role === 'HOMEOWNER') {
        setIsLoadingLeadCount(true);
        try {
          const response = await fetch('/api/homeowner/dashboard');
          if (response.ok) {
            const data = await response.json();
            setHomeownerLeadCount(data.totalSubmitted || 0);
          }
        } catch (error) {
          console.error('Failed to fetch lead count:', error);
        } finally {
          setIsLoadingLeadCount(false);
        }
      }
    };

    fetchLeadCount();
  }, [status, session]);

  // Captures quote data from the form and stores it pending authentication
  const handleQuoteCalculated = useCallback((data: any) => {
    setPendingQuoteData(data);
    setQuoteData(data);
  }, []);

  const handleQuoteOptionSelected = async (type: 'call_visit' | 'written') => {
    setSelectedQuoteType(type);
    setIsQuoteOptionsModalOpen(false);
    
    // Check if user is already logged in
    if (status === 'authenticated' && session?.user) {
      // User is logged in - submit quote directly without signup
      console.log('User already logged in, submitting quote request:', { 
        quoteType: type, 
        quoteData: pendingQuoteData,
        userId: session.user.id,
        userEmail: session.user.email
      });
      
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteType: type,
            propertyPostcode: pendingQuoteData?.postcode || pendingQuoteData?.propertyPostcode,
            location: pendingQuoteData?.location,
            state: pendingQuoteData?.state,
            energyBill: pendingQuoteData?.electricityValue || pendingQuoteData?.energyBill || 0,
            quoteData: pendingQuoteData,
            ...pendingQuoteData
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Success! Lead created - show success modal
          setIsQuoteSuccessModalOpen(true);
          setPendingQuoteData(null);
        } else if (response.status === 403 && data.requiresVerification) {
          // Phone verification required - for now, show error
          // TODO: Implement OTP flow in parent component
          console.error('Phone verification required:', data);
          alert('Phone verification required for second submission. Feature coming soon!');
        } else {
          // Other error
          console.error('Lead submission error:', data.error);
          alert(data.error || 'Failed to submit lead request. Please try again.');
        }
      } catch (err) {
        console.error('Lead submission error:', err);
        alert('An unexpected error occurred. Please try again.');
      }
    } else {
      // User is not logged in - show signup modal
      setIsHomeownerSignupModalOpen(true);
    }
  };

  const handleHomeownerSignupSuccess = () => {
    // After successful signup and auto-login, submit the quote request
    console.log('Signup successful, submitting quote request:', { 
      quoteType: selectedQuoteType, 
      quoteData: pendingQuoteData 
    });
    
    setIsHomeownerSignupModalOpen(false);
    setIsQuoteSuccessModalOpen(true);
    
    // Clear pending data after submission
    setPendingQuoteData(null);
  };

  const handleDashboardClick = () => {
    setIsQuoteSuccessModalOpen(false);
    // Navigate to homeowner dashboard
    router.push('/homeowner/dashboard');
  };

  const handleScrollToQuote = () => {
    setActiveCalculator('quote');
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToRebate = () => {
    setActiveCalculator('rebate');
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Footer handlers
  const handleBecomePartner = () => {
    router.push('/installer');
  };

  const handlePartnerSignIn = () => {
    router.push('/installer');
  };

  const handleBlogClick = () => {
    // Navigate to blog page when implemented
    console.log('Blog clicked');
  };

  const handleGovernmentNewsClick = () => {
    // Navigate to government news page when implemented
    console.log('Government news clicked');
  };

  const handleSeeAllBlogPosts = () => {
    router.push('/blog');
  };

  const handleNavigateToPost = (post: Post) => {
    // Store post in sessionStorage and navigate
    sessionStorage.setItem('currentBlogPost', JSON.stringify(post));
    router.push('/blog/post');
  };

  return (
  <main className="bg-bg-primary dark:bg-black">
      <Hero 
        onInstantQuoteClick={handleScrollToQuote}
        onRebateCalculatorClick={handleScrollToRebate}
      />
      
      {/* Calculator Section */}
  <section id="calculator-section" className="py-16 lg:py-24 bg-bg-primary">
        {/* Removed all gradient overlays for a flat cream look in light mode */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How Much Could You Save?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Find out now. Our calculators provide a transparent, no-jargon estimate of your solar savings and government incentives.
            </p>
          </div>
          
          {/* Calculator Switcher */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md theme-switcher-bg p-1 rounded-full flex border theme-switcher-border">
              <div className={`absolute top-1 bottom-1 left-1 w-1/2 rounded-full theme-switcher-active shadow-lg transition-transform duration-300 ease-in-out transform ${
                activeCalculator === 'quote' ? 'translate-x-0' : 'translate-x-full'
              }`}></div>

              <button
                onClick={() => setActiveCalculator('quote')}
                className={`relative z-10 w-1/2 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 rounded-full ${
                  activeCalculator === 'quote' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`}
                aria-pressed={activeCalculator === 'quote'}
              >
                <CalculatorIcon />
                Instant Quote
              </button>
              <button
                onClick={() => setActiveCalculator('rebate')}
                className={`relative z-10 w-1/2 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 rounded-full ${
                  activeCalculator === 'rebate' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`}
                aria-pressed={activeCalculator === 'rebate'}
              >
                <TagIcon />
                Rebate Calculator
              </button>
            </div>
          </div>
          
          {/* Calculator Forms */}
          {activeCalculator === 'quote' ? (
            <InstantQuoteForm 
              onProceedToDetailedQuote={() => setIsQuoteOptionsModalOpen(true)}
              onQuoteCalculated={handleQuoteCalculated}
              hideSubmitButton={status === 'authenticated' && session?.user?.role === 'HOMEOWNER' && homeownerLeadCount > 0}
            />
          ) : (
            <RebateCalculatorForm onGetQuotesClick={() => setIsQuoteOptionsModalOpen(true)} />
          )}
        </div>
      </section>

      {/* Modals */}
      {isQuoteOptionsModalOpen && (
        <QuoteOptionsModal
          isOpen={isQuoteOptionsModalOpen}
          onClose={() => setIsQuoteOptionsModalOpen(false)}
          onSelectOption={handleQuoteOptionSelected}
          quoteData={pendingQuoteData}
        />
      )}

      {isHomeownerSignupModalOpen && (
        <HomeownerSignupModal
          isOpen={isHomeownerSignupModalOpen}
          onClose={() => setIsHomeownerSignupModalOpen(false)}
          onSuccess={handleHomeownerSignupSuccess}
          onSwitchToSignIn={() => setIsHomeownerSignupModalOpen(false)}
          context="quote"
          quoteData={pendingQuoteData}
          quoteType={selectedQuoteType || undefined}
        />
      )}

      {isQuoteSuccessModalOpen && (
        <QuoteSuccessModal
          isOpen={isQuoteSuccessModalOpen}
          onClose={() => setIsQuoteSuccessModalOpen(false)}
          onDashboardClick={handleDashboardClick}
        />
      )}

      {/* Blog Section */}
  <section className="w-full py-16 lg:py-24 bg-bg-primary">
    <BlogSection
      onSeeAllPostsClick={handleSeeAllBlogPosts}
      onNavigateToPost={handleNavigateToPost}
    />
  </section>

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* Footer */}
      <Footer
        onBecomePartnerClick={handleBecomePartner}
        onPartnerSignInClick={handlePartnerSignIn}
        onScrollToQuote={handleScrollToQuote}
        onScrollToRebate={handleScrollToRebate}
        onBlogClick={handleBlogClick}
        onGovernmentNewsClick={handleGovernmentNewsClick}
      />
    </main>
  );
}