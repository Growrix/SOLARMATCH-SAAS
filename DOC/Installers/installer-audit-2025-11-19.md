# Installer Side Audit (2025-11-19)

## Summary
- Scope: Frontend routes/layouts, components, middleware/auth, API endpoints relevant to installers.
- Current issue: The installer marketing homepage (`/installer/page.tsx`) renders inside the dashboard chrome because `src/app/installer/layout.tsx` is a dashboard layout applied to ALL `/installer/*` routes.

## Routes (App Router)
- `src/app/installer/layout.tsx` — Dashboard layout (sidebar, header, bottom nav) applied to every route under `/installer`.
- `src/app/installer/page.tsx` — Installer marketing/home page (hero “Grow Smarter. Not Harder.”). Currently wrapped by the dashboard layout.
- `src/app/installer/dashboard/page.tsx` — Redirects to `/installer/leads`.
- `src/app/installer/lead-feed/page.tsx` — Lead feed.
- `src/app/installer/leads/page.tsx` — Leads overview.
- `src/app/installer/leads/[id]/page.tsx` — Lead details.
- `src/app/installer/marketplace/page.tsx` — Marketplace.
- `src/app/installer/purchased-leads/page.tsx` — Purchased leads.

## Shared/Installer Components
- `components/installer/InstallerSidebar.tsx` — Contains logo button calling `onHomeClick` → `/installer`.
- `components/installer/InstallerDashboardHeader.tsx` — Header (search, theme, notifications, avatar).
- `components/InstallerMobileSidebarMenu.tsx` — Mobile menu.
- `components/InstallerBottomNavBar.tsx` — Mobile bottom nav.

## Middleware & Auth
- `src/middleware.ts`
  - Protects `/installer/:path*` for `role === 'INSTALLER'` (admins bypass).
  - Non-installers attempting to access `/installer` are redirected appropriately.
- `src/lib/auth.ts` (NextAuth)
  - Credentials provider; JWT session with installer-specific fields (installerVerified, profileComplete, quoteLimit, etc.).
  - Session data exposes `role`, `profileComplete`, `installerVerified` for client-side gating.
- `src/app/api/auth/register/installer/route.ts` — Minimal installer registration (email + password), sets `role="INSTALLER"`.

## Observations
- Root cause for “homepage inside dashboard”:
  - `src/app/installer/layout.tsx` renders dashboard chrome (sidebar/header) for ALL children, including `/installer/page.tsx` (marketing homepage).
  - Sidebar logo `onHomeClick` navigates to `/installer`, which still uses the dashboard layout.
- Middleware currently protects `/installer`, so the homepage is not public.

## Risks
- Moving/changing layout structure can break nested pages if not grouped correctly.
- Public exposure of `/installer` (if desired) may require adjusting `middleware.ts` matchers.

## Recommended Architecture (App Router)
- Use route groups to split layouts:
  - Keep marketing page at `/installer` with a lightweight layout (or no layout).
  - Create `src/app/installer/(dashboard)/layout.tsx` containing the current dashboard chrome.
  - Move dashboard pages under the `(dashboard)` group:
    - `/installer/(dashboard)/leads`, `/installer/(dashboard)/lead-feed`, `/installer/(dashboard)/marketplace`, `/installer/(dashboard)/purchased-leads`, `/installer/(dashboard)/dashboard`.
- Keep `onHomeClick` target as `/installer` (now a clean marketing page without dashboard chrome).
- Option (if public marketing page needed): Move marketing page to `/installers` (plural) and update middleware to not protect it; update logo links accordingly.

---

# Plan: Fix "Homepage shows inside dashboard"

1) Layout Split (No UX change yet)
- Introduce route group: `src/app/installer/(dashboard)/layout.tsx` using the existing dashboard layout code.
- Move current dashboard pages/folders into `(dashboard)`.
- Replace `src/app/installer/layout.tsx` with a minimal layout (or remove) so `/installer` renders clean marketing page.

2) Navigation
- Ensure `InstallerSidebar.onHomeClick` navigates to `/installer`.
- Optional: In header/logo (if added later), keep same target.

3) Auth & Middleware
- If homepage should be public:
  - Update `middleware.ts` matcher to exclude `/installer` (root) or relocate marketing to `/installers`.
  - Confirm no protected data is rendered on the public page.
- If homepage should remain protected: no middleware change needed.

4) Validation
- Manual verify:
  - `/installer` shows marketing without sidebar/header.
  - `/installer/leads` and other dashboard routes show with sidebar/header.
  - Sidebar logo from dashboard routes takes you to `/installer` (clean).
- Run build checks: `npm run build`.

5) Rollout
- Atomic commits: one for layout split, one for moves, one for link updates.
- Update docs (this audit) if folder paths change.
