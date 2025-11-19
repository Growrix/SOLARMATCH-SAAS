# Plan: Separate Installer Homepage from Dashboard Layout

Goal: Ensure the installer marketing homepage is not shown within the dashboard chrome, and clicking the logo from the dashboard routes navigates to that clean homepage.

## Steps
- Create route group `src/app/installer/(dashboard)/` and move these into it:
  - `leads/`, `lead-feed/`, `marketplace/`, `purchased-leads/`, `dashboard/`
- Move current dashboard layout code from `src/app/installer/layout.tsx` to `src/app/installer/(dashboard)/layout.tsx`.
- Replace `src/app/installer/layout.tsx` with either:
  - Minimal layout for marketing, or
  - Remove it entirely so `/installer/page.tsx` renders with the global layout.
- Keep `InstallerSidebar` logo `onHomeClick` target as `/installer` (now clean homepage).
- Optional (if homepage must be public):
  - Relocate marketing page to `/installers/page.tsx` and update sidebar/logo to `/installers`.
  - Update `middleware.ts` to not guard that public route.

## Acceptance Criteria
- Visiting `/installer` displays marketing homepage without dashboard sidebar/header.
- Visiting any dashboard route (e.g., `/installer/leads`) shows dashboard chrome.
- Clicking the sidebar/logo on dashboard routes navigates to `/installer` (marketing homepage).
- No broken links or 404s from moved routes.
- `npm run build` succeeds.

## Risks & Mitigations
- Route move can break deep links → Add tests / manual checks; ensure redirects if needed.
- Middleware scope → verify no unintended exposure of protected pages.

## Rollback Plan
- Revert to previous layout by moving `(dashboard)` content back to `src/app/installer/` and restoring the original `layout.tsx`.
