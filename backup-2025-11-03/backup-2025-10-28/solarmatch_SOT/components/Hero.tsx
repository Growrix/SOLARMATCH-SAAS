import React from 'react';

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;

interface HeroProps {
  onInstantQuoteClick: () => void;
  onRebateCalculatorClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onInstantQuoteClick, onRebateCalculatorClick }) => {

  return (
    <section id="hero" className="hero-section dark:bg-black relative overflow-hidden sm:min-h-[calc(100vh-80px)] flex items-center pt-8 sm:pt-24 pb-12 sm:pb-0">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-[34px] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight" style={{ animation: 'fade-in-up 0.8s ease-out' }}>
            Smarter Solar
            <br className="sm:hidden" />
            <span className="text-primary whitespace-nowrap"> Starts Here</span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto" style={{ animation: 'fade-in-up 0.8s ease-out 0.2s both' }}>
            No jargon, no sales — just real numbers, real rebates, and real local installers.
          </p>

          <div className="flex space-x-4 mb-12 max-w-sm mx-auto" style={{ animation: 'fade-in-up 0.8s ease-out 0.4s both' }}>
            <button 
              onClick={onInstantQuoteClick}
              className="bg-primary text-white w-full px-4 py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Instant Quote</span>
              <ArrowRightIcon />
            </button>
            
            <button 
              onClick={onRebateCalculatorClick}
              className="bg-primary/10 border-2 border-primary/20 text-primary hover:bg-primary/20 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
            >
              <CalculatorIcon />
              <span>Rebates</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto">
            <div className="text-center bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-2 sm:p-4 border border-gray-200 dark:border-slate-700/50" style={{ animation: 'fade-in-up 0.8s ease-out 0.6s both' }}>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">2 min</div>
              <div className="text-xs sm:text-base text-slate-600 dark:text-slate-400">Quick Assessment</div>
            </div>
            <div className="text-center bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-2 sm:p-4 border border-gray-200 dark:border-slate-700/50" style={{ animation: 'fade-in-up 0.8s ease-out 0.8s both' }}>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
              <div className="text-xs sm:text-base text-slate-600 dark:text-slate-400">Free Service</div>
            </div>
            <div className="text-center bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-2 sm:p-4 border border-gray-200 dark:border-slate-700/50" style={{ animation: 'fade-in-up 0.8s ease-out 1s both' }}>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">5★</div>
              <div className="text-xs sm:text-base text-slate-600 dark:text-slate-400">Rated Installers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;