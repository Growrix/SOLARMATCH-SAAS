

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InstantQuoteForm from './components/InstantQuoteForm';
import RebateCalculatorForm from './components/RebateCalculatorForm';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import InstallerSignupModal from './components/InstallerSignupModal';
import InstallerEligibilityModal from './components/InstallerEligibilityModal';
import InstallerSignInModal from './components/InstallerSignInModal';
import HomeownerSignupModal from './components/HomeownerSignupModal';
import HomeownerSignInModal from './components/HomeownerSignInModal';
import QuoteOptionsModal from './components/QuoteOptionsModal';
import DetailedQuoteAuthModal from './components/DetailedQuoteAuthModal';
import QuoteSuccessModal from './components/QuoteSuccessModal';
import HomeownerDashboard from './components/HomeownerDashboard';
import InstallerDashboard from './components/InstallerDashboard';
import InstallerHomePage from './components/InstallerHomePage';
import NewQuoteRequestModal from './components/NewQuoteRequestModal';
import BottomNavBar from './components/BottomNavBar';
import MobileSidebarMenu from './components/MobileSidebarMenu';
import GuestBottomNavBar from './components/GuestBottomNavBar';
import DeleteAccountModal from './components/DeleteAccountModal';
import InstallerBottomNavBar from './components/InstallerBottomNavBar';
import InstallerMobileSidebarMenu from './components/InstallerMobileSidebarMenu';
import AdminDashboard from './components/AdminDashboard';
import BlogSection from './components/BlogSection';
import GovernmentNewsSection from './components/GovernmentNewsSection';
import NewsletterSignup from './components/NewsletterSignup';
import FloatingChat from './components/FloatingChat';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import GovernmentNewsPage from './components/GovernmentNewsPage';
import MessagingModal from './components/MessagingModal';
import InstallerMessagingModal from './components/InstallerMessagingModal';
import type { Post, QuoteRequest, UserProfile } from './types';


type Theme = 'light' | 'dark' | 'system';
type CalculatorType = 'quote' | 'rebate';
type PostAuthAction = 'submitQuote' | null;
type Page = 'home' | 'homeownerDashboard' | 'installerDashboard' | 'adminDashboard' | 'blog' | 'blogPost' | 'governmentNews';

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>;


const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('quote');
  
  // Page State
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [activeDashboardPage, setActiveDashboardPage] = useState('Call/Visit Quotes');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeInstallerDashboardPage, setActiveInstallerDashboardPage] = useState('Lead Feed');
  const [isInstallerMobileSidebarOpen, setIsInstallerMobileSidebarOpen] = useState(false);

  // Installer Modals State
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isInstallerMessagingModalOpen, setIsInstallerMessagingModalOpen] = useState(false);

  // Homeowner Modals State
  const [isHomeownerSignupOpen, setIsHomeownerSignupOpen] = useState(false);
  const [isHomeownerSignInOpen, setIsHomeownerSignInOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);


  // Quote Flow Modal State
  const [isQuoteOptionsModalOpen, setIsQuoteOptionsModalOpen] = useState(false);
  const [isDetailedQuoteModalOpen, setIsDetailedQuoteModalOpen] = useState(false);
  const [isQuoteSuccessModalOpen, setIsQuoteSuccessModalOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Homeowner auth
  const [isInstallerLoggedIn, setIsInstallerLoggedIn] = useState(false); // Installer auth
  const [postAuthAction, setPostAuthAction] = useState<PostAuthAction>(null);

  // Header visibility state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // State to hold quote data between form submission and login
  const [pendingQuoteData, setPendingQuoteData] = useState<any>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '0412 345 678',
    address: '123 Solar St, Sunnyside, NSW 2000',
    avatar: 'https://picsum.photos/seed/user/200/200'
  });

  // Notification Counts
  const unreadHomeownerMessages = 3;
  const unreadInstallerMessages = 3;
  const newLeadsCount = 5;


  // Effect to manage theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'theme-system');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'system') {
      root.classList.add('dark', 'theme-system');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect for header visibility on scroll
  useEffect(() => {
    let lastScroll = 0;
    const SCROLL_DELTA = 5;
    const HEADER_HEIGHT = 80;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        // At the very top, always show
        if (currentScroll <= HEADER_HEIGHT) {
            setIsHeaderVisible(true);
            lastScroll = currentScroll;
            return;
        }
        
        // Don't do anything if scroll is small
        if (Math.abs(currentScroll - lastScroll) < SCROLL_DELTA) {
            return;
        }

        // If scrolling down, hide. If scrolling up, show.
        if (currentScroll > lastScroll) {
            // Down
            setIsHeaderVisible(false);
        } else {
            // Up
            setIsHeaderVisible(true);
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
  
  const createQuoteRequest = (data: any): QuoteRequest => {
    const batteryCapacity = data.batteryCapacity === 'custom' 
        ? data.customBatteryCapacity 
        : data.batteryCapacity;
    const batteryDisplay = data.batteryIncluded 
        ? `${batteryCapacity || '10'}kWh` // Default of 10 if not specified
        : 'Not Included';

    return {
        id: quoteRequests.length + 1,
        location: `${data.location}, ${data.state} ${data.postcode}`,
        status: 'Awaiting Bids',
        requestDate: new Date().toISOString(),
        cost: {
            finalPrice: data.finalPrice,
            totalRebates: (data.federalRebate || 0) + (data.stateRebate || 0) + (data.batteryRebate || 0),
            totalSystemCost: data.totalCost,
        },
        system: {
            size: `${data.systemSize}kW`,
            battery: batteryDisplay,
            annualProduction: data.annualProduction,
        },
        details: {
            propertyType: data.propertyType,
            roofType: data.roofType,
            budget: data.budgetRange,
        },
        performance: {
            annualSavings: data.annualSavings,
            paybackPeriod: data.simplePaybackYears,
            co2Reduction: Math.round((data.annualProduction || 0) * 0.82),
        }
    };
  };

  const handleProceedToDetailedQuote = (quoteType: 'call_visit' | 'written') => {
    console.log(`Proceeding with detailed quote option: ${quoteType}`);
    setIsQuoteOptionsModalOpen(false);
  
    if (isLoggedIn) {
      if (pendingQuoteData) {
        const newRequest = createQuoteRequest(pendingQuoteData);
        setQuoteRequests(prev => [newRequest, ...prev]);
        setPendingQuoteData(null); // Clear pending data
  
        setIsQuoteSuccessModalOpen(true);
      } else {
          console.error("User is logged in but no pending quote data found to submit.");
          // Fallback: just go to dashboard.
          handleNavigateHomeownerDashboard();
      }
    } else {
      setIsDetailedQuoteModalOpen(true);
    }
  };
  
  // Captures quote data from the form and stores it pending authentication
  const handleQuoteCalculated = useCallback((data: any) => {
    setPendingQuoteData(data);
  }, []);

  const handleSignupAndSubmitQuote = (signupData: any) => {
    console.log('Signup data received, proceeding to submit quote:', signupData);
    setIsDetailedQuoteModalOpen(false);
    setIsLoggedIn(true); // Mock login

    if (pendingQuoteData) {
      const newRequest = createQuoteRequest(pendingQuoteData);
      setQuoteRequests(prev => [newRequest, ...prev]);
      setPendingQuoteData(null); // Clear pending data

      setIsQuoteSuccessModalOpen(true); // Open the success modal
    } else {
      console.error("Signup successful but no pending quote data found to submit.");
      // Fallback: just go to dashboard.
      handleNavigateHomeownerDashboard();
    }
  };
  
  const handleSwitchToSignInForQuote = () => {
      setIsDetailedQuoteModalOpen(false);
      setPostAuthAction('submitQuote'); // Keep track of the action
      setIsHomeownerSignInOpen(true); // Open the generic sign-in modal
  };

  const handleEligible = () => {
    setIsEligibilityModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsHomeownerSignInOpen(false);
    setIsHomeownerSignupOpen(false);
    setIsLoggedIn(true);

    if (postAuthAction === 'submitQuote' && pendingQuoteData) {
      const newRequest = createQuoteRequest(pendingQuoteData);
      setQuoteRequests(prev => [newRequest, ...prev]);
      setPendingQuoteData(null); // Clear pending data

      setPostAuthAction(null); // Reset the action
      setIsQuoteSuccessModalOpen(true);
    } else {
      handleNavigateHomeownerDashboard();
    }
  }

  const handleInstallerSignupSuccess = () => {
    setIsSignupModalOpen(false);
    setIsInstallerLoggedIn(true);
    setCurrentPage('home');
  };
  
  const handleInstallerSignInSuccess = () => {
    setIsSignInModalOpen(false);
    setIsInstallerLoggedIn(true);
    setCurrentPage('installerDashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsInstallerLoggedIn(false);
    setCurrentPage('home');
  }
  
  const handleScrollToQuote = () => {
    setActiveCalculator('quote');
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleScrollToRebate = () => {
      setActiveCalculator('rebate');
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
  }
  
  const handleNavigateHomeownerDashboard = () => setCurrentPage('homeownerDashboard');
  const handleNavigateInstallerDashboard = () => setCurrentPage('installerDashboard');
  const handleNavigateHome = () => setCurrentPage('home');
  const handleNavigateBlog = () => {
    setCurrentPage('blog');
    window.scrollTo(0, 0);
  };
  const handleNavigateToPost = (post: Post) => {
    setCurrentPost(post);
    setCurrentPage('blogPost');
    window.scrollTo(0, 0);
  };
  const handleNavigateGovernmentNews = () => {
    setCurrentPage('governmentNews');
    window.scrollTo(0, 0);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted for", userProfile.email);
    setIsDeleteAccountModalOpen(false);
    handleLogout();
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call
    console.log("Profile updated:", updatedProfile);
  };

  // --- Temporary Dev Navigation ---
  const handleNavigateInstallerHome_DEV = () => {
    setIsInstallerLoggedIn(true);
    setCurrentPage('home');
  };

  const handleNavigateHomeownerDashboard_DEV = () => {
    setIsLoggedIn(true);
    setCurrentPage('homeownerDashboard');
  };

  const handleNavigateInstallerDashboard_DEV = () => {
      setIsInstallerLoggedIn(true);
      setCurrentPage('installerDashboard');
  };

  const handleNavigateAdminDashboard_DEV = () => {
      // No auth check needed for dev mode
      setCurrentPage('adminDashboard');
  };

  const commonPageProps = {
    theme,
    setTheme,
    isLoggedIn: isLoggedIn || isInstallerLoggedIn,
    onLoginClick: () => setIsHomeownerSignInOpen(true),
    onSignupClick: () => setIsHomeownerSignupOpen(true),
    onLogoutClick: handleLogout,
    onHomeClick: handleNavigateHome,
    onDashboardClick: isInstallerLoggedIn ? handleNavigateInstallerDashboard : handleNavigateHomeownerDashboard,
    onHomeownerDashboardClick: handleNavigateHomeownerDashboard_DEV,
    onInstallerDashboardClick: handleNavigateInstallerDashboard_DEV,
    onInstallerHomeClick: handleNavigateInstallerHome_DEV,
    onAdminDashboardClick: handleNavigateAdminDashboard_DEV,
    onBecomePartnerClick: () => setIsEligibilityModalOpen(true),
    onPartnerSignInClick: () => setIsSignInModalOpen(true),
    onScrollToQuote: handleScrollToQuote,
    onScrollToRebate: handleScrollToRebate,
    onBlogClick: handleNavigateBlog,
    onGovernmentNewsClick: handleNavigateGovernmentNews,
    onNavigateToPost: handleNavigateToPost,
    isHeaderVisible,
  };

  return (
    <>
      {currentPage === 'home' && (
        isInstallerLoggedIn ? (
          <InstallerHomePage
            {...commonPageProps}
          />
        ) : (
          <div className="min-h-screen flex flex-col">
            <div className={`sticky top-0 z-30 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
              {!isLoggedIn && !isInstallerLoggedIn && (
                <TopBar 
                  onBecomePartnerClick={() => setIsEligibilityModalOpen(true)} 
                  onPartnerSignInClick={() => setIsSignInModalOpen(true)} 
                />
              )}
              <Header 
                {...commonPageProps}
              />
            </div>
            <main className="flex-grow">
              <Hero 
                  onInstantQuoteClick={handleScrollToQuote}
                  onRebateCalculatorClick={handleScrollToRebate}
              />
              <section id="calculator-section" className="animated-section-background pt-16 sm:pt-24 pb-16 sm:pb-24">
                <div className="floating-dollars-container" aria-hidden="true">
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                    <span>$</span>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        How Much Could You Save?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Find out now. Our calculators provide a transparent, no-jargon estimate of your solar savings and government incentives.
                    </p>
                  </div>
                  <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-md bg-gray-100 dark:bg-slate-800 p-1 rounded-full flex border border-gray-200 dark:border-slate-700">
                      <div className={`absolute top-1 bottom-1 left-1 w-1/2 rounded-full bg-white dark:bg-slate-700 shadow-lg transition-transform duration-300 ease-in-out transform ${
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
                  
                  {activeCalculator === 'quote' ? (
                    <InstantQuoteForm 
                      onProceedToDetailedQuote={() => setIsQuoteOptionsModalOpen(true)}
                      onQuoteCalculated={handleQuoteCalculated}
                    />
                  ) : (
                    <RebateCalculatorForm onGetQuotesClick={() => setIsNewQuoteModalOpen(true)} />
                  )}
                </div>
              </section>
              <BlogSection onSeeAllPostsClick={handleNavigateBlog} onNavigateToPost={handleNavigateToPost} />
              <GovernmentNewsSection onSeeAllUpdatesClick={handleNavigateGovernmentNews} />
              <NewsletterSignup />
            </main>
            <Footer 
              {...commonPageProps}
            />
          </div>
        )
      )}

      {currentPage === 'blog' && (
        <BlogPage {...commonPageProps} onNavigateToPost={handleNavigateToPost} />
      )}
      
      {currentPage === 'blogPost' && currentPost && (
          <BlogPostPage {...commonPageProps} post={currentPost} onBackClick={handleNavigateBlog} />
      )}

      {currentPage === 'governmentNews' && (
        <GovernmentNewsPage {...commonPageProps} />
      )}

      {currentPage === 'homeownerDashboard' && isLoggedIn && (
        <HomeownerDashboard 
          quoteRequests={quoteRequests}
          onNewQuoteClick={() => setIsNewQuoteModalOpen(true)} 
          onLogoutClick={handleLogout} 
          theme={theme} 
          setTheme={setTheme}
          onHomeClick={handleNavigateHome}
          activePage={activeDashboardPage}
          setActivePage={setActiveDashboardPage}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteAccountClick={() => setIsDeleteAccountModalOpen(true)}
          onMessagesClick={() => setIsMessagingModalOpen(true)}
          isHeaderVisible={isHeaderVisible}
        />
      )}

      {currentPage === 'installerDashboard' && isInstallerLoggedIn && (
        <InstallerDashboard
          theme={theme}
          setTheme={setTheme}
          onLogoutClick={handleLogout}
          onHomeClick={handleNavigateHome}
          activePage={activeInstallerDashboardPage}
          setActivePage={setActiveInstallerDashboardPage}
          onMessagesClick={() => setIsInstallerMessagingModalOpen(true)}
          isHeaderVisible={isHeaderVisible}
        />
      )}

      {currentPage === 'adminDashboard' && (
        <AdminDashboard 
          onHomeClick={handleNavigateHome} 
          onLogoutClick={handleLogout} 
          theme={theme} 
          setTheme={setTheme} 
          isHeaderVisible={isHeaderVisible} 
        />
      )}


      {/* Installer Modals */}
      <InstallerEligibilityModal
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        onEligible={handleEligible}
      />
      <InstallerSignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={handleInstallerSignupSuccess} 
      />
      <InstallerSignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
        onSuccess={handleInstallerSignInSuccess}
      />
      <InstallerMessagingModal
        isOpen={isInstallerMessagingModalOpen}
        onClose={() => setIsInstallerMessagingModalOpen(false)}
      />
      
      {/* Homeowner Modals */}
      <HomeownerSignupModal 
        isOpen={isHomeownerSignupOpen} 
        onClose={() => setIsHomeownerSignupOpen(false)} 
        onSuccess={handleLoginSuccess}
        onSwitchToSignIn={() => {
          setIsHomeownerSignupOpen(false);
          setIsHomeownerSignInOpen(true);
        }}
      />
      <HomeownerSignInModal
        isOpen={isHomeownerSignInOpen}
        onClose={() => setIsHomeownerSignInOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToSignUp={() => {
            setIsHomeownerSignInOpen(false);
            setIsHomeownerSignupOpen(true);
        }}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirmDelete={handleDeleteAccount}
      />
      <MessagingModal
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
      />
      
      {/* Quote Flow Modals */}
      <NewQuoteRequestModal
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onQuoteCalculated={handleQuoteCalculated}
        onProceedToDetailedQuote={() => {
          setIsNewQuoteModalOpen(false);
          setIsQuoteOptionsModalOpen(true);
        }}
      />
      <QuoteOptionsModal 
        isOpen={isQuoteOptionsModalOpen} 
        onClose={() => setIsQuoteOptionsModalOpen(false)} 
        onSelectOption={handleProceedToDetailedQuote} 
      />
      <DetailedQuoteAuthModal 
        isOpen={isDetailedQuoteModalOpen} 
        onClose={() => setIsDetailedQuoteModalOpen(false)} 
        onSignupAndSubmit={handleSignupAndSubmitQuote}
        onSwitchToSignIn={handleSwitchToSignInForQuote}
      />
      <QuoteSuccessModal
        isOpen={isQuoteSuccessModalOpen}
        onClose={() => setIsQuoteSuccessModalOpen(false)}
        onDashboardClick={() => {
            setIsQuoteSuccessModalOpen(false);
            handleNavigateHomeownerDashboard();
        }}
      />

      {/* Mobile Sidebar Menus */}
      {isLoggedIn && (
          <MobileSidebarMenu
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
              activePage={activeDashboardPage}
              setActivePage={(page) => {
                  setActiveDashboardPage(page);
                  setCurrentPage('homeownerDashboard');
              }}
              onLogoutClick={handleLogout}
              onMessagesClick={() => setIsMessagingModalOpen(true)}
              unreadMessagesCount={unreadHomeownerMessages}
          />
      )}
       {isInstallerLoggedIn && (
          <InstallerMobileSidebarMenu
              isOpen={isInstallerMobileSidebarOpen}
              onClose={() => setIsInstallerMobileSidebarOpen(false)}
              activePage={activeInstallerDashboardPage}
              setActivePage={(page) => {
                  setActiveInstallerDashboardPage(page);
                  setCurrentPage('installerDashboard');
              }}
              onLogoutClick={handleLogout}
              unreadMessagesCount={unreadInstallerMessages}
              newLeadsCount={newLeadsCount}
          />
      )}

      {/* Conditional Bottom Navigation & Floating Chat */}
      {isLoggedIn ? (
        <BottomNavBar 
            activePage={activeDashboardPage}
            setActivePage={setActiveDashboardPage}
            onNewQuoteClick={() => setIsNewQuoteModalOpen(true)}
            currentPage={currentPage as 'home' | 'homeownerDashboard'}
            onHomeClick={handleNavigateHome}
            onDashboardClick={handleNavigateHomeownerDashboard}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onMessagesClick={() => setIsMessagingModalOpen(true)}
            unreadMessagesCount={unreadHomeownerMessages}
        />
      ) : isInstallerLoggedIn ? (
        <InstallerBottomNavBar
            activePage={activeInstallerDashboardPage}
            setActivePage={setActiveInstallerDashboardPage}
            onNewBidClick={() => alert('New Bid Clicked')}
            currentPage={currentPage as 'home' | 'installerDashboard'}
            onHomeClick={handleNavigateHome}
            onDashboardClick={handleNavigateInstallerDashboard}
            onMenuClick={() => setIsInstallerMobileSidebarOpen(true)}
            unreadMessagesCount={unreadInstallerMessages}
            newLeadsCount={newLeadsCount}
        />
      ) : (
        (currentPage === 'home' || currentPage === 'blog' || currentPage === 'blogPost') &&
        <>
          <GuestBottomNavBar 
              onQuoteClick={handleScrollToQuote}
              onRebateClick={handleScrollToRebate}
              onLoginClick={() => setIsHomeownerSignInOpen(true)}
          />
          <FloatingChat />
        </>
      )}
    </>
  );
};

export default App;