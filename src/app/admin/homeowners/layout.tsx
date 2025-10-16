"use client";
import React from 'react';

import AdminBottomNavBar from '@/components/AdminBottomNavBar';
import AdminMobileSidebarMenu from '@/components/AdminMobileSidebarMenu';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminHomeownersLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activePage, setActivePage] = React.useState("Homeowners");
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* Mobile sidebar menu */}
      <div className="md:hidden">
        <AdminMobileSidebarMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogoutClick={() => {}}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        
        {/* Bottom nav for mobile */}
        <div className="md:hidden">
          <AdminBottomNavBar 
            activePage={activePage}
            setActivePage={setActivePage}
            onMenuClick={() => setIsOpen(true)}
            onThemeClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
