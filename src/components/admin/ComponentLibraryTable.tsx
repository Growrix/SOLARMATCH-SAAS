'use client';

import React, { useState } from 'react';

/**
 * Component Library Table
 * 
 * Comprehensive documentation of all neumorphic components used across the site.
 * Organized by category with exact class names and usage locations.
 * 
 * Data source: Audit of src/**\/*.tsx files on Nov 8, 2025
 */

interface ComponentPattern {
  name: string;
  description: string;
  className: string;
  usageCount: number;
  usedIn: string[];
  example: React.ReactNode;
}

export default function ComponentLibraryTable() {
  const [activeCategory, setActiveCategory] = useState('forms');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'forms', label: 'Forms', icon: '📝' },
    { id: 'buttons', label: 'Buttons', icon: '🔘' },
    { id: 'cards', label: 'Cards', icon: '🃏' },
    { id: 'badges', label: 'Badges', icon: '🏷️' },
    { id: 'typography', label: 'Typography', icon: '📄' },
    { id: 'shadows', label: 'Shadows', icon: '🌑' },
  ];

  // FORMS CATEGORY - Real patterns from codebase
  const formsPatterns: ComponentPattern[] = [
    {
      name: 'Text Input (Complete Neumorphic)',
      description: 'Standard text input with full neumorphic styling - MANDATORY pattern for ALL inputs',
      className: 'form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground',
      usageCount: 50,
      usedIn: ['Admin Leads Page (search)', 'Homeowner Signup', 'Installer Signup', 'Admin Forms'],
      example: (
        <input
          type="text"
          placeholder="Search components..."
          className="form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground"
        />
      ),
    },
    {
      name: 'Select Dropdown',
      description: 'Dropdown select with neumorphic inset shadow',
      className: 'form-select w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3',
      usageCount: 28,
      usedIn: ['Admin Leads (Status Filter)', 'Admin Leads (Verification Filter)', 'Rebate Calculator', 'Quote Forms'],
      example: (
        <select className="form-select w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      ),
    },
    {
      name: 'Textarea',
      description: 'Multi-line text input with complete neumorphic pattern',
      className: 'form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground resize-none',
      usageCount: 16,
      usedIn: ['Admin Lead Details (Notes)', 'Contact Forms', 'Admin Instant Quotes'],
      example: (
        <textarea
          rows={4}
          placeholder="Enter notes..."
          className="form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground resize-none"
        />
      ),
    },
  ];

  // BUTTONS CATEGORY - Real patterns from Button component + custom dashboard classes
  const buttonsPatterns: ComponentPattern[] = [
    // ===== BUTTON COMPONENT VARIANTS (src/components/ui/button.tsx) =====
    {
      name: 'Primary Button (variant="primary")',
      description: 'Button component primary variant - border accent with transparent background',
      className: 'border border-accent bg-transparent text-accent shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]',
      usageCount: 25,
      usedIn: ['Homepage Hero', 'Main CTAs', 'Signup Forms'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 border border-accent bg-transparent text-accent shadow-neu-outset-sm hover:shadow-neu-inset-sm">
          Get Started
        </button>
      ),
    },
    {
      name: 'Secondary Button (variant="secondary")',
      description: 'Button component secondary variant - background with neumorphic shadow',
      className: 'bg-background text-muted-foreground shadow-neu-outset-sm hover:text-foreground hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]',
      usageCount: 32,
      usedIn: ['Modals (Cancel)', 'Forms (Secondary Actions)', 'Alternative CTAs'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 bg-background text-muted-foreground shadow-neu-outset-sm hover:text-foreground hover:shadow-neu-inset-sm">
          Learn More
        </button>
      ),
    },
    {
      name: 'Ghost Button (variant="ghost")',
      description: 'Button component ghost variant - transparent with hover background',
      className: 'bg-transparent text-foreground hover:bg-background/80 hover:shadow-neu-outset-sm active:shadow-neu-inset-sm active:scale-[0.98] border-none',
      usageCount: 18,
      usedIn: ['Navigation', 'Subtle CTAs', 'Inline Actions'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 bg-transparent text-foreground hover:bg-background/80 hover:shadow-neu-outset-sm border-none">
          Skip
        </button>
      ),
    },
    {
      name: 'Outline Button (variant="outline")',
      description: 'Button component outline variant - bordered with transparent background',
      className: 'border-2 border-border bg-transparent shadow-neu-outset-sm text-foreground hover:text-accent active:shadow-neu-inset-sm active:scale-[0.98]',
      usageCount: 15,
      usedIn: ['Cards', 'Alternative Actions', 'Outlined CTAs'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 border-2 border-border bg-transparent shadow-neu-outset-sm text-foreground hover:text-accent">
          View Details
        </button>
      ),
    },
    {
      name: 'Minimal Button (variant="minimal")',
      description: 'Button component minimal variant - no shadow, minimal padding',
      className: 'bg-transparent text-foreground hover:text-accent transition-colors shadow-none border-none hover:bg-accent/5 active:scale-[0.98] px-4 py-2',
      usageCount: 22,
      usedIn: ['QuoteBuilderModal (Save Draft)', 'Table Actions', 'Modals'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-4 py-2 text-sm font-bold tracking-wider rounded-full transition-all duration-200 bg-transparent text-foreground hover:text-accent hover:bg-accent/5 shadow-none border-none">
          Save Draft
        </button>
      ),
    },
    {
      name: 'Destructive Button (variant="destructive")',
      description: 'Button component destructive variant - for delete/dangerous actions',
      className: 'bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 active:scale-[0.98]',
      usageCount: 8,
      usedIn: ['Delete Confirmations', 'Critical Actions', 'Dangerous Operations'],
      example: (
        <button className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90">
          Delete Account
        </button>
      ),
    },
    
    // ===== CUSTOM DASHBOARD BUTTON CLASSES (globals.css) =====
    {
      name: 'Dashboard Action Button (.dashboard-header__action-btn)',
      description: 'Custom header action button class - used in all dashboard headers',
      className: 'dashboard-header__action-btn',
      usageCount: 12,
      usedIn: ['AdminHeader', 'InstallerDashboardHeader', 'HomeownerDashboard Header'],
      example: (
        <button className="dashboard-header__action-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8"/><path d="M10 6v8M6 10h8"/></svg>
        </button>
      ),
    },
    {
      name: 'Dashboard Collapse Button (.dashboard-collapse-btn)',
      description: 'Custom sidebar collapse button class - neumorphic square button',
      className: 'dashboard-collapse-btn',
      usageCount: 6,
      usedIn: ['AdminSidebar', 'InstallerSidebar', 'HomeownerSidebar'],
      example: (
        <button className="dashboard-collapse-btn">
          <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
      ),
    },
    {
      name: 'Dashboard Collapse Button Floating (.dashboard-collapse-btn--floating)',
      description: 'Floating collapse button for collapsed sidebar state',
      className: 'dashboard-collapse-btn--floating dashboard-collapse-btn--floating-left',
      usageCount: 3,
      usedIn: ['AdminSidebar (Collapsed)', 'InstallerSidebar (Mobile)', 'HomeownerSidebar (Mobile)'],
      example: (
        <button className="fixed top-4 h-8 w-8 flex items-center justify-center rounded-full bg-surface text-primary shadow-neu-inset border border-border transition-all duration-200" style={{left: '84px'}}>
          <svg width="14" height="14" fill="none" stroke="currentColor"><path d="M10 15l-5-5 5-5"/></svg>
        </button>
      ),
    },
    
    // ===== RAW TAILWIND BUTTON PATTERNS (No Component) =====
    {
      name: 'Quote Modal Confirm Button',
      description: 'Raw Tailwind button for quote distribution modal confirm action',
      className: 'bg-primary text-white px-6 py-3 rounded-full shadow-neu-outset hover:shadow-neu-outset-lg transition-all',
      usageCount: 1,
      usedIn: ['Quote Distribution Modal (Admin)'],
      example: (
        <button className="bg-primary text-white px-6 py-3 rounded-full shadow-neu-outset hover:shadow-neu-outset-lg transition-all">
          Confirm Selection
        </button>
      ),
    },
    {
      name: 'Count Selector Button (Square)',
      description: 'Square neumorphic button for increment/decrement actions',
      className: 'w-10 h-10 rounded-xl bg-surface text-foreground shadow-neu-inset hover:shadow-neu-outset transition-all font-bold text-lg',
      usageCount: 6,
      usedIn: ['Quote Distribution Modal (Count Selector)'],
      example: (
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-surface text-foreground shadow-neu-inset hover:shadow-neu-outset transition-all font-bold text-lg">
            -
          </button>
          <span className="text-xl font-bold text-foreground min-w-[3ch] text-center">3</span>
          <button className="w-10 h-10 rounded-xl bg-surface text-foreground shadow-neu-inset hover:shadow-neu-outset transition-all font-bold text-lg">
            +
          </button>
        </div>
      ),
    },
    {
      name: 'Homeowner Dashboard Filter Tab',
      description: 'Tab button for homeowner dashboard filters (All/Active/Past)',
      className: 'px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-primary/10 text-primary shadow-neu-inset',
      usageCount: 3,
      usedIn: ['Homeowner Dashboard (Filter Tabs)'],
      example: (
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-primary/10 text-primary shadow-neu-inset">
            All
          </button>
          <button className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-muted-foreground hover:bg-surface hover:text-primary hover:shadow-neu-outset-sm">
            Active
          </button>
        </div>
      ),
    },
    {
      name: 'Custom Toggle Switch',
      description: 'Custom toggle switch for view mode in QuoteBuilderModal',
      className: 'relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-primary',
      usageCount: 2,
      usedIn: ['QuoteBuilderModal (View Mode Toggle)', 'Settings'],
      example: (
        <button className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-primary">
          <span className="inline-block h-3 w-3 transform rounded-full bg-surface transition-transform translate-x-5" />
        </button>
      ),
    },
  ];

  // CARDS CATEGORY
  const cardsPatterns: ComponentPattern[] = [
    {
      name: 'Theme Card (Class)',
      description: 'Standard elevated card using .theme-card class - most common pattern',
      className: 'theme-card p-6',
      usageCount: 31,
      usedIn: ['Quote Distribution Modal', 'Installer Feed', 'Modals', 'Admin Newsletter Table'],
      example: (
        <div className="theme-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-2">Card Title</h3>
          <p className="text-muted-foreground">Standard card with neumorphic styling using .theme-card class.</p>
        </div>
      ),
    },
    {
      name: 'Inline Card (No Class)',
      description: 'Card using direct utility classes instead of .theme-card',
      className: 'bg-surface shadow-neu-outset rounded-2xl p-6 border border-border',
      usageCount: 25,
      usedIn: ['Admin Leads Page (Filters)', 'Component Library (This Page)'],
      example: (
        <div className="bg-surface shadow-neu-outset rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-bold text-foreground mb-2">Inline Card</h3>
          <p className="text-muted-foreground">Uses direct utility classes for maximum control.</p>
        </div>
      ),
    },
    {
      name: 'Detail Card',
      description: 'Card optimized for displaying labeled data fields',
      className: 'detail-card p-6 space-y-4',
      usageCount: 17,
      usedIn: ['Lead Details Page', 'Profile Pages', 'Quote Data Display'],
      example: (
        <div className="detail-card p-6 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Property Type</h4>
            <p className="text-base font-medium text-foreground">Residential</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Energy Bill</h4>
            <p className="text-base font-medium text-foreground">£250/month</p>
          </div>
        </div>
      ),
    },
  ];

  // BADGES CATEGORY
  const badgesPatterns: ComponentPattern[] = [
    {
      name: 'Success Badge (/10 opacity)',
      description: 'Status badge with 10% background opacity and solid text',
      className: 'bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-sm font-medium',
      usageCount: 45,
      usedIn: ['Admin Leads (Phone Verified Badge)', 'Lead Cards', 'Status Indicators'],
      example: (
        <span className="bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-sm font-medium">
          Verified
        </span>
      ),
    },
    {
      name: 'Error Badge (/10 opacity)',
      description: 'Error/rejection badge with 10% background opacity',
      className: 'bg-error/10 text-error border border-error/20 px-3 py-1 rounded-full text-sm font-medium',
      usageCount: 30,
      usedIn: ['Admin Leads (Rejected Status)', 'Error States', 'Validation Feedback'],
      example: (
        <span className="bg-error/10 text-error border border-error/20 px-3 py-1 rounded-full text-sm font-medium">
          Rejected
        </span>
      ),
    },
    {
      name: 'Warning Badge (/10 opacity)',
      description: 'Warning/pending badge with 10% background opacity',
      className: 'bg-warning/10 text-warning border border-warning/20 px-3 py-1 rounded-full text-sm font-medium',
      usageCount: 28,
      usedIn: ['Admin Leads (Pending Status)', 'Alerts', 'Action Required Indicators'],
      example: (
        <span className="bg-warning/10 text-warning border border-warning/20 px-3 py-1 rounded-full text-sm font-medium">
          Pending
        </span>
      ),
    },
    {
      name: 'Info Badge (/10 opacity)',
      description: 'Info badge with 10% background opacity',
      className: 'bg-info/10 text-info border border-info/20 px-3 py-1 rounded-full text-sm font-medium',
      usageCount: 18,
      usedIn: ['Admin Leads (Info Status)', 'Tooltips', 'Help Indicators'],
      example: (
        <span className="bg-info/10 text-info border border-info/20 px-3 py-1 rounded-full text-sm font-medium">
          Info
        </span>
      ),
    },
    {
      name: 'Solid Success Badge',
      description: 'Full background success badge (used in Admin Leads table)',
      className: 'bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium',
      usageCount: 12,
      usedIn: ['Admin Leads Page (getStatusColor function)'],
      example: (
        <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
          Approved
        </span>
      ),
    },
  ];

  // TYPOGRAPHY CATEGORY
  const typographyPatterns: ComponentPattern[] = [
    {
      name: 'Primary Text',
      description: 'Main content text using text-foreground',
      className: 'text-foreground',
      usageCount: 178,
      usedIn: ['All pages', 'Headings', 'Body content', 'Primary labels'],
      example: (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Page Heading</h1>
          <p className="text-base text-foreground">Primary content text uses text-foreground for optimal theme adaptation.</p>
        </div>
      ),
    },
    {
      name: 'Secondary Text (Muted)',
      description: 'Secondary content using text-muted-foreground',
      className: 'text-muted-foreground',
      usageCount: 189,
      usedIn: ['Descriptions', 'Subtitles', 'Secondary labels', 'Form labels'],
      example: (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Section Title</h2>
          <p className="text-base text-muted-foreground">Secondary descriptive text uses text-muted-foreground for hierarchy.</p>
        </div>
      ),
    },
  ];

  // SHADOWS CATEGORY
  const shadowsPatterns: ComponentPattern[] = [
    {
      name: 'Neumorphic Outset (Raised)',
      description: 'Raised neumorphic shadow for elevated elements (cards, modals)',
      className: 'shadow-neu-outset',
      usageCount: 83,
      usedIn: ['Cards (.theme-card)', 'Modals', 'Primary Buttons', 'Elevated Surfaces'],
      example: (
        <div className="bg-surface shadow-neu-outset rounded-2xl p-6 w-48 text-center">
          <p className="text-foreground font-medium">Raised Surface</p>
          <p className="text-muted-foreground text-sm mt-2">shadow-neu-outset</p>
        </div>
      ),
    },
    {
      name: 'Neumorphic Inset (Pressed)',
      description: 'Inset neumorphic shadow for pressed elements (inputs, secondary buttons)',
      className: 'shadow-neu-inset',
      usageCount: 40,
      usedIn: ['Form Inputs (.form-input)', 'Form Selects (.form-select)', 'Secondary Buttons', 'Search Fields'],
      example: (
        <div className="bg-surface shadow-neu-inset rounded-2xl p-6 w-48 text-center">
          <p className="text-foreground font-medium">Pressed Surface</p>
          <p className="text-muted-foreground text-sm mt-2">shadow-neu-inset</p>
        </div>
      ),
    },
  ];

  // Get patterns for active category
  const getActivePatterns = (): ComponentPattern[] => {
    switch (activeCategory) {
      case 'forms':
        return formsPatterns;
      case 'buttons':
        return buttonsPatterns;
      case 'cards':
        return cardsPatterns;
      case 'badges':
        return badgesPatterns;
      case 'typography':
        return typographyPatterns;
      case 'shadows':
        return shadowsPatterns;
      default:
        return [];
    }
  };

  const filteredPatterns = getActivePatterns().filter(
    (pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Component Library</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference of all neumorphic components used across the site with exact class names
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-surface shadow-neu-outset rounded-2xl p-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components, descriptions, or class names..."
          className="form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground"
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-surface shadow-neu-outset rounded-2xl p-2 mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-neu-outset'
                  : 'bg-surface text-foreground shadow-neu-inset hover:shadow-neu-outset'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component Patterns List */}
      <div className="space-y-6">
        {filteredPatterns.length === 0 ? (
          <div className="bg-surface shadow-neu-outset rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No components found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredPatterns.map((pattern, index) => (
            <div key={index} className="bg-surface shadow-neu-outset rounded-2xl p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">{pattern.name}</h3>
                  <span className="bg-background px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                    Used {pattern.usageCount}× times
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              </div>

              {/* Live Preview */}
              <div className="bg-background rounded-xl p-6 mb-4 border border-border">
                <div className="flex items-center justify-center min-h-[100px]">{pattern.example}</div>
              </div>

              {/* Class Name */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Class Name:</h4>
                <div className="bg-background rounded-lg p-4 border border-border overflow-x-auto">
                  <code className="text-sm text-foreground font-mono">{pattern.className}</code>
                </div>
              </div>

              {/* Used In */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Used In:</h4>
                <div className="flex flex-wrap gap-2">
                  {pattern.usedIn.map((location, i) => (
                    <span key={i} className="bg-background text-foreground text-xs px-3 py-1 rounded-full border border-border">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-surface shadow-neu-outset rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Category Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{formsPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Forms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{buttonsPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Buttons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{cardsPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Cards</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{badgesPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Badges</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{typographyPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Typography</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{shadowsPatterns.length}</p>
            <p className="text-sm text-muted-foreground">Shadows</p>
          </div>
        </div>
      </div>
    </div>
  );
}
