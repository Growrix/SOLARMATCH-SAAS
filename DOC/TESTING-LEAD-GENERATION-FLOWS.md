# Testing Guide: Complete Lead Generation and Signup Flows

**Date**: November 18, 2025  
**Status**: Ready for Testing  
**Fixes Applied**: Auth architecture restored + Phase 23 session persistence

---

## What Was Fixed

### Issue 1: Signup Requiring Name (FIXED ✅)
- **Problem**: Signup modal was requiring name field, causing direct signup to fail
- **Root Cause**: Misunderstanding of where contact info is collected
- **Solution**: Reverted to simple email+password signup; name/phone/address collected during 1st lead

### Issue 2: Verification Modal Re-appearing (FIXED ✅ - Phase 23)
- **Problem**: Users with verified phone seeing verification modal again on 3rd+ leads
- **Root Cause**: NextAuth session not updating after OTP verification
- **Solution**: Added `updateSession()` call after OTP success to persist `phoneVerified: true`

### Issue 3: Hardcoded Lead Limits (FIXED ✅)
- **Problem**: Frontend using MAX_LEADS=3 instead of 5
- **Solution**: Added `MAX_LEADS=5` constant and replaced all hardcoded values

---

## Testing Instructions

### Test 1: Direct Signup Flow
**Goal**: Verify signup from header works with email+password only

**Steps**:
1. Navigate to homepage
2. Click "Sign Up" button in header
3. Enter:
   - Email: `test+direct@example.com`
   - Password: `TestPass123`
   - Confirm Password: `TestPass123`
4. Click "Create Account"

**Expected**:
- ✅ Account created successfully
- ✅ Automatically signed in
- ✅ Redirected to homeowner dashboard
- ✅ User.name = null, User.phone = null (in database)

---

### Test 2: Direct Signup → First Lead Generation
**Goal**: Verify contact info is collected during first lead

**Steps**:
1. From dashboard, navigate to homepage
2. Fill InstantQuote form:
   - Postcode: 2000
   - Monthly electricity bill: $300
3. Click "Get Your Quotes"
4. **Expected**: QuoteOptionsModal appears (because userLeadCount = 0)
5. Select "Call/Visit" or "Written Quote"
6. **Expected**: HomeownersInfoForm appears
7. Fill form:
   - Full Name: `John Direct`
   - Phone: `0400111222`
   - Address: `123 Direct St, Sydney`
8. Click "Continue"
9. **Expected**: Lead created, FirstQuoteSuccessModal appears

**Verify in Database**:
```sql
SELECT id, email, name, phone, leadSubmissionCount FROM "User" WHERE email = 'test+direct@example.com';
-- Expected: name = 'John Direct', phone = '0400111222', leadSubmissionCount = 1

SELECT id, name, "phoneNumber", address, "quoteType" FROM "Lead" WHERE "homeownerId" = (SELECT id FROM "User" WHERE email = 'test+direct@example.com');
-- Expected: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St, Sydney'
```

---

### Test 3: Guest Lead Generation Flow
**Goal**: Verify guest can generate lead then signup

**Steps**:
1. Open homepage in **incognito/private window** (ensure not logged in)
2. Fill InstantQuote form:
   - Postcode: 2000
   - Monthly electricity bill: $300
3. Click "Get Your Quotes"
4. **Expected**: QuoteOptionsModal appears
5. Select "Call/Visit" or "Written Quote"
6. **Expected**: HomeownersInfoForm appears
7. Fill form:
   - Full Name: `Jane Guest`
   - Phone: `0400333444`
   - Address: `456 Guest Ave, Sydney`
8. Click "Continue"
9. **Expected**: HomeownerSignupModal appears
10. Fill signup form:
    - Email: `test+guest@example.com`
    - Password: `TestPass123`
    - Confirm Password: `TestPass123`
11. Click "Create Account"

**Expected**:
- ✅ Account created
- ✅ Automatically signed in
- ✅ Lead created with name/phone/address
- ✅ QuoteSuccessModal appears
- ✅ User.name = 'Jane Guest', User.phone = '0400333444'

---

### Test 4: Second Lead → Phone Verification
**Goal**: Verify phone verification is required during 2nd lead

**Steps**:
1. Login as `test+direct@example.com` (from Test 2)
2. Generate 2nd lead (fill InstantQuote form again)
3. Click "Get Your Quotes"
4. **Expected**: ContactVerificationModal appears (because userLeadCount = 1, phoneVerified = false)
5. Phone number should be prefilled: `0400111222`
6. Click "Request OTP"
7. **Expected**: OTP sent via SMS (check Twilio logs if in dev)
8. Enter OTP code
9. Click "Verify"

**Expected**:
- ✅ OTP verification succeeds
- ✅ Session updated with `phoneVerified: true` (Phase 23 fix)
- ✅ QuoteTypeDistributionModal appears
- ✅ Select quote types → Lead created

**Verify in Database**:
```sql
SELECT id, email, "phoneVerified", leadSubmissionCount FROM "User" WHERE email = 'test+direct@example.com';
-- Expected: phoneVerified = true, leadSubmissionCount = 2
```

---

### Test 5: Session Persistence (CRITICAL - Phase 23 Test)
**Goal**: Verify verified status persists across browser sessions

**Steps**:
1. After Test 4, **close browser completely**
2. Reopen browser
3. Navigate to homepage
4. Login as `test+direct@example.com`
5. Generate 3rd lead (fill InstantQuote form)
6. Click "Get Your Quotes"

**Expected**:
- ✅ **QuoteTypeDistributionModal** appears directly (NO ContactVerificationModal!)
- ✅ Phone verification NOT required (already verified)
- ✅ Select quote types → Lead created

**If ContactVerificationModal appears again**:
- ❌ Phase 23 fix failed
- ❌ Session not persisting `phoneVerified: true`
- ❌ Check `handleOTPVerificationSuccess()` in page.tsx for `updateSession()` call

---

### Test 6: Third, Fourth, Fifth Leads (No Re-verification)
**Goal**: Verify 3rd-5th leads work without re-asking for contact info or verification

**Steps**:
1. Continue from Test 5 (after 3rd lead created)
2. Generate 4th lead → Click "Get Your Quotes"
3. **Expected**: QuoteTypeDistributionModal (NO verification)
4. Generate 5th lead → Click "Get Your Quotes"
5. **Expected**: QuoteTypeDistributionModal (NO verification)
6. Try to generate 6th lead → Click "Get Your Quotes"
7. **Expected**: LeadLimitReachedModal appears (5 lead limit reached)

**Verify in Database**:
```sql
SELECT id, email, leadSubmissionCount FROM "User" WHERE email = 'test+direct@example.com';
-- Expected: leadSubmissionCount = 5
```

---

### Test 7: Contact Info Reuse
**Goal**: Verify subsequent leads use stored name/phone/address (not re-collected)

**Steps**:
1. Login as `test+direct@example.com`
2. Check lead records in database:

```sql
SELECT id, name, "phoneNumber", address, "createdAt" FROM "Lead" 
WHERE "homeownerId" = (SELECT id FROM "User" WHERE email = 'test+direct@example.com')
ORDER BY "createdAt" ASC;
```

**Expected**:
- ✅ Lead 1: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St'
- ✅ Lead 2: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St' (inherited)
- ✅ Lead 3: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St' (inherited)
- ✅ Lead 4: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St' (inherited)
- ✅ Lead 5: name = 'John Direct', phoneNumber = '0400111222', address = '123 Direct St' (inherited)

---

## Test Matrix Summary

| Test | Flow | Expected Modal | Status |
|------|------|----------------|--------|
| 1 | Direct signup (header) | HomeownerSignupModal (email+password) | ⏳ |
| 2 | First lead after signup | QuoteOptionsModal → HomeownersInfoForm | ⏳ |
| 3 | Guest lead generation | QuoteOptionsModal → HomeownersInfoForm → HomeownerSignupModal | ⏳ |
| 4 | Second lead verification | ContactVerificationModal → OTP → QuoteTypeDistributionModal | ⏳ |
| 5 | Third lead (after refresh) | QuoteTypeDistributionModal (NO verification!) | ⏳ |
| 6 | Fourth/Fifth leads | QuoteTypeDistributionModal | ⏳ |
| 7 | Sixth lead (limit) | LeadLimitReachedModal | ⏳ |
| 8 | Contact info inheritance | All leads use first lead's name/phone/address | ⏳ |

---

## Success Criteria

✅ **All Flows Working When**:
1. Direct signup collects email+password only
2. Guest signup collects email+password only
3. First lead collects name/phone/address via HomeownersInfoForm
4. User model updated with name/phone from first lead
5. Second lead requires phone verification
6. Session persists `phoneVerified: true` after browser close
7. Third-fifth leads work without re-verification
8. Sixth lead shows limit reached modal
9. All leads inherit contact info from first lead
10. Zero re-collection of name/phone/address after first lead

---

## Common Issues and Fixes

### Issue: Signup modal requiring name
**Symptom**: "Email, password, and name are required" error  
**Cause**: Not reverted to simple signup  
**Fix**: Check `HomeownerSignupModal.tsx` - should ONLY have email/password fields

### Issue: Verification modal showing again on 3rd lead
**Symptom**: ContactVerificationModal appears after already verifying  
**Cause**: Session not persisting `phoneVerified: true`  
**Fix**: Check `handleOTPVerificationSuccess()` in page.tsx for `updateSession()` call

### Issue: User.name is null after first lead
**Symptom**: Database shows User.name = null even after first lead  
**Cause**: User model not updated from lead  
**Fix**: Check `lead-service.ts` line 270 for User.update with name/phone

### Issue: Lead limit showing at 3 instead of 5
**Symptom**: LeadLimitReachedModal at 3rd lead instead of 6th  
**Cause**: Hardcoded MAX_LEADS=3  
**Fix**: Check page.tsx for `MAX_LEADS = 5` constant

---

## Database Cleanup (After Testing)

```sql
-- Delete test users and their leads
DELETE FROM "Lead" WHERE "homeownerId" IN (
  SELECT id FROM "User" WHERE email LIKE 'test+%@example.com'
);

DELETE FROM "User" WHERE email LIKE 'test+%@example.com';
```

---

**END OF TESTING GUIDE**
