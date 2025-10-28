import React, { useState } from 'react';
import InstallerBottomNavBar from './InstallerBottomNavBar';
import InstallerMobileSidebarMenu from './InstallerMobileSidebarMenu';
import InstallerLeadFeed from './InstallerLeadFeed';
import type { InstallerProfile } from './InstallerLeadFeed';

// --- Icon Components ---
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const GavelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m14 12-8.5 8.5"/><path d="m18 16 1-1"/><path d="m17 11 4.3 4.3c.6.6.6 1.5 0 2.1l-2.1 2.1c-.6.6-1.5.6-2.1 0L12.8 16"/><path d="m3 3 8.5 8.5"/><path d="m13 7 4-4"/><path d="m14 11-4 4"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="9" x2="9" y1="22" y2="4"/><line x1="15" x2="15" y1="22" y2="4"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;

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

const InstallerSidebar: React.FC<{ activePage: string; setActivePage: (page: string) => void; onLogoutClick: () => void; onHomeClick: () => void; }> = ({ activePage, setActivePage, onLogoutClick, onHomeClick }) => {
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
        <NavItem icon={<ZapIcon />} title="Lead Feed" isActive={activePage === 'Lead Feed'} onClick={() => setActivePage('Lead Feed')} badgeCount={5} />
        <NavItem icon={<GavelIcon />} title="Active Bids" isActive={activePage === 'Active Bids'} onClick={() => setActivePage('Active Bids')} />
        <NavItem icon={<MessageSquareIcon />} title="Messages" isActive={activePage === 'Messages'} onClick={() => setActivePage('Messages')} badgeCount={3} />
        <NavItem icon={<BuildingIcon />} title="Company Profile" isActive={activePage === 'Company Profile'} onClick={() => setActivePage('Company Profile')} />
      </nav>
      <div className="mt-auto"><button onClick={onLogoutClick} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800"><LogOutIcon /><span>Logout</span></button></div>
    </aside>
  );
};

const DashboardHeader: React.FC<{ pageTitle: string; theme: Theme; setTheme: (theme: Theme) => void; }> = ({ pageTitle, theme, setTheme }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <header className="glass-header h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className={`flex items-center justify-end transition-all duration-300 ${isSearchOpen ? 'bg-gray-100 dark:bg-slate-800 rounded-lg' : ''}`}>
          <input type="text" placeholder="Search leads..." className={`bg-transparent focus:outline-none transition-all duration-300 ease-in-out text-sm ${ isSearchOpen ? 'w-32 sm:w-40 py-2 pl-3 pr-2' : 'w-0 p-0' }`}/>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400" aria-label="Toggle search"><SearchIcon /></button>
        </div>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hidden sm:block"><HelpCircleIcon /></button>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"><BellIcon /><span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black/50"></span></button>
        <button><img src="https://picsum.photos/seed/installer/40/40" alt="Installer Avatar" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" /></button>
      </div>
    </header>
  );
};

const PlaceholderContent: React.FC<{ title: string; }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-white dark:bg-black/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 animate-fade-in">
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">{title}</h2>
            <p className="text-slate-500 mt-2">This feature is under construction. Check back soon!</p>
        </div>
    </div>
);

const InstallerMessagesContent: React.FC<{ onOpenMessages: () => void }> = ({ onOpenMessages }) => {
    const unreadMessages = 4;
    const activeConversations = 5;
    const responseTime = "~1.5h";

    const recentConversations = [
      { id: 1, homeowner: { name: 'Jane Doe', avatar: 'https://picsum.photos/seed/user1/100/100' }, unreadCount: 1, lastMessage: new Date(Date.now() - 30 * 60 * 1000), lastMessageContent: "Thanks for the quote! Can you tell me more about the warranty?" },
      { id: 2, homeowner: { name: 'John Smith', avatar: 'https://picsum.photos/seed/user2/100/100' }, unreadCount: 2, lastMessage: new Date(Date.now() - 2 * 60 * 60 * 1000), lastMessageContent: "Okay, I have another question about panel placement..." },
      { id: 3, homeowner: { name: 'Emily White', avatar: 'https://picsum.photos/seed/user3/100/100' }, unreadCount: 0, lastMessage: new Date(Date.now() - 5 * 60 * 60 * 1000), lastMessageContent: "Perfect, let's schedule the installation for next Tuesday." },
    ];
    
    const formatTime = (date: Date) => {
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    };
  
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
          <button onClick={onOpenMessages} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm w-full sm:w-auto">
            Open Inbox
          </button>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="theme-card p-6">
            <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500 dark:text-slate-400">Unread Messages</span><span className="w-3 h-3 bg-red-500 rounded-full"></span></div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{unreadMessages}</p>
          </div>
          <div className="theme-card p-6">
            <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Conversations</span><span className="w-3 h-3 bg-green-500 rounded-full"></span></div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{activeConversations}</p>
          </div>
          <div className="theme-card p-6">
            <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Response Time</span><span className="w-3 h-3 bg-blue-500 rounded-full"></span></div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{responseTime}</p>
          </div>
        </div>
  
        <div className="theme-card">
          <div className="p-6 border-b border-gray-200 dark:border-slate-800"><h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Conversations</h3></div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {recentConversations.map(conv => (
              <button key={conv.id} onClick={onOpenMessages} className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={conv.homeowner.avatar} alt={conv.homeowner.name} className="w-12 h-12 rounded-full" />
                      {conv.unreadCount > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{conv.homeowner.name}</h4>
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


interface InstallerDashboardProps {
  onLogoutClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onHomeClick: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  onMessagesClick: () => void;
  isHeaderVisible: boolean;
}

const InstallerDashboard: React.FC<InstallerDashboardProps> = ({ 
  onLogoutClick, 
  theme, 
  setTheme, 
  onHomeClick,
  activePage,
  setActivePage,
  onMessagesClick,
  isHeaderVisible
}) => {

  // Mock Installer Profile for the lead feed
  const mockInstaller: InstallerProfile = {
      id: 1,
      companyName: 'Bright Spark Solar',
      email: 'contact@brightspark.com.au',
      phone: '02 9876 5432',
      serviceAreas: ['2000-2200', '2500-2600'],
      isApproved: true,
      creditBalance: 450,
      totalUnlocks: 15,
      successRate: 88,
  };

  const handleUnlockLead = async (leadId: number) => {
      console.log(`Attempting to unlock lead: ${leadId}`);
      alert(`Lead unlock requested for ID: ${leadId}`);
      return true; // Simulate success
  };

  const handleSubmitQuote = async (leadId: number, quoteData: any) => {
      console.log(`Submitting quote for lead ${leadId}:`, quoteData);
      alert(`Quote submitted for lead ID: ${leadId}`);
      return true; // Simulate success
  };

  const handleStartChat = (leadId: number) => {
      console.log(`Starting chat for lead: ${leadId}`);
      onMessagesClick(); // For now, just open the generic messages modal
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard Overview':
        return <PlaceholderContent title="Dashboard Overview" />;
      case 'Lead Feed':
        return <InstallerLeadFeed 
                  installer={mockInstaller}
                  onUnlockLead={handleUnlockLead}
                  onSubmitQuote={handleSubmitQuote}
                  onStartChat={handleStartChat}
                />;
      case 'Active Bids':
        return <PlaceholderContent title="Active Bids" />;
      case 'Messages':
        return <InstallerMessagesContent onOpenMessages={onMessagesClick} />;
      case 'Company Profile':
        return <PlaceholderContent title="Company Profile" />;
      default:
        return <PlaceholderContent title="Dashboard Overview" />;
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
            />
          </div>
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 sm:pb-8">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex">
          <InstallerSidebar activePage={activePage} setActivePage={setActivePage} onLogoutClick={onLogoutClick} onHomeClick={onHomeClick} />
      </div>
    </div>
  );
};

export default InstallerDashboard;