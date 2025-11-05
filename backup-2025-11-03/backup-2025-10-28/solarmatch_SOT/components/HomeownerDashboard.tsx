import React, { useState } from 'react';
import type { QuoteRequest, UserProfile, Conversation } from '../types';
import ProfileManagement from './ProfileManagement';
import AIInsights from './AIInsights';

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
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BatteryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" x2="23" y1="13" y2="11"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 22v-5"/><path d="M9 22V12.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 12.5V22"/><path d="M15 22V9a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 9v13"/><path d="M1.5 22V7.5A1.5 1.5 0 0 1 3 6h3a1.5 1.5 0 0 1 1.5 1.5V22"/><path d="M22.5 22V16.5a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5V22"/><path d="M15 5.5V3a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 3v2.5"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M7 20.9a9 9 0 0 1-5-7.8A9 9 0 0 1 10.2 2a9 9 0 0 1 8.7 6.4"/><path d="M12 2v20"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3L9.5 9.5L3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps { theme: Theme; setTheme: (theme: Theme) => void; }

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
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

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    onLogoutClick: () => void;
    onHomeClick: () => void;
    onMessagesClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogoutClick, onHomeClick, onMessagesClick }) => {
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
        <NavItem icon={<MessageSquareIcon />} title="Messages" isActive={activePage === 'Messages'} onClick={() => setActivePage('Messages')} badgeCount={3} />
        <NavItem icon={<UserIcon />} title="My Profile" isActive={activePage === 'My Profile'} onClick={() => setActivePage('My Profile')} />
      </nav>
      <div className="mt-auto"><button onClick={onLogoutClick} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800"><LogOutIcon /><span>Logout</span></button></div>
    </aside>
  );
};

const DashboardHeader: React.FC<{ pageTitle: string; onNewQuoteClick: () => void; theme: Theme; setTheme: (theme: Theme) => void; }> = ({ pageTitle, onNewQuoteClick, theme, setTheme }) => {
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
        <button><img src="https://picsum.photos/seed/user/40/40" alt="User Avatar" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" /></button>
      </div>
    </header>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; change: string; onAction: () => void; actionText: string; }> = ({ icon, title, value, change, onAction, actionText }) => (
    <div className="theme-card p-3 flex flex-col">
        <div className="flex justify-between items-start"><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p><div className="p-2 bg-primary/10 rounded-lg">{icon}</div></div>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{change}</p>
        <div className="flex-grow" />
        <button onClick={onAction} className="text-sm font-semibold text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors mt-4 text-left">{actionText} &rarr;</button>
    </div>
);

const DashboardOverviewContent: React.FC = () => (
    <div className="animate-fade-in">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6">Good Morning, Homeowner!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={<FileTextIcon />} title="Active Requests" value="3" change="+1 this week" onAction={() => {}} actionText="View Requests" />
            <StatCard icon={<GavelIcon />} title="New Bids" value="2" change="+2 this week" onAction={() => {}} actionText="Go to Bidding Room" />
            <StatCard icon={<MessageSquareIcon />} title="Unread Messages" value="5" change="from 3 installers" onAction={() => {}} actionText="Open Inbox" />
            <StatCard icon={<DollarSignIcon />} title="Est. Annual Savings" value="$1,850" change="Based on 6.6kW system" onAction={() => {}} actionText="View Breakdown" />
        </div>
        <div className="mt-4 sm:mt-6 theme-card p-4 sm:p-6"><h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3><div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">No recent activity to display.</p></div></div>
    </div>
);

const MessagesContent: React.FC<{ onOpenMessages: () => void }> = ({ onOpenMessages }) => {
    const unreadMessages = 2;
    const activeConversations = 3;
    const responseTime = "~2h";
  
    // Using a simplified type for mock data to avoid pulling in full Conversation type here
    const recentConversations = [
      {
        id: 1,
        installer: { name: 'Solar Pro Australia', avatar: 'https://picsum.photos/seed/installer1/100/100' },
        unreadCount: 1,
        lastMessage: new Date(Date.now() - 1 * 60 * 60 * 1000),
        lastMessageContent: "Based on your energy usage, I'd recommend a 6.6kW system..."
      },
      {
        id: 2,
        installer: { name: 'Green Energy Solutions', avatar: 'https://picsum.photos/seed/installer2/100/100' },
        unreadCount: 0,
        lastMessage: new Date(Date.now() - 3 * 60 * 60 * 1000),
        lastMessageContent: "Yes, I'd be interested. What times are available next week?"
      },
      {
        id: 3,
        installer: { name: 'Bright Solar Co.', avatar: 'https://picsum.photos/seed/installer3/100/100' },
        unreadCount: 1,
        lastMessage: new Date(Date.now() - 6 * 60 * 60 * 1000),
        lastMessageContent: "Hi there! We offer competitive pricing on Tesla Powerwall..."
      },
    ];
    
    const formatTime = (date: Date) => {
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    };
  
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
          <button onClick={onOpenMessages} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm w-full sm:w-auto">
            Open Messages
          </button>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="theme-card p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Unread Messages</span>
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{unreadMessages}</p>
          </div>
          <div className="theme-card p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Conversations</span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{activeConversations}</p>
          </div>
          <div className="theme-card p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Response Time</span>
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{responseTime}</p>
          </div>
        </div>
  
        <div className="theme-card">
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Conversations</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {recentConversations.map(conv => (
              <button key={conv.id} onClick={onOpenMessages} className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={conv.installer.avatar} alt={conv.installer.name} className="w-12 h-12 rounded-full" />
                      {conv.unreadCount > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{conv.installer.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-xs md:max-w-md">{conv.lastMessageContent}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 dark:text-slate-500 flex-shrink-0">{formatTime(conv.lastMessage)}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="p-6 border-t border-gray-200 dark:border-slate-800 text-center">
            <button onClick={onOpenMessages} className="font-semibold text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              Open Full Messaging Interface &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  };

const PlaceholderContent: React.FC<{ title: string; onLogoutClick?: () => void }> = ({ title, onLogoutClick }) => (
    <div className="flex items-center justify-center h-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 animate-fade-in"><div className="text-center"><h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">{title}</h2><p className="text-slate-500 mt-2">This feature is under construction. Check back soon!</p>
    {title === 'My Profile' && onLogoutClick && (
        <div className="mt-6">
            <button onClick={onLogoutClick} className="bg-red-500/10 text-red-500 font-semibold px-6 py-2 rounded-lg hover:bg-red-500/20 transition-colors">
                Logout
            </button>
        </div>
    )}
    </div></div>
);

const QuoteRequestCard: React.FC<{ request: QuoteRequest }> = ({ request }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusClasses = {
        'Awaiting Bids': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Bids Received': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Completed': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    
    return (
        <div className="theme-card p-4 sm:p-6 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{request.location}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mt-1">
                    <CalendarIcon />
                    <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                </p>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-full border self-start sm:self-center ${statusClasses[request.status]}`}>
                {request.status}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Out-of-Pocket Cost</p>
                    <p className="text-xl font-bold text-primary mt-1">{formatCurrency(request.cost.finalPrice)}</p>
                </div>
                <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Est. Annual Savings</p>
                    <p className="text-xl font-bold text-emerald-500 mt-1">{formatCurrency(request.performance.annualSavings)}</p>
                </div>
                <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Payback Period</p>
                    <p className="text-xl font-bold text-blue-500 mt-1">{request.performance.paybackPeriod ? `${request.performance.paybackPeriod} Years` : 'N/A'}</p>
                </div>
            </div>
            
            {/* Collapsible Details */}
            {isExpanded && (
                <div className="animate-fade-in space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* System Specs */}
                    <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">System Specifications</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>System Size:</span><span className="font-bold text-slate-900 dark:text-white">{request.system.size}</span></div>
                        <div className="flex justify-between"><span>Battery:</span><span className="font-bold text-slate-900 dark:text-white">{request.system.battery}</span></div>
                        <div className="flex justify-between"><span>Est. Production:</span><span className="font-bold text-slate-900 dark:text-white">{request.system.annualProduction.toLocaleString()} kWh/yr</span></div>
                        <div className="flex justify-between"><span>CO₂ Reduction:</span><span className="font-bold text-emerald-500">{request.performance.co2Reduction.toLocaleString()} kg/yr</span></div>
                    </div>
                    </div>
                    {/* Cost Breakdown */}
                    <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Total System Cost:</span><span className="font-bold text-slate-900 dark:text-white">{formatCurrency(request.cost.totalSystemCost)}</span></div>
                        <div className="flex justify-between"><span>Total Rebates:</span><span className="font-bold text-emerald-500">-{formatCurrency(request.cost.totalRebates)}</span></div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-slate-700 mt-2 pt-2"><strong>Final Price:</strong><strong className="text-primary">{formatCurrency(request.cost.finalPrice)}</strong></div>
                    </div>
                    </div>
                </div>
                {/* Original Details */}
                <div className="bg-gray-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Your Provided Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1.5"><HomeIcon /><span>{request.details.propertyType}</span></div>
                        <div className="flex items-center space-x-1.5"><BuildingIcon /><span>{request.details.roofType} Roof</span></div>
                        <div className="flex items-center space-x-1.5"><DollarSignIcon /><span>Budget: {request.details.budget}</span></div>
                    </div>
                </div>
                </div>
            )}

            {/* Footer / Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors flex items-center">
                    {isExpanded ? 'Show Less' : 'Show More Details'}
                    <ChevronDownIcon className={`ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">View Bids</button>
            </div>
        </div>
    );
};

const CallVisitQuotesContent: React.FC<{ quoteRequests: QuoteRequest[], onNewQuoteClick: () => void }> = ({ quoteRequests, onNewQuoteClick }) => {
    if (quoteRequests.length === 0) {
        return (
            <div className="text-center p-4 sm:p-6 theme-card border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center animate-fade-in">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileTextIcon />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">No Quote Requests Yet</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">When you request a quote on our homepage, it will appear here for you to track and manage.</p>
                <div className="mt-4">
                    <button onClick={onNewQuoteClick} className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
                        Request a New Quote
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-3 sm:space-y-4">
            {quoteRequests.map(request => (
                <QuoteRequestCard key={request.id} request={request} />
            ))}
        </div>
    );
};

interface HomeownerDashboardProps {
  quoteRequests: QuoteRequest[];
  onNewQuoteClick: () => void;
  onLogoutClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onHomeClick: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onDeleteAccountClick: () => void;
  onMessagesClick: () => void;
  isHeaderVisible: boolean;
}

const HomeownerDashboard: React.FC<HomeownerDashboardProps> = ({ 
  quoteRequests, 
  onNewQuoteClick, 
  onLogoutClick, 
  theme, 
  setTheme, 
  onHomeClick, 
  activePage, 
  setActivePage,
  userProfile,
  onUpdateProfile,
  onDeleteAccountClick,
  onMessagesClick,
  isHeaderVisible
}) => {

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard Overview':
        return <DashboardOverviewContent />;
      case 'Call/Visit Quotes':
        return <CallVisitQuotesContent quoteRequests={quoteRequests} onNewQuoteClick={onNewQuoteClick} />;
      case 'Written Quotes':
        return <PlaceholderContent title="Written Quotes" />;
      case 'Bidding Room':
        return <PlaceholderContent title="Bidding Room" />;
      case 'AI Insights':
        return <AIInsights quoteRequests={quoteRequests} />;
      case 'Messages':
        return <MessagesContent onOpenMessages={onMessagesClick} />;
      case 'My Profile':
        return <ProfileManagement 
                    user={userProfile} 
                    onUpdate={onUpdateProfile} 
                    onDeleteClick={onDeleteAccountClick}
                />;
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
              onNewQuoteClick={onNewQuoteClick} 
              theme={theme} 
              setTheme={setTheme} 
            />
          </div>
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 sm:pb-8">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex">
          <Sidebar activePage={activePage} setActivePage={setActivePage} onLogoutClick={onLogoutClick} onHomeClick={onHomeClick} onMessagesClick={onMessagesClick} />
      </div>
    </div>
  );
};

export default HomeownerDashboard;