import React, { useState } from 'react';
import type { QuoteRequest } from '../types';
import { getAIQuoteAnalysis, AIQuoteAnalysis } from '../services/geminiService';

// --- Icon Components ---
const SparklesIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3L9.5 9.5L3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7z"/><path d="M12 18h.01"/></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;

interface AIInsightsProps {
  quoteRequests: QuoteRequest[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ quoteRequests }) => {
    const [insights, setInsights] = useState<AIQuoteAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);

        try {
            const result = await getAIQuoteAnalysis(quoteRequests);
            setInsights(result);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (quoteRequests.length === 0) {
        return (
            <div className="theme-card text-center p-8">
                <h2 className="text-xl font-bold mb-2">Unlock AI Insights</h2>
                <p className="text-slate-500 dark:text-slate-400">You don't have any quote requests yet. Create a request to get personalized AI analysis on your solar potential.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="theme-card text-center p-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold mb-2">Generating Your Insights...</h2>
                <p className="text-slate-500 dark:text-slate-400">Our AI is analyzing your quotes to find the best solar solution for you.</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 text-center">
                <AlertCircleIcon />
                <h3 className="font-bold text-red-500 dark:text-red-400 mt-2">Analysis Failed</h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                 <button onClick={handleGenerateInsights} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
                    Try Again
                </button>
            </div>
        );
    }
    
    if (insights) {
        return (
            <div className="animate-fade-in space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Your AI-Powered Solar Analysis</h1>
                
                {/* Summary Card */}
                <div className="theme-card p-6">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><SparklesIcon className="text-primary" /> AI Summary</h2>
                    <p className="text-slate-600 dark:text-slate-300">{insights.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Optimal System Card */}
                    <div className="theme-card p-6">
                         <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ZapIcon /> Optimal System</h2>
                         <div className="flex justify-around text-center bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <div>
                                <p className="text-3xl font-bold text-primary">{insights.optimalSystem.panelSizeKW}kW</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Solar Panels</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">{insights.optimalSystem.batterySizeKWH}kWh</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Battery</p>
                            </div>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg"><strong>Reasoning:</strong> {insights.optimalSystem.reasoning}</p>
                    </div>

                    {/* Savings Tips Card */}
                    <div className="theme-card p-6">
                         <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LightbulbIcon /> Top Savings Tips</h2>
                         <ul className="space-y-3">
                            {insights.savingsInsights.map((tip, index) => (
                                <li key={index} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{tip.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{tip.tip}</p>
                                </li>
                            ))}
                         </ul>
                    </div>
                </div>

                {/* Installer Recommendations Card */}
                <div className="theme-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><WrenchIcon /> AI-Suggested Installers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights.installerRecommendations.map((rec, index) => (
                             <div key={index} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                                <h4 className="font-bold text-slate-900 dark:text-white">{rec.name}</h4>
                                <p className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block my-1">{rec.specialty}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{rec.reason}</p>
                             </div>
                        ))}
                    </div>
                </div>
                 <div className="text-center pt-4">
                    <button onClick={handleGenerateInsights} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
                        Re-generate Insights
                    </button>
                </div>
            </div>
        );
    }
    
    // Initial state: show button to generate
    return (
        <div className="theme-card text-center p-12">
            <SparklesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Unlock Your Personalized AI Solar Analysis</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto">Let our AI analyze your quote requests to provide tailored recommendations on system size, potential savings, and top local installers.</p>
            <button onClick={handleGenerateInsights} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto shadow-lg">
                <SparklesIcon />
                <span>Generate My Insights</span>
            </button>
        </div>
    );
}

export default AIInsights;
