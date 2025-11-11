import React, { useState } from 'react';

// --- Icon Components ---
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const PaperPlaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;


const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setStatus('error');
            setMessage('Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Randomly succeed or fail for demo
        if (email.includes("fail")) {
            setStatus('error');
            setMessage("Oops! Something went wrong. Please try again.");
        } else {
            setStatus('success');
            setMessage("Thanks for subscribing! Check your inbox for the latest solar news.");
            setEmail('');
        }
    };

    return (
        <section className="newsletter-section py-16 sm:py-24 animated-section-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="theme-card p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/5 dark:bg-primary/20 rounded-full blur-3xl animate-fade-in transition-all duration-500"></div>
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
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    aria-label="Email address for newsletter"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-100/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
                                                    disabled={status === 'loading'}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
                                        {status === 'error' && (
                                            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2 animate-fade-in">
                                                <AlertCircleIcon /> {message}
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