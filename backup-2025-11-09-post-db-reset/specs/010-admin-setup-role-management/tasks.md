# Phase 10: Admin Setup & Role Management

**Status**: 🚀 READY TO START  
**Priority**: CRITICAL  
**Estimated Time**: 2.5 hours  
**Dependencies**: Phase 7 (Clerk Migration) Complete ✅

---

## Overview

After database reset, system needs:
1. Admin user for dashboard access
2. Clerk role management verification
3. Seed data for testing
4. Complete authentication documentation

---

## Tasks

### ✅ Step 10.0: Backup & Commit (10 minutes)
- [ ] Create local backup: `backup-2025-11-09-post-db-reset/`
- [ ] Stage all changes: `git add .`
- [ ] Commit: `git commit -m "feat: Complete Clerk migration - database reset and seeded"`
- [ ] Verify commit successful

---

### 🔴 Step 10.1: Create Admin User (15 minutes) **CRITICAL**

**Objective**: Create admin user to access admin dashboard

#### Tasks:
- [ ] Create file: `prisma/seed-admin.ts`
  - [ ] Import Prisma Client
  - [ ] Define admin user data (email, clerkId, role=ADMIN)
  - [ ] Create admin user in database
  - [ ] Add console logging for success/error

- [ ] Update `package.json`:
  - [ ] Add script: `"seed:admin": "npx tsx prisma/seed-admin.ts"`

- [ ] Get Clerk User ID:
  - [ ] Login to Clerk Dashboard
  - [ ] Go to Users section
  - [ ] Copy current user's User ID
  - [ ] Use this as `clerkId` in seed script

- [ ] Run seed script:
  - [ ] Execute: `npm run seed:admin`
  - [ ] Verify admin user created in database
  - [ ] Check `clerkId` matches Clerk dashboard

- [ ] Update Clerk publicMetadata:
  - [ ] In Clerk Dashboard → Users → Select user
  - [ ] Add to publicMetadata: `{ "role": "ADMIN" }`
  - [ ] Save changes

- [ ] Test admin access:
  - [ ] Navigate to: `http://localhost:3000/admin`
  - [ ] Verify admin dashboard loads
  - [ ] Check no access denied errors
  - [ ] Verify admin-only features visible

#### Verification Checklist:
- [ ] ✅ Admin user exists in database (role=ADMIN)
- [ ] ✅ Admin user has valid clerkId
- [ ] ✅ Clerk account has role in publicMetadata
- [ ] ✅ Can access `/admin` routes
- [ ] ✅ Middleware allows admin access

#### Files Created/Modified:
- `prisma/seed-admin.ts` (NEW)
- `package.json` (MODIFIED - add script)

---

### 🟡 Step 10.2: Audit Clerk Webhook (20 minutes)

**Objective**: Verify Clerk webhook works correctly for user creation and role sync

#### Tasks:
- [ ] Check Clerk Dashboard Configuration:
  - [ ] Login to Clerk Dashboard
  - [ ] Navigate to: Webhooks section
  - [ ] Verify webhook URL is configured
  - [ ] Check webhook secret matches `.env`
  - [ ] Verify events enabled: `user.created`, `user.updated`

- [ ] Audit webhook code:
  - [ ] Read: `src/app/api/webhooks/clerk/route.ts`
  - [ ] Check role assignment logic
  - [ ] Verify error handling
  - [ ] Check database user creation
  - [ ] Review logging statements

- [ ] Add enhanced logging:
  - [ ] Add console.log for webhook received
  - [ ] Log user creation with role
  - [ ] Log any errors
  - [ ] Add timestamp logging

- [ ] Test webhook manually:
  - [ ] Create test Clerk user in dashboard
  - [ ] Check Next.js terminal for webhook logs
  - [ ] Verify user created in database
  - [ ] Check role assigned correctly

- [ ] Test role sync:
  - [ ] Update role in Clerk publicMetadata
  - [ ] Trigger user update event
  - [ ] Check database role updated
  - [ ] Test middleware recognizes new role

#### Verification Checklist:
- [ ] ✅ Webhook URL configured in Clerk
- [ ] ✅ Webhook secret matches `.env.local`
- [ ] ✅ New user creation triggers webhook
- [ ] ✅ User created in database with correct role
- [ ] ✅ Role updates sync correctly
- [ ] ✅ No errors in webhook logs

#### Files Modified:
- `src/app/api/webhooks/clerk/route.ts` (add logging)

---

### 🟢 Step 10.3: Create Installer Signup Flow (30 minutes) **OPTIONAL**

**Objective**: Allow installers to sign up (with admin approval)

**Decision**: Choose one option:
- **Option A**: Installers sign up via Clerk, admin approves (RECOMMENDED)
- **Option B**: Admin creates installer accounts manually
- **Option C**: Special installer signup page with verification

#### If Option A (Recommended):

##### Tasks:
- [ ] Create installer request page:
  - [ ] File: `src/app/installer/sign-up/page.tsx`
  - [ ] Add Clerk SignUp component
  - [ ] Add "Request Installer Account" form
  - [ ] Collect business details (company name, ABN, etc.)
  - [ ] Submit to API route

- [ ] Create API route:
  - [ ] File: `src/app/api/installer/request/route.ts`
  - [ ] Accept installer request
  - [ ] Create user with role=INSTALLER, status=PENDING
  - [ ] Send notification to admin
  - [ ] Return success message

- [ ] Create admin approval page:
  - [ ] Add section in `/admin` for pending installers
  - [ ] Show installer details
  - [ ] Add approve/reject buttons
  - [ ] Update installer status on action

- [ ] Create approval API:
  - [ ] File: `src/app/api/admin/installers/[id]/approve/route.ts`
  - [ ] Update installer status to VERIFIED
  - [ ] Send email notification to installer
  - [ ] Log action in audit table

#### If Option B (Manual Creation):
- [ ] Document process in admin guide
- [ ] Create admin UI for adding installers
- [ ] Skip signup page creation

#### Verification Checklist:
- [ ] ✅ Installer can request account
- [ ] ✅ Request appears in admin dashboard
- [ ] ✅ Admin can approve/reject
- [ ] ✅ Approved installer can access marketplace
- [ ] ✅ Rejected installer cannot access

#### Files Created (Option A):
- `src/app/installer/sign-up/page.tsx` (NEW)
- `src/app/api/installer/request/route.ts` (NEW)
- `src/app/api/admin/installers/[id]/approve/route.ts` (NEW)

---

### 🟢 Step 10.4: Create Comprehensive Seed Data (20 minutes)

**Objective**: Seed database with test data for all roles and scenarios

#### Tasks:
- [ ] Create seed script:
  - [ ] File: `prisma/seed-complete.ts`
  - [ ] Import Prisma Client
  - [ ] Add data creation functions

- [ ] Seed Users:
  - [ ] 1 admin (already created, skip or verify)
  - [ ] 3 installers (verified, with Clerk IDs)
  - [ ] 2 homeowners (1 verified, 1 unverified)

- [ ] Seed Leads:
  - [ ] 3 PENDING leads (awaiting approval)
  - [ ] 3 APPROVED leads (available for purchase)
  - [ ] 2 PURCHASED leads (assigned to installers)
  - [ ] 2 REJECTED leads (declined by admin)

- [ ] Document credentials:
  - [ ] File: `DOC/SEED-DATA-CREDENTIALS.md`
  - [ ] List all test accounts
  - [ ] Include emails and Clerk IDs
  - [ ] Document lead IDs for testing

- [ ] Add package.json script:
  - [ ] `"seed:complete": "npx tsx prisma/seed-complete.ts"`
  - [ ] `"seed:reset": "npx prisma migrate reset && npm run seed:complete"`

- [ ] Run seed script:
  - [ ] Execute: `npm run seed:complete`
  - [ ] Verify all users created
  - [ ] Verify all leads created
  - [ ] Check data in database

#### Seed Data Structure:
```
Users:
├── admin@solarmatch.com (ADMIN, verified)
├── installer1@solarmatch.com (INSTALLER, verified)
├── installer2@solarmatch.com (INSTALLER, verified)
├── installer3@solarmatch.com (INSTALLER, pending)
├── homeowner1@solarmatch.com (HOMEOWNER, verified)
└── homeowner2@solarmatch.com (HOMEOWNER, unverified)

Leads:
├── 3 PENDING (postcode: 2000, 3000, 4000)
├── 3 APPROVED (postcode: 5000, 6000, 7000)
├── 2 PURCHASED (assigned to installer1, installer2)
└── 2 REJECTED (reason: duplicate, incomplete)
```

#### Verification Checklist:
- [ ] ✅ All users created in database
- [ ] ✅ All leads created with correct status
- [ ] ✅ Relationships correct (purchased leads → installers)
- [ ] ✅ Can login as any test user
- [ ] ✅ Credentials documented

#### Files Created:
- `prisma/seed-complete.ts` (NEW)
- `DOC/SEED-DATA-CREDENTIALS.md` (NEW)
- `package.json` (MODIFIED - add scripts)

---

### 🟡 Step 10.5: Optimize Middleware Performance (15 minutes)

**Objective**: Add caching to reduce database calls on every request

#### Tasks:
- [ ] Analyze current performance:
  - [ ] Count role checks per page load
  - [ ] Measure average DB query time
  - [ ] Identify bottlenecks

- [ ] Implement role caching:
  - [ ] Add in-memory cache (Map or LRU)
  - [ ] Cache key: clerkId
  - [ ] Cache value: { role, timestamp }
  - [ ] Cache TTL: 5 minutes

- [ ] Update middleware:
  - [ ] File: `src/middleware.ts`
  - [ ] Check cache before DB query
  - [ ] Update cache on role fetch
  - [ ] Add cache invalidation logic

- [ ] Add cache metrics:
  - [ ] Log cache hits/misses
  - [ ] Calculate hit rate
  - [ ] Monitor performance improvement

- [ ] Test caching:
  - [ ] Load page multiple times
  - [ ] Verify DB calls reduced
  - [ ] Change role, verify cache updates
  - [ ] Check cache expiry works

#### Performance Goals:
- Reduce role checks: From 100% to <5% of requests
- Cache hit rate: >95%
- Response time: <10ms for cached requests

#### Verification Checklist:
- [ ] ✅ Cache implemented correctly
- [ ] ✅ DB calls reduced significantly
- [ ] ✅ Cache hit rate >95%
- [ ] ✅ Role updates still work
- [ ] ✅ No stale data issues

#### Files Modified:
- `src/middleware.ts` (add caching)

---

### 📚 Step 10.6: Create Documentation (20 minutes)

**Objective**: Document complete authentication system for developers

#### Tasks:
- [ ] Create Authentication Guide:
  - [ ] File: `DOC/AUTHENTICATION-SYSTEM-GUIDE.md`
  - [ ] Overview of authentication flow
  - [ ] Clerk integration explanation
  - [ ] Role-based access control
  - [ ] User creation flow diagrams
  - [ ] Troubleshooting section

- [ ] Create Role Management Guide:
  - [ ] File: `DOC/ROLE-MANAGEMENT-GUIDE.md`
  - [ ] How roles work (ADMIN, INSTALLER, HOMEOWNER)
  - [ ] How to assign roles
  - [ ] Role sync between Clerk and Database
  - [ ] Middleware role checking
  - [ ] Common issues and solutions

- [ ] Create Clerk Configuration Guide:
  - [ ] File: `DOC/CLERK-CONFIGURATION.md`
  - [ ] Clerk dashboard setup steps
  - [ ] Webhook configuration
  - [ ] Environment variables required
  - [ ] publicMetadata structure
  - [ ] Testing Clerk integration

- [ ] Update README.md:
  - [ ] Add authentication section
  - [ ] Link to new documentation
  - [ ] Add Clerk setup instructions
  - [ ] Document seed data usage

#### Verification Checklist:
- [ ] ✅ All documentation created
- [ ] ✅ Diagrams included where helpful
- [ ] ✅ Code examples provided
- [ ] ✅ Troubleshooting section complete
- [ ] ✅ README.md updated

#### Files Created:
- `DOC/AUTHENTICATION-SYSTEM-GUIDE.md` (NEW)
- `DOC/ROLE-MANAGEMENT-GUIDE.md` (NEW)
- `DOC/CLERK-CONFIGURATION.md` (NEW)
- `README.md` (MODIFIED)

---

### ✅ Step 10.7: End-to-End Testing (30 minutes)

**Objective**: Test all authentication flows work correctly

#### Test 1: Admin Flow
- [ ] Login as admin@solarmatch.com
- [ ] Access: `http://localhost:3000/admin`
- [ ] Verify admin dashboard loads
- [ ] Test: Approve a PENDING lead
- [ ] Test: Reject a PENDING lead
- [ ] Test: View installer list
- [ ] Test: Approve pending installer
- [ ] Test: View analytics
- [ ] Verify: No access denied errors

#### Test 2: Installer Flow
- [ ] Login as installer1@solarmatch.com
- [ ] Access: `http://localhost:3000/installer/marketplace`
- [ ] Verify: Can see APPROVED leads
- [ ] Test: Purchase a lead
- [ ] Access: `http://localhost:3000/installer/purchased-leads`
- [ ] Verify: Can see purchased lead details
- [ ] Test: Cannot access `/admin` (should redirect)

#### Test 3: Homeowner Flow
- [ ] Login as homeowner1@solarmatch.com
- [ ] Access: `http://localhost:3000/homeowner/dashboard`
- [ ] Verify: Dashboard loads with user data
- [ ] Test: Submit new lead via quote calculator
- [ ] Test: Phone verification modal (if required)
- [ ] Verify: Lead appears in dashboard
- [ ] Test: Cannot access `/admin` (should redirect)
- [ ] Test: Cannot access `/installer` (should redirect)

#### Test 4: New User Signup
- [ ] Sign up new homeowner via Clerk
- [ ] Verify: User created in database
- [ ] Verify: Role = HOMEOWNER
- [ ] Verify: Can access homeowner dashboard
- [ ] Verify: Cannot access admin/installer routes

#### Test 5: Role Protection
- [ ] Try accessing `/admin` as homeowner → Should redirect
- [ ] Try accessing `/installer` as homeowner → Should redirect
- [ ] Try accessing `/admin` as installer → Should redirect
- [ ] Verify: Middleware protects routes correctly

#### Test 6: Performance
- [ ] Load dashboard 10 times
- [ ] Check terminal for role check logs
- [ ] Verify: Most requests use cache (>95% hit rate)
- [ ] Measure: Page load time <500ms

#### Verification Checklist:
- [ ] ✅ All admin features work
- [ ] ✅ All installer features work
- [ ] ✅ All homeowner features work
- [ ] ✅ Role protection works correctly
- [ ] ✅ New user signup works
- [ ] ✅ Performance acceptable
- [ ] ✅ No errors in console/terminal

---

## Final Deliverables

### Scripts:
- [ ] `prisma/seed-admin.ts` - Admin user creation
- [ ] `prisma/seed-complete.ts` - Complete test data
- [ ] Package.json scripts updated

### Documentation:
- [ ] `DOC/POST-DB-RESET-AUDIT.md` - System audit
- [ ] `DOC/AUTHENTICATION-SYSTEM-GUIDE.md` - Auth guide
- [ ] `DOC/ROLE-MANAGEMENT-GUIDE.md` - Role system
- [ ] `DOC/CLERK-CONFIGURATION.md` - Clerk setup
- [ ] `DOC/SEED-DATA-CREDENTIALS.md` - Test accounts
- [ ] `README.md` - Updated with auth info

### Code:
- [ ] Middleware caching implemented
- [ ] Webhook logging enhanced
- [ ] (Optional) Installer signup flow

### Testing:
- [ ] All 6 test scenarios passed
- [ ] Performance benchmarks met
- [ ] No critical errors found

---

## Success Criteria

Phase 10 is complete when:
- ✅ Admin can access and use admin dashboard
- ✅ All roles work correctly (ADMIN, INSTALLER, HOMEOWNER)
- ✅ Seed data available for testing
- ✅ Documentation complete and accurate
- ✅ All end-to-end tests pass
- ✅ Performance optimized
- ✅ No authentication-related errors

---

## Notes

- Take backup before starting
- Commit after each major step
- Test thoroughly before moving to next step
- Document any issues encountered
- Keep Clerk dashboard open for reference

---

**Total Estimated Time**: 2.5 hours  
**Priority**: CRITICAL  
**Blockers**: None (all dependencies met)
