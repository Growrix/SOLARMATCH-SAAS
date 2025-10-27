
    <line x1="18" x2="6" y1="6" y2="18"/>
    <line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================
// TEACHING NOTE: TypeScript interfaces define the "shape" of data. They tell
// TypeScript (and you!) what properties an object should have and what types
// those properties are. This helps catch bugs before runtime!
// ============================================================================

interface NewsletterSubscriber {
  id: string;                    // Unique identifier (from database)
  email: string;                 // Email address
  subscribedAt: string;          // ISO date string (e.g., "2025-10-11T10:30:00.000Z")
  isActive: boolean;             // Still subscribed?
  unsubscribedAt: string | null; // When they unsubscribed (null if still active)
}

// Props for the modal component
interface SubscriberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: NewsletterSubscriber | null;
}

// ============================================================================
// SUBSCRIBER DETAILS MODAL COMPONENT
// ============================================================================
// TEACHING NOTE: This modal shows detailed information about a subscriber.
// It's a "controlled component" - its visibility is controlled by the parent
// through the `isOpen` prop.
// ============================================================================

const SubscriberDetailsModal: React.FC<SubscriberDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  subscriber 
}) => {
  // TEACHING NOTE: useEffect runs side effects when dependencies change
  // Here, we use it to handle keyboard events and body scroll locking
  useEffect(() => {
    if (!isOpen) return; // Don't do anything if modal is closed
    
    // Press Escape to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Lock body scroll when modal is open (better UX)
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    // Cleanup function: runs when component unmounts or dependencies change
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed or no subscriber data
  if (!isOpen || !subscriber) return null;

  // Format the date to be human-readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    // TEACHING NOTE: Modal Structure
    // 1. Backdrop (dark overlay covering the page)
    // 2. Modal content (the actual card/dialog)
    // 3. Close button
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose} // Click outside to close
    >
      <div 
        className="theme-card relative w-full max-w-lg p-8 animate-slide-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button (X icon in top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
          aria-label="Close"
        >
          <XIcon />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <MailIcon />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Subscriber Details
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete subscriber information
            </p>
          </div>
        </div>

        {/* Subscriber Information */}
        <div className="space-y-4">
          {/* Email */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <MailIcon />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </span>
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white ml-7">
              {subscriber.email}
            </p>
          </div>

          {/* Subscription Date */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <CalendarIcon />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Subscribed On
              </span>
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white ml-7">
              {formatDate(subscriber.subscribedAt)}
            </p>
          </div>

          {/* Status */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircleIcon />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Status
              </span>
            </div>
            <div className="ml-7">
              {subscriber.isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ● Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  ● Unsubscribed
                </span>
              )}
            </div>
          </div>

          {/* Unique ID (for developers/debugging) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <UserIcon />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Subscriber ID
              </span>
            </div>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-400 ml-7">
              {subscriber.id}
            </p>
          </div>

          {/* Unsubscribed Date (if applicable) */}
          {!subscriber.isActive && subscriber.unsubscribedAt && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-1">
                <CalendarIcon />
                <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Unsubscribed On
                </span>
              </div>
              <p className="text-lg font-medium text-red-700 dark:text-red-300 ml-7">
                {formatDate(subscriber.unsubscribedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN NEWSLETTER ADMIN PAGE COMPONENT
// ============================================================================
// TEACHING NOTE: This is the main page component. It fetches subscriber data
// from the API and displays it in a table.
// ============================================================================

export default function NewsletterAdminPage() {
  const router = useRouter();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  // TEACHING NOTE: useState creates state variables that trigger re-renders
  // when they change. Each piece of data gets its own state variable.
  // ============================================================================

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  // TEACHING NOTE: Array of subscriber objects fetched from API

  const [loading, setLoading] = useState(true);
  // TEACHING NOTE: Boolean to track if data is being fetched

  const [error, setError] = useState<string | null>(null);
  // TEACHING NOTE: String to store error messages (null if no error)

  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  // TEACHING NOTE: The subscriber whose details are shown in the modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  // TEACHING NOTE: Boolean to control modal visibility

  const [searchQuery, setSearchQuery] = useState('');
  // TEACHING NOTE: String for filtering subscribers by email

  // ============================================================================
  // FETCH SUBSCRIBERS FROM API
  // ============================================================================
  // TEACHING NOTE: This function calls our API endpoint to get all subscribers
  // ============================================================================

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      // STEP 1: Make HTTP GET request to our API
      const response = await fetch('/api/newsletter/subscribe');

      // STEP 2: Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // STEP 3: Parse JSON response
      const data = await response.json();

      // STEP 4: Check if response has expected format
      if (data.success && Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
      setError('Failed to load subscribers. Please try again.');
    } finally {
      // TEACHING NOTE: 'finally' runs whether try succeeds or fails
      setLoading(false);
    }
  };

  // ============================================================================
  // FETCH DATA ON COMPONENT MOUNT
  // ============================================================================
  // TEACHING NOTE: useEffect with empty dependency array [] runs once when
  // component mounts (similar to componentDidMount in class components)
  // ============================================================================

  useEffect(() => {
    fetchSubscribers();
  }, []); // Empty array = run only once on mount

  // ============================================================================
  // HANDLE ROW CLICK
  // ============================================================================
  // TEACHING NOTE: When user clicks a table row, show the details modal
  // ============================================================================

  const handleRowClick = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setIsModalOpen(true);
  };

  // ============================================================================
  // FILTER SUBSCRIBERS BY SEARCH QUERY
  // ============================================================================
  // TEACHING NOTE: Filter the subscribers array based on search input
  // ============================================================================

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // FORMAT DATE FOR TABLE
  // ============================================================================
  const formatTableDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ============================================================================
  // RENDER THE PAGE
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mb-4 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MailIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Newsletter Subscribers
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage and view all newsletter subscriptions
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchSubscribers}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <RefreshIcon />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="theme-card p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Total Subscribers
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {subscribers.length}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Active
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {subscribers.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Unsubscribed
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {subscribers.filter(s => !s.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="theme-card p-4 mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Content Area */}
        <div className="theme-card overflow-hidden">
          {loading ? (
            // Loading State
            <div className="p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading subscribers...</p>
            </div>
          ) : error ? (
            // Error State
            <div className="p-12 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchSubscribers}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            // Empty State
            <div className="p-12 text-center">
              <MailIcon />
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                {searchQuery ? 'No subscribers match your search.' : 'No subscribers yet.'}
              </p>
            </div>
          ) : (
            // Table View (Desktop and Mobile Responsive)
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Subscribed Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        onClick={() => handleRowClick(subscriber)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <MailIcon />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {formatTableDate(subscriber.subscribedAt)}
                        </td>
                        <td className="px-6 py-4">
                          {subscriber.isActive ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              ● Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              ● Unsubscribed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                {filteredSubscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    onClick={() => handleRowClick(subscriber)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MailIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {subscriber.email}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {formatTableDate(subscriber.subscribedAt)}
                        </p>
                        <div className="mt-2">
                          {subscriber.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              ● Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              ● Unsubscribed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Results Count */}
        {!loading && !error && filteredSubscribers.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </div>
        )}
      </div>

      {/* Subscriber Details Modal */}
      <SubscriberDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriber={selectedSubscriber}
      />
    </div>
  );
}

// ============================================================================
// WHAT YOU JUST LEARNED
// ============================================================================
//
// 1. **Client-Side Rendering**: Using 'use client' for React hooks
// 2. **State Management**: useState for managing component state
// 3. **Side Effects**: useEffect for fetching data and event listeners
// 4. **API Integration**: fetch() to call backend endpoints
// 5. **TypeScript Interfaces**: Defining data structures
// 6. **Modal Components**: Creating reusable dialog components
// 7. **Conditional Rendering**: Showing different UI based on state
// 8. **Loading States**: Providing feedback during async operations
// 9. **Error Handling**: Gracefully handling failed requests
// 10. **Responsive Design**: Different layouts for mobile and desktop
// 11. **Search/Filter**: Client-side filtering of data
// 12. **Theme System**: Using Tailwind's dark mode classes
// 13. **Accessibility**: Proper ARIA labels and keyboard support
//
// ============================================================================
// NEXT STEPS
// ============================================================================
//
// This page is ready to use once you've:
// 1. Connected to Supabase (add DATABASE_URL to .env)
// 2. Run migrations (npx prisma migrate dev)
// 3. Add some subscribers via the newsletter form
//
// To test:
// 1. Navigate to /admin/newsletter
// 2. See the list of subscribers
// 3. Click a row to see details in a modal
// 4. Use the search bar to filter
// 5. Click refresh to reload data
//
// ============================================================================
