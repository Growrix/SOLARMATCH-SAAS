import type { Post } from '../types/blog';

export const allArticles: Post[] = [
  {
    title: "2024 Solar Rebate Changes: What Homeowners Need to Know",
    excerpt: "Understanding the latest updates to government solar incentives and how they affect your savings potential.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "6 min read",
    category: "Policy Updates",
    image: "https://images.unsplash.com/photo-1509390636472-a0b5a1985799?q=80&w=800"
  },
  {
    title: "Tesla Powerwall vs Competitors: Battery Storage Comparison",
    excerpt: "An in-depth analysis of the top battery storage systems available in Australia, including costs and performance.",
    author: "Michael Chen",
    date: "March 10, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1629231249110-a1a1c63740e2?q=80&w=800"
  },
  {
    title: "Summer Solar Tips: Maximizing Your System's Performance",
    excerpt: "How to get the most out of your solar panels during Australia's peak sunshine months.",
    author: "Emma Thompson",
    date: "March 5, 2024",
    readTime: "4 min read",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1545284884-f3c914a2b9ae?q=80&w=800"
  },
  {
    title: "Case Study: A Sydney Family's Journey to Energy Independence",
    excerpt: "Discover how the Smiths cut their electricity bills by 90% with a 10kW solar system and battery storage.",
    author: "John Doe",
    date: "Feb 28, 2024",
    readTime: "7 min read",
    category: "Case Studies",
    image: "https://images.unsplash.com/photo-1518709594023-63ab79d72a24?q=80&w=800"
  },
  {
    title: "The Rise of Virtual Power Plants (VPPs) in Australia",
    excerpt: "Learn how you can earn money by connecting your solar battery to a VPP and supporting the grid.",
    author: "Jane Appleseed",
    date: "Feb 22, 2024",
    readTime: "5 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1630691742469-32a106a7afd5?q=80&w=800"
  },
  {
    title: "Choosing the Right Solar Inverter for Your Home",
    excerpt: "A comprehensive guide to string inverters, microinverters, and hybrid inverters. Which one is best for you?",
    author: "David Lee",
    date: "Feb 15, 2024",
    readTime: "9 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1627993093952-721d20e7e231?q=80&w=800"
  },
  {
    title: "Understanding Your Electricity Bill: A Homeowner's Guide",
    excerpt: "Demystifying tariffs, usage charges, and fixed costs to help you see exactly where your solar savings come from.",
    author: "Sarah Johnson",
    date: "Feb 10, 2024",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"
  },
  {
    title: "Are Solar Panels Worth It in 2024? A Cost-Benefit Analysis",
    excerpt: "With changing rebates and technology, we break down the numbers to see if a solar investment still makes sense.",
    author: "Michael Chen",
    date: "Feb 1, 2024",
    readTime: "10 min read",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1624391673245-56c45999b550?q=80&w=800"
  },
  {
    title: "DIY vs. Professional Solar Panel Cleaning: Which is Better?",
    excerpt: "We weigh the pros and cons of cleaning your own solar panels versus hiring a professional service.",
    author: "Emma Thompson",
    date: "Jan 25, 2024",
    readTime: "4 min read",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1609156847114-1e5c1b61c741?q=80&w=800"
  }
];

export const categories = ['All', ...Array.from(new Set(allArticles.map(a => a.category)))];
