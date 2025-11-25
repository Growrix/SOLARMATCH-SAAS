# CALL/VISIT Lead Implementation Tasks
**Date:** 2025-11-25  
**Branch:** 007-call-visit-lead  
**Implementation Order:** Installer → Admin → Homeowner

---

## 🎯 MANDATORY TESTING RULES

### **Rule 1: STOP-ON-FAIL**
- ❌ If ANY test fails in a phase, **STOP IMMEDIATELY**
- ❌ DO NOT proceed to next phase until all tests pass
- ❌ Fix the failed test before continuing

### **Rule 2: INCREMENTAL VALIDATION**
- ✅ Test after each file modification
- ✅ Run `npm run build` after each phase
- ✅ Check browser console for errors
- ✅ Verify Network tab shows correct API calls

### **Rule 3: ROLLBACK ON BREAKING CHANGES**
- ❌ If a change breaks existing functionality, revert immediately
- ❌ Fix in isolation before reapplying

### **Rule 4: DESIGN SYSTEM COMPLIANCE**
- ✅ Reference `DOC/Guidelines/DESIGN-SYSTEM-SOT.md` for all UI changes
- ✅ Use semantic classes from global CSS only (no inline styles)
- ✅ Follow `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md`
- ❌ NO hardcoded colors, spacing, or typography

### **Rule 5: CHECKPOINT VALIDATION**
- Each phase ends with a checkpoint
- ALL tests must pass before marking phase complete
- Document any deviations or issues found

---

## 📋 PHASE STRUCTURE

Each phase follows this pattern:
1. **Implementation** - Code changes with file paths
2. **Testing** - Detailed test steps with expected results
3. **Checkpoint** - Pass/fail validation before proceeding
4. **Rollback** - Instructions if tests fail

---

## PHASE 1: Setup & Validation (PREREQUISITE)

**Goal:** Verify current state and dependencies

### Task 1.1: Verify Backend Infrastructure
**File Audit:**
```bash
# Check these files exist and have correct structure:
- prisma/schema.prisma (Lead, LeadAssignment models)
- src/app/api/installer/leads/assigned/route.ts
- src/app/api/installer/leads/[id]/purchase/route.ts
```

**Testing:**
```bash
# Run Prisma validation
npx prisma validate

# Check TypeScript compilation
npx tsc --noEmit

# Start dev server
npm run dev
```

**Expected Results:**
- ✅ Prisma schema valid
- ✅ No TypeScript errors
- ✅ Dev server starts without errors

**❌ STOP:** If any errors, fix before Phase 2.

---

### Task 1.2: Test Existing APIs Manually
**Steps:**
1. Login as installer
2. Open DevTools Network tab
3. Navigate to `/installer/leads`
4. Check API calls

**Expected Results:**
- ✅ GET `/api/installer/leads/assigned` returns 200
- ✅ Response includes leads array
- ✅ Contact fields show `***LOCKED***` for unpurchased leads

**❌ STOP:** If API fails or returns wrong data, fix before Phase 2.

---

### Task 1.3: Read Design Guidelines
**Files to Review:**
```
DOC/Guidelines/DESIGN-SYSTEM-SOT.md
DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md
```

**Key Points to Note:**
- Color token names (--color-foreground, --color-surface, etc.)
- Typography classes (text-heading-3, text-body, etc.)
- Spacing utilities (spacing-4, spacing-6, etc.)
- Component patterns (theme-card, btn-primary, etc.)

**✅ CHECKPOINT:** Ready to proceed to Phase 2 (Installer Flow)

---

## PHASE 2: Installer Purchase Flow (CRITICAL)

**Goal:** Wire `StripeUnlockModal` to real purchase API with mock payment

### Task 2.1: Update Modal Interface
**File:** `src/components/InstallerLeadFeed.tsx` (lines 85-90)

**Changes:**
```typescript
// ADD new prop to interface:
const StripeUnlockModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUnlockLead: (leadId: number) => Promise<boolean>;  // NEW
  onPaymentSuccess: (leadId: number) => void;
  installer: InstallerProfile;
}> = ({ isOpen, onClose, lead, onUnlockLead, onPaymentSuccess, installer }) => {
```

**Testing:**
```bash
# Save file and check for TypeScript errors
npx tsc --noEmit
```

**Expected:**
- ✅ No TypeScript errors
- ✅ Modal interface updated

**❌ STOP:** If TypeScript errors appear, fix interface first.

---

### Task 2.2: Implement Mock Purchase Flow
**File:** `src/components/InstallerLeadFeed.tsx` (lines 91-118)

**Changes:**
```typescript
const handlePayment = async () => {
  if (!lead) return;
  
  setIsProcessing(true);
  setPaymentStatus('processing');
  
  try {
    // MOCK PAYMENT (Stripe placeholder)
    // TODO: When Stripe available, add here:
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    // const { error } = await stripe.confirmCardPayment(clientSecret);
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call real purchase API
    const success = await onUnlockLead(lead.id);
    
    if (!success) {
      setPaymentStatus('error');
      setTimeout(() => setPaymentStatus('idle'), 3000);
      return;
    }
    
    setPaymentStatus('success');
    setTimeout(() => {
      onPaymentSuccess(lead.id);
      onClose();
      setPaymentStatus('idle');
    }, 1500);
  } catch (error) {
    console.error('Purchase error:', error);
    setPaymentStatus('error');
    setTimeout(() => setPaymentStatus('idle'), 3000);
  } finally {
    setIsProcessing(false);
  }
};
```

**Testing Steps:**
1. Save file
2. Check browser console for errors
3. Verify no syntax errors

**Expected:**
- ✅ File saves without errors
- ✅ No console errors

**❌ STOP:** If errors, fix syntax first.

---

### Task 2.3: Pass Callback Through Component Tree
**File:** `src/components/InstallerLeadFeed.tsx` (line 733)

**Changes:**
```typescript
<StripeUnlockModal
  isOpen={showUnlockModal}
  onClose={() => {
    setShowUnlockModal(false);
    setSelectedLead(null);
  }}
  lead={selectedLead}
  onUnlockLead={onUnlockLead}  // NEW: Pass through
  onPaymentSuccess={handlePaymentSuccess}
  installer={installer}
/>
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build completes successfully
- ✅ No build errors

**❌ STOP:** If build fails, check component props.

---

### Task 2.4: End-to-End Purchase Flow Test

**Prerequisites:**
- Have test installer account
- Have assigned CALL_VISIT lead

**Test Steps:**
1. Login as installer
2. Navigate to `/installer/leads`
3. Find a CALL_VISIT lead with "Unlock Lead" button
4. Click "Unlock Lead ($X)"
5. Verify modal opens
6. Click "Pay $X to Unlock"
7. Watch for "Processing..." state (1.5s)
8. Open DevTools Network tab
9. Check for POST request to `/api/installer/leads/[id]/purchase`
10. Verify response is 200 OK
11. Check modal shows "Payment successful!"
12. Wait for modal to close automatically
13. Verify lead card now shows contact details (unmasked)
14. Check name, phone, email are visible

**Expected Results:**
- ✅ Modal opens correctly
- ✅ Payment processing animation shows
- ✅ API call succeeds (200 status)
- ✅ Contact details unlock
- ✅ Success message appears
- ✅ Modal closes automatically
- ✅ No console errors

**❌ STOP CRITERIA:**
- ❌ If modal doesn't open → Fix modal trigger
- ❌ If API returns error → Check backend logs
- ❌ If contact stays masked → Check API response
- ❌ If console errors → Fix JavaScript errors

**✅ CHECKPOINT 2:** Purchase flow working end-to-end. Proceed to Phase 3.

---

## PHASE 3: Purchased Leads Page (HIGH PRIORITY)

**Goal:** Create purchased leads endpoint and tabbed UI

### Task 3.1: Create Purchased Leads API Endpoint
**File:** `src/app/api/installer/leads/purchased/route.ts` (NEW)

**Full Implementation:**
```typescript
/**
 * GET /api/installer/leads/purchased
 * Returns leads purchased by logged-in installer
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (session.user.role !== 'INSTALLER') {
      return NextResponse.json(
        { error: 'Installer access required' },
        { status: 403 }
      );
    }
    
    const purchasedLeads = await prisma.lead.findMany({
      where: {
        installerId: session.user.id,
        purchasedAt: { not: null }
      },
      include: {
        homeowner: { 
          select: { id: true, name: true, phone: true, email: true } 
        },
        quotes: { 
          select: { id: true } 
        }
      },
      orderBy: { purchasedAt: 'desc' }
    });
    
    const leads = purchasedLeads.map(lead => ({
      id: lead.id,
      quoteType: lead.quoteType,
      status: lead.status,
      purchaseStatus: lead.purchaseStatus,
      purchasedAt: lead.purchasedAt?.toISOString(),
      leadPrice: lead.leadPrice,
      homeowner: {
        id: lead.homeowner.id,
        name: lead.homeowner.name,
        phone: lead.homeowner.phone,
        email: lead.homeowner.email
      },
      location: lead.location,
      postcode: lead.postcode,
      state: lead.state,
      propertyType: lead.propertyType,
      roofType: lead.roofType,
      budgetRange: lead.budgetRange,
      quotesCount: lead.quotes.length
    }));
    
    return NextResponse.json({
      success: true,
      leads,
      count: leads.length
    });
    
  } catch (error) {
    console.error('Error fetching purchased leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchased leads' },
      { status: 500 }
    );
  }
}
```

**Testing:**
```bash
# Save file
# Build project
npm run build

# Check for errors
npx tsc --noEmit
```

**Expected:**
- ✅ File created successfully
- ✅ No TypeScript errors
- ✅ Build succeeds

**❌ STOP:** If build fails, check import paths and Prisma syntax.

---

### Task 3.2: Update Purchased Leads Page
**File:** `src/app/installer/(dashboard)/purchased-leads/page.tsx` (line 76)

**Change:**
```typescript
// REPLACE:
const response = await fetch('/api/leads?purchased=true');

// WITH:
const response = await fetch('/api/installer/leads/purchased');
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds

---

### Task 3.3: Test Purchased Leads Page

**Prerequisites:**
- Complete Phase 2 (have purchased at least 1 lead)

**Test Steps:**
1. Login as installer who purchased a lead
2. Navigate to `/installer/purchased-leads`
3. Check page loads without errors
4. Verify "Call/Visit" tab is active by default
5. Check purchased lead appears in list
6. Verify contact details visible:
   - Name (not `***LOCKED***`)
   - Phone (not `***LOCKED***`)
   - Email (visible)
7. Check purchase date displays
8. Check status shows correctly
9. Click "Written Quotes" tab
10. Verify empty state or correct leads
11. Click "Bidding" tab
12. Verify empty state or correct leads
13. Return to "Call/Visit" tab
14. Verify filtering persists

**Expected Results:**
- ✅ Page loads without errors
- ✅ Purchased lead displays in correct tab
- ✅ All contact details unmasked
- ✅ Tab switching works
- ✅ Filtering by quoteType accurate
- ✅ No console errors

**❌ STOP CRITERIA:**
- ❌ If 404 error → Check API route path
- ❌ If contact still masked → Check API response mapping
- ❌ If tabs don't filter → Check tab logic
- ❌ If empty when should have data → Check where clause

**✅ CHECKPOINT 3:** Purchased leads page functional. Proceed to Phase 4.

---

## PHASE 4: Multi-Installer Detection (MEDIUM PRIORITY)

**Goal:** Show "Purchased by another installer" state

### Task 4.1: Add API Field
**File:** `src/app/api/installer/leads/assigned/route.ts` (line 89)

**Change:**
```typescript
// FIND (around line 89):
const isPurchased = lead.installerId === session.user.id && !!lead.purchasedAt;

return {
  ...lead,
  homeowner: {
    name: isPurchased ? lead.homeowner.name : '***LOCKED***',
    phone: isPurchased ? lead.homeowner.phone : '***LOCKED***'
  },
  isPurchased,
};

// ADD one line:
const isPurchased = lead.installerId === session.user.id && !!lead.purchasedAt;

return {
  ...lead,
  homeowner: {
    name: isPurchased ? lead.homeowner.name : '***LOCKED***',
    phone: isPurchased ? lead.homeowner.phone : '***LOCKED***'
  },
  isPurchased,
  isPurchasedByAnother: !!lead.installerId && lead.installerId !== session.user.id, // NEW
};
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds

---

### Task 4.2: Update Type Mapping
**File:** `src/app/installer/(dashboard)/leads/page.tsx` (line 10)

**Change:**
```typescript
// In mapAssignedLeadToComponentLead function, ADD:
return {
  // ... existing fields
  isUnlocked: !isLocked,
  isPurchasedByAnother: apiLead.isPurchasedByAnother || false, // NEW
  // ... rest
};
```

**Testing:**
```bash
npx tsc --noEmit
```

**Expected:**
- ✅ No TypeScript errors

---

### Task 4.3: Update Lead Card UI
**File:** `src/components/InstallerLeadFeed.tsx` (LeadCard component)

**Changes:**

**Step 1 - Add check (around line 240):**
```typescript
// FIND:
const isUnlockedByInstaller = lead.unlockedBy.includes(installer.id);
const canUnlock = lead.type === 'call_visit' && !isUnlockedByInstaller && lead.status === 'new';

// REPLACE WITH:
const isUnlockedByInstaller = lead.isUnlocked;
const isPurchasedByAnother = lead.isPurchasedByAnother || false;  // NEW
const canUnlock = lead.type === 'call_visit' && 
                  !isUnlockedByInstaller && 
                  !isPurchasedByAnother &&  // NEW
                  lead.status === 'new';
```

**Step 2 - Add banner (after line 260):**
```typescript
// FIND the opening div of LeadCard:
<div className={`theme-card border-l-4 ${getPriorityColor()} p-6 transition-colors duration-200`}>

// REPLACE WITH:
<div className={`theme-card border-l-4 ${getPriorityColor()} p-6 transition-colors duration-200 ${isPurchasedByAnother ? 'opacity-50' : ''}`}>
  
  {/* NEW: Show banner if purchased by another */}
  {isPurchasedByAnother && (
    <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <LockIcon className="h-5 w-5 text-error" />
        <p className="text-body text-error">
          ⛔ This lead has been purchased by another installer
        </p>
      </div>
    </div>
  )}
```

**Step 3 - Disable button (around line 480):**
```typescript
// FIND the unlock button section:
{canUnlock && (
  <Button
    onClick={() => onUnlock(lead.id)}
    variant="primary"
    className="flex items-center space-x-2"
  >

// REPLACE WITH:
{canUnlock && !isPurchasedByAnother && (  // NEW: Additional check
  <Button
    onClick={() => onUnlock(lead.id)}
    variant="primary"
    className="flex items-center space-x-2"
    disabled={isPurchasedByAnother}  // NEW: Disable state
  >
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds
- ✅ No console errors

---

### Task 4.4: Multi-Installer Test

**Prerequisites:**
- Need 2 installer accounts (A and B)
- Admin access to assign lead to both

**Setup:**
1. Login as Admin
2. Create/select a CALL_VISIT lead
3. Assign to both Installer A and B

**Test Steps:**

**Part 1 - Installer A Purchases:**
1. Login as Installer A
2. Navigate to `/installer/leads`
3. Find the assigned lead
4. Click "Unlock Lead"
5. Complete purchase (Phase 2 flow)
6. Verify success

**Part 2 - Installer B Views:**
1. Login as Installer B
2. Navigate to `/installer/leads`
3. Find the same lead
4. Verify red banner: "⛔ This lead has been purchased by another installer"
5. Check "Unlock Lead" button is disabled or hidden
6. Verify card has reduced opacity (dimmed)
7. Try clicking purchase button (should not work)
8. Open DevTools Network tab
9. Check API response includes `isPurchasedByAnother: true`

**Expected Results:**
- ✅ Installer B sees "purchased by another" banner
- ✅ Button disabled/hidden
- ✅ Card visually dimmed
- ✅ API returns correct flag
- ✅ No way for Installer B to purchase
- ✅ No console errors

**❌ STOP CRITERIA:**
- ❌ If Installer B can still purchase → Fix API check
- ❌ If banner doesn't show → Fix UI conditional
- ❌ If API missing field → Check assigned route

**✅ CHECKPOINT 4:** Multi-installer detection working. 

---

## 🎯 INSTALLER FLOW COMPLETE

**Before Proceeding to Admin/Homeowner:**

### Manual Testing Checklist:
- [ ] Phase 2: Purchase flow works end-to-end
- [ ] Phase 3: Purchased leads page displays correctly
- [ ] Phase 4: Multi-installer state shows correctly
- [ ] No console errors in any phase
- [ ] All API calls return 200 status
- [ ] Contact masking/unmasking works correctly
- [ ] Tab filtering works in purchased page
- [ ] Purchase button disabled for purchased leads

### Build Validation:
```bash
# Run full build
npm run build

# Check for warnings
# Should complete without errors
```

**Expected:**
- ✅ Build: 0 errors, 0 warnings
- ✅ All manual tests passed

**❌ STOP:** If ANY test failed, DO NOT proceed to Phase 6. Fix first.

**✅ PROCEED:** Once all tests pass, proceed to Phase 6 (Homeowner Flow).

---

## PHASE 6: Homeowner Flow (AFTER Installer Complete)

**Goal:** Lock homeowner actions after purchase, show notifications

**Prerequisites:** Phases 2-4 must ALL pass

### Task 6.1: Add Purchase Notification
**File:** `src/app/api/installer/leads/[id]/purchase/route.ts`

**Change:**
```typescript
// FIND (after successful lead update, around line 110):
const updatedLead = await prisma.lead.update({
  where: { id: leadId },
  data: {
    installerId: session.user.id,
    purchasedAt: new Date(),
    purchaseStatus: 'COMPLETED',
    status: 'PURCHASED'
  },
  include: {
    homeowner: {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true
      }
    }
  }
});

// ADD after update (before return):
// Create notification for homeowner
await prisma.notification.create({
  data: {
    userId: updatedLead.homeownerId,
    type: 'LEAD_PURCHASED',
    title: 'Installer Responded to Your Request',
    message: 'An installer has responded to your solar request and will contact you soon.',
    leadId: updatedLead.id,
    read: false
  }
});
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds

---

### Task 6.2: Block Homeowner Edit After Purchase
**File:** `src/app/api/homeowner/leads/[id]/route.ts`

**Find PUT/PATCH/DELETE handlers and add validation:**
```typescript
// At the start of PUT/PATCH/DELETE handler, ADD:
const existingLead = await prisma.lead.findUnique({
  where: { id: params.id },
  select: { purchasedAt: true, homeownerId: true }
});

// Check if purchased
if (existingLead.purchasedAt) {
  return NextResponse.json(
    {
      error: 'Cannot modify lead after installer purchase',
      message: 'An installer has already responded to this request. Please contact them directly.'
    },
    { status: 403 }
  );
}
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds

---

### Task 6.3: Test Homeowner Flow

**Prerequisites:**
- Complete Phases 2-4
- Have homeowner account for a purchased lead

**Test Steps:**

**Part 1 - Notification:**
1. Login as installer
2. Purchase a lead (Phase 2 flow)
3. Logout
4. Login as homeowner (owner of that lead)
5. Navigate to homeowner dashboard
6. Check for notification bell/badge
7. Open notifications
8. Verify message: "Installer Responded to Your Request"
9. Check notification details

**Part 2 - Lead Status:**
1. Navigate to homeowner leads page
2. Find the purchased lead
3. Verify status badge shows "Installer Responded" or similar
4. Check for message about installer contacting soon

**Part 3 - Edit Block:**
1. Try to click "Edit" on purchased lead
2. Should be disabled or show error
3. Try to cancel lead
4. Should be blocked with message
5. Check error message is clear

**Expected Results:**
- ✅ Notification created in database
- ✅ Homeowner sees notification
- ✅ Lead status updated correctly
- ✅ Edit button disabled/hidden
- ✅ Cancel action blocked
- ✅ Error messages clear and helpful
- ✅ No console errors

**❌ STOP CRITERIA:**
- ❌ If notification missing → Check notification creation
- ❌ If edit still works → Check validation logic
- ❌ If error message unclear → Update message text

**✅ CHECKPOINT 6:** Homeowner flow working. Proceed to Phase 7.

---

## PHASE 7: Admin Flow (FINAL)

**Goal:** Admin can view purchase info and track lifecycle

**Prerequisites:** Phases 2-4 and 6 must ALL pass

### Task 7.1: Update Admin Lead Modal
**File:** `src/components/admin/LeadDetailsModal.tsx`

**Change:**
```typescript
// FIND the lead details section (inside modal body)
// ADD new section after lead details:

{lead.purchasedAt && (
  <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4 mt-4">
    <h4 className="text-heading-4 text-foreground mb-3">Purchase Information</h4>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-small text-muted">Purchased By:</span>
        <span className="text-body-small text-foreground">
          {lead.installer?.companyName || 'Unknown Installer'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-small text-muted">Purchase Date:</span>
        <span className="text-body-small text-foreground">
          {new Date(lead.purchasedAt).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-small text-muted">Purchase Status:</span>
        <span className="px-2 py-1 text-caption rounded-full bg-success/10 text-success">
          {lead.purchaseStatus}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-small text-muted">Lead Price:</span>
        <span className="text-body-small text-foreground">
          ${lead.leadPrice || 'N/A'}
        </span>
      </div>
    </div>
  </div>
)}
```

**Testing:**
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds
- ✅ No styling conflicts

---

### Task 7.2: Test Admin View

**Prerequisites:**
- Complete Phases 2-4 and 6
- Have admin account
- Have at least 1 purchased lead

**Test Steps:**
1. Login as admin
2. Navigate to admin leads page
3. Find a purchased lead
4. Click to open lead details modal
5. Scroll to "Purchase Information" section
6. Verify all fields display correctly:
   - Installer company name
   - Purchase date (formatted)
   - Purchase status (COMPLETED)
   - Lead price
7. Check styling matches design system
8. Close modal
9. Open another unpurchased lead
10. Verify "Purchase Information" section doesn't show

**Expected Results:**
- ✅ Purchase info section displays for purchased leads
- ✅ All data accurate
- ✅ Styling consistent with design system
- ✅ Section hidden for unpurchased leads
- ✅ No console errors

**❌ STOP CRITERIA:**
- ❌ If data missing → Check include in query
- ❌ If styling wrong → Check class names
- ❌ If shows for unpurchased → Check conditional

**✅ CHECKPOINT 7:** Admin flow complete.

---

## 🏁 FINAL VALIDATION

**ALL PHASES COMPLETE - Run Full Test Suite:**

### 1. Build Validation
```bash
npm run build
```
**Expected:** 0 errors, 0 warnings

### 2. Type Check
```bash
npx tsc --noEmit
```
**Expected:** 0 errors

### 3. Manual Test Matrix

**Installer Tests:**
- [ ] Can view assigned CALL_VISIT leads
- [ ] Can purchase lead (mock payment works)
- [ ] Contact details unlock after purchase
- [ ] Purchased leads show in purchased-leads page
- [ ] Tabs filter correctly (Call/Visit, Written, Bidding)
- [ ] Cannot purchase lead bought by another installer
- [ ] "Purchased by another" banner shows correctly

**Homeowner Tests:**
- [ ] Receives notification on purchase
- [ ] Lead status updates to "Installer Responded"
- [ ] Cannot edit purchased lead
- [ ] Cannot cancel purchased lead
- [ ] Clear error messages on blocked actions

**Admin Tests:**
- [ ] Can view purchase info in lead modal
- [ ] All purchase details accurate
- [ ] Purchase info only shows for purchased leads
- [ ] Can track lead lifecycle

**Cross-Role Tests:**
- [ ] Installer A purchases → Installer B sees "purchased by another"
- [ ] Installer purchases → Homeowner notified immediately
- [ ] Homeowner actions locked → Installer has contact
- [ ] Admin can see full history

### 4. Edge Cases
- [ ] Expired lead cannot be purchased
- [ ] Concurrent purchase (2 installers) → Only 1 succeeds
- [ ] Lead cancelled by homeowner → Shows correct state
- [ ] Network error during purchase → Error handled gracefully

### 5. Design System Compliance
- [ ] All colors use CSS variables (no hex codes)
- [ ] All spacing uses design tokens
- [ ] Typography uses semantic classes
- [ ] Buttons use semantic variants
- [ ] Forms use consistent styling
- [ ] No inline styles anywhere

**✅ SUCCESS CRITERIA:**
- All manual tests passed
- Build with 0 errors
- No console errors in browser
- Design system compliant
- All 3 user flows working

**📝 DOCUMENTATION:**
- Update gitstatus.md with completion
- Document any deviations from plan
- Note Stripe integration points for future

---

## 🔄 ROLLBACK PROCEDURES

**If Critical Issues Found:**

### Phase 7 Rollback:
```bash
# Revert admin modal changes
git checkout HEAD -- src/components/admin/LeadDetailsModal.tsx
npm run build
```

### Phase 6 Rollback:
```bash
# Revert homeowner validation
git checkout HEAD -- src/app/api/homeowner/leads/[id]/route.ts
# Revert notification creation
git checkout HEAD -- src/app/api/installer/leads/[id]/purchase/route.ts
npm run build
```

### Phase 4 Rollback:
```bash
# Revert UI changes
git checkout HEAD -- src/components/InstallerLeadFeed.tsx
# Revert API changes
git checkout HEAD -- src/app/api/installer/leads/assigned/route.ts
git checkout HEAD -- src/app/installer/(dashboard)/leads/page.tsx
npm run build
```

### Phase 3 Rollback:
```bash
# Delete endpoint
rm src/app/api/installer/leads/purchased/route.ts
# Revert page
git checkout HEAD -- src/app/installer/(dashboard)/purchased-leads/page.tsx
npm run build
```

### Phase 2 Rollback:
```bash
# Revert modal
git checkout HEAD -- src/components/InstallerLeadFeed.tsx
npm run build
```

**After any rollback:** Re-test previous working state before attempting fixes.

---

**End of Implementation Tasks**
