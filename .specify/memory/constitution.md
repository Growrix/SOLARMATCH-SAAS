# SolarMatch Constitution
**Solar Lead Generation Platform - Technical Standards & Principles**

---

## Core Principles

### 0. Development Workflow (UI-First, Spec-Driven)

**Phase 1: UI/UX First - MANDATORY**
- ALL features MUST start with UI/UX implementation
- Build complete UI mockup in isolation (Storybook or page preview)
- No backend work until UI is reviewed and approved
- Iterate on UI based on feedback WITHOUT touching backend
- **Approval Gate**: Developer confirms UI/UX meets requirements before proceeding

**Phase 2: Spec Alignment - MANDATORY**
- Update ALL SpecKit files BEFORE backend implementation:
  - `spec.md`: Update functional requirements, success criteria
  - `tasks.md`: Update task status, add new tasks as discovered
  - `execution-plan.md`: Update phase status, timelines
  - `changelog.md`: Document what changed and why
- Every UI change triggers spec update (no exceptions)
- Every error fix triggers spec update (document lesson learned)
- Every new task discovered triggers spec update (add to tasks.md + spec.md)

**Phase 3: Backend Implementation - After UI Approval**
- Implement backend only after UI approved and specs updated
- Use approved UI as contract for API requirements
- Backend changes that affect UI require returning to Phase 1

**Workflow Rule**: UI → Spec Update → Backend → Never Backend First

### I. Next.js App Router First
**All features must use Next.js 14+ App Router architecture**
- Server Components by default (use 'use client' only when necessary)
- File-based routing in `src/app/` directory
- API routes as `route.ts` files with GET/POST/PATCH/DELETE exports
- Parallel routes and layouts for role-based dashboards
- Middleware for authentication and route protection
- **Layout Consistency MANDATORY**: NEVER create standalone pages with separate sidebars/navigation
- **Layout Inheritance**: All dashboard pages MUST use existing layout structure (src/app/[role]/layout.tsx)
- **Route Planning**: BEFORE creating new page, verify existing layout and navigation structure
- **No Duplicate UI Elements**: Never recreate sidebars, headers, navigation - always extend existing layouts

### II. TypeScript Strict Mode
**Type safety is non-negotiable**
- All files must be `.ts` or `.tsx` (no JavaScript)
- Strict mode enabled in `tsconfig.json`
- No `any` types unless absolutely necessary (document why)
- Type definitions for all props, API responses, and database models
- Extended NextAuth types for custom session fields (`src/types/next-auth.d.ts`)

### III. Database-First Design
**Prisma ORM is the single source of truth**
- All database changes start with `prisma/schema.prisma` updates
- Migrations required: `npx prisma migrate dev --name descriptive_name`
- Always run `npx prisma generate` after schema changes
- Use Prisma Client singleton pattern (`src/lib/prisma.ts`)
- Never write raw SQL without justification
- Teaching comments mandatory for complex schemas

### IV. Authentication & Authorization
**NextAuth.js handles all authentication**
- Credentials provider for email/password authentication
- JWT-based sessions (30-day expiry)
- Password hashing with bcryptjs (10 rounds minimum)
- Role-based access control (GUEST, HOMEOWNER, INSTALLER, ADMIN)
- Middleware enforces route protection (`src/middleware.ts`)
- Admin bypass pattern: Admins can access all routes for support
- Session data includes: `id`, `role`, `email`, `name`, `image`

### V. Security & Privacy
**Security is built-in, not bolted-on**
- Environment variables for all secrets (`.env` file, never committed)
- Password complexity requirements enforced
- Email validation with typo detection
- CSRF protection via NextAuth
- Database credentials use connection pooling (Supabase/Vercel Postgres)
- User input validation on both client and server
- SQL injection protection via Prisma parameterized queries
- Admin operations require ADMIN role verification

### VI. Styling & Theming
Centralized tokens with Tailwind CSS, shadcn/ui compatibility, and dark mode support

- Utility-first CSS approach (no custom CSS unless justified)
- Dark mode: Class-based (`darkMode: 'class'` in `tailwind.config.js`); optional HTML attribute `data-theme` allowed for future theme switching
- ThemeProvider Context API (or `next-themes`) manages theme and sets `.dark` class and/or `data-theme` on `<html>`
- Two-tier token system remains: primitives → semantic. Implementation uses TypeScript token files today and maps to Tailwind via `theme.extend`; CSS Variables layer is introduced for shadcn/ui alignment

Shadcn-compatible CSS variable tokens (authoritative names)

- Define tokens in `:root` of `src/app/globals.css` using HSL triplets: `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--destructive`, `--destructive-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, and `--radius`.
- Tailwind maps these variables to utilities in `tailwind.config.js` when present (example mapping: `colors.background: 'hsl(var(--background))'`). Our current config also exposes semantic colors from TypeScript tokens; both paths may coexist during migration.
- Component rule: Use tokenized utilities only (e.g., `bg-primary`, `text-foreground`, `border-input`). Never hardcode hex values or Tailwind raw palette colors in components.

Multi-theme model

- Light theme is the current default and the only maintained theme until UI is signed off (one-theme-first). Additional themes (e.g., Dark, Brand) are added by overriding CSS variables under `[data-theme="dark"]` blocks in `globals.css` without changing component code.
- The ThemeProvider toggles `.dark` and/or `data-theme` and persists preference to `localStorage`.

Validation and quality gates

- Storybook is REQUIRED for all token and UI changes; import `../src/app/globals.css` in `.storybook/preview.ts` and provide a theme toolbar (decorator or addon).
- Visual regression testing is REQUIRED (Chromatic preferred). Each UI/token change must include Storybook proof across active themes and breakpoints.
- Atomic migration: Only ONE component or token group per commit.
- Manual QA checklist is MANDATORY for each migration (themes, states, responsive breakpoints, accessibility focus ring visibility).

Mobile-first rules (unchanged and enforced)

- Mobile-first design 320–640px; typography base 14px mobile / 16px desktop; spacing tighter on mobile (50–75% of desktop); touch targets ≥ 44×44px.

Notes on current state and alignment

- Today, semantic colors, typography, spacing, shadows, and animations are sourced from `src/design-tokens/` and wired into Tailwind via `theme.extend` (backward compatible). `globals.css` already defines base variables used by layout styles (e.g., `--bg-primary`, `--text-primary`).
- As we adopt shadcn/ui, we will prioritize the CSS variable names listed above; a thin compatibility layer can map our semantic tokens to these variables to avoid churn.

### VII. Code Documentation
**Teaching-first documentation philosophy**
- Extensive inline comments explaining "why", not just "what"
- File headers with purpose, structure, and usage examples
- API routes: Document inputs, outputs, error cases, and security
- Complex logic: Step-by-step explanations for future developers
- Database models: Field descriptions, relationships, and constraints
- Configuration files: Setup instructions and troubleshooting tips

---

## Technical Stack

### Core Framework
- **Next.js**: 14.2.33 (App Router, Server Components)
- **React**: 18.2.0 (Server/Client Components)
- **TypeScript**: ~5.3.3 (Strict mode)
- **Node.js**: 20.8+ (LTS version)

### Database & ORM
- **Prisma**: 6.17.1 (ORM and migration tool)
- **@prisma/client**: 6.17.1 (Generated client)
- **PostgreSQL**: Supabase-hosted (connection pooling)
- **Database URL**: Environment variable with pooler support

### Authentication
- **next-auth**: 4.24.11 (NextAuth.js v4)
- **@next-auth/prisma-adapter**: 1.0.7 (Database sessions)
- **bcryptjs**: 3.0.2 (Password hashing)
- **@types/bcryptjs**: 2.4.6 (TypeScript types)

### Styling & UI
- **Tailwind CSS**: 3.4.18 (Utility-first CSS)
- **PostCSS**: 8.5.6 (CSS processing)
- **Autoprefixer**: 10.4.21 (Browser compatibility)
- **recharts**: 3.2.1 (Data visualization for dashboards)
- **Storybook**: 7+ (UI component explorer for isolated visual testing)
- **Chromatic/Percy/Loki**: Visual regression testing (one required for design system changes)

### Development Tools
- **ESLint**: 8.53.0 (Code linting)
- **eslint-config-next**: 14.2.33 (Next.js rules)
- **tsx**: For running TypeScript scripts (e.g., seed files)

### Package Manager
- **npm**: Primary package manager (not yarn/pnpm)
- Scripts: `dev`, `build`, `start`, `lint`, `seed:admin`

---

## Project Structure Standards

### Directory Organization
```
solarmatch/
├── src/
│   ├── app/                    # Next.js App Router (pages & API routes)
│   │   ├── api/               # API endpoints (route.ts files)
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── newsletter/    # Newsletter subscription
│   │   │   ├── instant-quote/ # Quote generation
│   │   │   └── admin/         # Admin management APIs
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── homeowner/         # Homeowner dashboard pages
│   │   ├── installer/         # Installer dashboard pages
│   │   ├── blog/              # Blog pages
│   │   ├── layout.tsx         # Root layout (NextAuthProvider, ThemeProvider)
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components (33+ components)
│   │   ├── *SignInModal.tsx   # Role-specific login modals
│   │   ├── *SignupModal.tsx   # Role-specific signup modals
│   │   ├── *BottomNavBar.tsx  # Role-specific navigation bars
│   │   ├── ThemeProvider.tsx  # Dark mode context provider
│   │   └── NextAuthProvider.tsx # NextAuth session provider
│   ├── lib/                   # Utility libraries
│   │   └── prisma.ts          # Prisma Client singleton
│   ├── types/                 # TypeScript type definitions
│   │   └── next-auth.d.ts     # Extended NextAuth types
│   ├── middleware.ts          # Route protection & role-based access
│   └── globals.css            # Global CSS (minimal, Tailwind-based)
├── prisma/
│   ├── schema.prisma          # Database schema (single source of truth)
│   ├── migrations/            # SQL migration files (auto-generated)
│   └── seed-admin.ts          # Admin user seeding script
├── DOC/                       # Documentation & progress reports
│   ├── Records/               # Implementation records & audits
│   ├── executionPlan.md       # Agile feature roadmap
│   └── *.md                   # Feature-specific documentation
├── .github/
│   ├── copilot-instructions.md # AI assistant guidelines
│   └── prompts/               # SpecKit prompt templates
├── .specify/
│   ├── memory/
│   │   └── constitution.md    # This file
│   └── templates/             # SpecKit templates
├── .env                       # Environment variables (NEVER commit)
├── .env.example               # Environment template (commit this)
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── next.config.js             # Next.js configuration
```

### File Naming Conventions
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (route-specific layouts)
- **API Routes**: `route.ts` (HTTP method exports)
- **Components**: PascalCase (e.g., `HomeownerSignupModal.tsx`)
- **Utilities**: camelCase (e.g., `prisma.ts`)
- **Types**: `.d.ts` extension (e.g., `next-auth.d.ts`)
- **Migrations**: Timestamp + description (e.g., `20251012_add_user_authentication`)

---

## Database Schema Standards

### Model Naming
- **Singular PascalCase**: `User`, `GuestInstantQuote`, `NewsletterSubscriber`
- **Table mapping**: Use `@@map("plural_snake_case")` for database table names
- **Enums**: PascalCase values (e.g., `UserRole { GUEST, HOMEOWNER, INSTALLER, ADMIN }`)

### Field Requirements
- **Primary Keys**: `id String @id @default(cuid())` (CUID for distributed systems)
- **Timestamps**: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- **Email Fields**: `@unique` constraint, validated on application layer
- **Status Fields**: Use enums (not strings) for type safety
- **Relations**: Always use `@relation` with proper cascade behavior

### Current Schema Models
1. **User** - Authentication & profiles (email, password, role, timestamps)
2. **Account** - OAuth provider data (NextAuth required)
3. **Session** - Active user sessions (NextAuth required)
4. **VerificationToken** - Email verification (NextAuth required)
5. **GuestInstantQuote** - Anonymous quote requests (48 fields, comprehensive)
6. **NewsletterSubscriber** - Email subscriptions (email, subscribed date, active status)

---

## API Design Standards

### Endpoint Structure
- **RESTful conventions**: GET (read), POST (create), PATCH (update), DELETE (remove)
- **File location**: `src/app/api/[resource]/route.ts`
- **Authentication**: Check session with `getServerSession(authOptions)`
- **Response format**: JSON with consistent structure

### Request Validation
```typescript
// 1. Parse request body
const body = await request.json();

// 2. Validate required fields
if (!body.email || !body.password) {
  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}

// 3. Validate format (email, password strength, etc.)
// 4. Check business logic (duplicates, permissions, etc.)
// 5. Perform database operation
// 6. Return success or error response
```

### Error Handling
- **400 Bad Request**: Invalid input, validation errors
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate data (e.g., email already exists)
- **500 Internal Server Error**: Unexpected server errors (log details)

### Security Checklist
- [ ] Authentication check (if protected endpoint)
- [ ] Role authorization (if role-specific)
- [ ] Input validation & sanitization
- [ ] Rate limiting (future: implement for public endpoints)
- [ ] Error messages don't leak sensitive data
- [ ] Passwords never returned in responses

---

## Authentication Patterns

### User Registration Flow
1. User fills signup form (name, email, password)
2. Frontend sends POST to `/api/auth/register/[role]`
3. Server validates input (email format, password strength)
4. Check for duplicate email (`findUnique`)
5. Hash password with bcryptjs (10 rounds)
6. Create user with role (HOMEOWNER or INSTALLER)
7. Return success (do NOT auto-login, require explicit signIn)

### User Login Flow
1. User fills login form (email, password)
2. Frontend calls `signIn('credentials', { email, password })`
3. NextAuth validates with CredentialsProvider
4. Provider queries database for user (`findUnique`)
5. Verify password with bcrypt.compare()
6. Check if account is active (`isActive` field)
7. Update `lastLoginAt` timestamp
8. Create JWT token with user data (id, role, email, name, image)
9. Return session to client

### Session Management
- **JWT Strategy**: Tokens stored client-side, verified server-side
- **Expiration**: 30 days (configurable in NextAuth options)
- **Refresh**: Automatic on session check
- **Custom Fields**: Added via `jwt` and `session` callbacks
- **Access**: `useSession()` hook (client), `getServerSession()` (server)

### Route Protection
```typescript
// middleware.ts pattern
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Admin bypass (support access)
    if (token.role === 'ADMIN') return NextResponse.next();
    
    // Role-based checks
    if (path.startsWith('/homeowner') && token.role !== 'HOMEOWNER') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public paths (login pages)
        if (req.nextUrl.pathname === '/admin') return true;
        
        // Protected paths require token
        return !!token;
      }
    }
  }
);
```

---

## Page & Routing Architecture Standards

### Layout Structure (CRITICAL)

**NEVER create standalone pages with duplicate UI elements**

#### Current Layout Hierarchy
```
src/app/
├── layout.tsx                 # Root layout (NextAuthProvider, ThemeProvider)
├── page.tsx                   # Public homepage
├── admin/
│   ├── layout.tsx            # Admin layout (AdminSidebar, AdminHeader)
│   ├── page.tsx              # Admin dashboard home
│   └── [feature]/
│       └── page.tsx          # Admin feature pages (inherit admin layout)
├── homeowner/
│   ├── layout.tsx            # Homeowner layout (HomeownerSidebar, HomeownerHeader)
│   ├── page.tsx              # Homeowner dashboard home
│   └── [feature]/
│       └── page.tsx          # Homeowner feature pages (inherit homeowner layout)
├── installer/
│   ├── layout.tsx            # Installer layout (InstallerSidebar, InstallerHeader)
│   ├── page.tsx              # Installer dashboard home
│   └── [feature]/
│       └── page.tsx          # Installer feature pages (inherit installer layout)
└── blog/
    └── page.tsx              # Public blog pages
```

### Mandatory Pre-Page Creation Workflow

**BEFORE creating ANY new page, complete this 10-minute audit**:

#### 1. Layout Discovery (5 minutes)
```bash
# Find existing layouts
ls -la src/app/**/layout.tsx

# Read the target role's layout file
cat src/app/admin/layout.tsx           # For admin pages
cat src/app/homeowner/layout.tsx       # For homeowner pages
cat src/app/installer/layout.tsx       # For installer pages

# Check what components the layout uses
grep -E "(Sidebar|Header|Nav)" src/app/admin/layout.tsx
```

**Checklist**:
- [ ] I have read the existing layout file for my target role
- [ ] I understand what UI elements the layout provides (sidebar, header, navigation)
- [ ] I know where my new page will be placed in the route hierarchy
- [ ] I verified the layout uses correct role-based components

#### 2. Navigation Structure Discovery (3 minutes)
```bash
# Find sidebar/navigation components
ls -la src/components/*Sidebar* src/components/*Nav*

# Read the sidebar component for target role
cat src/components/AdminSidebar.tsx       # For admin pages
cat src/components/HomeownerSidebar.tsx   # For homeowner pages
cat src/components/InstallerSidebar.tsx   # For installer pages

# Check existing navigation links
grep -E "(href|Link)" src/components/AdminSidebar.tsx
```

**Checklist**:
- [ ] I have read the sidebar component for my target role
- [ ] I understand the existing navigation structure
- [ ] I know where my new page link should be added in the sidebar
- [ ] I verified the sidebar uses consistent link patterns

#### 3. Routing Pattern Verification (2 minutes)
```bash
# List existing pages in target role
ls -la src/app/admin/**/*.tsx            # For admin
ls -la src/app/homeowner/**/*.tsx        # For homeowner
ls -la src/app/installer/**/*.tsx        # For installer

# Check route naming patterns
ls -la src/app/admin/
```

**Checklist**:
- [ ] I understand the existing route naming pattern (kebab-case, camelCase, etc.)
- [ ] I know if my feature should be a single page or a nested route
- [ ] I verified no duplicate or conflicting routes exist

### Page Creation Rules

#### ✅ CORRECT: Inherit Existing Layout
```typescript
// ✅ src/app/admin/settings/page.tsx
// This page automatically inherits AdminSidebar + AdminHeader from admin/layout.tsx

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      {/* Page content only - no sidebar, no header */}
    </div>
  );
}
```

#### ❌ WRONG: Create Standalone Page with Duplicate UI
```typescript
// ❌ NEVER DO THIS
// src/app/admin/settings/page.tsx

import { AdminSidebar } from '@/components/AdminSidebar';  // ❌ Duplicate
import { AdminHeader } from '@/components/AdminHeader';    // ❌ Duplicate

export default function AdminSettingsPage() {
  return (
    <div className="flex">
      <AdminSidebar />  {/* ❌ Already in layout */}
      <div className="flex-1">
        <AdminHeader />  {/* ❌ Already in layout */}
        <div className="p-6">
          <h1>Settings</h1>
        </div>
      </div>
    </div>
  );
}
```

### Navigation Link Addition

**When adding new page, update ONLY the sidebar component**:

#### ✅ CORRECT: Add Link to Existing Sidebar
```typescript
// src/components/AdminSidebar.tsx
export function AdminSidebar() {
  return (
    <aside>
      <nav>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/settings">Settings</Link>  {/* ✅ Added here */}
      </nav>
    </aside>
  );
}
```

#### ❌ WRONG: Create New Sidebar or Duplicate Links
```typescript
// ❌ NEVER create a separate sidebar for one page
// src/components/SettingsSidebar.tsx  // ❌ Don't create this
```

### Mobile-Responsive Layout Patterns

**Mobile layouts MUST differ from desktop layouts**:

#### Desktop Layout (> 768px)
```typescript
// src/app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop: Sidebar visible on left */}
      <AdminSidebar className="hidden md:block w-64" />
      
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Mobile Layout (< 768px)
```typescript
// src/app/admin/layout.tsx
export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile: Header with hamburger menu */}
      <AdminHeader onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* Mobile: Sidebar as overlay/drawer */}
      <AdminSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        className="md:hidden"
      />
      
      {/* Desktop: Sidebar visible on left */}
      <div className="flex flex-1">
        <AdminSidebar className="hidden md:block w-64" />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Route Organization Best Practices

#### Feature-Based Routing
```
src/app/admin/
├── layout.tsx              # Admin layout (sidebar, header)
├── page.tsx                # Admin dashboard home
├── users/
│   ├── page.tsx           # List users
│   ├── [id]/
│   │   └── page.tsx       # View/edit specific user
│   └── new/
│       └── page.tsx       # Create new user
├── leads/
│   ├── page.tsx           # List leads
│   └── [id]/
│       └── page.tsx       # View/edit specific lead
└── settings/
    ├── page.tsx           # Settings home
    ├── profile/
    │   └── page.tsx       # Profile settings
    └── billing/
        └── page.tsx       # Billing settings
```

### 🚨 Red Flags - Layout/Routing Issues

**STOP immediately if you see ANY of these**:

1. **Duplicate Sidebar Import**: Page imports sidebar component directly
2. **Duplicate Header Import**: Page imports header component directly
3. **Inconsistent Navigation**: Different pages have different sidebar menus
4. **Standalone Layout**: Page creates its own layout without using app/[role]/layout.tsx
5. **Route Conflicts**: Multiple pages with same route path
6. **Missing Mobile Layout**: Layout doesn't adapt to mobile (no hamburger menu, drawer, or bottom nav)
7. **Hardcoded Role Checks in Pages**: Pages check user role instead of using layout hierarchy
8. **Duplicate Navigation Links**: Same link appears in multiple places

### Page Creation Checklist (Mandatory)

**Before creating new page, verify**:

- [ ] I have read the existing layout file (`src/app/[role]/layout.tsx`)
- [ ] I have read the existing sidebar component (`src/components/[Role]Sidebar.tsx`)
- [ ] I understand the current route structure for this role
- [ ] I know where my new page fits in the navigation hierarchy
- [ ] My new page does NOT import sidebar or header components
- [ ] My new page will inherit layout from parent layout.tsx
- [ ] I will only update the sidebar component to add navigation link
- [ ] I have verified no duplicate or conflicting routes exist
- [ ] I have planned mobile-responsive layout (if custom layout needed)
- [ ] I have verified the page will work on mobile (320px-640px width)

**After creating new page, verify**:

- [ ] Page renders correctly with inherited layout (sidebar + header visible)
- [ ] Navigation link in sidebar works (correct href, active state)
- [ ] Page is accessible at correct URL
- [ ] Page respects role-based access control (middleware protection)
- [ ] Mobile layout works (drawer/overlay sidebar, responsive spacing)
- [ ] No duplicate UI elements (only one sidebar, only one header)

---

## Mobile-First Responsive Design Standards

### Philosophy: Design for Mobile FIRST, Scale Up

**Industry Standard**: Progressive Enhancement (Mobile → Tablet → Desktop)

#### Why Mobile-First?
- **70%+ of users** access web apps on mobile devices
- **Mobile constraints** force better UX decisions (simplified, focused)
- **Easier to scale up** (add features for desktop) than scale down (remove features for mobile)
- **Performance benefits** (load only what's needed for mobile, enhance for desktop)

### Viewport Breakpoints (Tailwind CSS)

**Critical**: Design for SMALLEST screen first, then add responsive classes.

```
Mobile:      < 640px   (sm: prefix)   [DEFAULT - no prefix needed]
Tablet:      640-1024px (md: prefix)
Desktop:     > 1024px   (lg: prefix)
Large:       > 1280px   (xl: prefix)
Extra Large: > 1536px   (2xl: prefix)
```

### Mobile-First Typography

**Problem**: Desktop font sizes are TOO LARGE on mobile (poor readability, excessive scrolling).

#### ✅ CORRECT: Mobile-First Font Sizes
```tsx
// ✅ Mobile-first: base 14px, desktop 16px
<p className="text-base md:text-lg">
  Body text is 14px on mobile, 16px on desktop
</p>

// ✅ Mobile-first: h1 is 24px mobile, 36px desktop
<h1 className="text-3xl md:text-5xl font-bold">
  Main Heading
</h1>

// ❌ WRONG: Same size on all devices (too big on mobile)
<p className="text-lg">  {/* 16px on mobile - TOO BIG */}
  This text is too large on small screens
</p>
```

### Mobile-First Spacing

**Problem**: Desktop spacing (24px, 32px) creates excessive white space on mobile.

```tsx
// ✅ Mobile: 16px padding, Desktop: 24px padding
<div className="p-4 md:p-6">
  Content with responsive padding
</div>

// ❌ WRONG: Same spacing on all devices (too much on mobile)
<div className="p-8">  {/* 32px padding on mobile - EXCESSIVE */}
  Content loses visible space
</div>
```

### Mobile-First Component Layouts

#### Cards
```tsx
// ✅ CORRECT: Full-width mobile, grid desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>

// ❌ WRONG: Fixed 3-column grid (breaks on mobile)
<div className="grid grid-cols-3 gap-6">  {/* Tiny columns on mobile */}
  <Card />
</div>
```

#### Forms
```tsx
// ✅ CORRECT: Full-width mobile, multi-column desktop
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="First Name" />  {/* Stack on mobile, side-by-side desktop */}
    <FormField label="Last Name" />
  </div>
  
  <Button className="w-full md:w-auto">
    Submit
  </Button>
</form>
```

#### Tables
```tsx
// ✅ CORRECT: Card-based mobile, table desktop
<div className="block md:hidden">
  {/* Mobile: Stack as cards */}
  {data.map(item => (
    <Card key={item.id} className="p-4 mb-4">
      <div className="font-bold">{item.name}</div>
      <div className="text-sm text-gray-600">{item.email}</div>
    </Card>
  ))}
</div>

<div className="hidden md:block overflow-x-auto">
  {/* Desktop: Traditional table */}
  <table className="w-full">...</table>
</div>
```

### Touch-Friendly Mobile UI

**WCAG 2.5.5**: Minimum touch target size is 44px × 44px.

#### Buttons
```tsx
// ✅ CORRECT: Larger touch targets on mobile
<Button className="h-12 md:h-10 px-6 md:px-4 text-base md:text-sm">
  Click Me
</Button>

// ❌ WRONG: Tiny buttons on mobile (hard to tap)
<Button className="h-8 px-2 text-sm">  {/* 32px height - too small */}
  Click Me
</Button>
```

#### Navigation
```tsx
// ✅ CORRECT: Bottom navigation mobile, sidebar desktop
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="flex justify-around">
    <NavLink href="/dashboard" icon={<HomeIcon />}>
      Home
    </NavLink>
  </div>
</nav>

<aside className="hidden md:block w-64 border-r">
  <nav className="p-4">
    <NavLink href="/dashboard">Dashboard</NavLink>
  </nav>
</aside>
```

### Mobile-First Testing Checklist

**For EVERY page/component, test on mobile FIRST**:

- [ ] **320px width**: iPhone SE (smallest common device)
- [ ] **375px width**: iPhone 12/13 (most common)
- [ ] **414px width**: iPhone 14 Pro Max (large phone)
- [ ] Text is readable (minimum 14px font size)
- [ ] Touch targets are minimum 44px × 44px
- [ ] No horizontal scroll (content fits in viewport)
- [ ] Spacing is comfortable (not cramped or excessive)
- [ ] Navigation is thumb-friendly (bottom nav or easy-to-reach)
- [ ] Forms are usable (full-width inputs, large buttons)
- [ ] Modals work correctly (full-screen on mobile or properly sized)
- [ ] Tables are readable (card layout or horizontal scroll)
- [ ] Performance is good (< 3s load time on 3G)

### App-Like Mobile Experience Characteristics

- **Full-Screen Content**: No wasted space, edge-to-edge design
- **Bottom Navigation**: Thumb-friendly (not top hamburger menu)
- **Large Touch Targets**: Minimum 44px, prefer 48-56px
- **Simplified UI**: Fewer options, focused interactions
- **Loading States**: Skeleton screens, not just spinners

### Mobile-First Red Flags 🚨

**STOP immediately if you see**:

1. **Fixed Desktop Widths**: `w-[600px]` without responsive alternative
2. **Tiny Text on Mobile**: `text-xs` or smaller as body text
3. **Excessive Spacing**: `p-8` or larger without mobile override
4. **Multi-Column on Mobile**: `grid-cols-3` without `grid-cols-1` for mobile
5. **Small Touch Targets**: Buttons < 44px height on mobile
6. **Horizontal Scroll**: Content wider than viewport on mobile
7. **Desktop-Only Navigation**: Sidebar without mobile hamburger/drawer
8. **Same Table on Mobile**: No card alternative for complex tables

---

## Component Architecture

### Server vs Client Components
**Default to Server Components** (better performance, smaller bundles)
- No `'use client'` directive needed
- Can fetch data directly (async components)
- Direct database access allowed
- Cannot use hooks (useState, useEffect, useContext)

**Use Client Components when:**
- Interactive features (onClick, onChange, etc.)
- React hooks required (useState, useEffect)
- Browser APIs needed (localStorage, window)
- Context providers (ThemeProvider, NextAuthProvider)

### Provider Pattern
```typescript
// Root layout wraps entire app with providers
<NextAuthProvider>        {/* Session context */}
  <ThemeProvider>          {/* Dark mode context */}
    <LayoutContent>
      {children}           {/* Page content */}
    </LayoutContent>
  </ThemeProvider>
</NextAuthProvider>
```

### Component Props
- Always type props with TypeScript interfaces
- Use optional props with default values
- Destructure props for clarity
- Document complex prop types with JSDoc comments

### Modal Components
- Controlled components (parent manages open/close state)
- Backdrop click closes modal (unless critical action pending)
- Escape key closes modal
- Focus trap for accessibility
- Form validation before submission

---

## Development Workflow

### Feature Implementation Cycle
1. **Audit Current State** - Review existing code/database/APIs
2. **Plan Feature** - Document in `DOC/` directory with clear spec
3. **Update Schema** - Modify `prisma/schema.prisma` if needed
4. **Run Migration** - `npx prisma migrate dev --name feature_name`
5. **Build Backend** - Create API routes with validation
6. **Build Frontend** - Create/update components
7. **Test Manually** - Verify all flows work correctly
8. **Document** - Update progress reports and implementation notes
9. **Commit** - Clear commit message describing what was built
10. **Move to Next Feature** - Iterate

### Git Workflow
- **Branch**: `Version-2` (current development branch)
- **Commits**: Descriptive messages ("Add development quick access menu to admin dashboard")
- **Never commit**: `.env` files, `node_modules/`, build artifacts
- **Always commit**: `.env.example`, migration files, type definitions

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in database connection string (Supabase/Vercel Postgres)
3. Add NextAuth secret: `openssl rand -base64 32`
4. Run `npm install` to install dependencies
5. Run `npx prisma generate` to generate Prisma Client
6. Run `npx prisma migrate dev` to apply migrations
7. Run `npm run seed:admin` to create initial admin user
8. Run `npm run dev` to start development server

### Testing Checklist
- [ ] Authentication flows (signup, login, logout)
- [ ] Role-based access control (each role can only access their routes)
- [ ] Admin bypass (admins can access all dashboards)
- [ ] Form validations (client-side and server-side)
- [ ] Error handling (display user-friendly messages)
- [ ] Database operations (create, read, update work correctly)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode (components render correctly in both themes)

---

## Development Workflow Standards

### Mandatory Pre-Phase Workflow
**EVERY feature phase MUST begin with this 30-60 minute audit**

#### 1. Specification Review (20 minutes)
- [ ] Read ALL spec files thoroughly (`spec.md`, `data-model.md`, `contracts/*.openapi.yaml`)
- [ ] Identify ALL affected database models and fields
- [ ] Review API contracts for exact request/response structures
- [ ] List all new types, interfaces, and enums needed
- [ ] Verify no conflicts with existing models or fields
- [ ] Document assumptions and edge cases
- [ ] **RULE**: If spec says use existing field, use it. Don't invent new fields mid-implementation.

#### 2. Schema Verification (10 minutes)
```bash
# Check Prisma schema for exact model structure
cat prisma/schema.prisma | grep -A 20 "model YourModel"

# Validate schema matches spec
npx prisma validate

# Check what relations exist
grep -E "model (User|Lead|YourModel)" prisma/schema.prisma -A 15
```
- [ ] Verify all required fields exist in schema
- [ ] Check field types match spec (String vs Int vs DateTime)
- [ ] Verify relations match data model (userId vs leadId)
- [ ] Confirm enums match spec values

#### 3. Service Signature Verification (10 minutes)
```bash
# Check what a service actually exports
grep "^export" src/lib/services/your-service.ts

# Check function signatures
grep "export async function" src/lib/services/your-service.ts -A 3

# Example: Before calling getSetting()
grep "export.*getSetting" src/lib/services/settings-service.ts -A 5
# Result: getSetting(key: string) - only ONE parameter!
```
- [ ] Verify all service functions exist with correct signatures
- [ ] Check parameter types and return types
- [ ] Note async vs sync functions
- [ ] Identify required imports

#### 4. Type Verification (5 minutes)
```bash
# Check NextAuth session type
grep -A 20 "interface Session" src/types/next-auth.d.ts

# Check if field exists in session.user
grep "interface.*User" src/lib/auth.ts -A 10

# Check Prisma Client types
grep "export.*YourType" src/types/your-type.ts -A 10
```
- [ ] Verify all TypeScript types exist
- [ ] Check type definitions match Prisma models
- [ ] Confirm session types include needed fields

#### 5. Existing Patterns Review (10 minutes)
- [ ] Open 2-3 similar existing files
- [ ] Note how they import Prisma client: `import { prisma } from '@/lib/prisma'`
- [ ] Note how they handle errors: try/catch patterns
- [ ] Note how they call other services: `await createAuditLog({ ... })`
- [ ] Copy-paste patterns, don't reinvent

#### 6. Pre-Implementation Checklist
- [ ] Read spec section for this phase completely
- [ ] Checked Prisma schema matches spec requirements
- [ ] Verified all service functions I'll call exist with correct signatures
- [ ] Confirmed all types I'll use exist and have required fields
- [ ] Reviewed 1-2 similar existing files for patterns
- [ ] Identified all imports needed (services, types, Prisma)
- [ ] Know exact field names from spec (not inventing new ones)

**TIME INVESTMENT**: 30-60 minutes of verification SAVES 3+ hours of build error fixing

---

### Mandatory During-Phase Workflow
**For EACH task within a phase**

#### Spec-Driven Implementation
1. **Re-read relevant spec section FIRST** before coding
2. **Copy exact field names** from spec (don't paraphrase)
3. **Use existing service patterns** (grep for similar code)
4. **Type everything strictly** (no `any` unless documented)
5. **Test incrementally** (don't wait until end of phase)

#### Manual QA Checklist (For Tasks with Frontend + Backend)
**Required for ANY task that includes BOTH backend and frontend changes**

Create checklist directly under task with:
- [ ] UI state validation (loading, success, error states)
- [ ] API call testing (success path)
- [ ] API call testing (at least ONE error path)
- [ ] Data accuracy verification (database check)
- [ ] Theme switching (Light/Dark/System)
- [ ] Interactive states (hover, focus, active, disabled)
- [ ] Responsive breakpoints (mobile, tablet, desktop)
- [ ] Accessibility check (ARIA labels, keyboard navigation)
- [ ] Console error check (no errors/warnings)

**Role-Specific QA Steps**:
- Admin: Can perform action, sees correct data, proper authorization
- Homeowner: Can only access own data, sees correct UI
- Installer: Can only access purchased leads, correct permissions
- Guest: Redirected appropriately, cannot access protected routes

---

### Mandatory Post-Phase Workflow
**MUST COMPLETE BEFORE ANY COMMIT**

#### Validation Checklist (30-45 minutes)
- [ ] **Schema Validation**: Run `npx prisma validate` - must pass with 0 errors
- [ ] **Schema-Spec Alignment**: Verify schema matches spec exactly (fields, types, relations)
- [ ] **TypeScript Check**: Run `npx tsc --noEmit` - must pass with 0 errors
- [ ] **Build Check**: Run `npm run build` - must pass (0 errors, warnings acceptable if documented)
- [ ] **Service Integration**: All service calls use correct function names and signatures
- [ ] **Type Safety**: No `any` types introduced (or documented if unavoidable)
- [ ] **Import Correctness**: All imports resolve correctly (no missing modules)
- [ ] **Database Query Test**: Test database operations work (create, read, update, delete)
- [ ] **API Testing** (if applicable):
  - [ ] Test with curl, Postman, or Thunder Client
  - [ ] Verify request/response matches OpenAPI contract
  - [ ] Test authentication/authorization (401, 403 responses)
  - [ ] Test validation errors (400 responses)
  - [ ] Test success path (200, 201 responses)
- [ ] **UI Testing** (if applicable):
  - [ ] Component renders without errors
  - [ ] All interactive elements work (buttons, forms, modals)
  - [ ] Theme switching works (Light/Dark/System)
  - [ ] Responsive design works (mobile, tablet, desktop)
  - [ ] Loading states display correctly
  - [ ] Error states display user-friendly messages
- [ ] **Manual QA Checklist**: All task-specific QA items completed
- [ ] **Regression Check**: Existing features still work (spot-check critical paths)
- [ ] **No Spec Drift**: Implementation matches spec (no undocumented changes)
- [ ] **No Architecture Changes**: Followed existing patterns (no new paradigms mid-phase)

#### Commit Approval Process
**❌ NEVER commit without explicit user approval**

1. **Request Approval**:
   - List all completed tasks with evidence
   - Show validation checklist results
   - Highlight any warnings or minor issues
   - Ask: "Ready to commit Phase X?"

2. **Wait for Explicit Approval**:
   - User reviews changes
   - User approves with explicit "yes, commit" or similar
   - User may request additional testing or fixes

3. **Only After Approval**:
   ```bash
   git add .
   git commit -m "Phase X: [Clear description]
   
   - Task 1: Description
   - Task 2: Description
   
   Validation:
   - Schema validated
   - Build passed
   - Manual QA completed"
   ```

---

### Visual Testing Workflow (UI Components Only)
**MANDATORY for all UI component refactoring or design token changes**

#### Storybook Story Creation (BEFORE refactoring)
1. **Create story FIRST** to establish visual baseline:
   ```tsx
   // Component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Component } from './Component';
   
   const meta: Meta<typeof Component> = {
     title: 'Components/Component',
     component: Component,
     parameters: { layout: 'centered' },
     tags: ['autodocs'],
   };
   
   export default meta;
   type Story = StoryObj<typeof Component>;
   
   // All variants
   export const Primary: Story = { args: { variant: 'primary' } };
   export const Secondary: Story = { args: { variant: 'secondary' } };
   export const AllStates: Story = {
     render: () => (
       <div className="space-y-4">
         <Component>Default</Component>
         <Component disabled>Disabled</Component>
       </div>
     ),
   };
   ```

2. **Capture Baseline**:
   ```bash
   npm run storybook
   npm run chromatic  # Or Percy/Loki
   ```

#### Component Refactoring
3. **Refactor to use design tokens**:
   - Replace hardcoded colors → semantic tokens (`bg-primary`)
   - Replace hardcoded fonts → typography tokens (`text-body`)
   - Replace hardcoded spacing → spacing tokens (`px-card-padding`)
   - Replace hardcoded shadows → elevation tokens (`shadow-card`)
   - Replace hardcoded radius → radius tokens (`rounded-button`)

#### Immediate Visual Testing (Within 5 minutes)
4. **Test in Storybook**:
   - [ ] Component renders correctly
   - [ ] Switch Light/Dark/System themes
   - [ ] Test hover/focus/active/disabled states
   - [ ] Test mobile/tablet/desktop breakpoints
   - [ ] Check accessibility (color contrast, ARIA)

5. **Run Visual Regression**:
   ```bash
   npm run chromatic  # Or equivalent
   ```
   - [ ] Review visual diff
   - [ ] Approve intentional changes
   - [ ] Reject unexpected changes (fix immediately)

#### Manual QA Checklist for UI Components
6. **Complete Component QA**:
   - [ ] Light theme: All variants correct
   - [ ] Dark theme: All variants correct
   - [ ] System theme: Respects OS preference
   - [ ] No color flicker when switching themes
   - [ ] Hover state: Visual feedback clear
   - [ ] Focus state: Focus ring visible (WCAG)
   - [ ] Active state: Visual feedback
   - [ ] Disabled state: Clearly disabled
   - [ ] Mobile (< 640px): Layout appropriate
   - [ ] Tablet (640-1024px): Layout appropriate
   - [ ] Desktop (> 1024px): Layout appropriate
   - [ ] Color contrast: WCAG AA (4.5:1 text)
   - [ ] Zero hardcoded values (all use tokens)

#### Integration Testing
7. **Test in Real Application**:
   ```bash
   npm run dev
   ```
   - [ ] Navigate to pages using component
   - [ ] Verify works with real data/layouts
   - [ ] Check browser console (no errors)

#### Build Validation
8. **Final Checks**:
   ```bash
   npx tsc --noEmit  # Must pass
   npm run build     # Must pass
   ```

#### Commit Only When 100% Validated
9. **Commit Message**:
   ```bash
   git commit -m "refactor(Component): migrate to design token system
   
   - Replaced hardcoded colors with semantic tokens
   - Replaced hardcoded spacing with spacing tokens
   - Added Storybook stories for all variants
   - Visual regression tests passed
   - Manual QA checklist completed
   
   Closes #XXX"
   ```

---

### 🚨 RED FLAGS - STOP IMMEDIATELY

**If you encounter ANY of these, STOP and ask user for guidance:**

1. **Schema doesn't match spec** → Review spec, verify field exists
2. **Service function signatures differ from usage** → Check existing services, align
3. **Build errors persist >30 minutes** → Report to user, don't spiral
4. **Creating new patterns not in existing codebase** → Use existing patterns
5. **Inventing field names not in spec** → Use exact spec names
6. **"I'll fix it later" thoughts** → Fix now according to spec, or ask user
7. **TypeScript errors** → Fix immediately, don't accumulate
8. **Visual regression failures** → Fix before proceeding
9. **Manual QA failures** → Fix before commit
10. **Spec ambiguity** → Ask user for clarification

---

### Phase Completion Criteria

**ALL of these MUST be true before phase is considered complete:**

- ✅ All tasks marked complete with evidence
- ✅ Implementation matches spec exactly (data model, API contracts, types)
- ✅ Prisma schema validated (`npx prisma validate`)
- ✅ TypeScript compiles with no errors (`npx tsc --noEmit`)
- ✅ Build passes (`npm run build`)
- ✅ No critical lint errors
- ✅ No spec drift or architectural changes mid-phase
- ✅ Manual QA checklists completed for all tasks
- ✅ Visual regression tests passed (UI components only)
- ✅ User approval received
- ✅ Git commit created with detailed message

**If ANY criterion fails**: Fix immediately, don't proceed to next phase.

---

## Testing Standards

### Visual Testing Requirements (UI Components)
**MANDATORY for all UI component work**

#### Tools Required
- **Storybook**: 7+ (UI component explorer)
- **Visual Regression**: ONE of Chromatic, Percy, or Loki
- **Manual QA**: Component-specific checklists

#### Testing Workflow
1. **Create Storybook story BEFORE refactoring** (establish baseline)
2. **Refactor component** to use design tokens
3. **Test immediately in Storybook** (< 5 minutes feedback)
4. **Run visual regression tests** (catch unintended changes)
5. **Complete manual QA checklist** (themes, states, responsive)
6. **Test in real application** (integration test)
7. **Commit only when 100% validated**

#### Manual QA Checklist Template
Every UI component MUST verify:
- [ ] Light theme: Renders correctly
- [ ] Dark theme: Renders correctly
- [ ] System theme: Respects OS preference
- [ ] Hover state: Visual feedback clear
- [ ] Focus state: Keyboard accessible (WCAG)
- [ ] Active state: Visual feedback
- [ ] Disabled state: Clearly disabled
- [ ] Mobile (< 640px): Responsive layout
- [ ] Tablet (640-1024px): Responsive layout
- [ ] Desktop (> 1024px): Responsive layout
- [ ] Color contrast: WCAG AA (4.5:1)
- [ ] Zero hardcoded values (all tokens)
- [ ] No console errors or warnings

### API Testing Requirements
**MANDATORY for all API routes**

#### Tools
- **curl**, **Postman**, or **Thunder Client**
- **Prisma Studio** (database verification)

#### Testing Checklist
- [ ] Authentication: Returns 401 if unauthorized
- [ ] Authorization: Returns 403 if insufficient permissions
- [ ] Validation: Returns 400 for invalid input
- [ ] Success path: Returns correct status (200, 201)
- [ ] Response format: Matches OpenAPI contract
- [ ] Database changes: Verified in Prisma Studio
- [ ] Audit logs: Created for important actions
- [ ] Error messages: User-friendly (no stack traces)

### Database Testing Requirements
**MANDATORY for all schema changes**

#### Validation Steps
- [ ] Run `npx prisma validate` (0 errors)
- [ ] Migration applied successfully
- [ ] Prisma Client regenerated (`npx prisma generate`)
- [ ] Database tables match schema (check with Prisma Studio)
- [ ] Relations work correctly (foreign keys)
- [ ] Enums have correct values
- [ ] Default values applied
- [ ] Unique constraints enforced

### Integration Testing
**Test real user flows, not isolated components**

#### Critical Paths to Test
- [ ] Authentication: Signup → Login → Dashboard
- [ ] Role-based access: Each role can only access allowed routes
- [ ] Admin bypass: Admin can access all dashboards
- [ ] Data flow: Form submit → API → Database → UI refresh
- [ ] Error handling: Network error → User-friendly message
- [ ] Theme switching: No visual glitches or state loss

### Regression Testing
**Verify existing features still work after changes**

#### Spot-Check List
- [ ] Login/logout flow works
- [ ] Navigation between pages works
- [ ] Existing forms submit correctly
- [ ] Data displays correctly on dashboards
- [ ] Theme switching still works
- [ ] No new console errors

### Performance Testing (Optional, for large features)
- [ ] Page load time < 3 seconds (Lighthouse)
- [ ] No memory leaks (Chrome DevTools)
- [ ] Database queries optimized (use indexes)
- [ ] Bundle size acceptable (check build output)

---

## Code Quality Standards

### TypeScript Best Practices
- Use interfaces for object shapes, types for unions/primitives
- Avoid type assertions (`as`) unless necessary
- Use optional chaining (`?.`) for nullable values
- Use nullish coalescing (`??`) for default values
- Prefer const over let (no var)

### React Best Practices
- One component per file (unless helper components)
- Extract reusable logic into custom hooks
- Memoize expensive calculations (useMemo)
- Memoize callback functions passed to children (useCallback)
- Use fragments (<></>) to avoid unnecessary divs

### Async/Await Patterns
- Always use try/catch for error handling
- Never ignore errors silently
- Log errors with context (what operation failed)
- Return user-friendly error messages
- Clean up resources in finally blocks

### Performance Considerations
- Lazy load heavy components (React.lazy)
- Optimize images (Next.js Image component)
- Minimize client-side JavaScript (prefer server components)
- Use database indexes for frequent queries
- Implement pagination for large datasets (future)

---

## Security Requirements

### Password Security
- **Minimum length**: 8 characters
- **Complexity**: At least one uppercase, lowercase, number, special character
- **Hashing**: bcryptjs with 10 salt rounds
- **Storage**: Never log or display passwords
- **Transmission**: HTTPS only (enforced in production)

### Email Validation
- **Format**: Standard email regex pattern
- **Typo detection**: Common domain misspellings (gail.com → gmail.com)
- **Valid TLDs**: 2-6 character top-level domains only
- **Uniqueness**: Enforce unique constraint at database level

### Session Security
- **JWT Secret**: Strong random string (32+ characters)
- **Expiration**: 30 days (configurable)
- **HttpOnly**: Cookies not accessible via JavaScript
- **SameSite**: CSRF protection enabled
- **Secure**: HTTPS-only in production

### Admin Access
- **Initial admin**: Created via seed script (not publicly accessible)
- **Password change**: Required after first login in production
- **Multi-dashboard access**: Allowed for support purposes
- **Role verification**: Server-side checks (JWT-based, cannot be faked)
- **Development menu**: Only visible in `NODE_ENV === 'development'`

---

## Documentation Standards

### Code Comments
- **File headers**: Purpose, structure, and usage examples
- **Function comments**: Describe what, why, and edge cases
- **Complex logic**: Step-by-step explanations for future developers
- **TODOs**: Include context and priority (e.g., `// TODO (PRIORITY): Description`)
- **Teaching notes**: Explain patterns for junior developers

### Progress Documentation
- **Location**: `DOC/Records/` directory
- **Naming**: `FEATURE-DESCRIPTION-DATE.md` or `FEATURE-DESCRIPTION.md`
- **Content**: Implementation details, decisions made, testing results
- **Updates**: Modify when significant changes occur
- **Audits**: Document current state before major features

### API Documentation
- **Endpoint**: Full path (e.g., `/api/auth/register/homeowner`)
- **Method**: HTTP method (GET, POST, PATCH, DELETE)
- **Auth required**: Yes/No, which roles
- **Request body**: TypeScript interface or example JSON
- **Response**: Success and error response structures
- **Error codes**: All possible status codes and meanings

---

## Role-Based Features

### Guest (Unauthenticated)
- ✅ View homepage and public content
- ✅ Submit instant quote requests (anonymous, stored in database)
- ✅ Subscribe to newsletter
- ✅ Access blog posts
- ❌ Cannot access any dashboard
- ❌ Cannot save quotes to account (must create account)

### Homeowner
- ✅ Create account (email/password)
- ✅ Login to homeowner dashboard
- ✅ Request detailed solar quotes
- ✅ View quote history
- ✅ Message installers
- ✅ Manage profile
- ❌ Cannot access installer or admin dashboards

### Installer
- ✅ Create account (email/password + company details)
- ✅ Login to installer dashboard
- ✅ View lead feed (homeowner quote requests)
- ✅ Purchase leads
- ✅ Message homeowners
- ✅ Manage business profile
- ❌ Cannot access homeowner or admin dashboards

### Admin
- ✅ Login with credentials (no public signup)
- ✅ Access admin dashboard
- ✅ View all instant quotes
- ✅ Update quote statuses
- ✅ Delete invalid quotes
- ✅ **Bypass**: Access homeowner and installer dashboards (support feature)
- ✅ View all users and activity
- 🚧 Create/manage other admin users (future feature)

---

## Current Implementation Status

### ✅ Completed Features
- Full authentication system (NextAuth.js + Prisma + bcryptjs)
- User registration (homeowner & installer roles)
- Role-based dashboards (admin, homeowner, installer)
- Admin seeding script (`npm run seed:admin`)
- Admin bypass middleware (access all routes)
- Newsletter subscription (frontend + backend + database)
- Instant quote form (guest submissions to database)
- Admin instant quote management (view, update status, delete)
- Dark mode theme system (ThemeProvider + Tailwind)
- Responsive navigation bars (role-specific bottom navbars)
- Email validation with typo detection
- Scroll-responsive header (show on scroll up, hide on scroll down)
- Development quick access menu (admin dashboard only, dev mode)

### 🚧 In Progress / Future Features
- Lead management system (installer purchases)
- Messaging system (homeowner ↔ installer communication)
- Payment integration (Stripe for lead purchases)
- Email verification flow
- Password reset functionality
- OAuth providers (Google, Apple)
- Admin user management UI
- Quote builder with pricing calculator
- Rebate/incentive calculator
- Blog CMS integration

---

## Environment Variables

### Required Variables
```bash
# Database (Supabase or Vercel Postgres)
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"

# NextAuth.js
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"  # Production: your-domain.com

# OAuth (Future - not yet implemented)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Optional Variables
```bash
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Future integrations
# STRIPE_SECRET_KEY="sk_test_..."
# SENDGRID_API_KEY="SG..."
# CLOUDINARY_CLOUD_NAME="..."
```

---

## Governance

### Constitution Authority
- This constitution supersedes all other development practices
- All features must comply with these standards
- Amendments require documentation and team approval (if applicable)
- Non-compliance must be documented with justification

### Code Review Standards
- All code must follow TypeScript strict mode
- API routes must include authentication checks
- Database changes require migrations
- No direct SQL without Prisma review
- Security vulnerabilities = immediate fix priority
- **UI component changes require Storybook stories** (no exceptions)
- **Visual regression tests must pass** before merge (Chromatic/Percy/Loki)
- **Manual QA checklists must be completed** for all tasks with frontend + backend changes
- **No batch refactoring**: Only one component or feature per commit
- **Spec compliance mandatory**: Implementation must match specification exactly

### Breaking Changes
- Database schema changes: Create migration, test locally, document
- API contract changes: Version endpoints or maintain backward compatibility
- Authentication changes: Test all user flows before deployment
- Component API changes: Update all usages in codebase

### Development Principles
- **Iterate quickly**: Build one feature at a time, test immediately (follow mandatory workflow standards)
- **Document decisions**: Record what was done and why
- **Security first**: Validate all inputs, protect all routes
- **Teaching mindset**: Write code that future developers can understand
- **YAGNI**: Build what's needed now, not what might be needed later
- **Zero "Hoping for the Best"**: Follow pre-phase audit, during-phase testing, post-phase validation (see Development Workflow Standards)
- **Visual Validation First**: For UI changes, create Storybook stories BEFORE refactoring
- **Atomic Commits**: One component or feature per commit (no batch refactoring)
- **Spec Compliance**: Implementation must match spec exactly (no improvisation)

---

**Version**: 1.0.0  
**Ratified**: October 13, 2025  
**Last Amended**: October 13, 2025  
**Project**: SolarMatch - Solar Lead Generation Platform