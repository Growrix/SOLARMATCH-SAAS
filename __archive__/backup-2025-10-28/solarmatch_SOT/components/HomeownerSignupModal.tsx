

import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
const AppleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.2,12.3c0-1.7,1.4-2.9,3.1-2.9c-0.1-1.2-0.8-2.6-2.2-3.4c-1.4-0.9-3-1-3.8-1c-2.9,0-5.1,1.8-6.5,1.8 c-1.4,0-3.6-1.8-5.8-1.7c-2.4,0-4.5,1.3-5.7,3.3C-1,9.8-0.3,13.7,2.1,16.5c1.2,1.4,2.6,3.2,4.6,3.1c1.9,0,2.6-1.2,5.1-1.2 c2.5,0,3.1,1.2,5.1,1.2c2,0.1,3.3-1.6,4.5-3C20.1,15.6,17.2,14.6,17.2,12.3z M13,4.1c1-1.1,1.8-2.6,1.6-4 c-1.4,0.1-3,0.9-4,2.1C9.6,3.4,8.7,5.1,8.9,6.5C10.5,6.5,12,5.2,13,4.1z"/></svg>;

interface HomeownerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

const HomeownerSignupModal: React.FC<HomeownerSignupModalProps> = ({ isOpen, onClose, onSuccess, onSwitchToSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Signing up with:", formData);
    setLoading(false);
    onSuccess();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const baseInputClasses = "w-full bg-white/5 dark:bg-black/20 border border-gray-300/30 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in" onClick={onClose}>
      <div className="theme-card relative w-full max-w-md p-8 max-h-[90vh] overflow-y-auto animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Close"><XIcon /></button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"><UserIcon /></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Your Account</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Get access to your solar savings dashboard.</p>
        </div>
        
        <div className="space-y-4">
          <button className="social-button w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"><GoogleIcon /><span>Continue with Google</span></button>
          <button className="social-button w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"><AppleIcon /><span>Continue with Apple</span></button>
        </div>

        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-700"></div></div><div className="relative flex justify-center text-sm"><span className="px-3 bg-white dark:bg-black text-slate-500 dark:text-slate-400 divider-bg">or</span></div></div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" className={baseInputClasses} required onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email Address" className={baseInputClasses} required onChange={handleInputChange} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className={`${baseInputClasses} pr-12`} required minLength={8} onChange={handleInputChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg">
            {loading ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div><span>Creating Account...</span></div> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center"><p className="text-slate-600 dark:text-slate-400 text-sm">Already have an account? <button onClick={onSwitchToSignIn} className="text-primary font-medium hover:underline">Sign in</button></p></div>
      </div>
    </div>
  );
};

export default HomeownerSignupModal;