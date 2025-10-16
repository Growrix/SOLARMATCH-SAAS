'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LeadStatus as LeadStatusEnum } from '@prisma/client';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import HomeownerBottomNavBar from '@/components/HomeownerBottomNavBar';
import HomeownerMobileSidebarMenu from '@/components/HomeownerMobileSidebarMenu';
import NewQuoteRequestModal from '@/components/NewQuoteRequestModal';
import MessagingModal from '@/components/MessagingModal';
import ProfileManagement from '@/components/ProfileManagement';
import VerifiedBadge from '@/components/VerifiedBadge';
import RequestMoreQuotesCTA from '@/components/homeowner/RequestMoreQuotesCTA';
import ContactVerificationModal from '@/components/homeowner/ContactVerificationModal';
import OTPVerificationModal from '@/components/OTPVerificationModal';

// --- Icon Components ---
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${className || ''}`}><path d="m6 9 6 6 6-6"/></svg>;
const PhoneCallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const FileSignatureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 18h.01"/><path d="M16 12.5a2.5 2.5 0 0 0-5 0"/><path d="m15 18-2-2-2 2"/></svg>;
const GavelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m14 12-8.5 8.5"/><path d="m18 16 1-1"/><path d="m17 11 4.3 4.3c.6.6.6 1.5 0 2.1l-2.1 2.1c-.6.6-1.5.6-2.1 0L12.8 16"/><path d="m3 3 8.5 8.5"/><path d="m13 7 4-4"/><path d="m14 11-4 4"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3L9.5 9.5L3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const HomeIconNav = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>;

// ThemeSwitcher Component
const ThemeSwitcher: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
  const options: { name: Theme; label: string; icon: React.ReactNode }[] = [
    { name: 'light', label: 'Light', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { name: 'dark', label: 'Dark', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> },
    { name: 'system', label: 'System', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  ];
  return (
    <div className="flex items-center p-1 rounded-full bg-gray-100 dark:bg-slate-800">
      {options.map((opt) => (
        <button key={opt.name} onClick={() => setTheme(opt.name)} className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-800 focus:ring-primary ${ theme === opt.name ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'}`} aria-label={`Switch to ${opt.name} theme`} title={`Switch to ${opt.name} theme`}>{opt.icon}</button>
      ))}
    </div>
  );
};

// NavItem Component
const NavItem: React.FC<{ icon: React.ReactNode; title: string; isActive: boolean; onClick: () => void; badgeCount?: number; }> = ({ icon, title, isActive, onClick, badgeCount }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${ isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'}`}>
        <div className="flex items-center space-x-3">
            {icon}
            <span>{title}</span>
        </div>
        {badgeCount && badgeCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {badgeCount}
            </span>
        )}
    </button>
);

type QuoteTypeOption = 'CALL_VISIT' | 'WRITTEN_QUOTE';

type LeadStatus = (typeof LeadStatusEnum)[keyof typeof LeadStatusEnum];

interface RecentLeadSummary {
  id: string;
  quoteType: QuoteTypeOption;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  leadPrice: number | null;
  purchaseStatus: string | null;
  purchasedAt: string | null;
  visibility: string;
}

interface HomeownerDashboardSummary {
  totalSubmitted: number;
  quoteLimit: number;
  remainingLeadAllowance: number;
  phoneVerified: boolean;
  requiresVerification: boolean;
  verificationThreshold: number;
  lastSubmissionAt: string | null;
  statusBreakdown: Record<LeadStatus, number>;
  recentLeads: RecentLeadSummary[];
}

interface PendingOTPState {
  phoneNumber: string;
  verificationId: string;
  expiresAt: Date;
  remainingAttempts: number;
}

const QUOTE_TYPE_LABELS: Record<QuoteTypeOption, string> = {
  CALL_VISIT: 'Call or Site Visit',
  WRITTEN_QUOTE: 'Written Quote',
};

const STATUS_LABELS: Record<LeadStatus, { label: string; description: string; accent: string }> = {
  [LeadStatusEnum.DRAFT]: {
    label: 'Draft',
    description: 'Awaiting submission',
    accent: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  [LeadStatusEnum.PENDING_PHONE]: {
    label: 'Needs Verification',
    description: 'Verify your phone to continue',
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  [LeadStatusEnum.PENDING_APPROVAL]: {
    label: 'Awaiting Review',
    description: 'Admin is reviewing your lead',
    accent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  },
  [LeadStatusEnum.APPROVED]: {
    label: 'Approved',
    description: 'Visible to installers',
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  [LeadStatusEnum.PURCHASED]: {
    label: 'Purchased',
    description: 'An installer has claimed this lead',
    accent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  [LeadStatusEnum.QUOTED]: {
    label: 'Quotes Received',
    description: 'Installers have responded',
    accent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  },
  [LeadStatusEnum.ACCEPTED]: {
    label: 'Accepted',
    description: 'You selected a winning quote',
    accent: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  },
  [LeadStatusEnum.REJECTED]: {
    label: 'Rejected',
    description: 'Marked as not suitable',
    accent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  },
  [LeadStatusEnum.EXPIRED]: {
    label: 'Expired',
    description: 'No activity for 30 days',
    accent: 'bg-slate-200 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400',
  },
  [LeadStatusEnum.CANCELLED]: {
    label: 'Cancelled',
    description: 'Removed by homeowner',
    accent: 'bg-slate-200 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400',
  },
  [LeadStatusEnum.FLAGGED]: {
    label: 'Flagged',
    description: 'Pending admin review',
    accent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
};

const formatCurrency = (value: number | null | undefined): string => {
  if (typeof value !== 'number') return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return `$${value.toFixed(0)}`;
  }
};

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeTime = (value: string | null | undefined): string => {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(Math.round(diffMinutes), 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, 'day');
  }

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month');
  }

  const diffYears = Math.round(diffMonths / 12);
  return rtf.format(diffYears, 'year');
};

// Sidebar Component
interface HomeownerSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  onMessagesClick: () => void;
}

const HomeownerSidebar: React.FC<HomeownerSidebarProps> = ({ activePage, setActivePage, onLogoutClick, onHomeClick, onMessagesClick }) => {
  const [quotesOpen, setQuotesOpen] = useState(true);
  return (
    <aside className="dashboard-sidebar w-64 flex-shrink-0 border-r border-gray-200 dark:border-slate-800 flex flex-col p-4 h-full">
      <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200 dark:border-slate-800 mb-4">
          <button onClick={onHomeClick} className="flex items-center space-x-3">
              <SunIcon />
              <span className="text-2xl font-bold text-primary">SolarMatch</span>
          </button>
      </div>
      <nav className="flex-grow space-y-1">
        <NavItem icon={<LayoutDashboardIcon />} title="Dashboard Overview" isActive={activePage === 'Dashboard Overview'} onClick={() => setActivePage('Dashboard Overview')} />
        <div>
          <button onClick={() => setQuotesOpen(!quotesOpen)} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 text-sm font-medium">
            <div className="flex items-center space-x-3"><FileTextIcon /><span>My Quote Requests</span></div>
            <ChevronDownIcon className={`transition-transform duration-200 ${quotesOpen ? 'rotate-180' : ''}`} />
          </button>
          {quotesOpen && (
            <div className="pl-7 mt-1 space-y-1">
              <NavItem icon={<PhoneCallIcon />} title="Call/Visit Quotes" isActive={activePage === 'Call/Visit Quotes'} onClick={() => setActivePage('Call/Visit Quotes')} />
              <NavItem icon={<FileSignatureIcon />} title="Written Quotes" isActive={activePage === 'Written Quotes'} onClick={() => setActivePage('Written Quotes')} />
            </div>
          )}
        </div>
        <NavItem icon={<GavelIcon />} title="Bidding Room" isActive={activePage === 'Bidding Room'} onClick={() => setActivePage('Bidding Room')} />
        <NavItem icon={<SparklesIcon />} title="AI Insights" isActive={activePage === 'AI Insights'} onClick={() => setActivePage('AI Insights')} />
        <NavItem icon={<MessageSquareIcon />} title="Messages" isActive={false} onClick={onMessagesClick} badgeCount={3} />
        <NavItem icon={<UserIcon />} title="My Profile" isActive={activePage === 'My Profile'} onClick={() => setActivePage('My Profile')} />
      </nav>
      <div className="mt-auto"><button onClick={onLogoutClick} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800"><LogOutIcon /><span>Logout</span></button></div>
    </aside>
  );
};

// DashboardHeader Component
interface DashboardHeaderProps {
  pageTitle: string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface DashboardHeaderProps {
  pageTitle: string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onNewQuoteClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle, theme, setTheme, onNewQuoteClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <header className="glass-header h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className={`flex items-center justify-end transition-all duration-300 ${isSearchOpen ? 'bg-gray-100 dark:bg-slate-800 rounded-lg' : ''}`}>
          <input type="text" placeholder="Search..." className={`bg-transparent focus:outline-none transition-all duration-300 ease-in-out text-sm ${ isSearchOpen ? 'w-32 sm:w-40 py-2 pl-3 pr-2' : 'w-0 p-0' }`}/>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400" aria-label="Toggle search"><SearchIcon /></button>
        </div>
        <button onClick={onNewQuoteClick} className="hidden sm:block bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">Request New Quote</button>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hidden sm:block"><HelpCircleIcon /></button>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"><BellIcon /><span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black/50"></span></button>
        <button><Image src="https://picsum.photos/seed/user/40/40" alt="User Avatar" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" /></button>
      </div>
    </header>
  );
};

// PlaceholderContent Component
const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">{title}</h2>
        <p className="text-slate-500 mt-2">This feature is under construction. Check back soon!</p>
      </div>
    </div>
);

// Dashboard Overview Content
const DashboardOverviewContent: React.FC = () => {
  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; change: string; actionText: string; }> = ({ icon, title, value, change, actionText }) => (
    <div className="theme-card p-3 flex flex-col">
        <div className="flex justify-between items-start"><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p><div className="p-2 bg-primary/10 rounded-lg">{icon}</div></div>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{change}</p>
        <div className="flex-grow" />
        <button onClick={() => {}} className="text-sm font-semibold text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors mt-4 text-left">{actionText} &rarr;</button>
    </div>
  );

  return (
    <div className="animate-fade-in">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">Good Morning, Homeowner!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={<FileTextIcon />} title="Active Requests" value="3" change="+1 this week" actionText="View Requests" />
            <StatCard icon={<GavelIcon />} title="New Bids" value="2" change="+2 this week" actionText="Go to Bidding Room" />
            <StatCard icon={<MessageSquareIcon />} title="Unread Messages" value="5" change="from 3 installers" actionText="Open Inbox" />
            <StatCard icon={<DollarSignIcon />} title="Est. Annual Savings" value="$1,850" change="Based on 6.6kW system" actionText="View Breakdown" />
        </div>
        <div className="mt-4 sm:mt-6 theme-card p-4 sm:p-6"><h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3><div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">No recent activity to display.</p></div></div>
    </div>
  );
};

// Main Dashboard Component
export default function HomeownerDashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, update: updateSession } = useSession();
  const [activePage, setActivePage] = useState('Dashboard Overview');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal states
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [isContactVerificationOpen, setIsContactVerificationOpen] = useState(false);
  const [pendingOTP, setPendingOTP] = useState<PendingOTPState | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const [dashboardSummary, setDashboardSummary] = useState<HomeownerDashboardSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // User profile state
  const [userProfile, setUserProfile] = useState({
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+61 412 345 678',
    address: '123 Solar Street, Sydney NSW 2000',
    avatar: 'https://picsum.photos/seed/homeowner-avatar/200'
  });

  const handleProfileUpdate = (updatedProfile: typeof userProfile) => {
    setUserProfile(updatedProfile);
    // Here you would typically save to backend
    console.log('Profile updated:', updatedProfile);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
      // Typically: call API, then redirect to home
      router.push('/');
    }
  };

  // Fetch dashboard summary
  const fetchDashboardSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch('/api/homeowner/dashboard', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-store',
        },
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to load dashboard summary');
      }

      const summary = (await response.json()) as HomeownerDashboardSummary;
      setDashboardSummary(summary);
    } catch (error) {
      console.error('[HomeownerDashboard] Failed to load summary:', error);
      setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Scroll logic for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setIsHeaderVisible(true);
      } else if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsHeaderVisible(currentScrollY < lastScrollY);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    // Clear authentication state using NextAuth
    await signOut({ redirect: false });
    // Redirect to guest homepage
    router.push('/');
  };

  const handleHomeClick = () => {
    router.push('/'); // Navigate to guest homepage
  };

  const handleNewQuoteClick = () => {
    if (!dashboardSummary) {
      return;
    }

    if (dashboardSummary.requiresVerification) {
      setIsContactVerificationOpen(true);
      return;
    }

    setIsNewQuoteModalOpen(true);
  };

  const handleMessagesClick = () => {
    setIsMessagingModalOpen(true);
  };

  const handleOTPRequested = (payload: PendingOTPState) => {
    setPendingOTP(payload);
    setIsContactVerificationOpen(false);
    setShowOTPModal(true);
  };

  const handleOTPVerificationSuccess = async () => {
    setShowOTPModal(false);
    setPendingOTP(null);
    
    // Refresh session to get updated phoneVerified status
    await updateSession();
    
    // Refresh dashboard summary
    await fetchDashboardSummary();
    
    // Show success message or open quote modal
    setIsNewQuoteModalOpen(true);
  };

  const handleResendOTP = async (): Promise<{
    success: boolean;
    verificationId?: string;
    expiresAt?: Date;
    error?: string;
    retryAfter?: number;
  }> => {
    if (!pendingOTP) {
      return {
        success: false,
        error: 'No pending verification',
      };
    }

    try {
      const response = await fetch('/api/verification/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: pendingOTP.phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          return {
            success: false,
            error: data.error,
            retryAfter: data.retryAfter,
          };
        }
        return {
          success: false,
          error: data.error || 'Failed to resend code',
        };
      }

      return {
        success: true,
        verificationId: data.verificationId,
        expiresAt: new Date(data.expiresAt),
      };
    } catch (error) {
      console.error('[Resend OTP] Error:', error);
      return {
        success: false,
        error: 'Failed to resend code. Please try again.',
      };
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard Overview':
        return <DashboardOverviewContent />;
      case 'Call/Visit Quotes':
        return <PlaceholderContent title="Call/Visit Quotes" />;
      case 'Written Quotes':
        return <PlaceholderContent title="Written Quotes" />;
      case 'Bidding Room':
        return <PlaceholderContent title="Bidding Room" />;
      case 'AI Insights':
        return <PlaceholderContent title="AI Insights" />;
      case 'Messages':
        return <PlaceholderContent title="Messages" />;
      case 'My Profile':
        return <ProfileManagement onDeleteClick={handleDeleteAccount} />;
      default:
        return <DashboardOverviewContent />;
    }
  };

  return (
    <div className="homeowner-dashboard-bg min-h-screen text-slate-800 dark:text-slate-200 animate-fade-in">
      <div className="md:pl-64">
        <div className="flex flex-col min-h-screen">
          <div className={`sticky top-0 z-20 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <DashboardHeader 
              pageTitle={activePage} 
              theme={theme} 
              setTheme={setTheme}
              onNewQuoteClick={handleNewQuoteClick}
            />
          </div>
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 sm:pb-8">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex">
          <HomeownerSidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onLogoutClick={handleLogout} 
            onHomeClick={handleHomeClick}
            onMessagesClick={handleMessagesClick}
          />
      </div>

      {/* Mobile Navigation */}
      <HomeownerBottomNavBar 
        activePage={activePage}
        setActivePage={setActivePage}
        onNewQuoteClick={handleNewQuoteClick}
        currentPage="dashboard"
        onHomeClick={handleHomeClick}
        onDashboardClick={() => {}}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onMessagesClick={handleMessagesClick}
        unreadMessagesCount={3}
      />
      <HomeownerMobileSidebarMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogoutClick={handleLogout}
        onMessagesClick={handleMessagesClick}
      />

      {/* Modals */}
      <NewQuoteRequestModal
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onQuoteCalculated={(data) => {
          console.log('Quote calculated:', data);
          // Handle quote data - could store in state or navigate to quote details
        }}
        onProceedToDetailedQuote={() => {
          setIsNewQuoteModalOpen(false);
          // Navigate to detailed quote page or show detailed quote form
          setActivePage('Quote Requests');
        }}
      />

      <MessagingModal
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
      />
    </div>
  );
}
