'use client';

import React, { useEffect } from 'react';

// --- Icon Components ---
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" x2="6" y1="6" y2="18"/>
    <line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const LayoutDashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
  </svg>
);

const PaintbrushIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M17 3a2.85 2.85 0 0 0-4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    <path d="m15 5 4 4"/>
    <path d="M22 11.5c0 2-1.5 3.5-3.5 3.5S15 13.5 15 11.5 16.5 8 18.5 8s3.5 1.5 3.5 3.5z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

interface AdminMobileSidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activePage: string;
    setActivePage: (page: string) => void;
    onLogoutClick: () => void;
}

const NavItem: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    isActive: boolean; 
    onClick: () => void; 
}> = ({ icon, title, isActive, onClick }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-colors text-base font-semibold ${
            isActive 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        <span>{title}</span>
    </button>
);

const AdminMobileSidebarMenu: React.FC<AdminMobileSidebarMenuProps> = ({ 
    isOpen, 
    onClose, 
    activePage, 
    setActivePage, 
    onLogoutClick 
}) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
    
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNavClick = (page: string) => {
        setActivePage(page);
        onClose();
    };

    const handleLogoutClick = () => {
        onClose();
        onLogoutClick();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                onClick={e => e.stopPropagation()} 
                className="relative w-full max-w-xs bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col p-6 animate-slide-in-up"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Menu</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                        <XIcon />
                    </button>
                </div>

                <nav className="flex-grow flex flex-col items-center space-y-3">
                    <NavItem 
                        icon={<LayoutDashboardIcon />} 
                        title="Dashboard" 
                        isActive={activePage === 'Dashboard'} 
                        onClick={() => handleNavClick('Dashboard')} 
                    />
                    <NavItem 
                        icon={<UsersIcon />} 
                        title="User Management" 
                        isActive={activePage === 'User Management'} 
                        onClick={() => handleNavClick('User Management')} 
                    />
                    <NavItem 
                        icon={<FileTextIcon />} 
                        title="Content Management" 
                        isActive={activePage === 'Content Management'} 
                        onClick={() => handleNavClick('Content Management')} 
                    />
                    <NavItem 
                        icon={<PaintbrushIcon />} 
                        title="Theme Settings" 
                        isActive={activePage === 'Theme Settings'} 
                        onClick={() => handleNavClick('Theme Settings')} 
                    />
                    <NavItem 
                        icon={<SettingsIcon />} 
                        title="Global Settings" 
                        isActive={activePage === 'Global Settings'} 
                        onClick={() => handleNavClick('Global Settings')} 
                    />
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                    <button 
                        onClick={handleLogoutClick} 
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-colors text-base font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                        <LogOutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMobileSidebarMenu;
