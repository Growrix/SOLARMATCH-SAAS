
'use client'

import React, { useState, useEffect } from 'react'

// --- Icon Components ---
const ExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const ArrowRightLargeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
// FIX: Update icon component to accept className prop to fix type error.
const RefreshCw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v6h-6"/></svg>;
const AlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const Sun = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;

interface GovernmentNewsSectionProps {
  onSeeAllUpdatesClick: () => void;
}

const GovernmentNewsSection: React.FC<GovernmentNewsSectionProps> = ({ onSeeAllUpdatesClick }) => {
  const [articles, setArticles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demo
    const mockArticles = [
      {
        id: '1',
        title: 'New Solar Rebate Program Announced for 2024',
        description: 'The Australian government has announced enhanced rebate programs for residential solar installations.',
        link: '#',
        pubDate: new Date().toISOString(),
        category: 'Government Policy',
        author: 'Department of Energy'
      },
      {
        id: '2',
        title: 'Battery Storage Incentives Extended',
        description: 'Home battery storage rebates have been extended through 2025 with increased funding.',
        link: '#',
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        category: 'Rebates',
        author: 'Clean Energy Council'
      },
      {
        id: '3',
        title: 'Solar Feed-in Tariff Updates',
        description: 'New feed-in tariff rates announced for solar energy exported to the grid.',
        link: '#',
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        category: 'Policy',
        author: 'Energy Regulator'
      }
    ]

    setArticles(mockArticles)
    setLoading(false)
    setLastUpdated(new Date().toISOString())
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => {
      setLoading(false)
      setLastUpdated(new Date().toISOString())
    }, 1000)
  }

  return (
    <section className="government-news-section py-16 sm:py-24 animated-section-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary p-3 rounded-2xl shadow-lg">
              <Sun />
            </div>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Latest Solar & Rebate News - Government Updates
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6">
            Stay informed with the latest updates on solar rebates, renewable energy policies, and government incentives
          </p>
          
          {/* Refresh Button */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="gov-news-refresh-button bg-gray-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* FIX: Changed className from a string literal to a template literal to correctly apply the conditional 'animate-spin' class. */}
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {lastUpdated && (
              <span className="text-sm text-slate-500 dark:text-slate-500">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading latest solar news...</p>
          </div>
        )}

        {/* Error State */}
        {error && articles.length === 0 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-8 flex items-center space-x-3">
            <AlertCircle />
            <div>
              <p className="text-red-400 font-semibold">Unable to load news</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* News Articles Grid - 3 Columns */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="theme-card overflow-hidden group h-full flex flex-col"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Category Badge */}
                  {article.category && (
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  )}

                  {/* Article Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors flex-grow">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline line-clamp-3"
                    >
                      {article.title}
                    </a>
                  </h3>

                  {/* Article Description */}
                  {article.description && (
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm line-clamp-3 flex-grow">
                      {article.description}
                    </p>
                  )}

                  {/* Article Meta */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar />
                        <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString('en-AU', { 
                          month: 'short', 
                          day: 'numeric'
                        }) : 'Recent'}</span>
                      </div>
                      {article.author && (
                        <span className="text-xs truncate max-w-20">{article.author}</span>
                      )}
                    </div>
                    
                    {/* Read More Link */}
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors inline-flex items-center space-x-1 font-semibold text-sm w-full justify-center bg-primary/10 hover:bg-primary/20 py-2 px-3 rounded-lg"
                    >
                      <span>Read Article</span>
                      <ExternalLink />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All News Button */}
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={onSeeAllUpdatesClick}
              className="bg-primary hover:bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center space-x-2 shadow-lg"
            >
              <span>See All Government Updates</span>
              <ArrowRightLargeIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default GovernmentNewsSection;