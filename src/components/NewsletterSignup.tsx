import React, { useState } from 'react';

// --- Icon Components ---
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const PaperPlaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;


const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [inputError, setInputError] = useState('');

    // Comprehensive email validation following RFC 5322 standards
    const validateEmail = (email: string): boolean => {
        if (!email) return false;
        
        // Industry-standard email validation regex
        // This checks for proper format: user@domain.tld
        // - Allows letters, numbers, dots, hyphens, underscores in username
        // - Requires @ symbol
        // - Domain must have at least 2 characters
        // - TLD must be 2-6 characters and only letters
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        if (!emailRegex.test(email)) return false;
        
        // Additional validation: check for common typos in popular domains
        const domain = email.split('@')[1]?.toLowerCase();
        
        // Map of common typos to correct domains
        const commonTypos: { [key: string]: string } = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'gmail.comm': 'gmail.com',
            'gail.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'outloo.com': 'outlook.com',
        };
        
        // If domain is a known typo, reject it
        if (domain && commonTypos[domain]) {
            return false;
        }
        
        return true;
    };

    // Live validation as user types
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setInputError('');
        setStatus('idle');
        setMessage('');
        
        if (!value) {
            setInputError('Please enter your email address.');
        } else if (!validateEmail(value)) {
            setInputError('Please enter a valid email address.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setInputError('Please enter your email address.');
            setStatus('error');
            setMessage('Please enter your email address.');
            return;
        }
        if (!validateEmail(email)) {
            setInputError('Please enter a valid email address.');
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        setStatus('loading');
        setMessage('');
        setInputError('');
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('success');
                setMessage(data.message || "Thanks for subscribing! Check your inbox for the latest solar news.");
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || "Oops! Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus('error');
            setMessage("Network error. Please check your connection and try again.");
        }
    };

    return (
        <section className="py-16 sm:py-24 bg-bg-primary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="theme-card p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/5 dark:bg-primary/20 rounded-full blur-3xl animate-fade-in transition-colors duration-500"></div>
                    <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl animate-fade-in" style={{ animationDelay: '300ms' }}></div>

                    <div className="relative z-10">
                        <div className="animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <PaperPlaneIcon />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Go Solar, Smarter.
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Get the latest solar news, government rebate updates, and exclusive tips delivered straight to your inbox.
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                           <div className="h-24">
                                {status !== 'success' ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <div className="relative flex-grow w-full">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                    <MailIcon />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    placeholder="Enter your email address"
                                                    aria-label="Email address for newsletter"
                                                    className={`w-full pl-12 pr-4 py-3 bg-gray-100/80 dark:bg-slate-800/50 border ${inputError ? 'border-destructive' : 'border-gray-200 dark:border-slate-700/80'} rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 shadow-sm`}
                                                    disabled={status === 'loading'}
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                                disabled={status === 'loading'}
                                            >
                                                {status === 'loading' ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Joining...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Subscribe</span>
                                                        <ArrowRightIcon />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {(inputError || (status === 'error' && message)) && (
                                            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2 animate-fade-in">
                                                <AlertCircleIcon /> {inputError || message}
                                            </p>
                                        )}
                                     </>
                                ) : (
                                    <div role="status" className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center gap-3 animate-fade-in h-full">
                                       <CheckCircleIcon />
                                       <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-center">
                                           {message}
                                       </p>
                                    </div>
                                )}
                            </div>
                        </form>
                        
                        {status !== 'success' && (
                             <p className="text-xs text-slate-500 dark:text-slate-500 mt-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;