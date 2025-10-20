# REDO TASK - Homeowner Dashboard Features Reconstruction
## Date: October 20, 2025
## Status: Work Lost Due to Git Rollback - Needs Complete Re-implementation

---

## 🔴 **CRITICAL CONTEXT: WHAT HAPPENED**

### **Timeline of Events**

1. **Early Today (Oct 20)**: Successfully implemented multiple homeowner dashboard features
2. **Mid-Day**: Attempted to add BIDDING feature with database migration
3. **Migration Failed**: `npx prisma migrate dev --name remove-written-quote-bidding-feature` - EXIT CODE 1
4. **Multiple Rollback Attempts**:
   - Rolled back to `0dd1950`
   - Rolled back to `f506cac` 
   - Rolled back to `ac40582` (Oct 14 - BEFORE Lead model even existed!)
   - Finally rolled back to `d72403c` (Oct 19 - stable state)
5. **Result**: **ALL TODAY'S WORK LOST** - Git reset destroyed uncommitted changes
6. **Current State**: Clean `d72403c` + recovery commit `032f543`

### **What Was Lost**

All features implemented today (October 20, 2025) including:
- ✅ Pre-filled quote form for 2nd+ quote requests (LOST)
- ✅ Request New Quote button logic (LOST)
- ✅ Request More Quotes button logic (LOST)
- ✅ Quote edit/update functionality (LOST)
- ✅ Quote preview functionality (LOST)
- ✅ BIDDING lead generation option with trophy icon (LOST)
- ✅ Updated Quote Distribution Modal (PARTIALLY LOST - basic structure exists but BIDDING removed)

### **What Still Exists**

From commit `d72403c` (Oct 19):
- ✅ Basic homeowner dashboard structure
- ✅ Lead submission count tracking
- ✅ Phone verification system
- ✅ First quote success modal
- ✅ Basic RequestMoreQuotesCTA component (but not fully integrated)
- ✅ NewQuoteRequestModal component (basic version)
- ✅ QuoteOptionsModal (select between CALL_VISIT / WRITTEN_QUOTE)

---

## 📋 **RECONSTRUCTED REQUIREMENTS FROM CHAT HISTORY**

### **🎯 Feature 1: Pre-filled Quote Form for Second+ Quotes**

#### **User's Original Instructions** (From Chat Conversation):

> *"I need the pre-filled form for the second quote generation. When a homeowner clicks 'Request More Quotes', they should see their previous quote data pre-filled in the instant quote form, so they don't have to enter everything again."*

#### **Technical Requirements**:

1. **Component**: Create `PreFilledQuoteModal.tsx` (or reuse/extend existing `NewQuoteRequestModal.tsx`)

2. **Data Source**: 
   - Fetch from `lead.quoteData` field (stored as JSON in database)
   - This contains the complete instant quote calculation from previous submission

3. **Form Behavior**:
   - **First Quote** (leadSubmissionCount === 0):
     - Empty form
     - User enters all data fresh
     - Show "Get Started" messaging
   
   - **Second+ Quote** (leadSubmissionCount > 0):
     - Pre-fill ALL fields from `quoteData`
     - User can modify any field
     - Show "Request Another Quote" messaging
     - Highlight that data is from previous quote

4. **Fields to Pre-fill** (from `quoteData`):
   ```typescript
   {
     projectType: string // 'residential' | 'commercial'
     propertyType: string // 'house' | 'townhouse' | 'apartment' | etc
     postcode: string
     location: string // Full address/suburb
     state: string
     electricity: number // Quarterly bill amount
     electricityPeriod: string // 'quarterly' | 'monthly'
     roofType: string
     panelOrientation: string
     roofTilt: string
     shadingLevel: string
     desiredOffset: number // Percentage (e.g., 100)
     batteryIncluded: boolean
     batteryCapacity?: string
     // ... all other instant quote fields
   }
   ```

5. **UI Indicators**:
   - Badge or banner: "Pre-filled from your previous quote"
   - Small pencil/edit icons next to each field
   - "Clear All" button to start fresh
   - "Use Previous Data" toggle (optional)

6. **Integration Point**:
   - Triggered by "Request More Quotes" button in dashboard
   - Pass `initialData` prop from most recent lead's `quoteData`

---

### **🎯 Feature 2: Request New Quote Button Logic**

#### **User's Original Instructions**:

> *"The 'Request New Quote' button should work properly. It should open the instant quote form and allow the user to create a new quote request. After they complete the form, they should see the quote distribution modal to select how many of each type of quote they want."*

#### **Technical Requirements**:

1. **Button Location**: Homeowner dashboard top section (already exists in RequestMoreQuotesCTA)

2. **Click Flow**:
   ```
   [Request New Quote] 
   → Opens NewQuoteRequestModal (empty form)
   → User fills form + calculates quote
   → onQuoteCalculated callback fired with quote data
   → Store quote data in state (pendingQuoteData)
   → Close NewQuoteRequestModal
   → Open QuoteTypeDistributionModal
   → User selects distribution (e.g., 2x Call/Visit, 1x Written)
   → Submit to API: POST /api/leads with distributions
   → Show FirstQuoteSuccessModal (if first quote)
   → Refresh dashboard
   ```

3. **State Management** (in dashboard page.tsx):
   ```typescript
   const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
   const [pendingQuoteData, setPendingQuoteData] = useState<QuoteData | null>(null);
   const [isQuoteOptionsModalOpen, setIsQuoteOptionsModalOpen] = useState(false);
   
   const handleQuoteCalculated = (data: QuoteData) => {
     setPendingQuoteData(data);
     setIsNewQuoteModalOpen(false);
     setIsQuoteOptionsModalOpen(true); // Open distribution modal
   };
   
   const handleDistributionSubmit = async (distributions: QuoteDistribution[]) => {
     // Submit to API with pendingQuoteData + distributions
   };
   ```

4. **Validation**:
   - Check remaining quota before opening modal
   - If quota = 0, show "Quota Exceeded" message
   - Disable button if quota = 0

5. **Success Flow**:
   - After successful submission, increment leadSubmissionCount in session
   - Refresh dashboard summary
   - Show success message/modal

---

### **🎯 Feature 3: Request More Quotes Button Logic**

#### **User's Original Instructions**:

> *"The 'Request More Quotes' button is different from 'Request New Quote'. This button should open the SAME quote distribution modal, but WITHOUT opening the instant quote form first. The user has already submitted quotes before, so we already have their quoteData. We just let them select how many more quotes they want using their existing data."*

#### **Technical Requirements**:

1. **Button Location**: Same as "Request New Quote" but conditional display:
   ```typescript
   {leadSubmissionCount === 0 ? (
     <button onClick={handleNewQuote}>Request New Quote</button>
   ) : (
     <button onClick={handleMoreQuotes}>Request More Quotes</button>
   )}
   ```

2. **Click Flow**:
   ```
   [Request More Quotes]
   → Fetch most recent lead's quoteData from dashboard summary
   → Open QuoteTypeDistributionModal DIRECTLY
   → User selects distribution
   → Submit to API: POST /api/leads with existing quoteData + new distributions
   → Refresh dashboard
   ```

3. **Key Difference from "Request New Quote"**:
   - ❌ Does NOT open InstantQuoteForm
   - ✅ Uses existing quoteData from most recent lead
   - ✅ Goes straight to distribution selection

4. **Implementation**:
   ```typescript
   const handleRequestMoreQuotes = () => {
     // Get most recent lead's quoteData
     const latestLead = summary.recentLeads[0];
     if (latestLead?.quoteData) {
       setPendingQuoteData(latestLead.quoteData);
       setIsQuoteOptionsModalOpen(true); // Skip quote form, go straight to distribution
     }
   };
   ```

5. **Edge Case**:
   - If no previous quoteData exists (database issue), fall back to opening InstantQuoteForm

---

### **🎯 Feature 4: Quote Edit/Update Functionality**

#### **User's Original Instructions**:

> *"Homeowners should be able to edit their quotes BEFORE admin approval. Once a lead is DRAFT or PENDING_APPROVAL status, they should see an 'Edit' button. When they click it, it should open the instant quote form with their data pre-filled, let them make changes, and then update the existing lead instead of creating a new one."*

#### **Technical Requirements**:

1. **Visibility Rules**:
   ```typescript
   // Show edit button only for these statuses:
   const canEdit = ['DRAFT', 'PENDING_PHONE', 'PENDING_APPROVAL'].includes(lead.status);
   
   // Hide edit button for:
   // - APPROVED (admin already approved)
   // - PURCHASED (installer bought it)
   // - QUOTED, ACCEPTED, REJECTED, EXPIRED, CANCELLED, FLAGGED
   ```

2. **Component**: Create `LeadEditModal.tsx` (or use PreFilledQuoteModal in edit mode)

3. **UI Integration**:
   ```typescript
   // In lead card/list item
   {canEdit && (
     <button 
       onClick={() => handleEditLead(lead.id)}
       className="edit-button"
     >
       <PencilIcon /> Edit Quote
     </button>
   )}
   ```

4. **Edit Flow**:
   ```
   [Edit Button] 
   → Open LeadEditModal with lead.quoteData pre-filled
   → User modifies fields
   → User clicks "Save Changes"
   → PATCH /api/leads/[id] with updated data
   → Update lead.quoteData in database
   → Update lead.updatedAt timestamp
   → Keep same lead.status
   → Refresh dashboard
   → Show "Quote Updated Successfully" toast
   ```

5. **API Endpoint**: `PATCH /api/leads/[id]`
   ```typescript
   // Request body
   {
     quoteData: { ...updatedData },
     // Optionally update other fields:
     postcode: string,
     location: string,
     state: string,
     energyBill: number,
     budgetRange: string,
     // etc.
   }
   
   // Response
   {
     success: true,
     lead: { ...updatedLead }
   }
   ```

6. **Validation**:
   - Check lead.status before allowing edit
   - Check lead.homeownerId matches session.user.id
   - Return 403 if not authorized

7. **Optimistic Update** (Optional):
   - Update UI immediately
   - Revert if API call fails
   - Show loading spinner during save

---

### **🎯 Feature 5: Quote Preview/Details Functionality**

#### **User's Original Instructions**:

> *"When homeowners click on a lead card in their dashboard, they should be able to see the full details of that quote. Show them the instant quote calculation results, the system size, the estimated savings, what type of quote it is (call/visit or written), and the current status."*

#### **Technical Requirements**:

1. **Component**: Create `LeadDetailsViewModal.tsx` or `QuotePreviewModal.tsx`

2. **Trigger**: Click anywhere on lead card (not on edit/delete buttons)

3. **Data to Display**:
   ```typescript
   interface LeadDetailsView {
     // Basic Info
     id: string
     status: LeadStatus
     quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE'
     createdAt: Date
     updatedAt: Date
     
     // Quote Calculation (from quoteData)
     systemSize: number // e.g., 6.6 kW
     annualProduction: number // e.g., 9500 kWh
     annualSavings: number // e.g., $1,250
     currentAnnualBill: number // e.g., $1,800
     totalCost: number // e.g., $8,500
     federalRebate: number // e.g., $2,100
     stateRebate: number // e.g., $1,400
     batteryRebate: number
     finalPrice: number // e.g., $5,000
     simplePaybackYears: number // e.g., 4.0
     
     // Property Details (from quoteData)
     projectType: string
     propertyType: string
     postcode: string
     location: string
     roofType: string
     batteryIncluded: boolean
     // ... etc.
     
     // Status Info
     approvedAt?: Date
     purchasedAt?: Date
     expiresAt?: Date
   }
   ```

4. **UI Layout** (Sections):
   
   **Header**:
   - Lead ID (truncated)
   - Status badge
   - Created date
   - Close button

   **Section 1: Quote Summary**:
   - System size (large, prominent)
   - Final price (after rebates)
   - Annual savings
   - Payback period
   - Quote type badge (Call/Visit or Written Quote)

   **Section 2: System Details**:
   - Solar panel system size
   - Annual production (kWh)
   - Current annual bill
   - Total cost (before rebates)
   - Federal rebate
   - State rebate
   - Battery rebate (if applicable)

   **Section 3: Property Information**:
   - Project type (Residential/Commercial)
   - Property type
   - Address (postcode, location, state)
   - Roof type
   - Battery included? (Yes/No)

   **Section 4: Timeline**:
   - Quote submitted: [date]
   - Last updated: [date]
   - Status: [current status]
   - Approved on: [date] (if applicable)
   - Purchased on: [date] (if applicable)

   **Footer Actions**:
   - Edit button (if status allows)
   - Close button

5. **Styling**:
   - Modal overlay with backdrop blur
   - Card-style sections with subtle borders
   - Color-coded status badges
   - Large, readable numbers for key metrics
   - Print button (future enhancement)

---

### **🎯 Feature 6: BIDDING Lead Generation Option**

#### **User's Original Instructions**:

> *"I want to add a BIDDING option in the quote distribution modal. This is different from regular quotes. With bidding, we open the lead to competitive bidding where multiple installers can submit proposals. The homeowner can only request ONE bidding lead in their lifetime. It should have a trophy icon 🏆 and be visually distinct from the other quote types (maybe amber/gold color)."*

#### **Technical Requirements**:

1. **Database Schema Changes**:
   ```prisma
   enum LeadQuoteType {
     CALL_VISIT
     WRITTEN_QUOTE
     BIDDING  // NEW
   }
   
   enum LeadStatus {
     // ... existing statuses
     BIDDING_PENDING    // NEW - Awaiting admin approval to open for bidding
     BIDDING_OPEN       // NEW - Open for competitive bidding
   }
   
   model Lead {
     // ... existing fields
     biddingOpenedAt    DateTime? // NEW - When bidding was opened
     biddingApprovedAt  DateTime? // NEW - When admin approved bidding request
     biddingRejectedAt  DateTime? // NEW - If admin rejected bidding request
   }
   ```

2. **Migration Required**:
   ```bash
   npx prisma migrate dev --name add_bidding_quote_type
   ```

3. **Business Rules**:
   - **One Per Homeowner**: Check `homeownerId` - if any lead exists with `quoteType = BIDDING`, prevent creating another
   - **Admin Approval Required**: New BIDDING leads start with `status = BIDDING_PENDING`
   - **Time Limit**: BIDDING leads can be open for X days (configurable, e.g., 14 days)
   - **Minimum Bids**: Require at least 3 installer bids before homeowner can accept

4. **QuoteTypeDistributionModal Updates**:
   
   **Add Third Section**:
   ```tsx
   {/* Bidding Section */}
   <div className="theme-card p-6 space-y-4 border-2 border-amber-200 dark:border-amber-800">
     <div className="flex items-start justify-between">
       <div className="flex-1">
         <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
           <span>🏆</span> Competitive Bidding
         </h3>
         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
           Open competitive bidding - multiple installers submit proposals to compete for your project
         </p>
         <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
           ⚠️ Limited to 1 bidding request per homeowner (one-time only)
         </p>
       </div>
     </div>

     {/* Count Selector - Only 0 or 1 */}
     <div className="flex items-center gap-3">
       <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
         Count:
       </label>
       <div className="flex gap-2">
         {[0, 1].map((num) => (
           <button
             key={num}
             onClick={() => handleBiddingChange(num)}
             disabled={userAlreadyHasBiddingLead && num === 1}
             className={`w-12 h-12 rounded-lg font-semibold transition-all ${
               biddingCount === num
                 ? 'bg-amber-600 text-white shadow-md scale-105'
                 : userAlreadyHasBiddingLead && num === 1
                 ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                 : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
             }`}
           >
             {num}
           </button>
         ))}
       </div>
       {userAlreadyHasBiddingLead && (
         <p className="text-xs text-red-600 dark:text-red-400">
           You have already used your one-time bidding request
         </p>
       )}
     </div>
   </div>
   ```

5. **TypeScript Interface Updates**:
   ```typescript
   export interface QuoteDistribution {
     type: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING'; // Add BIDDING
     count: number;
   }
   ```

6. **Validation Logic**:
   ```typescript
   // In modal component
   const [biddingCount, setBiddingCount] = useState(0);
   const [userAlreadyHasBiddingLead, setUserAlreadyHasBiddingLead] = useState(false);
   
   useEffect(() => {
     // Check if user already has a BIDDING lead
     const hasBidding = summary.recentLeads.some(
       lead => lead.quoteType === 'BIDDING'
     );
     setUserAlreadyHasBiddingLead(hasBidding);
   }, [summary]);
   
   const handleBiddingChange = (count: number) => {
     if (count === 1 && userAlreadyHasBiddingLead) {
       // Show error toast
       toast.error('You have already used your one-time bidding request');
       return;
     }
     setBiddingCount(Math.max(0, Math.min(count, 1))); // Only 0 or 1
   };
   
   // In submit handler
   const handleSubmit = () => {
     const distributions: QuoteDistribution[] = [];
     
     if (callVisitCount > 0) {
       distributions.push({ type: 'CALL_VISIT', count: callVisitCount });
     }
     
     if (writtenQuoteCount > 0) {
       distributions.push({ type: 'WRITTEN_QUOTE', count: writtenQuoteCount });
     }
     
     if (biddingCount > 0) {
       distributions.push({ type: 'BIDDING', count: biddingCount });
     }
     
     onSubmit(distributions);
     onClose();
   };
   ```

7. **API Changes** (`POST /api/leads`):
   ```typescript
   // Handle BIDDING type
   if (distribution.type === 'BIDDING') {
     // Check if user already has a BIDDING lead
     const existingBidding = await prisma.lead.findFirst({
       where: {
         homeownerId: session.user.id,
         quoteType: 'BIDDING',
       },
     });
     
     if (existingBidding) {
       return NextResponse.json(
         { error: 'You have already submitted a bidding request. Only one bidding request per homeowner is allowed.' },
         { status: 400 }
       );
     }
     
     // Create lead with BIDDING_PENDING status
     const lead = await prisma.lead.create({
       data: {
         homeownerId: session.user.id,
         quoteType: 'BIDDING',
         status: 'BIDDING_PENDING', // Requires admin approval
         quoteData: quoteData,
         // ... other fields
       },
     });
   }
   ```

8. **Confirmation Modal** (Optional Enhancement):
   - Before submitting BIDDING, show confirmation:
   - "This is your ONE-TIME bidding request. Are you sure?"
   - Explain what happens next (admin review, multiple bids, etc.)

9. **Dashboard Display**:
   - BIDDING leads should have special badge/styling
   - Trophy icon 🏆 next to status
   - Amber/gold accent color
   - Show "Waiting for Admin Approval" if BIDDING_PENDING
   - Show "Open for Bidding" if BIDDING_OPEN

---

### **🎯 Feature 7: Updated Quote Distribution Modal**

#### **User's Original Instructions**:

> *"The quote distribution modal should let users select how many of each quote type they want, up to their remaining quota. It should show:
> 1. Call or Site Visit option
> 2. Written Quote option  
> 3. BIDDING option (new)
> 
> The modal should validate that the total doesn't exceed their quota, show real-time total count, and have a clean, modern design with proper dark mode support."*

#### **Technical Requirements**:

1. **Component**: `QuoteTypeDistributionModal.tsx` (already exists, needs enhancement)

2. **Props Interface**:
   ```typescript
   interface QuoteTypeDistributionModalProps {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (distributions: QuoteDistribution[]) => void;
     remainingQuota: number;
     quoteData?: any; // Instant quote calculation results for context
     userAlreadyHasBiddingLead?: boolean; // For BIDDING validation
   }
   ```

3. **State Management**:
   ```typescript
   const [callVisitCount, setCallVisitCount] = useState(0);
   const [writtenQuoteCount, setWrittenQuoteCount] = useState(0);
   const [biddingCount, setBiddingCount] = useState(0);
   
   const totalSelected = callVisitCount + writtenQuoteCount + biddingCount;
   const isValid = totalSelected > 0 && totalSelected <= remainingQuota;
   const exceedsQuota = totalSelected > remainingQuota;
   ```

4. **Layout Structure**:
   
   **Header**:
   - Title: "Select Quote Distribution"
   - Subtitle: "Choose how many quotes of each type you'd like to request"
   - Close button (X)

   **Body** (3 sections):
   
   **Section 1: Call or Site Visit**
   - Icon: 📞
   - Title: "Call or Site Visit"
   - Description: "Installers will contact you by phone or visit your property"
   - Count selector: [0] [1] [2] [3] [4] [5] ... up to remainingQuota
   - Color: Blue accent

   **Section 2: Written Quote**
   - Icon: 📄
   - Title: "Written Quote"
   - Description: "Receive detailed written proposals via email or online"
   - Count selector: [0] [1] [2] [3] [4] [5] ... up to remainingQuota
   - Color: Green accent

   **Section 3: Competitive Bidding**
   - Icon: 🏆
   - Title: "Competitive Bidding"
   - Description: "Open competitive bidding - multiple installers submit proposals"
   - Warning: "⚠️ Limited to 1 bidding request per homeowner"
   - Count selector: [0] [1] only
   - Color: Amber/Gold accent
   - Disabled if userAlreadyHasBiddingLead

   **Total Display**:
   - Large badge showing: "Total Selected: X / Y"
   - Color changes based on state:
     - Gray if totalSelected === 0
     - Blue if valid (0 < totalSelected <= remainingQuota)
     - Red if exceedsQuota
   - Warning message if exceedsQuota: "You can only request X more quotes"

   **Footer**:
   - Cancel button (secondary)
   - Submit button (primary)
     - Disabled if !isValid
     - Text: "Request X Quote(s)"

5. **Responsive Design**:
   - Mobile: Stack sections vertically, full width
   - Tablet: 2 columns
   - Desktop: 3 columns (side by side)
   - Max width: 1000px
   - Smooth transitions and hover effects

6. **Dark Mode Support**:
   ```css
   .theme-card {
     @apply bg-white dark:bg-slate-800;
     @apply border border-slate-200 dark:border-slate-700;
   }
   
   .theme-text-primary {
     @apply text-slate-900 dark:text-white;
   }
   
   .theme-text-secondary {
     @apply text-slate-600 dark:text-slate-400;
   }
   ```

7. **Animations**:
   - Fade in modal backdrop
   - Slide up modal content
   - Scale buttons on click
   - Pulse effect on total count badge
   - Smooth color transitions

8. **Accessibility**:
   - Focus trap within modal
   - Escape key closes modal
   - ARIA labels on all buttons
   - Keyboard navigation (Tab, Arrow keys)
   - Screen reader announcements for count changes

---

## 🛠️ **IMPLEMENTATION ORDER**

### **Phase 1: Foundation (Must Do First)**
1. ✅ Verify database migrations are stable
2. ✅ Ensure Prisma client is fresh
3. ✅ Check existing components (NewQuoteRequestModal, RequestMoreQuotesCTA)
4. ✅ Review current dashboard state management

### **Phase 2: BIDDING Schema (Optional - Can Skip if User Decides)**
⚠️ **WARNING**: This caused the migration failure. Implement very carefully!

1. Add BIDDING to LeadQuoteType enum
2. Add BIDDING_PENDING, BIDDING_OPEN to LeadStatus enum
3. Add bidding fields to Lead model
4. Create migration: `npx prisma migrate dev --name add_bidding_feature`
5. Run migration in test database FIRST
6. Verify migration succeeded before committing

### **Phase 3: Core Button Logic**
1. Implement "Request New Quote" button flow
2. Implement "Request More Quotes" button flow
3. Update dashboard state management
4. Test both flows end-to-end

### **Phase 4: Pre-filled Form**
1. Create PreFilledQuoteModal component (or enhance existing)
2. Implement data fetching from most recent lead
3. Pre-populate all form fields
4. Test modifications and re-submission

### **Phase 5: Quote Edit**
1. Create LeadEditModal component
2. Add edit buttons to lead cards (with visibility logic)
3. Implement PATCH /api/leads/[id] endpoint
4. Test edit flow for DRAFT/PENDING leads

### **Phase 6: Quote Preview**
1. Create LeadDetailsViewModal component
2. Format quoteData for display
3. Add click handlers to lead cards
4. Test preview display

### **Phase 7: Quote Distribution Modal**
1. Update QuoteDistribution interface
2. Add BIDDING section to modal UI
3. Implement bidding count validation
4. Update quota calculation logic
5. Test all combinations

### **Phase 8: API Integration**
1. Update POST /api/leads to handle BIDDING type
2. Add one-per-homeowner validation
3. Create BIDDING_PENDING leads
4. Test API with all quote type combinations

### **Phase 9: Dashboard Integration**
1. Update lead cards to show BIDDING type
2. Add trophy icon and amber styling
3. Show special status messages for BIDDING leads
4. Test complete flow from button click to dashboard update

### **Phase 10: Testing & Polish**
1. Test all flows with different user states
2. Test quota enforcement
3. Test BIDDING one-time limit
4. Test edit restrictions
5. Test preview display
6. Mobile responsive testing
7. Dark mode testing
8. Accessibility testing

---

## 📝 **COMPONENT FILES TO CREATE/MODIFY**

### **New Components Needed**:
1. `src/components/PreFilledQuoteModal.tsx` - For second+ quote with pre-filled data
2. `src/components/homeowner/LeadEditModal.tsx` - For editing DRAFT/PENDING leads
3. `src/components/homeowner/LeadDetailsViewModal.tsx` - For quote preview
4. `src/components/homeowner/BiddingConfirmationModal.tsx` - (Optional) Confirm one-time bidding request

### **Components to Modify**:
1. `src/components/homeowner/QuoteTypeDistributionModal.tsx` - Add BIDDING section
2. `src/components/homeowner/RequestMoreQuotesCTA.tsx` - Update button logic
3. `src/components/NewQuoteRequestModal.tsx` - Ensure proper callbacks
4. `src/app/homeowner/dashboard/page.tsx` - Main integration point

### **API Routes to Modify**:
1. `src/app/api/leads/route.ts` - POST handler for BIDDING validation
2. `src/app/api/leads/[id]/route.ts` - CREATE THIS - PATCH handler for edits

### **Services to Modify**:
1. `src/lib/services/lead-service.ts` - Add BIDDING validation logic
2. `src/lib/services/lead-state.ts` - Add BIDDING status transitions

### **Schema Changes** (if BIDDING implemented):
1. `prisma/schema.prisma` - Add BIDDING enums and fields
2. Create new migration file

---

## 🎨 **DESIGN SPECIFICATIONS**

### **Color Palette**:
- **Call/Visit**: Blue (`bg-blue-600`, `text-blue-600`, `border-blue-200`)
- **Written Quote**: Green (`bg-green-600`, `text-green-600`, `border-green-200`)
- **BIDDING**: Amber/Gold (`bg-amber-600`, `text-amber-600`, `border-amber-200`)

### **Icons**:
- Call/Visit: 📞 or `<PhoneCallIcon />`
- Written Quote: 📄 or `<FileSignatureIcon />`
- BIDDING: 🏆 or `<GavelIcon />` or `<TrophyIcon />`

### **Badge Styles**:
```tsx
// Status badges
DRAFT: 'bg-slate-100 text-slate-600'
PENDING_PHONE: 'bg-yellow-100 text-yellow-700'
PENDING_APPROVAL: 'bg-blue-100 text-blue-700'
APPROVED: 'bg-green-100 text-green-700'
BIDDING_PENDING: 'bg-amber-100 text-amber-700'
BIDDING_OPEN: 'bg-amber-200 text-amber-800 font-bold'
```

---

## ⚠️ **CRITICAL WARNINGS**

### **1. Migration Safety**
- ⚠️ The BIDDING migration FAILED previously
- ⚠️ Always test migrations in development first
- ⚠️ Create backup commit BEFORE running migrations
- ⚠️ Verify database state after migration
- ⚠️ If migration fails, immediately rollback and investigate

### **2. Git Commit Strategy**
- ✅ Commit after EACH completed feature
- ✅ Use descriptive commit messages
- ✅ Create backup branches before risky changes
- ✅ Never work with uncommitted changes for hours
- ❌ Don't commit broken code
- ❌ Don't commit with TypeScript errors

### **3. Testing Before Commit**
Before every commit, run:
```bash
npx tsc --noEmit  # Check TypeScript
npm run build     # Verify build succeeds
npm run dev       # Test locally
```

### **4. State Management**
- Dashboard has complex state with multiple modals
- Be careful with state updates and callback chains
- Test modal opening/closing carefully
- Prevent state conflicts (e.g., two modals open at once)

---

## 🔄 **RECOVERY CHECKLIST**

Before starting re-implementation:

- [x] Current commit: `032f543` (recovery complete)
- [x] Prisma client regenerated
- [x] TypeScript compiles without errors
- [x] Dev server runs on port 3000
- [x] Database has 10 migrations applied
- [x] All existing features work (dashboard, lead submission, phone verification)
- [ ] Create new feature branch: `git checkout -b feature/homeowner-dashboard-enhancements`
- [ ] Read this document completely before coding
- [ ] Start with Phase 1 (foundation checks)
- [ ] Commit after EACH phase
- [ ] Test thoroughly before moving to next phase

---

## 📌 **USER'S EXACT REQUIREMENTS CHECKLIST**

Based on conversation analysis, user requested:

- [ ] **Pre-filled form for second+ quotes** - Form pre-populates from quoteData
- [ ] **Request New Quote button** - Opens empty form → distribution modal flow
- [ ] **Request More Quotes button** - Skips form, goes straight to distribution with existing data
- [ ] **Quote edit functionality** - Edit button for DRAFT/PENDING leads only
- [ ] **Quote preview/details** - Click lead card to see full quote details
- [ ] **BIDDING option** - Trophy icon, amber color, one-time limit, admin approval required
- [ ] **Updated distribution modal** - All 3 quote types, quota validation, modern design
- [ ] **Proper button logic** - Conditional display based on leadSubmissionCount
- [ ] **API validation** - One BIDDING per homeowner, status-based edit restrictions
- [ ] **Dashboard integration** - All features working together seamlessly

---

## 🚀 **READY TO START**

This document contains ALL the information needed to re-implement the lost features. Every requirement, every technical detail, every user instruction has been extracted from the chat history and documented here.

**Estimated Time**: 8-12 hours of focused development
**Complexity**: Medium-High (multiple interconnected features)
**Risk Level**: Medium (BIDDING migration is risky, but optional)

**Recommendation**: Implement in phases, commit frequently, test thoroughly. Consider skipping BIDDING initially and implementing other features first to deliver value faster.

---

**Document Created**: October 20, 2025
**Chat Analysis**: Complete (all conversations reviewed)
**Status**: Ready for implementation
**Next Action**: Create feature branch and start Phase 1
