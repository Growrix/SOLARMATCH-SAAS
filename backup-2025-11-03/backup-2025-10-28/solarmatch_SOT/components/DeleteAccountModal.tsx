import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;


interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirmDelete }) => {
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    if (!isOpen) {
        setConfirmationText('');
        return;
    };
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDeleteDisabled = confirmationText !== 'DELETE';

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="theme-card relative w-full max-w-lg p-8 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>
        
        <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-500/20">
                <AlertTriangleIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Are you absolutely sure?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                This action <strong className="text-red-500">cannot</strong> be undone. This will permanently delete your account, quote requests, and all associated data.
            </p>

            <div className="text-left mb-6">
                <label htmlFor="delete-confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    To confirm, please type <strong className="text-slate-800 dark:text-slate-100">DELETE</strong> below:
                </label>
                <input
                    id="delete-confirm"
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={onClose} 
                    className="w-full bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirmDelete} 
                    disabled={isDeleteDisabled}
                    className="w-full bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    I understand, delete my account
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;