import React from 'react';

// Icon Components - Matching SOT exactly
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ArticlesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
    <path d="M7 7h.01"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

interface GuestBottomNavBarProps {
  onArticlesClick: () => void;
  onRebateClick: () => void;
  onLoginClick: () => void;
  onHomeClick?: () => void;
}

const GuestBottomNavBar: React.FC<GuestBottomNavBarProps> = ({ 
  onArticlesClick, 
  onRebateClick, 
  onLoginClick, 
  onHomeClick 
}) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        <button onClick={handleHomeClick} className="flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <HomeIcon />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={onArticlesClick} className="flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <ArticlesIcon />
          <span className="text-xs">Articles</span>
        </button>
        <button onClick={onRebateClick} className="flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <TagIcon />
          <span className="text-xs">Rebates</span>
        </button>
        <button onClick={onLoginClick} className="flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
          <UserIcon />
          <span className="text-xs">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default GuestBottomNavBar;
