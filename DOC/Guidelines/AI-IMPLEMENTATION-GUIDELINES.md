# AI Implementation Guidelines
**Purpose**: Universal process and principles for AI-assisted development to ensure quality and consistency  
**Date**: November 26, 2025  
**Status**: Active Standard  
**Scope**: All AI models working on this codebase

---

## 🎯 CORE MANDATE

**NEVER implement anything without:**
1. ✅ Complete understanding of current state (audit first)
2. ✅ Clear implementation plan with testing checkpoints
3. ✅ Knowledge of where to find detailed guidance (reference files)

**Golden Rule**: If you don't have clear picture → STOP → Audit → Read Guidelines → Plan → Then implement

---

## 📚 REFERENCE FILES - READ BEFORE IMPLEMENTATION

**These files contain detailed standards. Read the relevant ones BEFORE starting work:**

### For ALL Tasks:
- `docs/constitution.md` - Core principles, quality gates, 12-step audit workflow

### For UI/Design Work:
- `DOC/Guidelines/DESIGN-SYSTEM-SOT.md` - Design tokens, color system, migration patterns, verification commands
- `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md` - Layout patterns, component structure, routing conventions

### For Current Task:
- `specs/[current-spec]/tasks.md` - Specific task structure, testing protocols, phase details
- `prisma/schema.prisma` - Database models and relationships


**Do NOT replicate content from these files. Reference them when needed.**

---

## 🔄 THE 6-STEP UNIVERSAL WORKFLOW

**Follow this process for EVERY task, no exceptions:**

### Step 1: GATE 0 - System Health Check

Run these checks BEFORE starting:
```powershell
npx tsc --noEmit    # TypeScript: 0 errors
npm run build       # Build: Success
npm run dev         # Dev server: Starts
npx prisma validate # Schema: Valid
git status          # Know current state
```
**❌ STOP if ANY check fails** - Fix first, then proceed.

---

### Step 2: AUDIT - Understand Current State

Create audit report in `DOC/[folder]/[FEATURE]-AUDIT.md` with:
1. **Current State**: Files, data models, API endpoints, component tree
2. **Gap Analysis**: What's missing vs what's needed
3. **Root Cause**: WHY issue exists (not just what)
4. **Impact Assessment**: Files to modify, features affected, risk level
5. **Implementation Plan**: Phases, testing checkpoints, rollback procedures
6. **Verification Strategy**: Test cases, expected results, validation commands

**Read relevant reference files** (see "Reference Files" section above) to understand standards.

---

### Step 3: PLAN - Create Implementation Tasks

Create/update `specs/[feature]/tasks.md` following structure from existing task files:
- Clear phases (PHASE 0, 1, 2...)
- Testing checkpoints after each phase
- Stop criteria (when to halt if tests fail)
- Rollback procedures

See existing `specs/*/tasks.md` files for template patterns.

---

### Step 4: IMPLEMENT - Execute Phase by Phase

**For each phase:**
1. Modify files (one phase at a time)
2. Run verification commands immediately
3. Test in browser (visual + console + network tab)
4. Check checkpoint - ALL tests must pass
5. Only then proceed to next phase

**STOP immediately if any test fails** - Don't continue to next phase.

---

### Step 5: VERIFY - Complete System Validation

**Run ALL verification commands:**
- TypeScript: `npx tsc --noEmit` → 0 errors
- Build: `npm run build` → Success
- Design System: Run 6 verification commands from DESIGN-SYSTEM-SOT.md → 0/0/0/0/0/0
- Themes: Test Dark, Light, Purple themes
- Responsive: Test 320px, 768px, 1440px breakpoints
- Browser Console: No errors
- Network Tab: API calls work correctly
- Database: Verify changes in Prisma Studio

**For UI work**: See verification commands in `DOC/Guidelines/DESIGN-SYSTEM-SOT.md`

---

### Step 6: REPORT - Honest Status Update

```markdown
## Status Report

**Completed**:
- ✅ Main file (path): Verified clean
- ✅ Child component 1: Verified clean

**Remaining**:
- ❌ Child component 2: Needs migration
- ❌ Testing: Multi-user flow pending

**Issues Found**:
- Issue 1: Description and fix plan

**Ready for User Review**: YES / NO
```

Never report "complete" unless ALL components verified and ALL tests pass.

---

## 🧪 TESTING PRINCIPLES (NON-NEGOTIABLE)

### Principle 1: STOP-ON-FAIL
```
Test Failed → STOP IMMEDIATELY
❌ DO NOT proceed to next phase
❌ DO NOT implement additional features
✅ Fix the failing test first
✅ Re-run until test passes
✅ Only then continue
```

### Principle 2: INCREMENTAL VALIDATION
After EVERY file modification:
1. TypeScript check: `npx tsc --noEmit`
2. Build check: `npm run build`
3. Browser check: Open DevTools → Console (no errors) + Network tab (API calls work)

### Principle 3: TEST THE USER'S EXACT ACTION
Don't assume code works. Test what user actually does:
- User types comma → Open browser, click field, type comma → Does comma appear?
- User clicks save → Check Network tab → API returned 200? Database updated?
- User sees modal → Inspect element → z-index applied? No overlaps?

### Principle 4: VERIFY ALL DEPENDENCIES
Before marking complete:
1. Map component tree (parent → children → nested children)
2. Verify EACH file in tree (not just parent)
3. Run verification commands on ALL files
4. Only report complete when ENTIRE tree verified

### Principle 5: HONEST REPORTING
❌ WRONG: "Task complete! All fixed."
✅ CORRECT: "Main file verified. 2 child components pending. Not complete yet."

---

## 🎨 DESIGN SYSTEM COMPLIANCE

**For ALL UI work, reference**: `DOC/Guidelines/DESIGN-SYSTEM-SOT.md`

That file contains:
- Design token reference (colors, spacing, typography)
- Verification commands (6 commands to detect hardcoded values)
- Migration patterns and lessons learned
- Multi-theme testing requirements

### Quick Reference - What NOT to Do:
```typescript
// ❌ FORBIDDEN:
<div className="bg-white text-gray-800">           // Hardcoded colors
<div style={{ backgroundColor: '#fff' }}>          // Inline styles
<div className="dark:bg-gray-900">                // Dark mode classes
<div className="mt-4 mb-6">                       // Hardcoded spacing
<h1 className="text-2xl font-bold">              // Hardcoded typography
```

### What TO Do:
```typescript
// ✅ CORRECT:
<div className="bg-surface text-foreground">      // Semantic tokens
<div className="spacing-4">                       // Spacing tokens
<h1 className="text-heading-1">                  // Typography tokens
<button className="btn-primary">                  // Design system components
```

**Verification**: Run 6 verification commands from DESIGN-SYSTEM-SOT.md → Must return 0/0/0/0/0/0

**Testing**: ALL 3 themes (Dark, Light, Purple) must pass. ALL 5 breakpoints (320px, 375px, 768px, 1024px, 1440px) must work.

---

## 🔐 BACKEND IMPLEMENTATION PATTERNS

**For database schema**: Reference `prisma/schema.prisma`
**For API structure**: See `docs/constitution.md` for patterns

### Standard API Route Pattern:
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication Check
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // 2. Authorization Check
    if (session.user.role !== 'REQUIRED_ROLE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
    // 3. Input Validation (use zod schema)
    const body = await request.json();
    
    // 4. Business Logic
    const result = await prisma.model.operation({ /* ... */ });
    
    // 5. Audit Logging (for sensitive operations)
    await logAudit({ action: 'ACTION', userId: session.user.id });
    
    // 6. Response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API_ERROR]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Database Operation Principles:
1. **Include relations**: Specify `include` for related data
2. **Use transactions**: Multi-step operations need `prisma.$transaction`
3. **Handle not found**: Check if result exists before using
4. **Select specific fields**: Don't fetch unnecessary data

---

## 🚫 COMMON MISTAKE PATTERNS (Learn from These)

### Mistake 1: Assuming Code Works Without Testing
**Wrong Approach**: Write code → Report "fixed" → User finds it broken
**Correct Approach**: Write code → Test in browser → Verify user's exact action works → Then report

### Mistake 2: Fixing Wrong Layer
**Pattern**: User can't type comma in field
- AI fixes: Validation regex, placeholder text, backend validation
- Actual problem: Input element `type="number"` blocks commas
**Lesson**: When repeated fixes don't work, audit the LAYER you're fixing (HTML vs JS vs CSS)

### Mistake 3: Partial Implementation
**Pattern**: Fix name and phone unlock, forget email unlock
**Lesson**: List ALL fields affected before implementing. Check EACH one.

### Mistake 4: Ignoring Component Dependencies
**Pattern**: Migrate parent file, report complete, child components still broken
**Lesson**: Map complete component tree FIRST. Migrate ALL files in tree. Verify ALL before reporting complete.

### Mistake 5: False Success Messages
**Pattern**: Frontend shows "success" but backend failed, database unchanged
**Lesson**: Never trust success messages. Verify: Network tab (API response) → Database (Prisma Studio) → UI reflects change

### Mistake 6: Repeating Failed Approaches
**Pattern**: Try approach 1 → Fails → Try same approach again → Fails → Repeat 5 times
**Lesson**: Failed twice? STOP. Switch tools/approach. Don't repeat same failure.

### Mistake 7: Skipping Audit Phase
**Pattern**: User requests feature → AI starts coding immediately → Gets requirements wrong
**Lesson**: ALWAYS audit first. Understand current state, data flows, dependencies BEFORE coding.

### Mistake 8: Vague Testing Instructions
**Pattern**: "Test the feature" → User confused what to test
**Lesson**: Numbered steps, clear actions, expected results. Test instructions should be followable by someone who doesn't know the feature.

---

## ✅ FINAL CHECKLIST (Before Reporting Complete)

```markdown
- [ ] GATE 0 checks passed
- [ ] Audit report created
- [ ] Reference files read (DESIGN-SYSTEM-SOT.md, constitution.md, etc.)
- [ ] Implementation plan documented (tasks.md)
- [ ] ALL component dependencies identified and verified
- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] All 3 themes tested (Dark, Light, Purple)
- [ ] All breakpoints tested (320px, 768px, 1440px)
- [ ] Browser console: No errors
- [ ] Network tab: All API calls work
- [ ] Database: Changes verified in Prisma Studio
- [ ] Manual testing: All features work as expected
- [ ] No existing functionality broken
- [ ] Git commit created with descriptive message
```

**Only after ALL checkboxes ticked can you report task complete.**

---

## 💡 KEY PRINCIPLES TO REMEMBER

> **"Never give false information. If you said the task is functional and fixed but in real it is not and there are a lot of issues, this destroys trust and wastes time."**

> **"Always test everything after making changes. Do not attempt blindly if you don't have clear picture."**

> **"Never implement anything without audit and clear understanding or without any audit report."**

> **"Each task/phase should be tested. If failed the test then stop and fix then again test. Move to the next phase only if it is passed."**

> **"You are overcomplicating it, giving fake information while it is not actually fixed" - Keep solutions simple and verify they actually work**

> **"I have been repeating some of these issues again and again. And you are not fixing them effectively. please focus on the main issues and fix them completely." - Listen to repeated feedback and fix root causes**

---

## 🎯 SUCCESS CRITERIA

**A task is successful when:**

1. ✅ All tests pass (no failures)
2. ✅ No breaking changes to existing features
3. ✅ Code follows design system standards (verified via reference files)
4. ✅ All component dependencies verified
5. ✅ Honest, accurate reporting (no false "complete" claims)
6. ✅ User can verify results match expectations
7. ✅ System is in a deployable state

**If ANY criterion fails, task is NOT complete.**

---

**This guideline defines the universal process and principles for AI implementation. For detailed standards, always reference the appropriate documentation files listed in the "Reference Files" section.**
