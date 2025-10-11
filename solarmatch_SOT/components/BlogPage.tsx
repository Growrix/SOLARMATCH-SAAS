import React, { useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';

// --- Icon Components ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// Mock Data
const allArticles = [
    { title: "2024 Solar Rebate Changes: What Homeowners Need to Know", excerpt: "Understanding the latest updates to government solar incentives and how they affect your savings potential.", author: "Sarah Johnson", date: "March 15, 2024", readTime: "6 min read", category: "Policy Updates", image: "https://images.unsplash.com/photo-1509390636472-a0b5a1985799?q=80&w=800" },
    { title: "Tesla Powerwall vs Competitors: Battery Storage Comparison", excerpt: "An in-depth analysis of the top battery storage systems available in Australia, including costs and performance.", author: "Michael Chen", date: "March 10, 2024", readTime: "8 min read", category: "Technology", image: "https://images.unsplash.com/photo-1629231249110-a1a1c63740e2?q=80&w=800" },
    { title: "Summer Solar Tips: Maximizing Your System's Performance", excerpt: "How to get the most out of your solar panels during Australia's peak sunshine months.", author: "Emma Thompson", date: "March 5, 2024", readTime: "4 min read", category: "Maintenance", image: "https://images.unsplash.com/photo-1545284884-f3c914a2b9ae?q=80&w=800" },
    { title: "Case Study: A Sydney Family's Journey to Energy Independence", excerpt: "Discover how the Smiths cut their electricity bills by 90% with a 10kW solar system and battery storage.", author: "John Doe", date: "Feb 28, 2024", readTime: "7 min read", category: "Case Studies", image: "https://images.unsplash.com/photo-1518709594023-63ab79d72a24?q=80&w=800" },
    { title: "The Rise of Virtual Power Plants (VPPs) in Australia", excerpt: "Learn how you can earn money by connecting your solar battery to a VPP and supporting the grid.", author: "Jane Appleseed", date: "Feb 22, 2024", readTime: "5 min read", category: "Technology", image: "https://images.unsplash.com/photo-1630691742469-32a106a7afd5?q=80&w=800" },
    { title: "Choosing the Right Solar Inverter for Your Home", excerpt: "A comprehensive guide to string inverters, microinverters, and hybrid inverters. Which one is best for you?", author: "David Lee", date: "Feb 15, 2024", readTime: "9 min read", category: "Technology", image: "https://images.unsplash.com/photo-1627993093952-721d20e7e231?q=80&w=800" },
    { title: "Understanding Your Electricity Bill: A Homeowner's Guide", excerpt: "Demystifying tariffs, usage charges, and fixed costs to help you see exactly where your solar savings come from.", author: "Sarah Johnson", date: "Feb 10, 2024", readTime: "5 min read", category: "Guides", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800" },
    { title: "Are Solar Panels Worth It in 2024? A Cost-Benefit Analysis", excerpt: "With changing rebates and technology, we break down the numbers to see if a solar investment still makes sense.", author: "Michael Chen", date: "Feb 1, 2024", readTime: "10 min read", category: "Finance", image: "https://images.unsplash.com/photo-1624391673245-56c45999b550?q=80&w=800" },
    { title: "DIY vs. Professional Solar Panel Cleaning: Which is Better?", excerpt: "We weigh the pros and cons of cleaning your own solar panels versus hiring a professional service.", author: "Emma Thompson", date: "Jan 25, 2024", readTime: "4 min read", category: "Maintenance", image: "https://images.unsplash.com/photo-1609156847114-1e5c1b61c741?q=80&w=800" },
];
const categories = ['All', ...Array.from(new Set(allArticles.map(a => a.category)))];
const ARTICLES_PER_PAGE = 6;

const ArticleCard = ({ article, onNavigateToPost }) => (
    <article 
        onClick={() => onNavigateToPost(article)}
        className="theme-card overflow-hidden group flex flex-col cursor-pointer h-full"
        role="button"
        tabIndex={0}
        aria-label={`Read article: ${article.title}`}
        onKeyPress={(e) => e.key === 'Enter' && onNavigateToPost(article)}
    >
        <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{article.category}</span>
                <span className="text-xs text-slate-500 dark:text-slate-500">{article.readTime}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors flex-grow">
                {article.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500 mt-auto pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center space-x-2"><UserIcon /><span>{article.author}</span></div>
                <div className="flex items-center space-x-2"><CalendarIcon /><span>{article.date}</span></div>
            </div>
            <div className="text-primary group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors inline-flex items-center space-x-2 font-semibold mt-4">
                <span>Read Article</span><ArrowRightIcon />
            </div>
        </div>
    </article>
);

const BlogPage = (props) => {
    const { onNavigateToPost, isHeaderVisible } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

    const filteredArticles = useMemo(() => {
        return allArticles
            .filter(article => selectedCategory === 'All' || article.category === selectedCategory)
            .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen flex flex-col blog-page-bg animate-fade-in">
            <div className={`sticky top-0 z-30 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Header {...props} />
            </div>
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-16 sm:py-24 bg-gray-100/50 dark:bg-black/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">The SolarMatch Blog</h1>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">Your definitive guide to solar energy, rebates, and technology in Australia.</p>
                    </div>
                </section>
                
                {/* Filter and Search Section */}
                <section className={`sticky top-0 z-20 py-4 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <div className="relative w-full sm:max-w-md">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon /></div>
                                <input type="search" placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800 border-transparent rounded-lg pl-10 pr-4 py-2 focus:ring-primary focus:border-primary text-sm" />
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
                
                {/* Articles Grid */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.slice(0, visibleCount).map((article, index) => (
                                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <ArticleCard article={article} onNavigateToPost={onNavigateToPost} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">No Articles Found</h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filter.</p>
                            </div>
                        )}

                        {visibleCount < filteredArticles.length && (
                             <div className="text-center mt-16">
                                <button onClick={() => setVisibleCount(c => c + ARTICLES_PER_PAGE)} className="bg-primary text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg">
                                    Load More Articles
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

export default BlogPage;