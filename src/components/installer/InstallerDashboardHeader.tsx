"use client";

import React, { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Search as SearchIcon, HelpCircle as HelpCircleIcon, Bell as BellIcon } from "lucide-react";

interface InstallerDashboardHeaderProps {
  pageTitle: string;
}

export const InstallerDashboardHeader: React.FC<InstallerDashboardHeaderProps> = ({ pageTitle }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <h1 className="dashboard-header__title">{pageTitle}</h1>
      </div>
      <div className="dashboard-header__right">
        {/* Search Input */}
        <div className={`dashboard-header__search ${isSearchOpen ? "dashboard-header__search--active" : ""}`}>
          <input 
            type="text" 
            placeholder="Search leads..." 
            className={`dashboard-header__search-input ${isSearchOpen ? "dashboard-header__search-input--expanded" : "dashboard-header__search-input--collapsed"}`}
          />
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="dashboard-header__action-btn" 
            aria-label="Toggle search"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Help Button (Hidden on mobile) */}
        <button 
          className="dashboard-header__action-btn dashboard-header__action-btn--hidden-sm"
          aria-label="Help"
        >
          <HelpCircleIcon />
        </button>

        {/* Notifications Button */}
        <button 
          className="relative dashboard-header__action-btn"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="dashboard-header__notification-badge"></span>
        </button>

        {/* User Avatar */}
        <button 
          className="dashboard-header__avatar"
          aria-label="User profile"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://picsum.photos/seed/installer/40/40" 
            alt="Installer Avatar" 
            className="dashboard-header__avatar-img" 
          />
        </button>
      </div>
    </header>
  );
};
