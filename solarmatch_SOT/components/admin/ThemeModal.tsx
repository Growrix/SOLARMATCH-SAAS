
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const MonitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const MoreVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 0-4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;

// --- Types ---
type GlobalMode = 'light' | 'dark' | 'system';
interface ColorToken { name: string; label: string; value: string; }
interface Palette {
    id: string;
    name: string;
    isSystem?: boolean;
    description?: string;
    tags?: string[];
    logo?: string | null;
    tokens: {
        light: ColorToken[];
        dark: ColorToken[];
    };
}

// --- Mock Data ---
const DEFAULT_TOKENS_STRUCTURE: Omit<ColorToken, 'value'>[] = [
    { name: '--color-primary', label: 'Primary' },
    { name: '--color-on-primary', label: 'On Primary' },
    { name: '--color-secondary', label: 'Secondary' },
    { name: '--color-on-secondary', label: 'On Secondary' },
    { name: '--color-bg', label: 'Background' },
    { name: '--color-surface', label: 'Surface' },
    { name: '--color-muted', label: 'Muted' },
];

const MOCK_PALETTES: Palette[] = [
    { id: '1', name: 'SolarMatch Green', isSystem: true, description: 'The default system theme.', tags:['Default', 'Green'], logo: null, tokens: {
        light: [
            { name: '--color-primary', label: 'Primary', value: '#0D9488' },
            { name: '--color-on-primary', label: 'On Primary', value: '#FFFFFF' },
            { name: '--color-secondary', label: 'Secondary', value: '#FACC15' },
            { name: '--color-on-secondary', label: 'On Secondary', value: '#1E293B' },
            { name: '--color-bg', label: 'Background', value: '#F1F5F9' },
            { name: '--color-surface', label: 'Surface', value: '#FFFFFF' },
            { name: '--color-muted', label: 'Muted', value: '#64748B' },
        ],
        dark: [
            { name: '--color-primary', label: 'Primary', value: '#0D9488' },
            { name: '--color-on-primary', label: 'On Primary', value: '#FFFFFF' },
            { name: '--color-secondary', label: 'Secondary', value: '#FACC15' },
            { name: '--color-on-secondary', label: 'On Secondary', value: '#1E293B' },
            { name: '--color-bg', label: 'Background', value: '#020617' },
            { name: '--color-surface', label: 'Surface', value: '#0F172A' },
            { name: '--color-muted', label: 'Muted', value: '#94A3B8' },
        ]
    }},
    { id: '2', name: 'Ocean Blue', isSystem: false, description: 'A calming blue theme.', tags:['Blue', 'Corporate'], logo: null, tokens: {
        light: [
            { name: '--color-primary', label: 'Primary', value: '#2563EB' },
            { name: '--color-on-primary', label: 'On Primary', value: '#FFFFFF' },
            { name: '--color-secondary', label: 'Secondary', value: '#EA580C' },
            { name: '--color-on-secondary', label: 'On Secondary', value: '#FFFFFF' },
            { name: '--color-bg', label: 'Background', value: '#F0F9FF' },
            { name: '--color-surface', label: 'Surface', value: '#FFFFFF' },
            { name: '--color-muted', label: 'Muted', value: '#6B7280' },
        ],
        dark: [
            { name: '--color-primary', label: 'Primary', value: '#3B82F6' },
            { name: '--color-on-primary', label: 'On Primary', value: '#FFFFFF' },
            { name: '--color-secondary', label: 'Secondary', value: '#F97316' },
            { name: '--color-on-secondary', label: 'On Secondary', value: '#FFFFFF' },
            { name: '--color-bg', label: 'Background', value: '#0B1120' },
            { name: '--color-surface', label: 'Surface', value: '#1E293B' },
            { name: '--color-muted', label: 'Muted', value: '#9CA3AF' },
        ]
    }},
];

// --- Main Modal Component ---
interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
    const [palettes, setPalettes] = useState<Palette[]>(MOCK_PALETTES);
    const [activePaletteId, setActivePaletteId] = useState<string>('1');
    const [previewPalette, setPreviewPalette] = useState<Palette | null>(null);
    const [globalMode, setGlobalMode] = useState<GlobalMode>('system');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPalette, setEditingPalette] = useState<Palette | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditorOpen) {
                    setIsEditorOpen(false);
                } else {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            const firstFocusableElement = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
            firstFocusableElement?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, isEditorOpen]);

    if (!isOpen) return null;
    
    return (
        <div ref={modalRef} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-8 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="theme-modal-title">
            <div className="flex-shrink-0 flex items-center justify-between mb-6">
                <div>
                    <h2 id="theme-modal-title" className="text-2xl font-bold text-white">Theme & Branding</h2>
                    <p className="text-slate-400">Manage your site's appearance</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Close theme settings"><XIcon /></button>
            </div>
            
            <div className="flex-grow bg-white dark:bg-slate-900 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                         <div className="relative w-full sm:max-w-xs">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon /></div>
                            <input type="search" placeholder="Search palettes..." className="w-full bg-gray-100 dark:bg-slate-800 border-transparent rounded-lg pl-10 pr-4 py-2 focus:ring-primary focus:border-primary text-sm" />
                        </div>
                        <button onClick={() => {}} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm w-full sm:w-auto">
                            Create New Palette
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
                     {/* Global Mode Settings */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Global Color Mode</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set the default color mode for all users. 'System' will respect the user's OS preference.</p>
                         <div className="flex items-center p-1 rounded-full bg-gray-200 dark:bg-slate-900/50 max-w-sm">
                            {(['light', 'dark', 'system'] as GlobalMode[]).map(mode => (
                                <button key={mode} onClick={() => setGlobalMode(mode)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-slate-900 focus:ring-primary ${ globalMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}>
                                    {mode === 'light' && <SunIcon />}
                                    {mode === 'dark' && <MoonIcon />}
                                    {mode === 'system' && <MonitorIcon />}
                                    <span className="capitalize">{mode}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Available Palettes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {palettes.map(p => (
                            <div key={p.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl border-2 transition-all duration-300 group ${p.id === activePaletteId ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                                            {p.isSystem && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">System Default</span>}
                                        </div>
                                        {p.id === activePaletteId && <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full"><CheckCircleIcon /> Active</div>}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 h-10">{p.description}</p>
                                </div>
                                <div className="p-4 flex items-center gap-2 border-t border-b border-gray-200 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Light</p>
                                    {p.tokens.light.slice(0, 7).map(token => <div key={token.name} className="w-5 h-5 rounded-full border border-black/10" style={{backgroundColor: token.value}} title={token.label}></div>)}
                                </div>
                                <div className="p-4 flex items-center gap-2">
                                     <p className="text-xs font-semibold text-slate-400 uppercase">Dark</p>
                                    {p.tokens.dark.slice(0, 7).map(token => <div key={token.name} className="w-5 h-5 rounded-full border border-white/10" style={{backgroundColor: token.value}} title={token.label}></div>)}
                                </div>
                                <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                    <button onClick={() => setActivePaletteId(p.id)} disabled={p.id === activePaletteId} className="text-sm font-semibold text-primary disabled:text-slate-400 disabled:cursor-not-allowed hover:text-teal-600 transition-colors">Set Active</button>
                                    <div className="relative">
                                        <button className="p-1 rounded-full text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={`Actions for ${p.name}`}><MoreVerticalIcon /></button>
                                        {/* Dropdown menu would go here */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;
