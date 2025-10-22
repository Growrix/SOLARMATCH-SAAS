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
import SimplifiedQuoteFormModal from '@/components/homeowner/SimplifiedQuoteFormModal';
import QuoteOptionsModal from '@/components/QuoteOptionsModal';
import MessagingModal from '@/components/MessagingModal';
import ProfileManagement from '@/components/ProfileManagement';
import VerifiedBadge from '@/components/VerifiedBadge';
import RequestMoreQuotesCTA from '@/components/homeowner/RequestMoreQuotesCTA';
import ContactVerificationModal from '@/components/homeowner/ContactVerificationModal';
import OTPVerificationModal from '@/components/OTPVerificationModal';
import FirstQuoteSuccessModal from '@/components/homeowner/FirstQuoteSuccessModal';
import LeadEditModal from '@/components/homeowner/LeadEditModal';
import LeadPreviewModal from '@/components/homeowner/LeadPreviewModal';

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
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const HomeIconNav = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

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
  quoteData: Record<string, unknown> | null;
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
  biddingLeadsSubmitted: number; // T263: BIDDING quota usage count (0 or 1)
  biddingQuotaRemaining: number; // T263: BIDDING quota remaining (0 or 1)
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
interface DashboardOverviewContentProps {
  summary: HomeownerDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  onRequestMoreQuotes: () => void;
  onVerifyContact: () => void;
  onEditLead: (lead: RecentLeadSummary) => void;
  onPreviewLead: (lead: RecentLeadSummary) => void;
  onCancelLead: (lead: RecentLeadSummary) => void;
}

const DashboardOverviewContent: React.FC<DashboardOverviewContentProps> = ({
  summary,
  isLoading,
  error,
  onRequestMoreQuotes,
  onVerifyContact,
  onEditLead,
  onPreviewLead,
  onCancelLead,
}) => {
  const StatCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    change: string; 
    actionText: string; 
    onClick?: () => void;
  }> = ({ icon, title, value, change, actionText, onClick }) => (
    <div className="theme-card p-3 flex flex-col">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{change}</p>
      <div className="flex-grow" />
      <button 
        onClick={onClick}
        className="text-sm font-semibold text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors mt-4 text-left"
      >
        {actionText} &rarr;
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="theme-card p-3">
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="theme-card p-6 text-center">
          <div className="text-red-500 dark:text-red-400 mb-2">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Failed to load dashboard</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="animate-fade-in">
        <div className="theme-card p-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const activeLeads = summary.statusBreakdown[LeadStatusEnum.APPROVED] + 
                    summary.statusBreakdown[LeadStatusEnum.PURCHASED] + 
                    summary.statusBreakdown[LeadStatusEnum.QUOTED];

  const pendingLeads = summary.statusBreakdown[LeadStatusEnum.PENDING_APPROVAL] + 
                      summary.statusBreakdown[LeadStatusEnum.PENDING_PHONE];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <VerifiedBadge 
              verified={summary.phoneVerified} 
              variant="inline" 
              size="sm" 
            />
            {summary.requiresVerification && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Verification required for more quotes
              </span>
            )}
          </div>
        </div>
      </div>

      <RequestMoreQuotesCTA
        remaining={summary.remainingLeadAllowance}
        quoteLimit={summary.quoteLimit}
        totalSubmitted={summary.totalSubmitted}
        requiresVerification={summary.requiresVerification}
        onRequest={onRequestMoreQuotes}
        onVerifyContact={onVerifyContact}
        className="mb-6"
      />

      {/* Phase 4.11: Bidding Quota Indicator */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <TrophyIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Competitive Bidding Quota
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                One-time bidding request per homeowner
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {summary.biddingQuotaRemaining ?? 0} / 1
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-300">
              {(summary.biddingQuotaRemaining ?? 0) === 1 ? 'Available' : 'Used'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          icon={<FileTextIcon />} 
          title="Quote Requests" 
          value={summary.totalSubmitted.toString()} 
          change={`${summary.remainingLeadAllowance} remaining`}
          actionText="View All Requests" 
          onClick={() => {/* Navigate to requests */}}
        />
        <StatCard 
          icon={<GavelIcon />} 
          title="Active Leads" 
          value={activeLeads.toString()} 
          change={pendingLeads > 0 ? `${pendingLeads} pending review` : 'All approved'}
          actionText="Go to Bidding Room" 
          onClick={() => {/* Navigate to bidding */}}
        />
        <StatCard 
          icon={<MessageSquareIcon />} 
          title="Messages" 
          value="0" 
          change="No new messages"
          actionText="Open Inbox" 
          onClick={() => {/* Open messages */}}
        />
        <StatCard 
          icon={<SparklesIcon />} 
          title="Last Activity" 
          value={summary.lastSubmissionAt ? formatRelativeTime(summary.lastSubmissionAt) : 'Never'} 
          change="Quote submission"
          actionText="View Timeline" 
          onClick={() => {/* View activity */}}
        />
      </div>

      <div className="theme-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Quote Requests</h3>
        {summary.recentLeads.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400">No quote requests yet.</p>
            <button 
              onClick={onRequestMoreQuotes}
              className="mt-2 text-primary hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
            >
              Create your first request &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {summary.recentLeads.map((lead) => {
              const statusInfo = STATUS_LABELS[lead.status as LeadStatus];
              const canEdit = lead.status === LeadStatusEnum.PENDING_APPROVAL;
              const canCancel = lead.status !== LeadStatusEnum.PURCHASED;
              const canPreview = [LeadStatusEnum.APPROVED as string, LeadStatusEnum.PURCHASED as string, LeadStatusEnum.QUOTED as string, LeadStatusEnum.ACCEPTED as string].includes(lead.status);
              
              return (
                <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {QUOTE_TYPE_LABELS[lead.quoteType]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.accent}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Created {formatDateTime(lead.createdAt)} • {formatCurrency(lead.leadPrice)}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {canEdit && (
                      <button
                        onClick={() => onEditLead(lead)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                        title="Edit lead"
                      >
                        <EditIcon /> Edit
                      </button>
                    )}
                    
                    {canPreview && (
                      <button
                        onClick={() => onPreviewLead(lead)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                        title="View details"
                      >
                        <EyeIcon /> View
                      </button>
                    )}
                    
                    {canCancel && (
                      <button
                        onClick={() => onCancelLead(lead)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                        title="Cancel lead"
                      >
                        <XCircleIcon /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
  const [isSimplifiedQuoteModalOpen, setIsSimplifiedQuoteModalOpen] = useState(false);
  const [isQuoteOptionsModalOpen, setIsQuoteOptionsModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [showContactVerificationModal, setShowContactVerificationModal] = useState(false);
  const [pendingOTP, setPendingOTP] = useState<PendingOTPState | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [pendingQuoteData, setPendingQuoteData] = useState<any>(null);
  const [selectedQuoteType, setSelectedQuoteType] = useState<'CALL_VISIT' | 'WRITTEN_QUOTE' | null>(null);
  const [showFirstQuoteSuccessModal, setShowFirstQuoteSuccessModal] = useState(false);
  const [firstQuoteSuccessData, setFirstQuoteSuccessData] = useState<{
    quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE';
    remainingQuotes: number;
    totalQuoteLimit: number;
  } | null>(null);

  const [dashboardSummary, setDashboardSummary] = useState<HomeownerDashboardSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [quoteFormInitialData, setQuoteFormInitialData] = useState<Record<string, unknown> | null>(null);

  // Phase 4.11: Lead CRUD modal states
  const [editLeadModalOpen, setEditLeadModalOpen] = useState(false);
  const [previewLeadModalOpen, setPreviewLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<RecentLeadSummary | null>(null);

  // Aliases for component compatibility
  const isLoading = isLoadingSummary;
  const error = summaryError;

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
  const fetchDashboardSummary = useCallback(async (): Promise<HomeownerDashboardSummary | null> => {
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
      return summary;
    } catch (error) {
      console.error('[HomeownerDashboard] Failed to load summary:', error);
      setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
      return null;
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  const getLatestQuoteData = useCallback(
    (summary: HomeownerDashboardSummary | null): Record<string, unknown> | null =>
      summary?.recentLeads?.[0]?.quoteData ?? null,
    [],
  );

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Debug: Log modal states
  useEffect(() => {
    console.log('[Modal States]', {
      isNewQuoteModalOpen,
      isSimplifiedQuoteModalOpen,
      isQuoteOptionsModalOpen,
    });
  }, [isNewQuoteModalOpen, isSimplifiedQuoteModalOpen, isQuoteOptionsModalOpen]);

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

    setQuoteFormInitialData(getLatestQuoteData(dashboardSummary));

    if (dashboardSummary.requiresVerification) {
      setShowContactVerificationModal(true);
      return;
    }

    // Check if this is the first quote (0 submissions) or subsequent quotes
    if (dashboardSummary.totalSubmitted === 0) {
      // First quote: Show InstantQuoteForm (multi-step modal)
      setIsNewQuoteModalOpen(true);
    } else {
      // Subsequent quotes: Show SimplifiedQuoteForm (single-page pre-filled form)
      setIsSimplifiedQuoteModalOpen(true);
    }
  };

  const handleMessagesClick = () => {
    setIsMessagingModalOpen(true);
  };

  const handleOTPRequested = (payload: PendingOTPState) => {
    setPendingOTP(payload);
    setShowContactVerificationModal(false);
    setShowOTPModal(true);
  };

  const handleOTPVerificationSuccess = async () => {
    setShowOTPModal(false);
    setPendingOTP(null);
    
    // Update session to reflect phone verification success
    await updateSession({
      phoneVerified: true,
    });
    
    // Refresh dashboard summary
    const updatedSummary = await fetchDashboardSummary();
    setQuoteFormInitialData(getLatestQuoteData(updatedSummary ?? dashboardSummary));
    
    // Check if this is the first quote or subsequent quotes
    if ((updatedSummary ?? dashboardSummary)?.totalSubmitted === 0) {
      setIsNewQuoteModalOpen(true);
    } else {
      setIsSimplifiedQuoteModalOpen(true);
    }
  };

  const handleRequestMoreQuotes = () => {
    console.log('[handleRequestMoreQuotes] Dashboard Summary:', dashboardSummary);
    console.log('[handleRequestMoreQuotes] totalSubmitted:', dashboardSummary?.totalSubmitted);
    console.log('[handleRequestMoreQuotes] Condition check (totalSubmitted === 0):', dashboardSummary?.totalSubmitted === 0);
    
    setQuoteFormInitialData(getLatestQuoteData(dashboardSummary ?? null));

    if (dashboardSummary?.requiresVerification) {
      console.log('[handleRequestMoreQuotes] → Opening ContactVerificationModal (verification required)');
      setShowContactVerificationModal(true);
    } else {
      // Check if this is the first quote (0 submissions) or subsequent quotes
      if (dashboardSummary?.totalSubmitted === 0) {
        // First quote: Show InstantQuoteForm (multi-step modal)
        console.log('[handleRequestMoreQuotes] → Opening InstantQuoteForm (first quote, totalSubmitted = 0)');
        setIsNewQuoteModalOpen(true);
      } else {
        // Subsequent quotes: Show SimplifiedQuoteForm (single-page pre-filled form)
        console.log('[handleRequestMoreQuotes] → Opening SimplifiedQuoteForm (returning user, totalSubmitted =', dashboardSummary?.totalSubmitted, ')');
        setIsSimplifiedQuoteModalOpen(true);
      }
    }
  };

  // Phase 4.11: Lead CRUD handlers
  const handleEditLead = (lead: RecentLeadSummary) => {
    setSelectedLead(lead);
    setEditLeadModalOpen(true);
  };

  const handlePreviewLead = (lead: RecentLeadSummary) => {
    setSelectedLead(lead);
    setPreviewLeadModalOpen(true);
  };

  const handleCancelLead = async (lead: RecentLeadSummary) => {
    if (!confirm(`Are you sure you want to cancel this ${QUOTE_TYPE_LABELS[lead.quoteType]} request? This action cannot be undone.`)) {
      return;
    }

    const reason = prompt('Please provide a reason for cancellation (optional):');

    try {
      const response = await fetch(`/api/leads/${lead.id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Cancelled by homeowner' }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to cancel lead: ${error.error || 'Unknown error'}`);
        return;
      }

      const result = await response.json();
      alert(result.quotaRestored
        ? '✅ Lead cancelled successfully! Your quote allowance has been restored.'
        : '✅ Lead cancelled successfully!');

      // Refresh dashboard
      await fetchDashboardSummary();
    } catch (error) {
      console.error('[handleCancelLead] Error:', error);
      alert('Failed to cancel lead. Please try again.');
    }
  };

  const handleLeadEditSuccess = async () => {
    setEditLeadModalOpen(false);
    setSelectedLead(null);
    // Refresh dashboard to show updated lead
    await fetchDashboardSummary();
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
        return (
          <DashboardOverviewContent 
            summary={dashboardSummary}
            isLoading={isLoading}
            error={error}
            onRequestMoreQuotes={handleRequestMoreQuotes}
            onVerifyContact={() => setShowContactVerificationModal(true)}
            onEditLead={handleEditLead}
            onPreviewLead={handlePreviewLead}
            onCancelLead={handleCancelLead}
          />
        );
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
        return (
          <DashboardOverviewContent 
            summary={dashboardSummary}
            isLoading={isLoading}
            error={error}
            onRequestMoreQuotes={handleRequestMoreQuotes}
            onVerifyContact={() => setShowContactVerificationModal(true)}
            onEditLead={handleEditLead}
            onPreviewLead={handlePreviewLead}
            onCancelLead={handleCancelLead}
          />
        );
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
          // Store quote data and open QuoteOptionsModal to select quote type
          setPendingQuoteData(data);
          setIsNewQuoteModalOpen(false);
          setIsQuoteOptionsModalOpen(true);
        }}
        onProceedToDetailedQuote={() => {
          setIsNewQuoteModalOpen(false);
          // Navigate to detailed quote page or show detailed quote form
          setActivePage('Quote Requests');
        }}
        initialData={quoteFormInitialData}
      />

      {/* SimplifiedQuoteFormModal for returning users (1+ quotes) */}
      <SimplifiedQuoteFormModal
        isOpen={isSimplifiedQuoteModalOpen}
        onClose={() => setIsSimplifiedQuoteModalOpen(false)}
        onSubmit={(data) => {
          console.log('Simplified quote form submitted:', data);
          // Store quote data and open QuoteOptionsModal to select quote type
          setPendingQuoteData(data);
          setIsSimplifiedQuoteModalOpen(false);
          setIsQuoteOptionsModalOpen(true);
        }}
        initialData={quoteFormInitialData}
      />

      <QuoteOptionsModal
        isOpen={isQuoteOptionsModalOpen}
        onClose={() => {
          setIsQuoteOptionsModalOpen(false);
          setPendingQuoteData(null);
        }}
        onSelectOption={async (quoteType: 'call_visit' | 'written') => {
          console.log('[Dashboard] Quote type selected (raw):', quoteType);
          
          // Transform to API format: 'call_visit' -> 'CALL_VISIT', 'written' -> 'WRITTEN_QUOTE'
          const apiQuoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE' = 
            quoteType === 'call_visit' ? 'CALL_VISIT' : 'WRITTEN_QUOTE';
          
          console.log('[Dashboard] Quote type (transformed):', apiQuoteType);
          console.log('[Dashboard] Pending quote data:', pendingQuoteData);
          setSelectedQuoteType(apiQuoteType);
          setIsQuoteOptionsModalOpen(false);
          setIsSubmittingRequest(true);

          try {
            const payload = {
              quoteType: apiQuoteType,
              quoteData: pendingQuoteData,
              propertyPostcode: pendingQuoteData?.postcode || '',
              location: pendingQuoteData?.location || '',
              state: pendingQuoteData?.state || '',
              propertyType: pendingQuoteData?.propertyType || 'residential',
              roofType: pendingQuoteData?.roofType || '',
              energyBill: pendingQuoteData?.electricityUsage || 0,
              billType: pendingQuoteData?.electricityUsageType || 'quarterly',
              budgetRange: pendingQuoteData?.budgetRange || '',
              desiredOffset: pendingQuoteData?.desiredOffset || 100,
              batteryRequired: pendingQuoteData?.batteryIncluded || false,
              batteryCapacity: pendingQuoteData?.batteryCapacity || '',
            };
            
            console.log('[Dashboard] Submitting payload:', payload);

            // Submit lead directly since user is already authenticated
            const response = await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
              // Handle verification required
              if (result.requiresVerification) {
                alert('Phone verification required. Please verify your phone number to submit more quotes.');
                setShowContactVerificationModal(true);
                return;
              }

              // Handle limit reached
              if (result.limitReached) {
                alert(`You have reached your quote limit (${result.quoteLimit} total).`);
                return;
              }

              throw new Error(result.error || 'Failed to submit lead');
            }

            // Success! Refresh dashboard
            console.log('✅ Lead submitted successfully:', result);
            
            // Check if this was the first quote submission
            const isFirstQuote = result.leadSubmissionCount === 1;
            
            if (isFirstQuote && apiQuoteType && result.remainingLeadAllowance !== undefined && result.quoteLimit) {
              // Show first quote success modal with details
              setFirstQuoteSuccessData({
                quoteType: apiQuoteType,
                remainingQuotes: result.remainingLeadAllowance,
                totalQuoteLimit: result.quoteLimit,
              });
              setShowFirstQuoteSuccessModal(true);
            } else {
              // Show regular success message for subsequent quotes
              alert('Quote request submitted successfully! We\'ll match you with verified installers soon.');
            }
            
            await fetchDashboardSummary();
            setPendingQuoteData(null);
            setSelectedQuoteType(null);
          } catch (error) {
            console.error('Failed to submit lead:', error);
            alert(error instanceof Error ? error.message : 'Failed to submit quote request. Please try again.');
          } finally {
            setIsSubmittingRequest(false);
          }
        }}
        quoteData={pendingQuoteData}
      />

      <MessagingModal
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
      />

      <ContactVerificationModal
        isOpen={showContactVerificationModal}
        defaultPhone={session?.user?.phone || ''}
        onClose={() => setShowContactVerificationModal(false)}
        onOTPRequested={handleOTPRequested}
      />

      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phoneNumber={pendingOTP?.phoneNumber || session?.user?.phone || ''}
        verificationId={pendingOTP?.verificationId || ''}
        expiresAt={pendingOTP?.expiresAt || new Date()}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onResendOTP={handleResendOTP}
      />

      {/* First Quote Success Modal */}
      {firstQuoteSuccessData && (
        <FirstQuoteSuccessModal
          isOpen={showFirstQuoteSuccessModal}
          onClose={() => {
            setShowFirstQuoteSuccessModal(false);
            setFirstQuoteSuccessData(null);
          }}
          onVerifyContact={() => {
            setShowFirstQuoteSuccessModal(false);
            setShowContactVerificationModal(true);
          }}
          quoteType={firstQuoteSuccessData.quoteType}
          remainingQuotes={firstQuoteSuccessData.remainingQuotes}
          totalQuoteLimit={firstQuoteSuccessData.totalQuoteLimit}
        />
      )}

      {/* Phase 4.11: Lead Edit Modal */}
      {selectedLead && (
        <LeadEditModal
          isOpen={editLeadModalOpen}
          onClose={() => {
            setEditLeadModalOpen(false);
            setSelectedLead(null);
          }}
          leadId={selectedLead.id}
          initialData={selectedLead.quoteData || {}}
          onSaveSuccess={handleLeadEditSuccess}
        />
      )}

      {/* Phase 4.11: Lead Preview Modal */}
      {selectedLead && (
        <LeadPreviewModal
          isOpen={previewLeadModalOpen}
          onClose={() => {
            setPreviewLeadModalOpen(false);
            setSelectedLead(null);
          }}
          lead={{
            id: selectedLead.id,
            quoteType: selectedLead.quoteType,
            status: selectedLead.status,
            createdAt: selectedLead.createdAt,
            updatedAt: selectedLead.updatedAt,
            quoteData: selectedLead.quoteData || {},
          }}
        />
      )}
    </div>
  );
}
