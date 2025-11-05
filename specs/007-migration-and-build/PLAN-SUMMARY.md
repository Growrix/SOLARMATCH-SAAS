# Universal Migration Plan - Summary

**Created**: November 4, 2025  
**Purpose**: This is the INSTRUCTION SET for executing any migration/build task  
**Status**: ✅ Complete and ready for use

---

## What This Plan Is

This is a **UNIVERSAL EXECUTION PLAN** that applies to ANY migration task you request.

When you say:
- "Migrate the form"
- "Migrate Hero component"  
- "Migrate InstallrSignupModal"
- "Migrate modal"

I will follow the **13-step workflow** defined in `plan.md`.

---

## What This Plan Is NOT

This is NOT:
- A plan to migrate specific components (that's decided by you)
- A plan to create new features (that requires separate specs)
- A plan to modify business logic (UI-only, logic preserved)
- A replacement for DESIGN-SYSTEM-SOT.md (that's the token reference)
- A replacement for constitution.md (that's project-wide standards)

---

## Key Guarantees

When you request migration work, this plan guarantees:

✅ **UI-Only Changes**: Zero logic modifications (only className replacements)  
✅ **100% Compliance**: Zero hardcoded values after migration (0/0/0/0/0/0 verification)  
✅ **Multi-Theme Quality**: Works in ALL 3 themes (Dark, Light, Purple)  
✅ **Responsive Design**: Tested at 5 breakpoints (320px to 1440px)  
✅ **Accessibility**: WCAG 2.1 AA compliant (contrast, keyboard, ARIA)  
✅ **Build Success**: Passes TypeScript check and Next.js build  
✅ **Logic Preservation**: Component functions identically after migration  
✅ **Atomic Commits**: One component per commit with descriptive message  

---

## The 13-Step Workflow

Every migration follows these exact steps (no-skip):

1. **GATE 0 Health Check** - Verify design system is complete and healthy
2. **Mental Logic Audit** - Keep functionality inventory in memory (no file creation unless complex)
3. **Pre-Migration Verification** - Baseline violation count
4. **Migrate Component** - Replace hardcoded classes with design tokens (UI ONLY)
5. **Post-Migration Verification** - MUST be 0/0/0/0/0/0
6. **Test Dark Theme** - Visual quality check
7. **Test Light Theme** - Visual quality check
8. **Test Purple Theme** - Visual quality check
9. **Test Responsive** - 5 breakpoints (mobile to desktop)
10. **Test Accessibility** - WCAG 2.1 AA compliance
11. **Test Functionality** - Verify logic works identically
12. **Build Validation** - TypeScript + Next.js build checks
13. **Batch Commit** - Group 3-5 components per commit with user approval

---

## How to Use This Plan

### When You Want Migration Work:

1. **You say**: "Migrate [ComponentName]" or "Migrate the form"
2. **I execute**: All 13 steps from `plan.md`
3. **Result**: Component migrated with zero violations, zero regressions, full quality

### When You Want to Review the Plan:

- **Full spec**: `specs/007-migration-and-build/spec.md` (user stories, requirements)
- **Execution plan**: `specs/007-migration-and-build/plan.md` (13-step workflow with commands)
- **This summary**: Quick reference for what the plan provides

---

## Critical Rules (Never Violate)

🚫 **NEVER modify logic**: State, handlers, effects, API calls are OFF-LIMITS  
🚫 **NEVER skip theme testing**: All 3 themes MUST pass  
🚫 **NEVER accept partial migration**: Component is 100% clean or not done  
🚫 **NEVER commit without user approval**: Present results, wait for confirmation  
🚫 **NEVER skip verification**: ALL 6 commands MUST return 0 matches  
🚫 **NEVER create unnecessary docs**: No per-component audit files unless complex/blocked  

---

## What I Check For You

When you request migration, I automatically verify:

### Design System Health (GATE 0)
- CSS variables exist for all themes
- Centralized components exist and work
- Form classes properly defined
- Theme classes use CSS variables (not hardcoded)

### Code Quality (6 Verification Commands)
- No hardcoded gray/slate colors
- No manual dark mode classes
- No RGB/HEX hardcoded colors
- No hardcoded white/black
- No hardcoded typography sizes
- No manual responsive classes without tokens

### Visual Quality (Multi-Theme)
- Dark theme: correct colors, shadows, contrast
- Light theme: neumorphic styling works
- Purple theme: purple shadows, accent colors

### Responsive Quality (5 Breakpoints)
- 320px: Mobile (iPhone SE)
- 375px: Mobile (iPhone X)
- 768px: Tablet
- 1024px: Desktop
- 1440px: Wide desktop

### Accessibility Quality (WCAG 2.1 AA)
- Contrast ratios pass
- Keyboard navigation works
- ARIA labels present
- Focus management correct

### Technical Quality
- TypeScript type check passes
- Next.js build succeeds
- No console errors
- All functionality preserved

---

## Example Migration Request

**You**: "Migrate InstallrSignupModal, Hero, and QuoteOptionsModal"

**I will**:
1. Run GATE 0 health check (once for all)
2. For each component: Mental logic audit (keep in memory)
3. For each component: Run pre-migration verification → Document baseline
4. For each component: Replace all hardcoded classes with design tokens (UI only)
5. For each component: Run post-migration verification → Confirm 0/0/0/0/0/0
6. For each component: Test Dark theme → Pass
7. For each component: Test Light theme → Pass
8. For each component: Test Purple theme → Pass
9. For each component: Test 5 breakpoints → Pass
10. For each component: Test accessibility → Pass
11. For each component: Test functionality → Pass
12. After all 3 components: Run `npx tsc --noEmit` and `npm run build` → Pass
13. Present results to you → Wait for approval → Batch commit with message:
    ```
    Migrate: InstallrSignupModal, Hero, QuoteOptionsModal - Design token compliance
    
    - Total violations fixed: 45 → 0
    - InstallrSignupModal: 15/5/3/2/8/1 → 0/0/0/0/0/0
    - Hero: 12/3/2/1/5/0 → 0/0/0/0/0/0
    - QuoteOptionsModal: 8/2/1/0/3/1 → 0/0/0/0/0/0
    - All tested in Dark, Light, Purple themes
    - All tested at 5 breakpoints
    - WCAG 2.1 AA compliant
    - Build: ✅ TypeScript passed, build successful
    ```
14. Update migration tracker → Mark all 3 complete

**Result**: All 3 components are 100% compliant, zero violations, work in all themes, fully responsive, accessible, and function identically.

---

## Files Created by This Plan

### Core Documents (Already Exist)
- `specs/007-migration-and-build/spec.md` - Full specification
- `specs/007-migration-and-build/plan.md` - This execution plan
- `specs/007-migration-and-build/checklists/requirements.md` - Quality checklist
- `specs/007-migration-and-build/PLAN-SUMMARY.md` - This quick reference

### Per-Migration Documents (Rarely Created)
- Logic audit files: **NOT created** (keep in memory during migration)
- Exception: Only create audit file if component is highly complex (>500 lines, >10 state variables) or blocked

### Updated Documents (After Each Batch Commit)
- Migration tracker in spec (task status, violation counts, commit hashes)
- Tasks.md: Only if spec explicitly requests task tracking updates

---

## Success Metrics

After following this plan for a migration, you can confirm success by:

✅ Verification returns 0/0/0/0/0/0 (zero hardcoded values)  
✅ Component works in Dark, Light, AND Purple themes  
✅ Component works at all 5 breakpoints (320px to 1440px)  
✅ Component passes WCAG 2.1 AA (contrast, keyboard, ARIA)  
✅ Component functions identically (no logic regressions)  
✅ TypeScript check passes (no type errors)  
✅ Build succeeds (no build errors)  
✅ Atomic commit created (one component only)  
✅ Migration tracker updated (status, violations, commit)  

---

## Questions?

**Q**: Do I need to tell you which steps to follow?  
**A**: No. Just say "migrate [component list]" and I follow all 13 steps automatically.

**Q**: Can you skip theme testing if it looks fine in Dark mode?  
**A**: No. All 3 themes MUST be tested (requirement FR-017).

**Q**: Should you commit after each component?  
**A**: No. Batch commits (3-5 components) with user approval are preferred (tasks.md workflow).

**Q**: What if verification finds 2 violations but component looks good?  
**A**: Component is NOT complete. Must be 0/0/0/0/0/0 (requirement FR-015).

**Q**: Can you modify the form validation logic during migration?  
**A**: No. UI-only changes. Logic is OFF-LIMITS (out of scope, constitution rule).

**Q**: Do you create audit files for each component?  
**A**: No. Keep logic inventory in memory. Only create audit file if component is highly complex or blocked.

---

## Ready to Use

This plan is complete and ready. When you request migration work, I will execute all 13 steps from `plan.md` automatically.

**To start a migration, just say**: "Migrate [ComponentName]"
