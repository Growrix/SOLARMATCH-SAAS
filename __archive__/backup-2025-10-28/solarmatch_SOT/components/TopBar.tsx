import React from 'react';

const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="9" x2="9" y1="22" y2="4"/><line x1="15" x2="15" y1="22" y2="4"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const LogInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>;

interface TopBarProps {
  onBecomePartnerClick: () => void;
  onPartnerSignInClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onBecomePartnerClick, onPartnerSignInClick }) => {
  return (
    <div id="top-bar" className="glass-top-bar text-sm py-2 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
            <BuildingIcon />
            <span>For Solar Installers:</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBecomePartnerClick}
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors flex items-center space-x-1"
            >
              <BuildingIcon />
              <span>Become a Partner</span>
            </button>
            
            <div className="w-px h-4 bg-gray-300 dark:bg-slate-700"></div>
            
            <button
              onClick={onPartnerSignInClick}
              className="text-xs font-medium text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors flex items-center space-x-1"
            >
              <LogInIcon />
              <span>Partner Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;