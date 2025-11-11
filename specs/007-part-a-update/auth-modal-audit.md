# Auth Modal Design Token Compliance Audit

**Date**: 2025-01-XX  
**Branch**: 007-part-a-update  
**Phase**: 3 (User Story 1 MVP)  
**Task**: T012

## Summary

Ran 6-command verification on all 6 auth modal files:

| Modal | Gray/Slate | Dark Mode | RGB/HEX | White/Black | Typography | Responsive |
|-------|------------|-----------|---------|-------------|------------|------------|
| HomeownerSignupModal.tsx | ✅ 0 | ✅ 0 | ⚠️ 8 | ⚠️ 1 | ⚠️ 6 | ✅ 0 |
| HomeownerSignInModal.tsx | ✅ 0 | ✅ 0 | ⚠️ 4 | ⚠️ 1 | ⚠️ 8 | ✅ 0 |
| InstallerSignupModal.tsx | ✅ 0 | ✅ 0 | ⚠️ 4 | ⚠️ 1 | ⚠️ 7 | ✅ 0 |
| InstallerSignInModal.tsx | ✅ 0 | ✅ 0 | ⚠️ 4 | ⚠️ 1 | ⚠️ 8 | ✅ 0 |
| AdminSignInModal.tsx | ❌ 10 | ❌ 11 | ✅ 0 | ⚠️ 6 | ⚠️ 6 | ✅ 0 |
| auth/AuthModal.tsx (base) | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 0 |

**Legend**:
- ✅ PASS (0 violations)
- ⚠️ MINOR (1-10 violations)
- ❌ MAJOR (>10 violations)

## Findings

### Compliant Components

**AuthModal.tsx** (base component):
- 🎯 **PERFECT**: 0/0/0/0/0/0 across all verification commands
- Uses semantic design tokens throughout
- No hardcoded colors, typography, or responsive classes
- **Status**: ✅ Ready for Phase 3 (focus trap, ESC handling additions only)

### Components Requiring Minor Fixes

#### HomeownerSignupModal.tsx
- ❌ 8 RGB/HEX color violations
- ❌ 1 white/black hardcoded value
- ❌ 6 hardcoded typography violations
- **Impact**: Low (no gray/slate hardcoding, no dark mode classes)
- **Fix Scope**: Replace inline `style={{ color: '#...' }}` with semantic tokens, update typography classes to `text-heading-*`, `text-body-small`, `text-caption`

#### HomeownerSignInModal.tsx
- ❌ 4 RGB/HEX violations
- ❌ 1 white/black hardcoded value
- ❌ 8 hardcoded typography violations
- **Impact**: Low
- **Fix Scope**: Same as Homeowner Signup

#### InstallerSignupModal.tsx
- ❌ 4 RGB/HEX violations
- ❌ 1 white/black hardcoded value
- ❌ 7 hardcoded typography violations
- **Impact**: Low
- **Fix Scope**: Same as Homeowner modals

#### InstallerSignInModal.tsx
- ❌ 4 RGB/HEX violations
- ❌ 1 white/black hardcoded value
- ❌ 8 hardcoded typography violations
- **Impact**: Low
- **Fix Scope**: Same as Installer Signup

### Components Requiring Major Refactor

#### AdminSignInModal.tsx
- ❌ 10 hardcoded gray/slate color violations
- ❌ 11 dark mode class violations
- ❌ 6 white/black hardcoded values
- ❌ 6 hardcoded typography violations
- **Impact**: HIGH (mixing old + new patterns; NOT design system compliant)
- **Fix Scope**: Complete className replacement to semantic tokens
  - Replace `text-gray-600 dark:text-gray-300` → `text-muted-foreground`
  - Replace `bg-gray-100 dark:bg-gray-800` → `bg-secondary`
  - Replace `border-gray-300 dark:border-gray-600` → `border-border`
  - Replace `text-white`, `bg-white` → semantic tokens
  - Update typography: `text-sm font-semibold` → `text-body font-medium` (tokens include weight)

## Detailed Violation Examples

### RGB/HEX Violations (Homeowner/Installer Modals)
Likely inline styles like:
```tsx
<div style={{ color: '#8b5cf6' }}>...</div>
<span style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>...</span>
```

**Fix**:
```tsx
<div className="text-primary">...</div>
<span className="bg-primary/10">...</span>
```

### Gray/Slate + Dark Mode Violations (Admin Modal)
Mixing old and new patterns:
```tsx
<input className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" />
```

**Fix**:
```tsx
<input className="bg-input text-foreground" />
```

### Typography Violations (All Non-Base Modals)
Hardcoded sizes and weights:
```tsx
<h2 className="text-xl font-semibold">Title</h2>
<p className="text-sm">Body text</p>
```

**Fix**:
```tsx
<h2 className="text-heading-2">Title</h2> <!-- includes font-semibold -->
<p className="text-body-small">Body text</p>
```

## Recommendations

### Priority 1: AdminSignInModal (MAJOR)
- MUST be refactored completely to match design system
- All gray/slate + dark mode classes must be replaced with semantic tokens
- Run post-migration verification: 0/0/0/0/0/0 required

### Priority 2: Homeowner/Installer Modals (MINOR)
- Remove inline RGB/HEX styles
- Replace hardcoded typography with semantic tokens
- Modals are functional; violations are cosmetic (no dark mode classes)

### Priority 3: AuthModal Base (COMPLIANT)
- No design token violations
- Only needs Phase 3 enhancements:
  - T013: Focus trap (trap focus within modal when open)
  - T013: aria-live region for error announcements
  - T013: ESC key handling (close modal on Escape press)

## Next Steps (T013-T016)

1. **T013**: Update AuthModal base with focus trap, aria-live, ESC handling
2. **T014**: Verify OAuth button components exist (UI stubs for Google/Apple)
3. **T015**: Audit role-based redirect logic (Homeowner → `/homeowner`, Installer → `/installer`, Admin → `/admin`)
4. **T016**: Delete obsolete modal files (search for `*.OLD.tsx`, `*.backup.tsx` in `src/components`)

## Success Criteria

Phase 3 (User Story 1 MVP) complete when:
- [ ] All 6 modals pass 0/0/0/0/0/0 verification
- [ ] AuthModal base has focus trap + ESC handling
- [ ] Role-based redirects preserved
- [ ] No obsolete modal files remain
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] All 3 themes tested (Dark, Light, Purple)
