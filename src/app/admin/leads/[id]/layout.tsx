"use client";
import React from 'react';

import AdminBottomNavBar from '@/components/AdminBottomNavBar';
import AdminMobileSidebarMenu from '@/components/AdminMobileSidebarMenu';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLeadDetailLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activePage, setActivePage] = React.useState("Leads");
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
        <AdminBottomNavBar
          activePage="Leads"
          setActivePage={() => {}}
          onMenuClick={() => {}}
          onThemeClick={() => {}}
        />
      </div>
    </div>
  );
}
