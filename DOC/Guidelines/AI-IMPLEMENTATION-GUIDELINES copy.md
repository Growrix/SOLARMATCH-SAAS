# AI Implementation Guidelines
**Purpose**: Universal rules and procedures for AI-assisted development to ensure error-free builds and consistency  
**Date**: November 26, 2025  
**Status**: Active Standard  
**Scope**: All AI models working on this codebase

---

## 🎯 CORE MANDATE

**NEVER implement anything without:**
1. ✅ Comprehensive audit report documenting current state
2. ✅ Clear understanding of data flows, dependencies, and impacts
3. ✅ Detailed implementation plan with testing checkpoints
4. ✅ Alignment verification with constitution.md and design system

**If you don't have clear picture → STOP → Audit → Plan → Then implement**

---

## 📋 MANDATORY PRE-IMPLEMENTATION CHECKLIST

### GATE 0: System Health Verification (BEFORE ANY WORK)

Run these checks BEFORE starting any task:

```powershell
# 1. TypeScript Compilation
npx tsc --noEmit
# Expected: 0 errors

# 2. Build Verification  
npm run build
# Expected: Build completes successfully

# 3. Dev Server Start
npm run dev
# Expected: Starts without errors

# 4. Prisma Schema Validation
npx prisma validate
# Expected: Schema valid

# 5. Check Git Status
git status
# Expected: Know what's modified before you start
```

**❌ STOP CRITERIA**: If ANY check fails, fix it BEFORE proceeding with your task.

---

## 🔍 COMPREHENSIVE AUDIT REQUIREMENTS

### Audit Structure (Mandatory Sections)

Every audit report MUST include:

1. **Current State Analysis**
   - File paths and line numbers
   - Data models and schemas
   - API endpoints and their methods
   - Component dependencies (parent-child tree)
   - Current functionality (what works, what doesn't)

2. **Gap Analysis**
   - What's missing vs what's needed
   - Inconsistencies between frontend/backend
   - Data flow breaks or mismatches
   - UI/UX deviations from design system

3. **Root Cause Identification**
   - Why the issue exists (not just what the issue is)
   - Systemic problems vs isolated bugs
   - Dependencies that might break

4. **Impact Assessment**
   - Which files will be modified
   - Which features might be affected
   - Risk level (Critical/High/Medium/Low)

5. **Implementation Plan**
   - Phased approach with clear milestones
   - Testing checkpoints after each phase
   - Rollback procedures if tests fail

6. **Verification Strategy**
   - Specific test cases for each change
   - Expected results for each test
   - Commands to run for validation

### Component Dependency Mapping (CRITICAL)

**BEFORE migrating/modifying ANY component:**

```powershell
# Step 1: Identify ALL components imported by the target file
Select-String -Path "src\app\your-page\page.tsx" -Pattern "import.*from.*components"

# Step 2: For EACH imported component, check for issues
Select-String -Path "src\components\ComponentName.tsx" -Pattern "hardcoded-pattern"

# Step 3: Create complete file list
# Main file + ALL child components + ALL nested children
```

**Rule**: A task is NOT complete until the main file AND ALL its dependencies are verified clean.

---

## 🏗️ IMPLEMENTATION PHASE STRUCTURE

### Every Phase MUST Follow This Pattern:

```markdown
## PHASE X: [Clear Goal Statement]

**Objective**: What we're trying to achieve

### Task X.1: [Specific Action]
**Files Affected**: 
- src/path/to/file1.tsx (lines 10-50)
- src/path/to/file2.tsx (lines 100-150)

**Changes**:
```typescript
// Clear code example with context
```

**Testing**:
```bash
# Exact commands to run
npx tsc --noEmit
npm run build
```

**Expected Results**:
- ✅ Specific expected outcome 1
- ✅ Specific expected outcome 2

**❌ STOP Criteria**:
- ❌ If X happens, STOP and do Y
- ❌ If Z error appears, fix A before continuing

**✅ Checkpoint**: Only proceed to next task if ALL tests pass.

---

### Task X.2: [Next Action]
[Repeat structure]
```

---

## 🧪 TESTING RULES (NON-NEGOTIABLE)

### Rule 1: STOP-ON-FAIL

```
❌ Test Failed → STOP IMMEDIATELY
❌ DO NOT proceed to next phase
❌ DO NOT implement additional features
✅ Fix the failing test
✅ Re-run the test
✅ Only continue when test passes
```

### Rule 2: INCREMENTAL VALIDATION

**After EVERY file modification:**

```powershell
# 1. TypeScript Check
npx tsc --noEmit

# 2. Build Check  
npm run build

# 3. Browser Console Check
# Open DevTools → Console → Check for errors

# 4. Network Tab Check
# Verify API calls return correct status codes
```

### Rule 3: ROLLBACK ON BREAKING CHANGES

```
Changed File → Breaks Existing Feature?
├─ YES → Revert immediately
│         Fix in isolation
│         Test fix separately
│         Then reapply
└─ NO → Continue with testing
```

### Rule 4: COMPREHENSIVE TESTING BY TASK TYPE

#### UI/UX Changes:
```markdown
**Testing Checklist**:
- ✅ Visual: All 3 themes (Dark, Light, Purple)
- ✅ Responsive: 5 breakpoints (320px, 375px, 768px, 1024px, 1440px)
- ✅ Accessibility: Keyboard navigation, ARIA labels, contrast ratios
- ✅ Design tokens: No hardcoded colors/spacing/typography
- ✅ Browser console: No errors or warnings
- ✅ Semantic classes: Only from globals.css
```

#### Backend/API Changes:
```markdown
**Testing Checklist**:
- ✅ API returns correct status codes (200, 201, 400, 401, 403, 404, 500)
- ✅ Response data structure matches expected format
- ✅ Error handling works (try invalid inputs)
- ✅ Database updates correctly (check via Prisma Studio)
- ✅ Audit logs created for sensitive operations
- ✅ Authorization checks work (test with wrong user role)
```

#### Full-Stack Features:
```markdown
**Testing Checklist**:
- ✅ Frontend renders correctly
- ✅ User interactions trigger correct API calls
- ✅ API processes requests correctly
- ✅ Database reflects changes
- ✅ UI updates after API response
- ✅ Error states display properly
- ✅ Success messages appear
- ✅ Loading states work
```

### Rule 5: CHECKPOINT VALIDATION

**At the end of each phase:**

```markdown
## ✅ PHASE X CHECKPOINT

**Completed Tasks**:
- [x] Task X.1: Description
- [x] Task X.2: Description
- [x] Task X.3: Description

**All Tests Passed**:
- ✅ TypeScript: 0 errors
- ✅ Build: Success
- ✅ Manual tests: All passed
- ✅ No console errors
- ✅ No broken functionality

**Ready to Proceed**: YES / NO

**If NO**: List what needs fixing before next phase
```

---

## 🎨 UI/UX IMPLEMENTATION STANDARDS

### Design System Compliance (MANDATORY)

**ALWAYS reference these files:**
- `DOC/Guidelines/DESIGN-SYSTEM-SOT.md` - Design tokens and patterns
- `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md` - Layout patterns

### Forbidden Practices (NEVER DO THESE):

```typescript
// ❌ WRONG: Hardcoded colors
<div className="bg-white text-gray-800">

// ❌ WRONG: Inline styles
<div style={{ backgroundColor: '#fff', color: '#333' }}>

// ❌ WRONG: Dark mode classes
<div className="bg-gray-100 dark:bg-gray-900">

// ❌ WRONG: Hardcoded spacing
<div className="mt-4 mb-6 px-8">

// ❌ WRONG: Hardcoded typography
<h1 className="text-2xl font-bold">

// ❌ WRONG: RGB/HEX values
<div style={{ color: 'rgb(100, 100, 100)' }}>
```

### Correct Practices (ALWAYS DO THESE):

```typescript
// ✅ CORRECT: Semantic background tokens
<div className="bg-surface text-foreground">

// ✅ CORRECT: Semantic spacing tokens
<div className="spacing-4">

// ✅ CORRECT: Semantic typography tokens
<h1 className="text-heading-1">

// ✅ CORRECT: Semantic color tokens
<p className="text-foreground-muted">
<span className="text-error">Error message</span>
<span className="text-success">Success message</span>

// ✅ CORRECT: Design system components
<button className="btn-primary">Click me</button>
<div className="theme-card">Content</div>
```

### Background Color Decision Tree

```
What are you styling?
├─ Structural element (body, sidebar, header, footer)
│  └─ Use: bg-background
│
├─ Content surface (card, modal, panel, section)
│  └─ Use: bg-surface
│
├─ Elevated surface (dropdown, tooltip, popover)
│  └─ Use: bg-elevated
│
├─ Input fields
│  └─ Use: bg-input
│
└─ Status/semantic colors
   ├─ Error → bg-error (with appropriate alpha)
   ├─ Success → bg-success
   ├─ Warning → bg-warning
   └─ Info → bg-info
```

### Multi-Theme Testing Requirements

**EVERY UI change MUST pass ALL 3 themes:**

```markdown
**Theme Testing**:
1. ✅ Dark theme: Check colors, shadows, contrast
2. ✅ Light theme: Verify neumorphic styling works
3. ✅ Purple theme: Check purple shadows and accents
```

**Common Theme Issues to Watch For:**
- Insufficient contrast (text unreadable)
- Shadow visibility (too strong/weak)
- Border visibility (too prominent/invisible)
- Hover states (not visible enough)

---

## 🔐 BACKEND IMPLEMENTATION STANDARDS

### API Route Structure (Standard Pattern)

```typescript
/**
 * [METHOD] /api/[resource]/[action]
 * Description of what this endpoint does
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function [METHOD](request: NextRequest) {
  try {
    // 1. Authentication Check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // 2. Authorization Check
    if (session.user.role !== 'REQUIRED_ROLE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // 3. Input Validation
    const body = await request.json();
    // Use zod schema validation
    
    // 4. Business Logic
    const result = await prisma.model.operation({
      // database operation
    });
    
    // 5. Audit Logging (for sensitive operations)
    await logAudit({
      action: 'ACTION_NAME',
      userId: session.user.id,
      details: { /* relevant data */ }
    });
    
    // 6. Success Response
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('[API_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Operation Patterns

```typescript
// ✅ CORRECT: Include necessary relations
const lead = await prisma.lead.findUnique({
  where: { id: leadId },
  include: {
    homeowner: { select: { id: true, name: true, email: true } },
    quotes: true
  }
});

// ✅ CORRECT: Use transactions for multi-step operations
const result = await prisma.$transaction(async (tx) => {
  const lead = await tx.lead.update({ /* ... */ });
  const assignment = await tx.leadAssignment.create({ /* ... */ });
  return { lead, assignment };
});

// ✅ CORRECT: Handle not found cases
if (!lead) {
  return NextResponse.json(
    { error: 'Lead not found' },
    { status: 404 }
  );
}
```

---

## 📝 TASKS.MD FILE STRUCTURE (MANDATORY FORMAT)

### Template for Every tasks.md File:

```markdown
# [Feature Name] Implementation Tasks
**Date**: YYYY-MM-DD  
**Branch**: branch-name  
**Implementation Order**: [User Role 1] → [User Role 2] → [User Role 3]

---

## 🎯 MANDATORY TESTING RULES

### Rule 1: STOP-ON-FAIL
- ❌ If ANY test fails in a phase, STOP IMMEDIATELY
- ❌ DO NOT proceed to next phase until all tests pass
- ❌ Fix the failed test before continuing

### Rule 2: INCREMENTAL VALIDATION
- ✅ Test after each file modification
- ✅ Run `npm run build` after each phase
- ✅ Check browser console for errors
- ✅ Verify Network tab shows correct API calls

### Rule 3: ROLLBACK ON BREAKING CHANGES
- ❌ If a change breaks existing functionality, revert immediately
- ❌ Fix in isolation before reapplying

### Rule 4: DESIGN SYSTEM COMPLIANCE
- ✅ Reference DESIGN-SYSTEM-SOT.md for all UI changes
- ✅ Use semantic classes from global CSS only
- ❌ NO hardcoded colors, spacing, or typography
- ❌ NO inline styles
- ❌ NO dark: prefixes

### Rule 5: CHECKPOINT VALIDATION
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

## PHASE 0: Prerequisites & Validation

**Goal**: Verify system health before implementation

### Task 0.1: System Health Check
```bash
npx tsc --noEmit          # Expected: 0 errors
npm run build             # Expected: Build succeeds
npm run dev               # Expected: Server starts
npx prisma validate       # Expected: Schema valid
```

**❌ STOP**: If any check fails, fix before Phase 1.

### Task 0.2: Audit Current State
**Create audit report**: `DOC/[folder]/[FEATURE]-AUDIT.md`

**Audit must include**:
- Current data flows
- Component dependencies
- API endpoints
- Database schema
- Gap analysis
- Root cause of issues

**❌ STOP**: Don't proceed without audit report.

### Task 0.3: Read Design Guidelines
**Review these files**:
- `DOC/Guidelines/DESIGN-SYSTEM-SOT.md`
- `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md`
- `docs/constitution.md`

✅ **Checkpoint 0**: Ready to proceed to Phase 1.

---

## PHASE 1: [Feature Component 1]

### Task 1.1: [Specific Action]
**Files Affected**:
- `src/path/to/file.tsx` (lines X-Y)

**Changes**:
```typescript
// Code with full context
```

**Testing**:
```bash
npx tsc --noEmit
npm run build
```

**Expected Results**:
- ✅ Specific outcome 1
- ✅ Specific outcome 2

**❌ STOP Criteria**:
- ❌ If X happens, do Y

**Manual Test**:
1. Action step 1
2. Action step 2
3. Verify result

**Expected**:
- ✅ Behavior 1
- ✅ Behavior 2

✅ **Checkpoint 1**: All tests pass, proceed to Phase 2.

---

## PHASE 2: [Feature Component 2]
[Repeat structure]
```

---

## 🚫 COMMON MISTAKES TO AVOID

### Mistake 1: False Completion Reporting

```markdown
❌ WRONG:
"Task complete! All issues fixed."

✅ CORRECT:
"Migration Status:
- ✅ Main file (src/app/page.tsx): Clean
- ✅ Child component 1: Clean
- ❌ Child component 2: 5 hardcoded colors found
- ❌ Child component 3: Not checked yet

**Task is INCOMPLETE**. Remaining work: Migrate child components 2 and 3."
```

**Rule**: Never report "complete" unless ALL files are verified. Be explicit about what's done and what's remaining.

### Mistake 2: Ignoring Component Dependencies

```markdown
❌ WRONG APPROACH:
1. Migrate page.tsx
2. Check page.tsx only
3. Report "complete"
4. User sees broken child components

✅ CORRECT APPROACH:
1. Map ALL component dependencies first
2. Migrate main file
3. Migrate ALL child components
4. Verify ENTIRE tree is clean
5. Then report "complete"
```

### Mistake 3: Repeating Failed Approaches

```markdown
Tool/Approach Failed?
├─ Once → Analyze why, adjust context, try once more
├─ Twice → STOP, switch tool or approach
└─ Three times → You're doing something fundamentally wrong
```

**Rule**: If a tool fails twice, stop and switch tools or approach. Don't repeat the same failure 5+ times.

### Mistake 4: Incomplete Verification

```powershell
# ❌ WRONG: Only checking one pattern
Select-String -Pattern "bg-white"

# ✅ CORRECT: Run ALL 6 verification commands
Select-String -Pattern "text-gray-|bg-gray-|border-gray-"      # Command 1
Select-String -Pattern "dark:"                                  # Command 2
Select-String -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"        # Command 3
Select-String -Pattern "text-white|bg-white|text-black"        # Command 4
Select-String -Pattern "text-xs|text-sm|font-bold"            # Command 5
Select-String -Pattern "sm:text-|md:text-"                     # Command 6

# Expected: 0/0/0/0/0/0 (all zero)
```

### Mistake 5: Skipping Audit Phase

```markdown
❌ WRONG:
User: "Fix the login form"
AI: *starts editing files immediately*

✅ CORRECT:
User: "Fix the login form"
AI: "Let me audit the login form first to understand:
     1. Current implementation
     2. What's broken
     3. Dependencies
     4. Impact of changes
     
     Creating audit report in DOC/AUDIT-LOGIN-FORM.md..."
```

**Rule**: NEVER implement without audit. No exceptions.

---

## 📊 VERIFICATION COMMAND REFERENCE

### Hardcoded Color Detection (Run ALL 6)

```powershell
# Command 1: Gray/slate/zinc hardcoded colors
Select-String -Path "src\components\YourComponent.tsx" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"

# Command 2: ALL dark: prefixes
Select-String -Path "src\components\YourComponent.tsx" -Pattern "dark:text-|dark:bg-|dark:border-"

# Command 3: RGB/RGBA/HEX (excluding SVG)
Select-String -Path "src\components\YourComponent.tsx" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}" | Where-Object { $_.Line -notmatch "viewBox|fill=|d=" }

# Command 4: Hardcoded white/black
Select-String -Path "src\components\YourComponent.tsx" -Pattern "text-white\b|bg-white\b|text-black\b|bg-black\b|border-white\b"

# Command 5: Hardcoded color names
Select-String -Path "src\components\YourComponent.tsx" -Pattern "bg-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|text-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]"

# Command 6: Hardcoded typography
Select-String -Path "src\components\YourComponent.tsx" -Pattern "text-xs|text-sm|text-lg|text-xl|text-2xl|font-bold|font-semibold"

# EXPECTED RESULT: 0/0/0/0/0/0
```

### Post-Migration Verification Checklist

```markdown
- [ ] Run ALL 6 verification commands: 0/0/0/0/0/0
- [ ] TypeScript compilation: 0 errors
- [ ] Build succeeds: No errors
- [ ] Visual test: Dark theme passes
- [ ] Visual test: Light theme passes
- [ ] Visual test: Purple theme passes
- [ ] Responsive test: 320px, 768px, 1440px breakpoints
- [ ] Browser console: No errors
- [ ] Network tab: API calls work correctly
- [ ] Component dependencies: ALL child components verified
```

---

## 🔄 WORKFLOW SUMMARY

### For Every Task/Feature:

```
1. ✅ GATE 0: System health check
   └─ Pass → Continue
   └─ Fail → Fix first

2. ✅ AUDIT: Create comprehensive audit report
   └─ Document current state
   └─ Identify gaps
   └─ Root cause analysis
   └─ Implementation plan

3. ✅ PLAN: Create/update tasks.md
   └─ Clear phases
   └─ Testing checkpoints
   └─ Stop criteria

4. ✅ IMPLEMENT: Phase by phase
   └─ One phase at a time
   └─ Test after each phase
   └─ Stop if test fails

5. ✅ VERIFY: Complete verification
   └─ Run all verification commands
   └─ Test all themes
   └─ Check all breakpoints
   └─ Verify all dependencies

6. ✅ REPORT: Honest status
   └─ What's complete
   └─ What's remaining
   └─ Any issues found
```

---

## 📚 REFERENCE FILES (READ THESE FIRST)

**Before ANY implementation, read:**

1. `docs/constitution.md` - Core principles and standards
2. `DOC/Guidelines/DESIGN-SYSTEM-SOT.md` - Design tokens and patterns
3. `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md` - Layout patterns
4. `DOC/Prompts/prompt.md` - User's historical pain points and preferences
5. `DOC/AUDIT-REPORTS/` - Previous issues and lessons learned

**During implementation, reference:**

1. `specs/[current-spec]/tasks.md` - Current task structure
2. `DOC/AUDIT-REPORTS/[relevant-audit].md` - Related audit findings
3. `prisma/schema.prisma` - Database structure

---

## ✅ FINAL CHECKLIST (Before Reporting Complete)

```markdown
- [ ] Audit report created and reviewed
- [ ] ALL component dependencies identified and migrated
- [ ] ALL 6 verification commands return 0 matches
- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] All 3 themes tested and pass
- [ ] All 5 breakpoints tested and pass
- [ ] Browser console: No errors
- [ ] Network tab: All API calls work
- [ ] Manual testing: All features work
- [ ] No existing functionality broken
- [ ] Git commit created with descriptive message
- [ ] Documentation updated (if needed)
```

**Only after ALL checkboxes are ticked can you report task complete.**

---

## 🎯 SUCCESS CRITERIA

**A task is successful when:**

1. ✅ All tests pass (no failures)
2. ✅ No breaking changes to existing features
3. ✅ Code follows design system standards
4. ✅ All component dependencies verified
5. ✅ Honest, accurate reporting (no false "complete" claims)
6. ✅ User can verify results match expectations
7. ✅ System is in a deployable state

**If ANY criterion fails, task is NOT complete.**

---

## 💡 REMEMBER

> **"Never give false information. If you said the task is functional and fixed but in real it is not and there are a lot of issues, this destroys trust and wastes time."**

> **"Always test everything after making changes. Do not attempt blindly if you don't have clear picture."**

> **"Never implement anything without audit and clear understanding or without any audit report."**

> **"Each task/phase should be tested. If failed the test then stop and fix then again test. Move to the next phase only if it is passed."**

> **"You are overcomplicating it, giving fake information while it is not actually fixed" - Keep solutions simple and verify they actually work**

> **"I have been repeating some of these issues again and again. And you are not fixing them effectively. please focus on the main issues and fix them completely." - Listen to repeated feedback and fix root causes**

---

## 🎓 LESSONS FROM HISTORICAL PAIN POINTS

### Critical Pattern Recognition from Actual Project History

Based on analyzing `prompt.md` (2484 lines of historical prompts) and recent conversation logs, here are the REAL recurring pain points that AI models keep repeating:

---

### Pattern 1: "Modal Z-Index Issues" (Current Session - Repeated 3+ Times)
**Repeated Issue:** "the header is overlapping and the left side icons outside looks weird"
**What Happened:**
- Phase 1: User reports modal visibility issues
- AI attempts fix with z-index classes
- Phase 2: User says "you are overcomplicating it, giving fake information while it is not actually fixed"
- Phase 3: AI discovers root cause - using `.z-modal` class that doesn't exist (only CSS variable `--z-modal: 1400`)
- Solution: Use inline style `style={{ zIndex: 1400 }}` instead

**Root Causes:**
1. Assumed CSS utility class exists without verifying in globals.css
2. Didn't test actual modal rendering in browser
3. Reported "fixed" based on code logic instead of visual verification
4. Overcomplicated solution with sticky positioning + negative margins

**Prevention Rules:**
- Before using ANY CSS class, grep for it in globals.css: `Select-String -Path "src\app\globals.css" -Pattern "\.z-modal"`
- Distinguish between CSS variables (`--z-modal: 1400`) and utility classes (`.z-modal`)
- If utility class doesn't exist, use inline style or create the utility class first
- ALWAYS test in browser - open DevTools, inspect element, verify z-index is applied
- Keep solutions simple - don't add complexity (sticky, negative margins) when not needed

### Pattern 2: "Countdown Timer Display Issues" (Current Session - 4 Related Issues)
**Repeated Issues:**
1. "The homeowners lead card ui enhancement was not done as per I said. now it is showing the expiry date, not the countdown timer"
2. "Now I can see there are so many countdown timers in the Quote request details modal"
3. "when the lead is purchased by an installer, there should be no more countdown timer to show"
4. "The countdown timer UI needs to be updated, it should follow the Installers lead card countdown timer style UI"

**What Happened:**
- User wanted EXACT SAME countdown as installer feed ("2d 22h 50m 59s remaining" with colored dot)
- AI implemented static "Expires: Nov 29, 2025" text instead
- AI added countdown to wrong places (preview modal, multiple locations)
- AI didn't match the installer countdown style

**Root Causes:**
1. Didn't audit EXISTING installer countdown implementation first
2. Created NEW countdown instead of reusing LiveCountdownBar component
3. Added countdown everywhere without understanding WHEN to show it (only APPROVED status)
4. Didn't follow user's reference ("follow the Installer Lead card countdown timer design")

**Prevention Rules:**
- When user says "follow X design", FIRST audit X to see exact implementation
- Reuse existing components instead of creating new ones
- Understand business logic: countdown for APPROVED (time to purchase), NO countdown for PURCHASED (already sold)
- Check ALL places component appears (dashboard, modal, feed) and update consistently
- Match styling EXACTLY: same format, same colors, same positioning

### Pattern 3: "Cancelled Leads Still Showing in Installer Feed" (Current Session - Simple Fix)
**Issue:** "when the homeowner cancel a assigned lead before the installer purchase, The assigned leads should be removed from the installers lead feed immediately"

**What Happened:**
- Homeowner cancels lead → Lead status changes to CANCELLED in database ✅
- Installer refreshes feed → Cancelled lead STILL appears ❌
- Root cause: Installer feed query didn't filter out CANCELLED status

**Root Cause:**
- Backend query fetched LeadAssignment without checking lead.status
- Simple filter missing: `status: { not: 'CANCELLED' }`

**Prevention Rules:**
- When user action changes status (cancel, delete, archive), check ALL queries that fetch that resource
- Trace complete flow: UI action → API → Database update → WHO ELSE queries this data?
- Test from DIFFERENT user perspective (if homeowner cancels, what does installer see?)
- Add filter to query: `where: { lead: { status: { not: 'CANCELLED' } } }`

### Pattern 4: "Postcode Input Not Accepting Comma" (From prompt.md - Repeated 5+ Times)
**Repeated Issue:** User requested comma-separated postcode input across multiple phases:
- "in the Postcodes served filed, the user cant enter multiple postcode by using comma"
- "it is not allowing to type comma in the placeholder"
- "Users should be able to type multiple postcodes separated by comma"
- Repeated in verification modal, profile edit, admin view

**What Happened:**
- AI kept fixing validation regex instead of input element
- AI assumed input type="text" but didn't check for maxLength restrictions
- AI tested backend validation but didn't test TYPING comma in browser
- AI reported "fixed" but comma still couldn't be typed

**Root Cause:**
- Fixated on JavaScript validation logic (wrong layer)
- Didn't test user's EXACT action (click field, type comma, verify it appears)
- Missed HTML input element restrictions

**Prevention Rules:**
- When user repeats issue 2+ times, STOP current approach completely
- Test the EXACT user action in browser: Click field → Type comma → Does comma appear? YES/NO
- Check HTML element: `<input type="text" maxLength="4">` blocks comma at 4 chars
- Check input masks or character restrictions in onChange handlers
- Don't just check validation - check if character can be TYPED

### Pattern 5: "Verification Modal Field Mismatch" (From prompt.md - Data Source Inconsistency)
**Repeated Issue:** "The verification modal fileds mismatch with the installers profile details"
- Personal Details: Email fetched from Authentication, Phone NOT fetched from verification
- Profile page shows different data than admin review modal
- Contact verification modal doesn't prefill number for unverified users

**What Happened:**
- Different components pulling from different database tables
- Profile page: Email from User.email (auth), Name from InstallerProfile.representativeName
- Verification modal: Email from User.email, Phone from ContactVerification.phone
- Admin modal: Company from InstallerProfile.companyName (sometimes blank)

**Root Cause:**
- No data source mapping created before implementation
- Assumed all components use same data model
- Didn't trace WHERE each field comes from

**Prevention Rules:**
- BEFORE implementing ANY form/modal, create data source map:
  ```
  Field Name | Table.Column | Notes
  Email → User.email (auth) | Read-only, from signup
  Phone → InstallerProfile.phone | Editable, needs verification
  Company → InstallerProfile.companyName | Required field
  ```
- Ensure ALL views (profile, modal, admin) use SAME data source for same field
- Document in audit: "Email will always come from User.email across all components"

### Pattern 6: "Edit Profile Not Saving" (From prompt.md - False Success Messages)
**Repeated Issue:** "I have tried to edit other fields and save changes, but in real nothing is updated... even it shows 'profile updated successfully' message"
- Contact number edit → OTP verification → "Failed to save changes"
- Other fields edit → "Profile updated successfully" → Database unchanged
- Company details → "Validation failed" error
- Name field → Not editable (should be editable)

**What Happened:**
- Frontend validation passes → Shows success toast
- Backend validation fails → Returns 400 error
- Frontend doesn't check response status, always shows "success"
- Database never updates

**Root Cause:**
- Frontend trusts its own validation, doesn't check API response
- Backend validation rules stricter than frontend
- Success message shown before API call completes

**Prevention Rules:**
- NEVER show success message until API returns 200/201
- Check Network tab Response: Status 400? 500? What's the error?
- Verify in Prisma Studio: Did database row actually change?
- Test flow: Edit → Save → Check Network tab → Check Database → Verify UI reflects change
- Don't trust success messages - always verify data changed

### Pattern 7: "Duplicate Fields in UI" (From prompt.md - Poor Data Modeling)
**Repeated Issue:** "There are duplicate fields in the profile page which is not needed"
- 2 fields for Contact Number (one from auth, one from profile)
- 2 fields for Email Address
- 2 fields for Name (User.name vs InstallerProfile.representativeName)

**What Happened:**
- AI added fields without checking existing fields
- Different forms asking for same data
- User confused which field to edit
- Data inconsistency between duplicates

**Root Cause:**
- Didn't audit existing UI before adding new fields
- No single source of truth for each data point
- Copy-paste pattern led to duplication

**Prevention Rules:**
- Before adding field, grep for existing field: `Select-String -Pattern "Contact Number|phone" src/components/**/*.tsx`
- Map each field to ONE source: Email → User.email (read-only), Phone → InstallerProfile.phone (editable)
- Remove duplicate fields, keep only functional one
- Document: "Representative Name is the user's name, stored in InstallerProfile.representativeName"
- UI principle: One field per data point

### Pattern 8: "Admin Lead Assignment Double-Attempt" (From prompt.md - Workflow Confusion)
**Repeated Issue:** "After clicking on Manage lead button... in the second attempt... I again clicked on the Manage lead button"
- First attempt: Click Approve → Message "lead approved with 6 days countdown" → Nothing happens
- Second attempt: Click Save Changes → Message "lead assigned successfully" → Leads appear
- User has to do TWO attempts to assign one lead

**What Happened:**
- Old "Approve Lead" button doesn't assign to installers
- New "Save Changes" button has assignment logic
- UI shows both buttons, confusing workflow
- User doesn't know which button to click

**Root Cause:**
- Leftover UI from old workflow (approve first, assign later)
- New workflow (assign directly) not fully implemented
- Didn't remove old buttons/actions
- No clear user path

**Prevention Rules:**
- When changing workflow, remove OLD UI completely (don't leave orphaned buttons)
- One action = one button (not "Approve" then "Assign" then "Save")
- Test user's perspective: "What should I click to assign lead?" → Clear answer
- Simplify: Manage Lead → Select Installers → Approve (single action)
- Remove intermediate states if not needed

### Pattern 9: "Admin Has No Back Button" (From prompt.md - Simple UX Gap)
**Repeated Issue:** "the admin dashboard lead management page has no back button to visit back to the dashboard"

**What Happened:**
- User navigates: Dashboard → Lead Details → Stuck (no back button)
- Has to use browser back button or manually type URL
- Poor UX for workflow

**Root Cause:**
- Focused on main feature, forgot basic navigation
- Didn't test user journey end-to-end
- No navigation pattern established

**Prevention Rules:**
- Every detail page needs back button to parent list
- Test complete user journey: Enter page → View details → Return → Should be easy
- Standard pattern: `<button onClick={() => router.back()}>← Back to Dashboard</button>`
- Place back button in consistent location (top-left or breadcrumb)
- Simple fixes shouldn't be forgotten in complex features

### Pattern 10: "Incomplete Testing Instructions" (From prompt.md - User Quote)
**User's Actual Quote:** "I am getting confused after done each phase with what to test exactly manually. I need the exact checklist in real time after done a backend+frontend done."

**Example User Wanted:**
```markdown
✅ CORRECT FORMAT:
**After Backend + Frontend Complete:**
1. You should see a OTP verification modal
2. Enter phone number: 0412345678
3. Click "Send OTP"
4. Check terminal for OTP code (development mode)
5. Enter OTP in modal
6. Click "Verify"
7. Expected: Modal closes, success message appears
8. Expected: Dashboard shows "Verified" badge
9. Check Network tab: POST /api/verify-otp returned 200
10. Check Database: User.phoneVerified = true
```

**What AI Was Doing:**
```markdown
❌ WRONG FORMAT:
**Testing:**
- Test the OTP flow
- Verify it works
- Check the UI
```

**Prevention Rules:**
- Every test MUST have numbered steps (1, 2, 3...)
- Every step has clear action ("Click X", "Enter Y", "Check Z")
- Every step has expected result ("Modal closes", "Badge appears", "API returns 200")
- Include DevTools checks: Console, Network tab, specific API endpoints
- Include Database checks: "Check Prisma Studio → User table → phoneVerified column"
- Write for someone who doesn't know the feature - they should be able to follow blindly

---

## 🚨 CRITICAL: USER FRUSTRATION PATTERNS

### When User Says "You Said It's Fixed But It's Not"

**STOP IMMEDIATELY. Do not continue with plan. Instead:**

1. **Admit the mistake openly:**
   ```
   "You're right - I reported it as fixed but clearly it's not working. 
   Let me re-audit this specific issue from scratch."
   ```

2. **Re-audit with fresh eyes:**
   - Ignore previous attempts
   - Start from user's perspective: "What EXACTLY are they trying to do?"
   - Test the EXACT user action they described
   - Check EVERY step in the flow

3. **Identify what you missed:**
   - Was it wrong file edited?
   - Was it wrong approach entirely?
   - Was it partial fix (fixed one thing, broke another)?

4. **Provide honest assessment:**
   ```markdown
   "After re-audit:
   - ❌ Previous fix: Changed validation logic
   - ❌ Actual problem: Input field has type='number' (doesn't allow commas)
   - ✅ Real solution: Change to type='text' + custom validation
   
   I was focused on the wrong layer. Starting fresh now."
   ```

5. **Implement correct solution:**
   - Fix root cause (not symptom)
   - Test user's EXACT action
   - Verify in browser (not just code review)

### When User Repeats Same Request 3+ Times

**This means previous fixes didn't work. Reset approach:**

```markdown
❌ WRONG: "As I mentioned before, I already fixed this in Task X.Y"
✅ CORRECT: "I notice you've mentioned this 3 times. My previous fixes clearly didn't work. 
            Let me completely re-audit this specific issue to find what I'm missing."
```

**Then:**
1. Create focused audit report ONLY for this repeated issue
2. Test current behavior step-by-step
3. Identify gap between current vs expected
4. Fix root cause (not surface symptom)
5. Test user's EXACT workflow
6. Verify in browser with screenshots

### When User Says "There Are Lot of Issues"

**STOP everything. Run comprehensive verification:**

```powershell
# Run ALL verification commands
npx tsc --noEmit
npm run build
npm run dev

# Open browser, check:
# 1. Console (any errors?)
# 2. Network tab (API calls successful?)
# 3. Actual UI behavior (does it match user's expectation?)
```

**Then create prioritized issue list:**
```markdown
## Issues Found (After User Feedback)

**Critical (Blocks core functionality):**
1. Email still locked after purchase
2. Countdown ignores admin input

**High (Degrades UX):**
3. Double-attempt needed for lead assignment
4. Cancelled leads still visible

**Medium (Polish):**
5. Modal z-index needs adjustment
```

Work through list one-by-one. Mark complete ONLY after user confirms each fix works.

---

## 🔬 DETAILED TESTING PROTOCOLS

### Protocol 1: Input Field Testing

**Every input field change requires:**

```markdown
**Field:** Postcodes Served

**Test Case 1: Can User Type Comma?**
1. Click into input field
2. Type: "2000"
3. Type: ","
4. VERIFY: Comma appears in field ✅
5. Type: " 2010"
6. VERIFY: Final value = "2000, 2010" ✅

**Test Case 2: Can User Paste Comma-Separated?**
1. Copy: "2000, 2010, 2020"
2. Paste into field
3. VERIFY: All text appears ✅

**Test Case 3: Does Validation Accept Comma?**
1. Enter: "2000, 2010"
2. Click Save
3. Check Network tab → Request Body
4. VERIFY: Value = "2000, 2010" (not truncated) ✅
5. Check Database (Prisma Studio)
6. VERIFY: Saved value = "2000, 2010" ✅

**Test Case 4: Does Display Show Comma?**
1. Refresh page
2. Open edit modal
3. VERIFY: Field shows "2000, 2010" (commas preserved) ✅
```

### Protocol 2: Data Flow Tracing

**Every "save" action requires:**

```markdown
**Flow:** Edit Profile → Save Changes → Data Updated

**Trace Points:**
1. ✅ Input Field: `<input value={formData.postcode} />`
   - Console.log formData.postcode before submit
   - Expected: "2000, 2010"

2. ✅ Form Submit Handler: `handleSubmit()`
   - Console.log request body
   - Expected: { postcode: "2000, 2010" }

3. ✅ API Request: `POST /api/profile/update`
   - Network tab → Request Payload
   - Expected: postcode field present with commas

4. ✅ Backend Handler: `route.ts`
   - Add console.log of request.body
   - Expected: Logged value includes commas

5. ✅ Database Update: `prisma.profile.update()`
   - Add console.log before/after update
   - Expected: Data updated

6. ✅ Database Verification: Open Prisma Studio
   - Query profile record
   - Expected: postcode column = "2000, 2010"

7. ✅ UI Refresh: Reload page
   - Check displayed value
   - Expected: Shows "2000, 2010" correctly
```

If ANY step fails, STOP and fix that step before continuing.

### Protocol 3: Multi-User Flow Testing

**Every feature affecting multiple user roles requires:**

```markdown
**Feature:** Lead Purchase

**Test Setup:**
- User A: Homeowner (creates lead)
- User B: Admin (assigns lead)
- User C: Installer (purchases lead)
- User D: Another Installer (views same lead)

**Test Flow:**
1. As User A (Homeowner):
   - Create CALL_VISIT lead
   - Verify: Lead status = PENDING_APPROVAL
   - Screenshot: Homeowner dashboard

2. As User B (Admin):
   - Open lead detail
   - Assign to Installer C and D
   - Set countdown: 3 days
   - Click Approve
   - Verify: Success message mentions "3 days"
   - Verify: Assignment History shows both installers

3. As User C (Installer):
   - Navigate to /installer/leads
   - Verify: Assigned lead appears
   - Verify: Contact details show ***LOCKED***
   - Verify: Countdown shows "3 days" (not 6)
   - Click "Unlock Lead"
   - Complete purchase
   - Verify: Email unlocks (not ***LOCKED***)
   - Screenshot: Unlocked contact details

4. As User D (Installer):
   - Navigate to /installer/leads
   - Find same lead
   - Verify: Red banner "Purchased by another"
   - Verify: Purchase button disabled
   - Try clicking button
   - Verify: Nothing happens (blocked)

5. As User A (Homeowner):
   - Refresh dashboard
   - Verify: Lead status = "Responded by Installer"
   - Try clicking Edit
   - Verify: Blocked with clear message
   - Screenshot: Final homeowner view

6. As User B (Admin):
   - Open lead detail
   - Verify: Purchase info section shows
   - Verify: Shows User C's company name
   - Verify: Purchase date displays

**Expected:** ALL 6 user perspectives work correctly
**Stop Criteria:** If ANY user sees wrong state, fix before marking complete
```

### Protocol 4: Browser Testing Matrix

**Every UI change requires:**

```markdown
**Browsers to Test:**
- [ ] Chrome/Edge (Chromium) - Primary
- [ ] Firefox - Secondary  
- [ ] Safari (Mac) - If available

**Devices to Test:**
- [ ] Desktop (1440px width)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

**For Each Browser + Device:**
1. Visual Rendering
   - [ ] Layout correct
   - [ ] No overlapping elements
   - [ ] All text readable
   - [ ] Images load properly

2. Interactive Elements
   - [ ] Buttons clickable
   - [ ] Forms submittable
   - [ ] Modals open/close
   - [ ] Dropdowns work

3. Console Verification
   - [ ] No JavaScript errors
   - [ ] No failed network requests
   - [ ] No warning messages

4. Theme Testing
   - [ ] Dark theme: Check colors, contrast
   - [ ] Light theme: Check neumorphic effects
   - [ ] Purple theme: Check accent colors

**Matrix Result:**
| Browser | Desktop | Tablet | Mobile | Pass |
|---------|---------|--------|--------|------|
| Chrome  | ✅      | ✅     | ✅     | ✅   |
| Firefox | ✅      | ✅     | ✅     | ✅   |
| Safari  | ✅      | ✅     | ✅     | ✅   |
```

---

## 📖 REAL EXAMPLES FROM PROJECT HISTORY

### Example 1: Postcode Comma Issue (Repeated 5 Times)

**User Request (Attempt 1):** "in the Postcodes served field, the user cant enter multiple postcode by using comma"

**AI Response (Wrong):**
```typescript
// Changed validation regex
const postcodeRegex = /^\d{4}(,\s*\d{4})*$/;
```

**Result:** ❌ Still couldn't type comma

**User Request (Attempt 2):** "this is not fixed yet. it is still not allowing to type comma in the placeholder"

**AI Response (Wrong Again):**
```typescript
// Changed placeholder text
placeholder="Enter postcodes (e.g., 2000, 2010, 2020)"
```

**Result:** ❌ STILL couldn't type comma

**User Request (Attempt 3-5):** [Same request repeated]

**AI Finally Audited Input Element:**
```typescript
// THE ACTUAL PROBLEM:
<input 
  type="number"  // ❌ number type rejects commas!
  maxLength={4}  // ❌ also prevents multiple codes
/>

// THE SOLUTION:
<input 
  type="text"  // ✅ Accepts any characters
  // Remove maxLength to allow comma-separated list
/>
```

**Lesson:** When validation/placeholder changes don't work, check the INPUT ELEMENT ITSELF.

### Example 2: Double-Attempt Lead Assignment

**User Report:** "first attempt is failed without taking any real impact. in the second attempt... it shows assigned successfully"

**AI's Wrong Focus:** Thought issue was in success message logic

**Actual Problem:**
```typescript
// Old code:
onApprove={async (data) => {
  await handleApprove(); // ❌ Called with no parameters!
  // Modal data (installers, countdown) lost
}}

// Fix:
onApprove={async (data) => {
  await fetch('/api/leads/approve', {
    method: 'POST',
    body: JSON.stringify({
      assignTo: data.installerIds,  // ✅ Pass modal data
      countdownDays: data.countdownDays
    })
  });
}}
```

**Lesson:** When button needs 2 clicks, check if data is being PASSED through the click handler to the API.

### Example 3: Email Stays Locked

**User Report:** "after purchase it is not showing up the full contact details"

**AI's Partial Fix:** Fixed name and phone, forgot email

**Complete Fix Required:**
```typescript
// API Response:
homeowner: {
  name: isPurchased ? lead.homeowner.name : '***LOCKED***',
  phone: isPurchased ? lead.homeowner.phone : '***LOCKED***',
  email: isPurchased ? lead.homeowner.email : '***LOCKED***'  // ← Was missing!
}

// Frontend Mapping:
contact: {
  name: apiLead.homeowner.name,
  phone: apiLead.homeowner.phone,
  email: apiLead.homeowner.email  // ← Was hardcoded to '***LOCKED***'
}
```

**Lesson:** When fixing "contact unlock", verify ALL contact fields (name, phone, email, address), not just first 2.

---

**This is the universal implementation guideline enhanced with real project pain points. Follow it strictly for every task, no exceptions.**
