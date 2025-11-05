"use client";
import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

const AdminHeader: React.FC = () => {
  return (
    <header className="h-20 flex items-center justify-end px-4 sm:px-8 bg-transparent">
      <ThemeSwitcher />
    </header>
  );
};

export default AdminHeader;