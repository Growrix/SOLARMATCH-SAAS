import React from 'react';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>;
const LogInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>;

interface GuestBottomNavBarProps {
  onQuoteClick: () => void;
  onRebateClick: () => void;
  onLoginClick: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="group flex flex-col items-center justify-center space-y-1 w-full h-full transition-transform duration-200 text-slate-500 dark:text-slate-400 hover:text-primary active:text-primary active:scale-95">
    <div className="p-1 rounded-full group-active:bg-primary/10 transition-colors">
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const GuestBottomNavBar: React.FC<GuestBottomNavBarProps> = ({ onQuoteClick, onRebateClick, onLoginClick }) => {
  const scrollToTop = () => {
    // Scrolls to the top of the page smoothly.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <nav
      aria-label="Guest navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-800/50 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]"
      style={{
        height: `calc(4.5rem + env(safe-area-inset-bottom))`,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="grid grid-cols-4 items-center h-full max-w-md mx-auto px-2">
        <NavItem icon={<HomeIcon />} label="Home" onClick={scrollToTop} />
        <NavItem icon={<CalculatorIcon />} label="Quote" onClick={onQuoteClick} />
        <NavItem icon={<TagIcon />} label="Rebates" onClick={onRebateClick} />
        <NavItem icon={<LogInIcon />} label="Login" onClick={onLoginClick} />
      </div>
    </nav>
  );
};

export default GuestBottomNavBar;