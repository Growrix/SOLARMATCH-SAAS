'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import TopBar from './TopBar';
import HeaderMenu from './HeaderMenu';
import InstallerEligibilityModal from './InstallerEligibilityModal';
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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Check if we're on installer or homeowner routes (dashboard pages have their own headers)
  const isInstallerRoute = pathname?.startsWith('/installer');
  const isHomeownerRoute = pathname?.startsWith('/homeowner');
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname === '/homeowner/dashboard' || pathname === '/installer/dashboard' || pathname === '/admin/dashboard';
  
  // Installer modal states
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  
  // Homeowner navbar states
  const [activeDashboardPage, setActiveDashboardPage] = useState('Dashboard Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);

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
    router.push('/sign-in');
  };

  const handleEligible = () => {
    setIsEligibilityModalOpen(false);
    // Redirect to Clerk signup with installer role indication
    router.push('/sign-up?role=installer');
  };

  // Homeowner handlers - Now use Clerk routing
  const handleLoginClick = () => {
    router.push('/sign-in');
  };

  const handleSignupClick = () => {
    router.push('/sign-up');
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
    router.push('/sign-in');
  };

  // Homeowner navbar handlers
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

  const handleLogout = () => {
    // Clerk handles logout via UserButton, but if needed:
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
