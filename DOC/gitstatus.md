# Git Status - SolarMatch

## Latest Commits

### Phase 22.1: Fix Flow 2 Modal Issue (November 17, 2025)
**Commit:** `9b6d895` - fix: Phase 22.1 - use FirstQuoteSuccessModal for authenticated first lead  
**Branch:** `main-secondary`  
**Status:** ✅ Complete - Flow 2 now uses correct modal

**Changes:**
- Added `FirstQuoteSuccessModal` import to `src/app/page.tsx`
- Added `isFirstQuoteSuccessModalOpen` state variable
- Added `handleVerifyContactFromFirstQuote` handler function
- Updated `handleAuthenticatedFirstLead` to show `FirstQuoteSuccessModal` (was QuoteSuccessModal)
- Rendered FirstQuoteSuccessModal with correct props:
  * `remainingQuotes` - Shows 2/3 quota
  * `onVerifyContact` - Prepares user for Flow 3
  * `quoteType` - CALL_VISIT or WRITTEN_QUOTE
  * `totalQuoteLimit` - 3 max quotes

**Fix Details:**
- **Before:** Flow 2 showed generic `QuoteSuccessModal` (no quota, no verification CTA)
- **After:** Flow 2 shows `FirstQuoteSuccessModal` (displays quota, has "Verify Contact" button)
- **User Impact:** First-time authenticated users now see remaining quotes and can verify early

**Related:**
- Re-Audit Report: `DOC/AUDIT-REPORTS/LEAD-GENERATION-SYSTEM/11-HOMEPAGE-FLOWS-RE-AUDIT.md`
- Root Cause: Implementation didn't follow original audit specification (10-HOMEPAGE-LEAD-GENERATION-FLOWS-AUDIT.md)

**Known Issue:**
- `/api/user/me` returns 404 (needs creation for full verification status fetching)
- Workaround: Using `/api/leads` to fetch lead count (working)

**Validation:**
- ✅ TypeScript: 0 errors
- ✅ className Violations: 0 (pre-commit hook passed)
- ⚠️ Manual Testing: Required (Flow 2 end-to-end test)

---

### Phase 22: Homepage Lead Generation Flows Fix (November 17, 2025)
**Commit:** `6a351ba` - feat: implement Phase 22 homepage lead generation flows fix  
**Branch:** `main-secondary`  
**Status:** ✅ Complete - Ready for testing

**Changes:**
- Added 7 new state variables for modal management and user data tracking
- Created `LeadLimitReachedModal.tsx` component (neumorphic design, semantic tokens)
- Added `useEffect` to fetch user lead count and phone verification status
- Rewrote `handleQuoteOptionSelected` with conditional flow logic (5 flows)
- Implemented 4 new handler functions:
  * `handleAuthenticatedFirstLead` - Flow 2 handler
  * `handleOTPRequested` - Flow 3 OTP handler
  * `handleVerificationModalClose` - Flow 3 verification completion
  * `handleQuoteDistributionSubmit` - Flows 3 & 4 lead creation
- Updated `handleHomeownerInfoContinue` to support both guest and authenticated flows
- Integrated 3 modals: ContactVerificationModal, QuoteTypeDistributionModal, LeadLimitReachedModal

**Flows Implemented:**
- ✅ Flow 1 (Guest): No changes - InstantQuote → HomeownersInfoForm → Signup → Lead creation
- ✅ Flow 2 (First lead, authenticated): InstantQuote → HomeownersInfoForm → Lead creation → Success
- ✅ Flow 3 (Second lead, unverified): InstantQuote → ContactVerification → QuoteDistribution → Leads
- ✅ Flow 4 (Second+ lead, verified): InstantQuote → QuoteDistribution → Leads
- ✅ Flow 5 (Limit reached): InstantQuote → LeadLimitReachedModal

**Validation:**
- ✅ TypeScript: 0 errors
- ✅ Next.js Build: Success
- ✅ className Violations: 0 (pre-commit hook passed)

**Files Modified:**
- `src/app/page.tsx` - Core flow logic implementation
- `src/components/homeowner/LeadLimitReachedModal.tsx` - New component

**Next Steps:**
- Task 22.9: Manual testing of all 5 flows
- Verify Flow 2: Authenticated first lead data collection
- Verify Flow 3: Verification → Distribution flow
- Verify Flow 4: Direct to distribution (skip verification)
- Verify Flow 5: Lead limit modal display

---

### Phase 21.3: Admin Homeowners Management Page Fixes (November 17, 2025)
**Commit:** `a45b88b` - fix: Phase 21.3 - admin homeowners management className violations  
**Branch:** `main-secondary`  
**Status:** ✅ Complete

**Changes:**
- Fixed 40 className violations in admin homeowners management page
- Replaced hardcoded colors with semantic tokens (bg-surface, text-foreground, border-border)
- Updated badge styling to use semantic status colors
- All components now follow neumorphic design system

**Previous Commits:**
- `c63a18f` - fix: admin homeowners postcode display - filter empty postcodes
- `0d6e4bc` - feat: Phase 21.2 - add quote type aggregation badges to admin homeowners table
- `8875835` - feat: Phase 21.1 - add IP and Address columns to admin homeowners management

---

## Branch Information
**Current Branch:** `main-secondary`  
**Parent Branch:** `main`  
**Last Push:** November 17, 2025  
**Last Pull:** November 17, 2025

## Pending Work
- [ ] Phase 22: Manual testing of all 5 homepage lead generation flows
- [ ] Part D: Comprehensive testing of admin homeowners management page

## Notes
- All commits follow conventional commit format
- Pre-commit hooks validate className usage (0 violations required)
- Build validation ensures TypeScript and Next.js compatibility

---

### Documentation Update (November 19, 2025)
**Commit:** `f3b8ed89aab82400abc58f6ee45c5154a728590c` - Audit: Installer frontend/backend/auth + plan to separate marketing homepage from dashboard via route groups. No code changes yet.  
**Branch:** `main-secondary`
### CALL_VISIT Foundational Progress (November 24, 2025)
**Commit:** `2637a331fa0b534f3408bb507c1d89159ffd8f76` - feat: CALL_VISIT feed flags fix and validation schemas (foundational tasks complete)  
**Branch:** `007-call-visit-lead`  
**Status:** ✅ Foundational Phase 2 tasks (T008–T014) completed; migration still pending (T004 drift)
### CALL_VISIT Contract Mapping (November 24, 2025)
**Commit:** `a89791828442c8a87c98d55a1d25caa161123b2d` - feat: add OpenAPI contract TS mappings for CALL_VISIT feed & purchase (T015)  
**Branch:** `007-call-visit-lead`  
**Status:** ✅ Contract types aligned with OpenAPI specs (T015)

**Changes:**
- Added `src/types/callVisitContracts.ts` mapping purchase & feed responses
- Updated `tasks.md` marking T015 complete (Phase 2 fully done except migration)

**Notes:**
- Ready to begin US1 endpoint implementation (T016–T023)
- Consider resolving migration drift (T004) before audit verification tasks needing persistent log entries

**Validation:**
- ✅ TypeScript compile (pre-commit) clean
- ✅ className scan: 0 violations

---

**Changes:**
- Added atomic purchase service `src/lib/services/call-visit-purchase-service.ts`
- Added feed resolver with corrected flag logic `src/lib/services/feed-service.ts`
- Implemented structured logger `src/lib/logger.ts`
- Implemented resilient audit writer `src/lib/audit/purchase-log.ts`
- Added comprehensive Zod validation schemas `src/lib/validation/leadPurchase.ts`
- Updated tasks file marking Phase 2 tasks complete

**Notes:**
- PurchaseLogEntry migration still blocked by drift (T004) – audit writes wrapped in try/catch
- Next step: Contract type mapping (T015) then US1 endpoint (T016–T023)

**Validation:**
- ✅ TypeScript build (pre-commit) passed
- ✅ className scan: 0 violations
- ✅ Feed flag logic now correctly derives purchasedByMe/purchasedByOther

---

**Files Added:**
- `DOC/Installers/installer-audit-2025-11-19.md`
- `DOC/Installers/plan-homepage-layout-fix.md`

**Summary:** Added full installer-side audit (routes, layouts, middleware/auth, APIs) and a concrete plan to split the installer marketing homepage from the dashboard via App Router route groups.
