'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import HomeownerSignInModal from '@/components/HomeownerSignInModal';
import type { Post } from '@/types/blog';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

// Icon Components
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;

export default function BlogPostPage() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { 
      id: 1, 
      author: "Alex R.", 
      avatar: "https://i.pravatar.cc/150?img=1", 
      text: "Great overview! Really helped clarify the new rebate structure. Thanks for breaking it down so clearly.", 
      date: "March 15, 2024" 
    },
    { 
      id: 2, 
      author: "Brenda M.", 
      avatar: "https://i.pravatar.cc/150?img=2", 
      text: "I was on the fence about getting a battery, but this comparison is exactly what I needed. The VPP section was particularly interesting.", 
      date: "March 11, 2024" 
    }
  ]);

  useEffect(() => {
    const storedPost = sessionStorage.getItem('currentBlogPost');
    if (storedPost) {
      setPost(JSON.parse(storedPost));
    } else {
      router.push('/blog');
    }
    
    // Check if user is logged in (you can check localStorage or session)
    const userAuth = localStorage.getItem('homeownerAuth');
    setIsLoggedIn(userAuth === 'true');
  }, [router]);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>;
  }

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    if (isLoggedIn) {
      const newCommentObject: Comment = {
        id: Date.now(),
        author: "You",
        avatar: "https://i.pravatar.cc/150?img=5",
        text: newComment,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
      setComments(prev => [...prev, newCommentObject]);
      setNewComment("");
    } else {
      // Open login modal if not logged in
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(true);
    localStorage.setItem('homeownerAuth', 'true');
  };

  const handleBecomePartner = () => router.push('/installer');
  const handlePartnerSignIn = () => router.push('/installer');
  const handleScrollToQuote = () => router.push('/#calculator-section');
  const handleScrollToRebate = () => router.push('/#calculator-section');
  const handleBlogClick = () => router.push('/blog');
  const handleGovernmentNewsClick = () => console.log('Government news');
  const handleBackToBlog = () => router.push('/blog');

  return (
    <div className="min-h-screen flex flex-col blog-post-page-bg animate-fade-in">
      <main className="flex-grow pb-20 md:pb-0">
        <article>
          {/* Hero Image */}
          <header className="relative h-64 sm:h-80 md:h-96">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </header>
          
          {/* Article Content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Back Button */}
            <button 
              onClick={handleBackToBlog} 
              className="inline-flex items-center text-primary hover:text-teal-700 dark:hover:text-teal-400 font-semibold text-sm mb-8"
            >
              <ArrowLeftIcon />
              Back to All Articles
            </button>
            
            {/* Category */}
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">{post.category}</span>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{post.title}</h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400 mb-8 border-y border-gray-200 dark:border-slate-700 py-4">
              <div className="flex items-center space-x-2"><UserIcon /><span>By {post.author}</span></div>
              <div className="flex items-center space-x-2"><CalendarIcon /><span>{post.date}</span></div>
              <div className="flex items-center space-x-2"><ClockIcon /><span>{post.readTime}</span></div>
            </div>
            
            {/* Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
              <p className="text-xl font-light text-slate-600 dark:text-slate-300">{post.excerpt}</p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                As Australia continues its transition towards a renewable energy future, staying updated on government incentives is crucial for homeowners considering a solar investment. The landscape of rebates and tariffs is constantly evolving, with significant changes implemented at the start of 2024. This guide will walk you through the key updates to ensure you can maximize your savings.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-slate-700 dark:text-slate-300">
                "The most significant change is the adjustment to the Small-scale Technology Certificate (STC) calculation, which directly impacts the upfront discount on your system."
              </blockquote>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Understanding the STC Deeming Period Reduction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Small-scale Technology Certificates (STCs) are a federal government incentive that reduces the initial cost of installing a solar system. The number of STCs you receive is based on your system&apos;s size, your location, and the &quot;deeming period&quot; – the number of years until the scheme ends in 2030.
              </p>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">State-Based Rebates and Loans</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                While the federal STC scheme is national, several states and territories continue to offer their own incentives. It&apos;s vital to check the specific eligibility criteria for your state, as they often include income thresholds, property valuations, and requirements to use accredited installers.
              </p>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">Share this article</h3>
              <div className="flex items-center justify-center space-x-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><TwitterIcon /></button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><FacebookIcon /></button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><LinkedinIcon /></button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><LinkIcon /></button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="theme-card mt-12 p-6 flex flex-col sm:flex-row items-center gap-6">
              <img src="https://i.pravatar.cc/150?img=3" alt={post.author} className="w-20 h-20 rounded-full flex-shrink-0"/>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Written by</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{post.author}</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {post.author} is a senior energy analyst at SolarMatch, with over a decade of experience in renewable energy policy and consumer advocacy.
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Comments ({comments.length})</h2>
              
              {/* Comment Form */}
              <div className="theme-card p-4 mb-8">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..." 
                  rows={4}
                  className="w-full bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-300 dark:border-slate-700 focus:ring-primary focus:border-primary transition"
                  aria-label="Write a comment"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handlePostComment}
                    className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-8">
                {comments.map(comment => (
                  <div key={comment.id} className="theme-card flex items-start gap-4 p-4">
                    <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full flex-shrink-0 mt-1"/>
                    <div>
                      <div className="flex items-center gap-3">
                        <h5 className="font-bold text-slate-900 dark:text-white">{comment.author}</h5>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{comment.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer
        onBecomePartnerClick={handleBecomePartner}
        onPartnerSignInClick={handlePartnerSignIn}
        onScrollToQuote={handleScrollToQuote}
        onScrollToRebate={handleScrollToRebate}
        onBlogClick={handleBlogClick}
        onGovernmentNewsClick={handleGovernmentNewsClick}
      />

      {/* Login Modal */}
      <HomeownerSignInModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          console.log('Switch to sign up');
        }}
      />
    </div>
  );
}
