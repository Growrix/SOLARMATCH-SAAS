'use client';

/**
 * Admin Installers Page
 * Phase 7.5.13 - T342
 * 
 * Main page for managing installer verification and profiles.
 * Integrates all installer management components.
 */

import React from 'react';
import InstallersTable from '@/components/admin/InstallersTable';

export default function AdminInstallersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <InstallersTable />
    </div>
  );
}
