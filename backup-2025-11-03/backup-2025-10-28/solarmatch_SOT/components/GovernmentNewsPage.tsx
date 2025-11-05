import React, { useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import type { Post } from '../types';

// --- Icon Components ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

const allGovArticles = [
    { id: '1', title: 'New Solar Rebate Program Announced for 2024', description: 'The Australian government has announced enhanced rebate programs for residential solar installations.', link: '#', pubDate: new Date('2024-03-15').toISOString(), category: 'Government Policy', author: 'Department of Energy' },
    { id: '2', title: 'Battery Storage Incentives Extended Through 2025', description: 'Home battery storage rebates have been extended with increased funding.', link: '#', pubDate: new Date('2024-03-10').toISOString(), category: 'Rebates', author: 'Clean Energy Council' },
    { id: '3', title: 'Solar Feed-in Tariff Updates for NSW and VIC', description: 'New feed-in tariff rates announced for solar energy exported to the grid in key states.', link: '#', pubDate: new Date('2024-03-02').toISOString(), category: 'Policy', author: 'Energy Regulator' },
    { id: '4', title: 'Clean Energy Finance Corporation Invests in Grid-Scale Storage', description: 'A major investment aims to stabilize the grid and support more renewable integration.', link: '#', pubDate: new Date('2024-02-25').toISOString(), category: 'Investment', author: 'CEFC' },
    { id: '5', title: 'Consultation Opens for National Energy Performance Strategy', description: 'The government is seeking feedback on a new strategy to improve energy efficiency across the economy.', link: '#', pubDate: new Date('2024-02-18').toISOString(), category: 'Policy', author: 'Department of Energy' },
    { id: '6', title: 'Small-scale Technology Certificate (STC) Value Update', description: 'An overview of the current STC market price and its impact on upfront solar costs.', link: '#', pubDate: new Date('2024-02-10').toISOString(), category: 'Finance', author: 'Clean Energy Regulator' },
    { id: '7', title: 'Victoria Solar Homes Program Reaches New Milestone', description: 'The popular state-based rebate program celebrates 200,000 installations.', link: '#', pubDate: new Date('2024-01-30').toISOString(), category: 'Rebates', author: 'Solar Victoria' },
    { id: '8', title: 'New Standards for Inverters to Improve Grid Stability', description: 'Updated technical standards for solar inverters will be mandatory from late 2024.', link: '#', pubDate: new Date('2024-01-22').toISOString(), category: 'Standards', author: 'AEMC' },
    { id: '9', title: 'ARENA funds new ultra low-cost solar research', description: 'The Australian Renewable Energy Agency (ARENA) is backing research to bring solar generation costs down.', link: '#', pubDate: new Date('2024-01-15').toISOString(), category: 'Investment', author: 'ARENA' },
];

const categories = ['All', ...Array.from(new Set(allGovArticles.map(a => a.category)))];
const ARTICLES_PER_PAGE = 6;

const GovArticleCard = ({ article }) => (
    <article className="theme-card overflow-hidden group flex flex-col h-full">
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{article.category}</span>
                <span className="text-xs text-slate-500 dark:text-slate-500">{article.author}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug flex-grow">
                {article.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm">{article.description}</p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500 mt-auto pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center space-x-2"><CalendarIcon /><span>{new Date(article.pubDate).toLocaleDateString()}</span></div>
                 <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-primary group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors inline-flex items-center space-x-2 font-semibold">
                    <span>Read More</span><ExternalLink />
                </a>
            </div>
        </div>
    </article>
);


const GovernmentNewsPage = (props) => {
    const { isHeaderVisible } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

    const filteredArticles = useMemo(() => {
        return allGovArticles
            .filter(article => selectedCategory === 'All' || article.category === selectedCategory)
            .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen flex flex-col blog-page-bg animate-fade-in">
             <div className={`sticky top-0 z-30 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Header {...props} />
            </div>
            <main className="flex-grow">
                <section className="py-16 sm:py-24 bg-gray-100/50 dark:bg-black/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Government Solar & Rebate News</h1>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">The latest official updates on incentives, policies, and standards affecting Australian solar owners.</p>
                    </div>
                </section>
                
                <section className={`sticky top-0 z-20 py-4 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <div className="relative w-full sm:max-w-md">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon /></div>
                                <input type="search" placeholder="Search updates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 border-transparent rounded-lg pl-10 pr-4 py-2 focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mb-2">
                                {categories.map(category => (
                                    <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.slice(0, visibleCount).map((article, index) => (
                                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <GovArticleCard article={article} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">No Updates Found</h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filter.</p>
                            </div>
                        )}

                        {visibleCount < filteredArticles.length && (
                             <div className="text-center mt-16">
                                <button onClick={() => setVisibleCount(c => c + ARTICLES_PER_PAGE)} className="bg-primary text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg">
                                    Load More Updates
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer {...props} />
        </div>
    );
};

export default GovernmentNewsPage;
