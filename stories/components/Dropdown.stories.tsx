import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta = {
  title: 'Components/Dropdown',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dropdown component demonstrating Level 3 elevation (shadow-dropdown)
 * Positioned above cards but below modals in the elevation hierarchy
 */
export const BasicDropdown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Dropdown Component</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Dropdowns use <code className="bg-muted px-2 py-1 rounded">shadow-dropdown</code> token (Level 3 elevation) to appear above cards but below modals.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-3 mb-4">Basic Dropdown</h3>
          <div className="relative inline-block">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
            >
              Select Option ▼
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[200px] z-50">
                <div className="p-2">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                  >
                    Option 1
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                  >
                    Option 2
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                  >
                    Option 3
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-error hover:text-white text-body transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Elevation:</strong> Level 3 (above cards, below modals)</p>
            <p><strong>Shadow Token:</strong> <code>shadow-dropdown</code></p>
            <p><strong>Z-index:</strong> 50</p>
            <p className="mt-2"><strong>Use for:</strong> Context menus, select dropdowns, action menus</p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Multi-select dropdown with checkboxes
 */
export const MultiSelectDropdown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(['react']);

    const toggleOption = (option: string) => {
      setSelected(prev => 
        prev.includes(option) 
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    };

    const options = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ];

    return (
      <div className="space-y-8 max-w-4xl">
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-3 mb-4">Multi-Select Dropdown</h3>
          <div className="relative inline-block">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="bg-surface border-2 border-border px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors min-w-[200px] text-left"
            >
              <span className="text-body">
                {selected.length === 0 ? 'Select frameworks' : `${selected.length} selected`}
              </span>
              <span className="float-right">▼</span>
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[200px] z-50">
                <div className="p-2">
                  {options.map(option => (
                    <label 
                      key={option.value}
                      className="flex items-center px-3 py-2 rounded hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        onChange={() => toggleOption(option.value)}
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-body">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-body-small text-muted">
            Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Right-aligned dropdown (for user menus, profile dropdowns)
 */
export const RightAlignedDropdown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-8 max-w-4xl">
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-3 mb-4">Right-Aligned Dropdown (User Menu)</h3>
          <div className="flex justify-end">
            <div className="relative inline-block">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-button hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-body-small font-semibold">
                  JD
                </div>
                <span className="text-body">John Doe</span>
                <span className="text-body-small">▼</span>
              </button>
              
              {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[220px] z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-body font-semibold">John Doe</p>
                      <p className="text-body-small text-muted">john@example.com</p>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors mt-2"
                    >
                      👤 Profile
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                    >
                      ⚙️ Settings
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                    >
                      💳 Billing
                    </button>
                    <div className="border-t border-border my-2"></div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-error hover:text-white text-body transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Dropdown with search
 */
export const SearchableDropdown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const allOptions = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia'
    ];

    const filteredOptions = allOptions.filter(option => 
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8 max-w-4xl">
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-3 mb-4">Searchable Dropdown</h3>
          <div className="relative inline-block">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="bg-surface border-2 border-border px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors min-w-[250px] text-left"
            >
              <span className="text-body">Select state</span>
              <span className="float-right">▼</span>
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[250px] z-50">
                <div className="p-2">
                  <input 
                    type="text"
                    placeholder="Search states..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded mb-2 text-body focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(option => (
                        <button 
                          key={option}
                          onClick={() => {
                            setSearchQuery('');
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors"
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-body-small text-muted">No results found</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * All dropdown states in Light/Dark themes
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Dropdown States</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Comprehensive demonstration of dropdown states and shadow behavior across themes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Closed state */}
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-4 mb-4">Closed State</h3>
          <button className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button">
            Dropdown Trigger
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button on trigger</p>
        </div>

        {/* Open state */}
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-4 mb-4">Open State</h3>
          <div className="relative inline-block">
            <button className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button">
              Dropdown Trigger
            </button>
            <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[180px] z-50">
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors">
                  Item 1
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors">
                  Item 2
                </button>
              </div>
            </div>
          </div>
          <p className="text-body-small text-muted mt-20">shadow-dropdown on menu</p>
        </div>

        {/* Hover state */}
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-4 mb-4">Hover State</h3>
          <div className="relative inline-block">
            <button className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow">
              Hover Me
            </button>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-button → shadow-card on hover</p>
        </div>

        {/* Focus state */}
        <div className="bg-surface border border-border rounded-lg p-card-padding">
          <h3 className="font-heading-4 mb-4">Focus State</h3>
          <button className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Focus Me
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button + focus ring</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-warning-light rounded text-body-small text-warning-dark">
        <p><strong>Theme Switching:</strong> Use the theme toolbar above to see how shadows adapt to Light/Dark themes automatically.</p>
        <p className="mt-2"><strong>Light Theme:</strong> Darker shadows (rgba(0,0,0,...))</p>
        <p><strong>Dark Theme:</strong> Lighter/stronger shadows for visibility on dark backgrounds</p>
      </div>
    </div>
  ),
};

/**
 * Elevation comparison: Dropdown vs Card
 */
export const ElevationComparison: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Elevation Hierarchy</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Dropdowns (Level 3) sit above cards (Level 2) in the elevation system.
          </p>
        </div>

        <div className="relative bg-background border border-border rounded-lg p-12 min-h-[400px]">
          {/* Card - Level 2 */}
          <div className="bg-surface rounded-lg shadow-card p-card-padding max-w-md">
            <h4 className="font-heading-4 mb-2">Card Component</h4>
            <p className="text-body text-foreground-secondary mb-4">
              This card uses shadow-card (Level 2 elevation) to sit slightly above the page surface.
            </p>
            <div className="relative inline-block">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button"
              >
                Toggle Dropdown
              </button>
              
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[200px] z-50">
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors">
                      Dropdown Option 1
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-primary hover:text-white text-body transition-colors">
                      Dropdown Option 2
                    </button>
                  </div>
                  <div className="px-3 py-2 border-t border-border">
                    <p className="text-body-small text-info">shadow-dropdown (Level 3)</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-body-small text-muted mt-4">shadow-card (Level 2)</p>
          </div>

          <div className="mt-8 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Visual Hierarchy:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Card (Level 2): shadow-card | z-index: 10</li>
              <li>Dropdown (Level 3): shadow-dropdown | z-index: 50</li>
              <li>Notice: Dropdown appears clearly above the card</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};
