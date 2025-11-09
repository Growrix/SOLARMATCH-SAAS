/**
 * Safe Migration Script for instant-quotes/page.tsx
 * Migrates all hardcoded colors and dark mode classes to neumorphic semantic tokens
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'instant-quotes', 'page.tsx');

// Read file with UTF-8 encoding
let content = fs.readFileSync(filePath, 'utf-8');

// Count before
const darkBefore = (content.match(/dark:/g) || []).length;
const slateBefore = (content.match(/slate-/g) || []).length;

console.log(`Before: ${darkBefore} dark: prefixes, ${slateBefore} slate colors`);

// Filters Section - Complete neumorphic pattern for all inputs
content = content.replace(
  /<div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">\s*<div className="flex items-center gap-2 mb-3">\s*<FilterIcon \/>\s*<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters<\/h2>/,
  '<div className="bg-surface shadow-neu-outset rounded-xl p-4 border border-border mb-6">\n          <div className="flex items-center gap-2 mb-3">\n            <FilterIcon />\n            <h2 className="text-lg font-semibold text-foreground">Filters</h2>'
);

// Replace filter inputs with complete neumorphic pattern
content = content.replace(
  /className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"/g,
  'className="form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground"'
);

// Replace filter search input with placeholder styling
content = content.replace(
  /className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400"/g,
  'className="form-input w-full rounded-xl bg-surface text-foreground shadow-neu-inset border border-border px-4 py-3 placeholder:text-muted-foreground"'
);

// Replace filter labels
content = content.replace(/text-slate-600 dark:text-slate-400 mb-1/g, 'text-muted-foreground mb-1');

// Error State
content = content.replace(
  /bg-red-50 dark:bg-red-900\/20 border border-red-200 dark:border-red-800/g,
  'bg-surface shadow-neu-outset border border-error'
);
content = content.replace(/text-red-600 dark:text-red-400/g, 'text-error');

// Loading & Empty States
content = content.replace(
  /bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700/g,
  'bg-surface shadow-neu-outset rounded-xl p-12 border border-border'
);

// Table Container
content = content.replace(
  /bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden/g,
  'bg-surface shadow-neu-outset rounded-xl border border-border overflow-hidden'
);

// Table Headers
content = content.replace(/bg-slate-50 dark:bg-slate-900\/50 border-b border-slate-200 dark:border-slate-700/g, 'bg-surface border-b border-border');
content = content.replace(/text-slate-500 dark:text-slate-400 uppercase/g, 'text-muted-foreground uppercase');

// Table Body
content = content.replace(/divide-slate-200 dark:divide-slate-700/g, 'divide-border');
content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-700\/50/g, 'hover:bg-surface/50');
content = content.replace(/text-slate-900 dark:text-white/g, 'text-foreground');
content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-muted-foreground');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-muted-foreground');

// Table Action Buttons
content = content.replace(
  /className="inline-flex items-center px-3 py-1\.5 bg-primary text-white rounded-lg hover:bg-primary\/90 transition-colors text-xs font-medium"/g,
  'className="inline-flex items-center text-xs" variant="secondary"'
);

// Convert inline button to Button component in table
content = content.replace(
  /<button\s+onClick=\{[\s\S]*?openDetailsModal[\s\S]*?\}\s+className="inline-flex[\s\S]*?font-medium">/g,
  (match) => {
    if (match.includes('openDetailsModal')) {
      return '<Button onClick={() => openDetailsModal(quote)} variant="secondary" className="inline-flex items-center text-xs">';
    }
    return match;
  }
);

content = content.replace(/<\/button>(\s*<button\s+onClick[\s\S]*?deleteQuote)/g, '</Button>$1');

content = content.replace(
  /<button\s+onClick=\{[\s\S]*?deleteQuote[\s\S]*?\}\s+className="inline-flex items-center px-3 py-1\.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium">/g,
  '<Button onClick={() => deleteQuote(quote.id)} variant="secondary" className="inline-flex items-center text-xs bg-error text-error-foreground">'
);

content = content.replace(/<\/button>(\s*<\/td>)/g, '</Button>$1');

// Badge colors for quote types
content = content.replace(/bg-blue-100 dark:bg-blue-900\/30 text-blue-800 dark:text-blue-300/g, 'bg-info text-info-foreground');
content = content.replace(/bg-purple-100 dark:bg-purple-900\/30 text-purple-800 dark:text-purple-300/g, 'bg-accent text-accent-foreground');

// Modal
content = content.replace(
  /className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-\[90vh\] overflow-y-auto"/g,
  'className="bg-surface shadow-neu-outset rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border"'
);

content = content.replace(/sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/g, 'sticky top-0 bg-surface border-b border-border');
content = content.replace(/text-slate-400 hover:text-slate-600 dark:hover:text-slate-300/g, 'text-muted-foreground hover:text-foreground');

// Modal sections
content = content.replace(/bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6/g, 'bg-surface shadow-neu-outset rounded-xl border border-border p-6');

// Gradients to surface
content = content.replace(/bg-gradient-to-r from-primary\/10 via-blue-50\/50 to-primary\/10 dark:from-primary\/20 dark:via-blue-900\/20 dark:to-primary\/20/g, 'bg-surface shadow-neu-inset');

// Save with UTF-8
fs.writeFileSync(filePath, content, 'utf-8');

const darkAfter = (content.match(/dark:/g) || []).length;
const slateAfter = (content.match(/slate-/g) || []).length;

console.log(`After: ${darkAfter} dark: prefixes, ${slateAfter} slate colors`);
console.log(`Removed: ${darkBefore - darkAfter} dark: prefixes, ${slateBefore - slateAfter} slate colors`);
