'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import TopBar from './TopBar';
import HeaderMenu from './HeaderMenu';
import InstallerEligibilityModal from './InstallerEligibilityModal';
import InstallerSignInModal from './InstallerSignInModal';
import InstallerSignupModal from './InstallerSignupModal';
import HomeownerSignupModal from './HomeownerSignupModal';
import HomeownerSignInModal from './HomeownerSignInModal';
import GuestBottomNavBar from './GuestBottomNavBar';
import HomeownerBottomNavBar from './HomeownerBottomNavBar';
import HomeownerMobileSidebarMenu from './HomeownerMobileSidebarMenu';
import NewQuoteRequestModal from './NewQuoteRequestModal';
import MessagingModal from './MessagingModal';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if we're on installer or homeowner routes (dashboard pages have their own headers)
  const isInstallerRoute = pathname?.startsWith('/installer');
  const isHomeownerRoute = pathname?.startsWith('/homeowner');
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname === '/homeowner/dashboard' || pathname === '/installer/dashboard' || pathname === '/admin/dashboard';
  
  // Installer modal states
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [isInstallerSignInModalOpen, setIsInstallerSignInModalOpen] = useState(false);
  const [isInstallerSignupModalOpen, setIsInstallerSignupModalOpen] = useState(false);
  
  // Homeowner modal states
  const [isHomeownerSignupModalOpen, setIsHomeownerSignupModalOpen] = useState(false);
  const [isHomeownerSignInModalOpen, setIsHomeownerSignInModalOpen] = useState(false);
  
  // Homeowner navbar states
  const [activeDashboardPage, setActiveDashboardPage] = useState('Dashboard Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);

  // Check login status from Clerk
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    
    // Check if there's an action query parameter (e.g., ?action=signin)
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'signin' && !isSignedIn) {
      setIsHomeownerSignInModalOpen(true);
    }
  }, [isSignedIn, user, isLoaded]);

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

  // Installer handlers - Show eligibility modal first, then redirect to Clerk signup
  const handleBecomePartner = () => {
    setIsEligibilityModalOpen(true);
  };

  const handlePartnerSignIn = () => {
    setIsInstallerSignInModalOpen(true);
  };

  const handleEligible = () => {
    setIsEligibilityModalOpen(false);
    setIsInstallerSignupModalOpen(true);
  };

  const handleInstallerSignupSuccess = async () => {
    setIsInstallerSignupModalOpen(false);
    console.log('Installer signed up successfully');
    
    // Get role from Clerk user metadata
    try {
      const role = user?.unsafeMetadata?.role;
      
      console.log('User role from Clerk after signup:', role);
      
      // Redirect based on actual role (should be INSTALLER)
      if (role === 'INSTALLER') {
        router.push('/installer/dashboard');
      } else if (role === 'HOMEOWNER') {
        router.push('/homeowner/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        // Fallback
        router.push('/installer/dashboard');
      }
    } catch (error) {
      console.error('Error getting role after signup:', error);
      // Fallback to installer dashboard
      router.push('/installer/dashboard');
    }
  };

  const handleInstallerSignInSuccess = async () => {
    setIsInstallerSignInModalOpen(false);
    console.log('Installer signed in successfully');
    
    // Get role from Clerk user metadata
    try {
      const role = user?.unsafeMetadata?.role;
      
      console.log('User role from Clerk:', role);
      
      // Redirect based on actual role
      if (role === 'INSTALLER') {
        router.push('/installer/dashboard');
      } else if (role === 'HOMEOWNER') {
        router.push('/homeowner/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        // Fallback
        router.push('/installer/dashboard');
      }
    } catch (error) {
      console.error('Error getting role:', error);
      // Fallback to installer dashboard
      router.push('/installer/dashboard');
    }
  };

  const handleSwitchToInstallerSignIn = () => {
    setIsInstallerSignupModalOpen(false);
    setIsInstallerSignInModalOpen(true);
  };

  // Homeowner handlers - Now use Clerk routing
  const handleLoginClick = () => {
    setIsHomeownerSignInModalOpen(true);
  };

  const handleSignupClick = () => {
    setIsHomeownerSignupModalOpen(true);
  };

  const handleHomeownerSignupSuccess = async () => {
    setIsHomeownerSignupModalOpen(false);
    console.log('Homeowner signed up successfully');
    
    // Get role from Clerk user metadata
    try {
      const role = user?.unsafeMetadata?.role;
      
      console.log('User role from Clerk after signup:', role);
      
      // Redirect based on actual role (should be HOMEOWNER)
      if (role === 'HOMEOWNER') {
        router.push('/homeowner/dashboard');
      } else if (role === 'INSTALLER') {
        router.push('/installer/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        // Fallback
        router.push('/homeowner/dashboard');
      }
    } catch (error) {
      console.error('Error getting role after signup:', error);
      // Fallback to homeowner dashboard
      router.push('/homeowner/dashboard');
    }
  };

  const handleHomeownerSignInSuccess = async () => {
    setIsHomeownerSignInModalOpen(false);
    console.log('Homeowner signed in successfully');
    
    // Check if we should return to the previous page or go to dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'signin') {
      // Remove the action query parameter and stay on the same page
      window.history.replaceState({}, '', window.location.pathname);
      window.location.reload();
    } else {
      // Get role from Clerk user metadata
      try {
        const role = user?.unsafeMetadata?.role;
        
        console.log('User role from Clerk:', role);
        
        // Redirect based on actual role
        if (role === 'INSTALLER') {
          router.push('/installer/dashboard');
        } else if (role === 'HOMEOWNER') {
          router.push('/homeowner/dashboard');
        } else if (role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          // Fallback to homeowner
          router.push('/homeowner/dashboard');
        }
      } catch (error) {
        console.error('Error getting role:', error);
        // Fallback to homeowner dashboard
        router.push('/homeowner/dashboard');
      }
    }
  };

  const handleSwitchToSignup = () => {
    setIsHomeownerSignInModalOpen(false);
    setIsHomeownerSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsHomeownerSignupModalOpen(false);
    setIsHomeownerSignInModalOpen(true);
  };

  // Guest bottom navbar handlers
  const handleGuestHome = () => {
    if (pathname === '/') {
      // Already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to homepage
      router.push('/');
    }
  };

  const handleGuestArticles = () => {
    if (pathname?.startsWith('/blog')) {
      // Already on blog pages, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to blog
      router.push('/blog');
    }
  };

  const handleScrollToRebate = () => {
    if (pathname === '/') {
      // On homepage, scroll to calculator section
      const calculatorSection = document.getElementById('calculator-section');
      if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage calculator section
      router.push('/#calculator-section');
    }
  };

  const handleGuestLogin = () => {
    setIsHomeownerSignInModalOpen(true);
  };

  // Homeowner bottom navbar handlers
  const handleHomeownerHomeClick = () => {
    router.push('/');
  };

  const handleHomeownerDashboardClick = () => {
    router.push('/homeowner/dashboard');
  };

  // Smart dashboard handler that routes based on role
  const handleDashboardClick = () => {
    const role = user?.publicMetadata?.role as string;
    
    if (role === 'INSTALLER') {
      router.push('/installer/dashboard');
    } else if (role === 'HOMEOWNER') {
      router.push('/homeowner/dashboard');
    } else if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      // If role not loaded yet, check current path or default to homeowner
      if (pathname?.startsWith('/installer')) {
        router.push('/installer/dashboard');
      } else if (pathname?.startsWith('/admin')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/homeowner/dashboard'); // Default
      }
    }
  };

  const handleNewQuoteClick = () => {
    setIsNewQuoteModalOpen(true);
  };

  const handleMessagesClick = () => {
    setIsMessagingModalOpen(true);
  };

  const handleMobileSidebarOpen = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Check if we're on a guest page (home and all blog pages)
  const isGuestPage = pathname === '/' || pathname?.startsWith('/blog');
  
  // Get user role from Clerk
  const userRole = user?.publicMetadata?.role as string;

  return (
    <>
      {/* Only show main site header/topbar on non-installer, non-homeowner, and non-admin routes */}
      {!isInstallerRoute && !isHomeownerRoute && !isAdminRoute && (
        <div className={`sticky top-0 z-30 transition-transform duration-300 ease-in-out ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          {!isSignedIn && (
            <TopBar 
              onBecomePartnerClick={handleBecomePartner}
              onPartnerSignInClick={handlePartnerSignIn}
            />
          )}
          <HeaderMenu 
            isLoggedIn={isSignedIn}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onLogoutClick={handleLogout}
            onDashboardClick={handleDashboardClick}
            onHomeownerDashboardClick={handleHomeownerDashboardClick}
            onInstallerDashboardClick={() => router.push('/installer/dashboard')}
            onInstallerHomeClick={() => router.push('/installer')}
            onAdminDashboardClick={() => router.push('/admin/dashboard')}
          />
        </div>
      )}

      {children}

      {/* Installer Modals */}
      <InstallerEligibilityModal 
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        onEligible={handleEligible}
      />
      <InstallerSignInModal 
        isOpen={isInstallerSignInModalOpen}
        onClose={() => setIsInstallerSignInModalOpen(false)}
        onSuccess={() => {}} // Clerk handles redirect via afterSignInUrl
        onOpenSignup={() => {
          setIsInstallerSignInModalOpen(false);
          setIsInstallerSignupModalOpen(true);
        }}
      />
      <InstallerSignupModal 
        isOpen={isInstallerSignupModalOpen}
        onClose={() => setIsInstallerSignupModalOpen(false)}
        onSuccess={() => {}} // Clerk handles redirect via afterSignUpUrl
        onSwitchToSignIn={handleSwitchToInstallerSignIn}
      />

      {/* Homeowner Modals */}
      <HomeownerSignupModal 
        isOpen={isHomeownerSignupModalOpen}
        onClose={() => setIsHomeownerSignupModalOpen(false)}
        onSuccess={() => {}} // Clerk handles redirect via afterSignUpUrl
        onSwitchToSignIn={handleSwitchToLogin}
      />
      <HomeownerSignInModal 
        isOpen={isHomeownerSignInModalOpen}
        onClose={() => setIsHomeownerSignInModalOpen(false)}
        onSuccess={() => {}} // Clerk handles redirect via afterSignInUrl
        onSwitchToSignUp={handleSwitchToSignup}
      />

      {/* Homeowner Dashboard Modals (Global) */}
      <NewQuoteRequestModal 
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onQuoteCalculated={() => {}}
        onProceedToDetailedQuote={() => {}}
      />
      
      <MessagingModal 
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
      />

      {/* Conditional Bottom Navigation - Role-Based Rendering */}
      {isSignedIn && !isDashboardRoute && !isInstallerRoute && !isHomeownerRoute && !isAdminRoute && userRole === 'HOMEOWNER' ? (
        // Logged-in HOMEOWNER on main pages (/, /blog, etc.) - NOT on /homeowner routes
        <>
          <HomeownerBottomNavBar 
            activePage={activeDashboardPage}
            setActivePage={setActiveDashboardPage}
            onNewQuoteClick={handleNewQuoteClick}
            currentPage="home"
            onHomeClick={handleHomeownerHomeClick}
            onDashboardClick={handleHomeownerDashboardClick}
            onMenuClick={handleMobileSidebarOpen}
            onMessagesClick={handleMessagesClick}
            unreadMessagesCount={3}
            onLogoutClick={handleLogout}
          />
          <HomeownerMobileSidebarMenu
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            activePage={activeDashboardPage}
            setActivePage={setActiveDashboardPage}
            onLogoutClick={handleLogout}
          />
        </>
      ) : !isSignedIn && isGuestPage ? (
        // Guest (not logged in) on main pages
        <GuestBottomNavBar 
          onHomeClick={handleGuestHome}
          onArticlesClick={handleGuestArticles}
          onRebateClick={handleScrollToRebate}
          onLoginClick={handleGuestLogin}
          onSignupClick={handleSignupClick}
        />
      ) : null}
    </>
  );
}
