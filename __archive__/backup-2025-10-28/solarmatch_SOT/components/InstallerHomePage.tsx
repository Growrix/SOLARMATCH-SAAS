
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

type Theme = 'light' | 'dark' | 'system';

interface InstallerHomePageProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onLogoutClick: () => void;
    onHomeClick: () => void;
    onDashboardClick: () => void;
    onHomeownerDashboardClick: () => void;
    onInstallerDashboardClick: () => void;
    onInstallerHomeClick: () => void;
    onAdminDashboardClick: () => void;
    isHeaderVisible: boolean;
}

const InfoCard: React.FC<{ icon: string; title: string; delay: string; children: React.ReactNode }> = ({ icon, title, delay, children }) => (
    <div className="animate-fade-in-up h-full" style={{ animationDelay: delay }}>
        <div className="theme-card h-full p-6 text-left">
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{children}</p>
        </div>
    </div>
);

const InstallerHomePage: React.FC<InstallerHomePageProps> = ({
    theme,
    setTheme,
    onLogoutClick,
    onHomeClick,
    onDashboardClick,
    onHomeownerDashboardClick,
    onInstallerDashboardClick,
    onInstallerHomeClick,
    onAdminDashboardClick,
    isHeaderVisible
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-slate-900 dark:text-slate-200">
      <div className={`sticky top-0 z-30 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Header
          theme={theme}
          setTheme={setTheme}
          isLoggedIn={true}
          onLoginClick={() => {}}
          onSignupClick={() => {}}
          onLogoutClick={onLogoutClick}
          onHomeClick={onHomeClick}
          onDashboardClick={onDashboardClick}
          onHomeownerDashboardClick={onHomeownerDashboardClick}
          onInstallerDashboardClick={onInstallerDashboardClick}
          onInstallerHomeClick={onInstallerHomeClick}
          onAdminDashboardClick={onAdminDashboardClick}
        />
      </div>
      <main className="flex-grow">
        <section className="hero-section relative dark:bg-black flex items-center justify-center min-h-[70vh] sm:min-h-[calc(100vh-80px)] overflow-hidden pt-8 sm:pt-24 pb-12 sm:pb-0">
            {/* Gradient Overlay */}
            <div className="gradient-overlay absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent dark:from-slate-900 dark:via-black dark:to-black"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 hidden md:block">
                {/* Floating Geometric Shapes */}
                <div className="absolute top-20 left-10 w-16 h-16 border border-primary/20" style={{ animation: 'float-slow 8s ease-in-out infinite' }}></div>
                <div className="absolute top-40 right-20 w-8 h-8 bg-primary/10 rounded-full" style={{ animation: 'float-medium 6s ease-in-out infinite' }}></div>
                <div className="absolute bottom-40 left-20 w-12 h-12 border-2 border-slate-500/20 rounded-full" style={{ animation: 'float-fast 4s ease-in-out infinite' }}></div>
                <div className="absolute top-60 left-1/3 w-6 h-6 bg-primary/15 transform rotate-45" style={{ animation: 'float-slow 8s ease-in-out infinite 1s' }}></div>
                <div className="absolute bottom-60 right-1/3 w-10 h-10 border border-slate-300 dark:border-slate-700" style={{ animation: 'float-medium 6s ease-in-out infinite 1s' }}></div>
                
                {/* Pulsating Sun Element */}
                <div className="absolute top-32 right-32">
                <div className="w-24 h-24 bg-primary rounded-full relative" style={{ animation: 'pulse-sun 3s ease-in-out infinite' }}>
                    {/* Sun Rays */}
                    <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="ray" style={{ transform: `rotate(${i * 45}deg)` }}>
                        <div style={{ animation: `ray-glow 2s ease-in-out infinite ${i * 0.25}s` }}></div>
                        </div>
                    ))}
                    </div>
                    
                    {/* Energy Particles */}
                    <div>
                    <div className="particle" style={{ animation: 'particle-flow-1 4s linear infinite' }}></div>
                    <div className="particle" style={{ animation: 'particle-flow-2 4s linear infinite 0.8s' }}></div>
                    <div className="particle" style={{ animation: 'particle-flow-3 4s linear infinite 1.6s' }}></div>
                    <div className="particle" style={{ animation: 'particle-flow-4 4s linear infinite 2.4s' }}></div>
                    <div className="particle" style={{ animation: 'particle-flow-5 4s linear infinite 3.2s' }}></div>
                    </div>
                </div>
                </div>
                
                {/* Solar Panels */}
                <div className="absolute bottom-20 left-20">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative w-16 h-10 m-1 inline-block" style={{ animation: `panel-track 6s ease-in-out infinite ${i * 0.5}s` }}>
                    <div className="panel-surface w-full h-full bg-slate-200 dark:bg-slate-800 border border-primary/20 rounded relative">
                        <div className="panel-glow" style={{ animation: `panel-glow-anim 4s ease-in-out infinite ${i * 0.3}s` }}></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">
                        Grow Smarter.
                        <span className="text-primary"> Not Harder.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                        From lead capture to compliance, future-proof your solar business with tools built for Australian installers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-primary text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg">
                            Try It Free
                        </button>
                        <button className="bg-transparent border-2 border-slate-800 dark:border-white text-slate-800 dark:text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-slate-800 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-lg">
                            Watch Installer Stories
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="installer-how-it-works-section">
            <div className="animated-grid-background"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        How SolarMatch Works for You
                     </h2>
                     <p className="text-lg text-slate-600 dark:text-slate-400">
                        A simple, powerful platform designed to connect you with quality leads and streamline your workflow.
                     </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <InfoCard icon="📊" title="Smarter Leads" delay="0.2s">Stop chasing cold calls, get verified homeowner leads.</InfoCard>
                    <InfoCard icon="📑" title="Compliance Made Easy" delay="0.4s">Always up to date with rebates & CEC standards.</InfoCard>
                    <InfoCard icon="🔗" title="Seamless Integration" delay="0.6s">CRM, finance, and job management in one place.</InfoCard>
                </div>
            </div>
        </section>
      </main>
      <Footer 
        onBecomePartnerClick={onDashboardClick}
        onPartnerSignInClick={onDashboardClick}
        onScrollToQuote={() => {}}
        onScrollToRebate={() => {}}
        onBlogClick={() => {}}
        onGovernmentNewsClick={() => {}}
      />
    </div>
  );
};

export default InstallerHomePage;
