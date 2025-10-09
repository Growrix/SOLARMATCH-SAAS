


import React from 'react';

// --- Icon Components ---
const Sun = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const Facebook = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Twitter = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
const Instagram = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Linkedin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
// FIX: Update icon components to accept className prop to fix type error.
const Mail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const Phone: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-7-9-7a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const Building = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;

interface FooterProps {
    onBecomePartnerClick: () => void;
    onPartnerSignInClick: () => void;
    onScrollToQuote: () => void;
    onScrollToRebate: () => void;
    onBlogClick: () => void;
    onGovernmentNewsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBecomePartnerClick, onPartnerSignInClick, onScrollToQuote, onScrollToRebate, onBlogClick, onGovernmentNewsClick }) => {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-800/50 mt-0 animated-section-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-br from-primary to-teal-700 p-2 rounded-lg shadow-lg">
                <Sun />
              </div>
              <span className="text-slate-900 dark:text-white text-xl font-bold">SolarMatch</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Australia&apos;s trusted platform for connecting homeowners with verified solar installers. 
              Get quotes, calculate rebates, and go solar with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-primary transition-colors" aria-label="Facebook"><Facebook /></a>
              <a href="#" className="text-slate-500 hover:text-primary transition-colors" aria-label="Twitter"><Twitter /></a>
              <a href="#" className="text-slate-500 hover:text-primary transition-colors" aria-label="Instagram"><Instagram /></a>
              <a href="#" className="text-slate-500 hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><button onClick={() => alert('How It Works Clicked')} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">How It Works</button></li>
              <li><button onClick={onScrollToRebate} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Rebate Calculator</button></li>
              <li><button onClick={onScrollToQuote} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Get Your Instant Quote</button></li>
              <li><button onClick={onBlogClick} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Blog & News</button></li>
              <li><button onClick={onGovernmentNewsClick} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Government News</button></li>
            </ul>
          </div>

          {/* For Installers */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-6">For Installers</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={onBecomePartnerClick} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-left flex items-center space-x-2"><Building /><span>Become a Partner</span></button>
              </li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Partner Benefits</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Lead Quality</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Support Center</a></li>
              <li><button onClick={onPartnerSignInClick} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Partner Login</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-primary" /><span className="text-slate-600 dark:text-slate-400">1300 SOLAR (76527)</span></div>
              <div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-primary" /><span className="text-slate-600 dark:text-slate-400">hello@solarmatch.com.au</span></div>
              <div className="flex items-start space-x-3"><MapPin className="h-5 w-5 text-primary mt-1" /><span className="text-slate-600 dark:text-slate-400">Level 10, 123 Collins Street<br />Melbourne VIC 3000</span></div>
            </div>
            <div className="theme-card mt-6 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><strong className="text-slate-900 dark:text-white">Operating Hours:</strong></p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Mon - Fri: 8:00 AM - 6:00 PM AEST<br />Sat: 9:00 AM - 4:00 PM AEST</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-slate-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-500">
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Installer Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
            </div>
            <div className="text-sm text-slate-500 text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} SolarMatch Australia. All rights reserved.</p>
              <p className="mt-1">ABN: 12 345 678 901</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;