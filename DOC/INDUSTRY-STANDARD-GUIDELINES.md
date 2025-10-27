# Industry-Standard Full-Stack Web Application Development Guidelines

**Version**: 1.0  
**Created**: January 27, 2025  
**Author**: Senior Full-Stack Web Developer Standards  
**Purpose**: Comprehensive A-Z guidelines for professional web application development covering UI/UX, Backend, API, DevOps, and Quality Assurance

**Scope**: These guidelines represent industry best practices from leading tech companies (Google, Meta, Microsoft, Airbnb, Stripe) and open-source communities. Applicable to SolarMatch and all future web application projects.

---

## Table of Contents

1. [UI/UX Design System Standards](#1-uiux-design-system-standards)
   - 1.1 [Design Token System (Critical)](#11-design-token-system-critical)
   - 1.2 [Mobile-First Responsive Design Standards (CRITICAL)](#12-mobile-first-responsive-design-standards-critical)
   - 1.3 [Page & Routing Architecture Standards (Next.js)](#13-page--routing-architecture-standards-nextjs)
   - 1.4 [Component Architecture](#14-component-architecture)
   - 1.5 [Visual Testing Standards](#15-visual-testing-standards)
2. [Frontend Architecture Standards](#2-frontend-architecture-standards)
3. [Backend Architecture Standards](#3-backend-architecture-standards)
4. [API Design Standards](#4-api-design-standards)
5. [Database Design Standards](#5-database-design-standards)
6. [Authentication & Authorization Standards](#6-authentication--authorization-standards)
7. [Security Standards](#7-security-standards)
8. [Testing & Quality Assurance Standards](#8-testing--quality-assurance-standards)
9. [Performance Standards](#9-performance-standards)
10. [Accessibility Standards](#10-accessibility-standards)
11. [Documentation Standards](#11-documentation-standards)
12. [DevOps & Deployment Standards](#12-devops--deployment-standards)
13. [Code Quality Standards](#13-code-quality-standards)
14. [Project Management Standards](#14-project-management-standards)

---

## 1. UI/UX Design System Standards

### 1.1 Design Token System (Critical)

**Industry Standard**: Material Design 3, Ant Design, Chakra UI, Radix Themes

#### Color System
- **Centralized Color Tokens**: ALL colors defined in central token file
- **Semantic Naming**: `primary`, `secondary`, `success`, `warning`, `error`, `info` (not `teal-600`, `red-500`)
- **Variant System**: Each color has `light`, `DEFAULT`, `dark` variants for hover/active states
- **Neutral Scales**: 50-950 scale for grays (background, borders, text)
- **Brand Colors**: Primary (1-2 colors), Secondary (1 color), Accent (optional)
- **WCAG Compliance**: All text/background combinations meet AA standards (4.5:1 contrast ratio)
- **Theme Support**: Minimum 2 themes (Light, Dark) with centralized theme configuration
- **No Hardcoded Colors**: Zero inline hex codes or arbitrary Tailwind classes (`bg-teal-600`)

#### Typography System
- **Font Families**: Sans-serif (UI), Monospace (code), Serif (long-form content - optional)
- **Type Scale**: 8-10 sizes following modular scale (1.125, 1.250, 1.333 ratios)
  - Example: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
- **Semantic Tokens**: `display`, `h1-h6`, `body`, `caption`, `code` (not just `text-sm`, `text-lg`)
- **Line Height Ratios**:
  - Headings: 1.2 - 1.3 (tight)
  - Body text: 1.5 - 1.6 (normal)
  - Long-form content: 1.7 - 1.8 (relaxed)
- **Font Weights**: 4 levels (400 normal, 500 medium, 600 semibold, 700 bold)
- **Letter Spacing**: Defined for specific use cases (all-caps headers, tight display text)
- **Responsive Typography**: Fluid scaling or breakpoint-based adjustments

#### Spacing System
- **8-Point Grid**: ALL spacing in multiples of 4px or 8px
  - Standard scale: 0, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
- **Semantic Tokens**: `card-padding`, `form-gap`, `section-margin` (not just numeric values)
- **Responsive Spacing**: Tighter on mobile, more generous on desktop
- **No Arbitrary Values**: Avoid random spacing like 13px, 27px, 45px
- **Optical Adjustments**: Document exceptions (e.g., circular buttons need extra padding)

#### Shadow/Elevation System
- **5-7 Elevation Levels**: none, sm, DEFAULT, md, lg, xl, 2xl, inner
- **Visual Hierarchy**: Higher elevation = higher z-index (modals > dropdowns > cards)
- **Theme-Aware Shadows**: Dark shadows for light mode, lighter shadows for dark mode
- **Semantic Shadows**: `shadow-card`, `shadow-dropdown`, `shadow-modal`
- **Material Design Principles**: Follow Google's elevation guidelines (0dp - 24dp)

#### Border Radius System
- **Standard Scale**: none (0), sm (4px), md (8px), lg (12px), xl (16px), 2xl (24px), full (9999px)
- **Component Consistency**: All buttons use same radius, all cards use same radius
- **Semantic Tokens**: `radius-button`, `radius-input`, `radius-card`
- **Brand Identity**: Border radius contributes to brand "feel" (sharp vs rounded)

#### Animation/Transition System
- **Duration Tokens**: fast (150ms), normal (300ms), slow (500ms)
- **Easing Functions**: ease-in, ease-out, ease-in-out, linear
- **Reduced Motion**: Respect `prefers-reduced-motion` user preference
- **Consistent Transitions**: All hover states use same duration/easing
- **Performance**: Use `transform` and `opacity` (GPU-accelerated), avoid `width`/`height` animations

### 1.2 Mobile-First Responsive Design Standards (CRITICAL)

**Industry Standard**: Google Mobile-First Indexing, Progressive Enhancement, Touch-Friendly UI

#### Philosophy: Design for Mobile FIRST, Scale Up
- **Why Mobile-First**: 70%+ users access web apps on mobile, mobile constraints force better UX decisions
- **Progressive Enhancement**: Start with smallest screen (320px), add features for larger screens
- **Performance Benefits**: Load only what's needed for mobile, enhance for desktop
- **Easier to Scale Up**: Add features for desktop vs removing features for mobile

#### Viewport Breakpoints (Tailwind CSS Standard)
```
Mobile (default):    < 640px     [No prefix - this is your BASE]
Tablet:              640-1024px  (md: prefix)
Desktop:             > 1024px    (lg: prefix)
Large Desktop:       > 1280px    (xl: prefix)
Extra Large:         > 1536px    (2xl: prefix)
```

**Critical Rule**: Always write mobile styles FIRST (no prefix), then add `md:` and `lg:` for larger screens.

#### Mobile-First Typography
**Problem**: Desktop font sizes (16px+) are TOO LARGE on mobile, causing poor readability and excessive scrolling.

**Solution**:
```tsx
// ✅ CORRECT: 14px mobile, 16px desktop
<p className="text-sm md:text-base">Body text</p>

// ✅ CORRECT: 24px mobile, 36px desktop
<h1 className="text-2xl md:text-4xl font-bold">Heading</h1>

// ❌ WRONG: Same size on all devices (too big on mobile)
<p className="text-base">This is 16px everywhere - TOO BIG on mobile</p>
```

**Standards**:
- **Body Text**: 14px mobile, 16px desktop (`text-sm md:text-base`)
- **Headings**: Scale down 25-30% on mobile (h1: 24px mobile → 36px desktop)
- **Small Text**: Minimum 12px mobile, 14px desktop (WCAG readability)
- **Line Height**: 1.5 for body, 1.2-1.3 for headings

#### Mobile-First Spacing
**Problem**: Desktop spacing (24px, 32px padding) creates excessive white space on mobile, reducing content visibility.

**Solution**:
```tsx
// ✅ CORRECT: 16px mobile, 24px desktop padding
<div className="p-4 md:p-6">Content</div>

// ✅ CORRECT: 12px mobile, 24px desktop gaps
<div className="space-y-3 md:space-y-6">Items</div>

// ❌ WRONG: Same spacing everywhere (excessive on mobile)
<div className="p-8">32px padding on mobile - EXCESSIVE</div>
```

**Standards**:
- **Card Padding**: 12-16px mobile, 24px desktop (`p-3 md:p-6` or `p-4 md:p-6`)
- **Section Spacing**: 24px mobile, 48px desktop (`space-y-6 md:space-y-12`)
- **Form Field Gaps**: 12px mobile, 16px desktop (`space-y-3 md:space-y-4`)
- **Rule**: Mobile spacing = 50-75% of desktop spacing

#### Mobile-First Component Layouts
**Problem**: Multi-column grids on mobile create tiny, unusable cards. Fixed-width components cause horizontal scroll.

**Solution**:
```tsx
// ✅ CORRECT: 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
</div>

// ✅ CORRECT: Full-width mobile button, auto-width desktop
<Button className="w-full md:w-auto">Submit</Button>

// ❌ WRONG: Fixed 3-column grid (breaks on mobile)
<div className="grid grid-cols-3 gap-6">
  <Card /> {/* Tiny cards on mobile */}
</div>
```

**Component Patterns**:

**Cards**:
```tsx
// Full-width mobile, grid desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card />
</div>
```

**Forms**:
```tsx
// Stacked mobile, 2-column desktop
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="First Name" />
    <FormField label="Last Name" />
  </div>
  <Button className="w-full md:w-auto">Submit</Button>
</form>
```

**Tables**:
```tsx
// Card layout mobile, table desktop
<div className="block md:hidden">
  {data.map(item => (
    <Card key={item.id} className="p-4 mb-4">
      <div className="font-bold">{item.name}</div>
      <div className="text-sm text-muted-foreground">{item.email}</div>
    </Card>
  ))}
</div>

<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    {/* Traditional table for desktop */}
  </table>
</div>
```

**Navigation**:
```tsx
// Bottom nav mobile, sidebar desktop
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
  <div className="flex justify-around py-2">
    <NavLink href="/dashboard" icon={<HomeIcon />}>Home</NavLink>
  </div>
</nav>

<aside className="hidden md:block w-64 border-r">
  <nav className="p-4">
    <NavLink href="/dashboard">Dashboard</NavLink>
  </nav>
</aside>
```

#### Touch-Friendly Mobile UI (WCAG 2.5.5 Compliance)
**Standard**: Minimum touch target size is **44px × 44px** (WCAG 2.5.5 Level AAA).

**Industry Best Practice**: 48-56px for primary actions (easier to tap).

```tsx
// ✅ CORRECT: 48px height on mobile, 40px desktop
<Button className="h-12 md:h-10 px-6 md:px-4 text-base md:text-sm">
  Click Me
</Button>

// ❌ WRONG: 32px height on mobile (too small to tap reliably)
<Button className="h-8 px-2 text-sm">
  Click Me {/* Hard to tap on mobile */}
</Button>
```

**Standards**:
- **Buttons**: Minimum 44px height, prefer 48px (`h-12`)
- **Links in Lists**: Minimum 44px tap area (add padding)
- **Form Inputs**: Minimum 44px height
- **Icon Buttons**: Minimum 44px × 44px
- **Spacing Between Tappable Elements**: Minimum 8px gap

#### App-Like Mobile Experience
**Characteristics**:
- **Full-Screen Content**: Edge-to-edge design, no wasted space
- **Bottom Navigation**: Thumb-friendly (not top hamburger menu)
- **Large Touch Targets**: 48-56px for primary actions
- **Simplified UI**: Fewer options on mobile, focused interactions
- **Loading States**: Skeleton screens, not just spinners
- **Pull-to-Refresh**: Native-feeling interactions
- **Swipe Gestures**: For carousels, dismissible cards

#### Mobile-First Testing Checklist (MANDATORY)
For EVERY page/component, test on mobile FIRST:

- [ ] **320px width**: iPhone SE (smallest common device)
- [ ] **375px width**: iPhone 12/13 (most common)
- [ ] **414px width**: iPhone 14 Pro Max (large phone)
- [ ] Text is readable: minimum 14px body text, 12px small text
- [ ] Touch targets: minimum 44px × 44px, prefer 48px
- [ ] No horizontal scroll: content fits in viewport
- [ ] Spacing is comfortable: not cramped (min 8px gaps), not excessive (max 24px padding on mobile)
- [ ] Navigation is thumb-friendly: bottom nav or easy-to-reach menu
- [ ] Forms are usable: full-width inputs, large buttons
- [ ] Modals work: full-screen or properly sized
- [ ] Tables are readable: card layout or horizontal scroll with indicators
- [ ] Performance: < 3s load time on 3G network
- [ ] App-like feel: full-screen content, no wasted space

#### Mobile-First Red Flags 🚨
**STOP immediately if you see**:
1. Fixed desktop widths without mobile alternatives (`w-[600px]` with no responsive classes)
2. Tiny text on mobile (`text-xs` or smaller as body text)
3. Excessive spacing on mobile (`p-8` or larger without mobile override)
4. Multi-column grids on mobile (`grid-cols-3` without `grid-cols-1` for mobile)
5. Small touch targets (buttons < 44px height on mobile)
6. Horizontal scroll (content wider than viewport)
7. Desktop-only navigation (sidebar without mobile drawer/bottom nav)
8. Same table on mobile (no card alternative)
9. Desktop font sizes on mobile (16px+ body text causing excessive scrolling)
10. Same component spacing on all devices (no responsive padding/gaps)

### 1.3 Page & Routing Architecture Standards (Next.js)

**Industry Standard**: Feature-based routing, layout inheritance, consistent navigation

#### Layout Structure (CRITICAL)
**Problem**: AI builds standalone pages with duplicate sidebars/navigation, creating inconsistent structure and wasting development time.

**Solution**: ALWAYS inherit existing layouts, NEVER recreate sidebars or navigation.

**Current Layout Hierarchy** (Your Project):
```
app/
├── admin/
│   ├── layout.tsx          # Admin sidebar + navigation
│   ├── page.tsx            # /admin
│   └── [feature]/
│       └── page.tsx        # /admin/[feature] - inherits admin layout
├── homeowner/
│   ├── layout.tsx          # Homeowner sidebar + navigation
│   └── [feature]/page.tsx  # Inherits homeowner layout
└── installer/
    ├── layout.tsx          # Installer sidebar + navigation
    └── [feature]/page.tsx  # Inherits installer layout
```

#### Mandatory Pre-Page Creation Workflow (10 Minutes)
**Before creating ANY new page, ALWAYS do this**:

**Step 1: Layout Discovery (5 min)**
```bash
# Find existing layouts
find app -name "layout.tsx" -type f

# Read layout files to understand structure
# Check what navigation/sidebar already exists
```

**Step 2: Navigation Structure Discovery (3 min)**
```bash
# Find sidebar/navigation components
grep -r "sidebar" app/components
grep -r "navigation" app/components

# Read sidebar component to see menu items
```

**Step 3: Routing Pattern Verification (2 min)**
```bash
# Check existing route patterns
ls -R app/admin
ls -R app/homeowner
ls -R app/installer

# Verify naming conventions match
```

#### Page Creation Rules

**✅ CORRECT: Inherit Layout**
```tsx
// app/admin/settings/page.tsx
export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1>Settings</h1>
      {/* Page content only - no sidebar, inherits admin layout */}
    </div>
  );
}
```

**❌ WRONG: Duplicate Layout**
```tsx
// app/admin/settings/page.tsx
export default function AdminSettingsPage() {
  return (
    <div className="flex">
      <AdminSidebar />  {/* ❌ WRONG: Duplicates sidebar from layout.tsx */}
      <main>
        <h1>Settings</h1>
      </main>
    </div>
  );
}
```

#### Navigation Link Addition
**When adding new page to navigation, update sidebar component ONLY**:

```tsx
// ✅ CORRECT: Update app/components/AdminSidebar.tsx
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon }, // Add here
];
```

**❌ WRONG: Create new sidebar in page**

#### Mobile-Responsive Layout Patterns
```tsx
// Desktop: Sidebar visible
// Mobile: Sidebar hidden, show hamburger menu or bottom nav

<div className="flex">
  {/* Sidebar: hidden mobile, visible desktop */}
  <aside className="hidden md:block w-64 border-r">
    <Sidebar />
  </aside>

  {/* Mobile: Hamburger or bottom nav */}
  <MobileNav className="md:hidden" />

  {/* Main content */}
  <main className="flex-1">
    {children}
  </main>
</div>
```

#### Route Organization Best Practices
- **Feature-Based Routing**: Group related pages (e.g., `/admin/users/*` for all user management)
- **Consistent Naming**: Use kebab-case for route segments (`/solar-quotes`, not `/solarQuotes`)
- **Route Groups**: Use `(auth)`, `(dashboard)` to organize without affecting URL
- **Parallel Routes**: Use `@modal`, `@sidebar` for complex layouts
- **Dynamic Routes**: Use `[id]` for dynamic segments

#### Page Creation Red Flags 🚨
**STOP immediately if you see**:
1. Importing `AdminSidebar`, `HomeownerSidebar`, or `InstallerSidebar` in a page file
2. Duplicating navigation menus in page component
3. Creating standalone layout inside page (wrapping with `<div className="flex"><aside>...</aside><main>`)
4. Inconsistent navigation (different menu items on different pages)
5. Missing responsive layout (sidebar always visible on mobile)
6. Creating new `layout.tsx` without verifying parent layouts
7. Hardcoding navigation links instead of using dynamic mapping
8. Different color schemes/themes on different pages (should be centralized)

#### Page Creation Checklist

**Before Creating Page**:
- [ ] Verified existing layout structure (`find app -name "layout.tsx"`)
- [ ] Read parent layout to understand what's already provided
- [ ] Checked sidebar component for existing navigation items
- [ ] Verified route naming patterns match existing conventions
- [ ] Confirmed mobile-responsive layout exists (sidebar hidden on mobile)
- [ ] Identified correct folder (admin, homeowner, installer)
- [ ] No duplicate UI elements planned (sidebar, header, nav)
- [ ] Page component will ONLY contain page-specific content

**After Creating Page**:
- [ ] Page inherits correct layout (no duplicate sidebar)
- [ ] Navigation link added to sidebar component (if applicable)
- [ ] Page renders correctly on mobile (320px, 375px, 414px)
- [ ] Page renders correctly on desktop (>1024px)
- [ ] No console errors or warnings
- [ ] Consistent styling with other pages in same section

### 1.4 Component Architecture

#### Atomic Design Methodology
- **Atoms**: Buttons, inputs, labels, icons (smallest building blocks)
- **Molecules**: Form fields (label + input + error), search bars (input + button)
- **Organisms**: Forms, navigation bars, cards with multiple elements
- **Templates**: Page layouts with placeholder content
- **Pages**: Actual pages with real content

#### Component Standards
- **Single Responsibility**: One component, one purpose
- **Composability**: Components combine to create complex UIs
- **Reusability**: Build for reuse across multiple pages
- **Prop Interface**: Clear TypeScript interfaces for all props
- **Default Props**: Sensible defaults for optional props
- **Variant System**: Use `variant` prop for different styles (primary, secondary, ghost)
- **Size System**: Use `size` prop for different sizes (sm, md, lg)
- **State Management**: Loading, error, success, disabled states

#### Component File Structure
```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx           # Component implementation
│   │   ├── Button.stories.tsx   # Storybook stories
│   │   ├── Button.test.tsx      # Unit tests
│   │   └── index.ts             # Barrel export
│   ├── Input/
│   └── Badge/
├── molecules/
│   ├── FormField/
│   ├── SearchBar/
│   └── StatusIndicator/
├── organisms/
│   ├── LoginForm/
│   ├── DataTable/
│   └── NavigationBar/
└── templates/
    ├── DashboardLayout/
    └── AuthLayout/
```

### 1.5 Visual Testing Standards

**Industry Standard**: Chromatic, Percy, Applitools, Loki

#### Storybook Requirements
- **Mandatory for UI Components**: Every reusable component MUST have Storybook stories
- **Story Coverage**: Default, all variants, all states (loading, error, disabled)
- **Theme Testing**: Stories for Light/Dark themes
- **Responsive Testing**: Stories at multiple viewport sizes
- **Accessibility Testing**: Use `@storybook/addon-a11y`
- **Documentation**: Use `autodocs` for automatic prop documentation

#### Visual Regression Testing
- **Automated Snapshots**: Visual regression tests for every component
- **Baseline Management**: Establish visual baselines, approve intentional changes
- **CI/CD Integration**: Visual tests run on every pull request
- **Cross-Browser Testing**: Test in Chrome, Firefox, Safari (via cloud services)
- **Pixel-Perfect Verification**: Catch unintended visual changes (1px shifts, color changes)

#### Manual QA Checklist
For EVERY component:
- [ ] Light theme renders correctly
- [ ] Dark theme renders correctly
- [ ] All interactive states work (hover, focus, active, disabled)
- [ ] Responsive at mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- [ ] Accessibility: Color contrast, keyboard navigation, screen reader support
- [ ] No console errors or warnings

---

## 2. Frontend Architecture Standards

### 2.1 Framework Best Practices (Next.js 14+)

#### App Router (Next.js 14+)
- **Server Components First**: Default to Server Components for better performance
- **Use Client Components Sparingly**: Only when interactive features (hooks, browser APIs) required
- **File-Based Routing**: Use `app/` directory structure
- **Layouts**: Share common UI (navigation, footer) across routes
- **Loading States**: Use `loading.tsx` for Suspense boundaries
- **Error Boundaries**: Use `error.tsx` for error handling
- **Route Groups**: Organize routes with `(group)` folders
- **Parallel Routes**: Use `@folder` syntax for dashboard layouts
- **Intercepting Routes**: Use `(.)folder` for modals

#### Performance Optimization
- **Code Splitting**: Dynamic imports for heavy components (`React.lazy`, `next/dynamic`)
- **Image Optimization**: Always use `next/image` component (automatic WebP, lazy loading)
- **Font Optimization**: Use `next/font` for automatic font optimization
- **Bundle Analysis**: Regularly run `npm run build` and review bundle sizes
- **Tree Shaking**: Ensure dead code elimination works
- **Lazy Loading**: Load below-the-fold content after initial render

### 2.2 State Management

**Industry Standard**: React Context API, Zustand, Redux Toolkit, Jotai

#### State Categories
- **Server State**: Data from APIs (use React Query, SWR, or Next.js Server Components)
- **Client State**: UI state (modals, theme, form inputs) - use React hooks or Context API
- **URL State**: Search params, filters - use Next.js `useSearchParams`
- **Form State**: Use React Hook Form or Formik for complex forms

#### State Management Rules
- **Keep State Local**: Don't lift state unnecessarily
- **Server State Caching**: Use React Query/SWR for automatic caching, refetching
- **Avoid Prop Drilling**: Use Context API for deeply nested state (max 3 levels)
- **Immutability**: Never mutate state directly (use spread operator, `Object.assign`)
- **Optimistic Updates**: Update UI immediately, rollback on error

### 2.3 Data Fetching

#### Server-Side Fetching (Preferred)
```typescript
// Server Component - fetch data directly
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store', // or 'force-cache' for static data
  });
  const json = await data.json();
  return <div>{/* render */}</div>;
}
```

#### Client-Side Fetching (When Necessary)
```typescript
// Use React Query for client-side data fetching
import { useQuery } from '@tanstack/react-query';

function Component() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(res => res.json()),
  });
}
```

#### Data Fetching Best Practices
- **Server Components**: Fetch data on server when possible (better SEO, performance)
- **Parallel Fetching**: Fetch multiple data sources simultaneously
- **Error Handling**: Always handle loading, error, and success states
- **Caching Strategy**: Use appropriate cache headers (SWR: stale-while-revalidate)
- **Loading States**: Show skeletons/spinners during data fetch
- **Pagination**: Implement for large datasets (never load 10,000+ items at once)

---

## 3. Backend Architecture Standards

### 3.1 API Layer Organization

**Industry Standard**: Clean Architecture, Hexagonal Architecture, Domain-Driven Design

#### Layer Structure
```
src/
├── app/                      # Next.js App Router (presentation layer)
│   └── api/                  # API routes (thin controllers)
├── lib/
│   ├── services/             # Business logic layer
│   │   ├── user-service.ts
│   │   ├── lead-service.ts
│   │   └── payment-service.ts
│   ├── repositories/         # Data access layer (optional - Prisma abstracts this)
│   ├── validators/           # Input validation schemas (Zod, Yup)
│   ├── utils/                # Utility functions
│   └── prisma.ts             # Prisma Client singleton
```

#### Separation of Concerns
- **API Routes**: Thin controllers (parse request, call service, return response)
- **Services**: Business logic, orchestration (complex operations, multiple DB calls)
- **Repositories**: Data access (optional with Prisma ORM)
- **Validators**: Input validation schemas (Zod for TypeScript)
- **Utils**: Pure functions (no side effects)

### 3.2 Service Layer Best Practices

#### Service Function Structure
```typescript
// lib/services/lead-service.ts
export async function createLead(data: CreateLeadInput): Promise<Lead> {
  // 1. Validate input (Zod schema validation)
  const validated = createLeadSchema.parse(data);
  
  // 2. Business logic checks
  if (await leadAlreadyExists(validated.email)) {
    throw new Error('Lead already exists');
  }
  
  // 3. Database operations
  const lead = await prisma.lead.create({
    data: validated,
  });
  
  // 4. Side effects (emails, notifications, audit logs)
  await sendWelcomeEmail(lead.email);
  await createAuditLog({ action: 'lead_created', leadId: lead.id });
  
  // 5. Return result
  return lead;
}
```

#### Service Standards
- **Single Responsibility**: One service per domain (UserService, LeadService, PaymentService)
- **Input Validation**: Validate all inputs with Zod schemas
- **Error Handling**: Throw descriptive errors, catch in API routes
- **Transaction Management**: Use Prisma transactions for multi-table operations
- **Idempotency**: Make operations idempotent where possible (use unique keys)
- **Audit Logging**: Log all critical operations (create, update, delete)

### 3.3 Error Handling

**Industry Standard**: Centralized error handling, custom error classes

#### Error Classification
```typescript
// lib/errors.ts
export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

#### API Route Error Handling
```typescript
// app/api/leads/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    // Generic error (don't expose details to client)
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 4. API Design Standards

### 4.1 RESTful API Conventions

**Industry Standard**: OpenAPI 3.0, REST API Design Rulebook, Microsoft REST API Guidelines

#### HTTP Methods
- **GET**: Retrieve resources (must be idempotent, no side effects)
- **POST**: Create new resources (non-idempotent)
- **PUT**: Replace entire resource (idempotent)
- **PATCH**: Partial update (idempotent)
- **DELETE**: Remove resource (idempotent)

#### URL Structure
```
Good:
  GET    /api/leads              # List leads
  GET    /api/leads/:id          # Get specific lead
  POST   /api/leads              # Create lead
  PATCH  /api/leads/:id          # Update lead
  DELETE /api/leads/:id          # Delete lead
  POST   /api/leads/:id/purchase # Purchase lead (action)

Bad:
  GET    /api/getLeads           # Don't use verbs in URLs
  POST   /api/lead/create        # Don't use verbs in URLs
  GET    /api/leads/delete/:id   # Use DELETE method, not GET
```

#### Status Codes (Standard Usage)
- **200 OK**: Successful GET, PATCH, DELETE
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE (no response body)
- **400 Bad Request**: Invalid input, validation errors
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (e.g., email already exists)
- **422 Unprocessable Entity**: Validation errors (alternative to 400)
- **429 Too Many Requests**: Rate limiting exceeded
- **500 Internal Server Error**: Unexpected server error
- **503 Service Unavailable**: Temporary outage (maintenance)

### 4.2 Request/Response Formats

#### Request Format
```typescript
// POST /api/leads
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "propertyAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105"
  },
  "estimatedBill": 250.50
}
```

#### Success Response Format
```typescript
// 201 Created
{
  "id": "lead_abc123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "status": "new",
  "createdAt": "2025-01-27T10:30:00Z",
  "updatedAt": "2025-01-27T10:30:00Z"
}
```

#### Error Response Format
```typescript
// 400 Bad Request
{
  "error": "Validation failed",
  "message": "Invalid email format",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

### 4.3 API Versioning

**Industry Standard**: URL versioning, Header versioning, or Semantic versioning

#### URL Versioning (Recommended for Public APIs)
```
/api/v1/leads     # Version 1
/api/v2/leads     # Version 2 (breaking changes)
```

#### Header Versioning (Alternative)
```
GET /api/leads
Accept: application/vnd.api+json; version=1
```

#### Deprecation Strategy
- **Announce Deprecation**: 6-12 months notice before removal
- **Sunset Header**: Include `Sunset` header with deprecation date
- **Documentation**: Clear migration guides for v1 → v2
- **Backwards Compatibility**: Support old versions for at least 1 year

### 4.4 API Security

#### Authentication
- **JWT Tokens**: Use NextAuth.js for session management
- **HTTP-Only Cookies**: Store tokens in HTTP-only cookies (prevent XSS)
- **Token Expiration**: Short-lived tokens (30 days max, 1 hour for sensitive operations)
- **Refresh Tokens**: Use refresh tokens for long-lived sessions

#### Authorization
- **Role-Based Access Control (RBAC)**: Check user role before allowing operations
- **Resource-Level Permissions**: Verify user owns resource before access
- **Admin Bypass**: Allow admins to access all resources (with audit logging)

#### Input Validation
- **Validate Everything**: Never trust client input
- **Zod Schemas**: Use Zod for TypeScript-first validation
- **Sanitization**: Sanitize HTML inputs (prevent XSS)
- **SQL Injection Protection**: Use Prisma parameterized queries (automatic)

#### Rate Limiting
```typescript
// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

---

## 5. Database Design Standards

### 5.1 Schema Design Principles

**Industry Standard**: Database Normalization, Third Normal Form (3NF), Domain-Driven Design

#### Naming Conventions
- **Tables**: Plural snake_case (`users`, `guest_instant_quotes`)
- **Columns**: Snake_case (`first_name`, `created_at`)
- **Primary Keys**: `id` (CUID or UUID for distributed systems)
- **Foreign Keys**: `{entity}_id` (`user_id`, `lead_id`)
- **Boolean Fields**: `is_` or `has_` prefix (`is_active`, `has_purchased`)
- **Timestamps**: `created_at`, `updated_at` (always include)
- **Soft Deletes**: `deleted_at` (nullable timestamp)

#### Data Types
- **IDs**: `String @id @default(cuid())` (CUID for distributed systems)
- **UUIDs**: Alternative to CUID for compatibility
- **Enums**: Use for status fields (`enum UserRole { GUEST, HOMEOWNER, INSTALLER, ADMIN }`)
- **Dates**: `DateTime` for timestamps, `Date` for date-only fields
- **Decimals**: Use `Decimal` for money (avoid Float/Double for financial data)
- **Text**: `String` for short text, `Text` for long text (unlimited length)

### 5.2 Relationships

#### One-to-Many
```prisma
model User {
  id    String @id @default(cuid())
  leads Lead[]
}

model Lead {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Many-to-Many
```prisma
model Installer {
  id             String           @id @default(cuid())
  purchasedLeads PurchasedLead[]
}

model Lead {
  id                String          @id @default(cuid())
  installerPurchases PurchasedLead[]
}

model PurchasedLead {
  id          String    @id @default(cuid())
  installerId String
  leadId      String
  installer   Installer @relation(fields: [installerId], references: [id])
  lead        Lead      @relation(fields: [leadId], references: [id])
  purchasedAt DateTime  @default(now())
  
  @@unique([installerId, leadId]) // Prevent duplicate purchases
}
```

### 5.3 Indexes

**Industry Standard**: Index frequently queried fields

#### Index Strategy
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique  // Automatic index
  role      UserRole @default(GUEST)
  createdAt DateTime @default(now())
  
  @@index([role])         // Index for filtering by role
  @@index([createdAt])    // Index for sorting by date
}

model Lead {
  id        String     @id @default(cuid())
  status    LeadStatus @default(NEW)
  createdAt DateTime   @default(now())
  
  @@index([status, createdAt]) // Composite index for common query
}
```

#### Index Guidelines
- **Unique Constraints**: Always index unique fields (email, username)
- **Foreign Keys**: Index all foreign key columns
- **Query Patterns**: Index fields used in WHERE, ORDER BY, GROUP BY
- **Composite Indexes**: Use for multi-field queries (`WHERE status = 'active' AND createdAt > date`)
- **Over-Indexing**: Don't index everything (slows down writes)

### 5.4 Migrations

**Industry Standard**: Version-controlled migrations, never edit migration files

#### Migration Workflow
```bash
# Create migration (development)
npx prisma migrate dev --name add_user_phone_field

# Apply migration (production)
npx prisma migrate deploy

# Reset database (development only - destroys data)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate
```

#### Migration Best Practices
- **Descriptive Names**: `add_user_phone_field`, `create_lead_table`, `add_lead_status_enum`
- **Never Edit**: Don't edit migration files after creation (create new migration instead)
- **Test Migrations**: Test on staging environment before production
- **Rollback Plan**: Document how to rollback breaking changes
- **Data Migrations**: Use seed scripts for data transformations

---

## 6. Authentication & Authorization Standards

### 6.1 Authentication Strategy

**Industry Standard**: JWT tokens, OAuth 2.0, OpenID Connect

#### NextAuth.js Implementation (Recommended)
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Password Security
- **Hashing Algorithm**: bcrypt with 10-12 salt rounds (NEVER store plaintext passwords)
- **Password Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- **Password Reset**: Time-limited tokens (1-2 hours), one-time use
- **Account Lockout**: Lock account after 5 failed login attempts (15-minute cooldown)

### 6.2 Authorization Strategy

**Industry Standard**: Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC)

#### Role-Based Access Control (RBAC)
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      
      // Admin-only routes
      if (path.startsWith('/admin')) {
        return token?.role === 'ADMIN';
      }
      
      // Homeowner routes
      if (path.startsWith('/homeowner')) {
        return token?.role === 'HOMEOWNER' || token?.role === 'ADMIN';
      }
      
      // Installer routes
      if (path.startsWith('/installer')) {
        return token?.role === 'INSTALLER' || token?.role === 'ADMIN';
      }
      
      // Public routes
      return true;
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/homeowner/:path*', '/installer/:path*'],
};
```

#### Resource-Level Authorization
```typescript
// lib/services/lead-service.ts
export async function updateLead(
  leadId: string,
  userId: string,
  userRole: string,
  data: UpdateLeadInput
) {
  // Check if user owns the lead
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });
  
  if (!lead) {
    throw new NotFoundError('Lead not found');
  }
  
  // Only owner or admin can update
  if (lead.userId !== userId && userRole !== 'ADMIN') {
    throw new ForbiddenError('You do not have permission to update this lead');
  }
  
  return prisma.lead.update({
    where: { id: leadId },
    data,
  });
}
```

---

## 7. Security Standards

### 7.1 OWASP Top 10 Protection

**Industry Standard**: OWASP Top 10, CWE Top 25

#### 1. Injection Protection
- **SQL Injection**: Use Prisma ORM (parameterized queries, automatic escaping)
- **NoSQL Injection**: Validate all MongoDB queries
- **Command Injection**: Never execute shell commands with user input

#### 2. Broken Authentication
- **Strong Password Policy**: 8+ characters, complexity requirements
- **Multi-Factor Authentication (MFA)**: Optional but recommended for admins
- **Session Management**: HTTP-only cookies, secure flag, SameSite attribute
- **Logout**: Clear session tokens on logout

#### 3. Sensitive Data Exposure
- **HTTPS Only**: Enforce HTTPS in production (HSTS header)
- **Encryption at Rest**: Database encryption (managed by cloud provider)
- **Encryption in Transit**: TLS 1.2+ for all connections
- **Secret Management**: Environment variables, never commit secrets to Git

#### 4. XML External Entities (XXE)
- **Disable XML Parsing**: Don't parse user-supplied XML unless necessary
- **Use JSON**: Prefer JSON over XML for API requests/responses

#### 5. Broken Access Control
- **Authorization Checks**: Verify user permissions on every request
- **Resource Ownership**: Check user owns resource before access
- **Direct Object References**: Use UUIDs/CUIDs instead of sequential IDs

#### 6. Security Misconfiguration
- **Default Credentials**: Change all default passwords
- **Error Messages**: Don't expose stack traces in production
- **Security Headers**: Set CSP, X-Frame-Options, X-Content-Type-Options
- **Dependency Updates**: Regularly update npm packages (weekly)

#### 7. Cross-Site Scripting (XSS)
- **React Auto-Escaping**: React automatically escapes JSX content
- **Sanitize HTML**: Use DOMPurify for user-generated HTML
- **Content Security Policy (CSP)**: Restrict script sources
- **Avoid `dangerouslySetInnerHTML`**: Only use when absolutely necessary

#### 8. Insecure Deserialization
- **Validate Input**: Validate all JSON input with Zod schemas
- **Type Checking**: Use TypeScript for compile-time type safety

#### 9. Using Components with Known Vulnerabilities
- **npm audit**: Run `npm audit` weekly, fix high/critical vulnerabilities
- **Dependabot**: Enable GitHub Dependabot for automatic security updates
- **SNYK**: Use Snyk for continuous vulnerability scanning

#### 10. Insufficient Logging & Monitoring
- **Audit Logs**: Log all critical operations (create, update, delete)
- **Error Tracking**: Use Sentry or similar for error monitoring
- **Security Events**: Log failed login attempts, authorization failures
- **Alerting**: Set up alerts for suspicious activity

### 7.2 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 8. Testing & Quality Assurance Standards

### 8.1 Testing Pyramid

**Industry Standard**: 70% unit tests, 20% integration tests, 10% E2E tests

#### Unit Tests (70%)
- **What**: Test individual functions, components in isolation
- **Tools**: Jest, Vitest, React Testing Library
- **Coverage**: 80%+ code coverage for business logic
- **Speed**: Fast (milliseconds per test)

#### Integration Tests (20%)
- **What**: Test multiple modules working together (API + database)
- **Tools**: Jest, Supertest, Prisma Test Client
- **Coverage**: Critical user flows, API endpoints
- **Speed**: Medium (seconds per test)

#### End-to-End Tests (10%)
- **What**: Test entire application from user perspective
- **Tools**: Playwright, Cypress
- **Coverage**: Critical user journeys (signup, login, purchase)
- **Speed**: Slow (seconds to minutes per test)

### 8.2 Visual Testing

**Industry Standard**: Storybook + Chromatic/Percy

#### Storybook Requirements
- **All UI Components**: Every reusable component MUST have Storybook stories
- **Variants**: Stories for default, all variants, all states
- **Documentation**: Use `autodocs` for prop documentation
- **Accessibility**: Use `@storybook/addon-a11y` for accessibility testing

#### Visual Regression Testing
- **Baseline Snapshots**: Establish visual baselines for all components
- **Automated Comparison**: Catch visual changes automatically
- **CI/CD Integration**: Visual tests run on every pull request
- **Review Process**: Approve intentional changes, reject unintended changes

### 8.3 Manual QA Checklist

**For every feature before deployment**:

#### Functionality
- [ ] Feature works as specified
- [ ] All user flows complete successfully
- [ ] Edge cases handled correctly
- [ ] Error messages are user-friendly

#### UI/UX
- [ ] Light theme renders correctly
- [ ] Dark theme renders correctly
- [ ] System theme respects OS preference
- [ ] All interactive states work (hover, focus, active, disabled)
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640-1024px)
- [ ] Responsive on desktop (> 1024px)

#### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible (semantic HTML, ARIA labels)
- [ ] Focus indicators visible in all themes

#### Performance
- [ ] Page loads in < 3 seconds (Lighthouse)
- [ ] No memory leaks (Chrome DevTools)
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Bundle size acceptable (< 200KB initial load)

#### Security
- [ ] Authentication required for protected routes
- [ ] Authorization checks enforce role permissions
- [ ] Input validation works (client + server)
- [ ] No sensitive data in console logs or error messages

#### Cross-Browser
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works in Edge (latest)

---

## 9. Performance Standards

### 9.1 Web Vitals Targets

**Industry Standard**: Google Core Web Vitals

#### Lighthouse Scores (Minimum)
- **Performance**: 90+ (target: 95+)
- **Accessibility**: 90+ (target: 95+)
- **Best Practices**: 90+ (target: 95+)
- **SEO**: 90+ (target: 95+)

#### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5 seconds (Good)
- **FID (First Input Delay)**: < 100ms (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)
- **FCP (First Contentful Paint)**: < 1.8 seconds (Good)
- **TTI (Time to Interactive)**: < 3.8 seconds (Good)

### 9.2 Performance Optimization Techniques

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for client-only components
});
```

#### Image Optimization
```typescript
// Always use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Above-the-fold images
  placeholder="blur" // Blur-up effect
/>
```

#### Font Optimization
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Avoid layout shift
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

#### Database Query Optimization
```typescript
// Use select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // Don't fetch password or other heavy fields
  },
  take: 20, // Limit results
  skip: 0,  // Pagination offset
});

// Use indexes for WHERE/ORDER BY
const leads = await prisma.lead.findMany({
  where: {
    status: 'NEW', // Indexed field
  },
  orderBy: {
    createdAt: 'desc', // Indexed field
  },
});
```

---

## 10. Accessibility Standards

### 10.1 WCAG 2.1 Level AA Compliance

**Industry Standard**: WCAG 2.1 Level AA (minimum), AAA (ideal)

#### Color Contrast (WCAG 1.4.3)
- **Normal Text**: 4.5:1 contrast ratio minimum
- **Large Text**: 3:1 contrast ratio minimum (18pt+ or 14pt+ bold)
- **UI Components**: 3:1 contrast for focus indicators, borders

#### Keyboard Navigation (WCAG 2.1.1)
- **All Interactive Elements**: Accessible via keyboard (Tab, Enter, Space, Arrow keys)
- **Focus Indicators**: Visible focus outline (don't remove with `outline: none` without replacement)
- **Focus Order**: Logical tab order (follows visual order)
- **Skip Links**: "Skip to main content" link for screen readers

#### Semantic HTML (WCAG 4.1.1)
```html
<!-- Good: Semantic HTML -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>
<footer>
  <p>&copy; 2025 Company</p>
</footer>

<!-- Bad: Non-semantic divs -->
<div class="nav">
  <div class="link" onclick="navigate()">Home</div>
</div>
<div class="content">
  <div class="title">Article Title</div>
  <div>Content...</div>
</div>
```

#### ARIA Labels (WCAG 4.1.2)
```tsx
// Use ARIA labels for icon-only buttons
<button aria-label="Close modal">
  <XIcon />
</button>

// Use aria-labelledby for complex labels
<div id="dialog-title">Delete Account</div>
<div role="dialog" aria-labelledby="dialog-title">
  <p>Are you sure?</p>
</div>

// Use aria-describedby for additional context
<input
  type="email"
  aria-describedby="email-hint"
/>
<span id="email-hint">We'll never share your email</span>
```

#### Form Accessibility
```tsx
<form>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={errors.email ? 'true' : 'false'}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert">
      {errors.email.message}
    </span>
  )}
</form>
```

### 10.2 Accessibility Testing

#### Automated Testing
- **@storybook/addon-a11y**: Visual accessibility testing in Storybook
- **axe-core**: Automated accessibility testing library
- **Lighthouse**: Accessibility audit in Chrome DevTools
- **WAVE**: Browser extension for accessibility evaluation

#### Manual Testing
- [ ] Keyboard-only navigation (unplug mouse, navigate with Tab/Enter/Space)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color blindness simulation (Chrome DevTools, ColorOracle)
- [ ] Zoom to 200% (text should remain readable without horizontal scroll)
- [ ] High contrast mode (Windows High Contrast, macOS Increase Contrast)

---

## 11. Documentation Standards

### 11.1 Code Documentation

**Industry Standard**: JSDoc, TSDoc, Inline comments

#### Function Documentation
```typescript
/**
 * Creates a new lead in the database and sends welcome email.
 * 
 * @param data - Lead data including email, name, and property details
 * @returns Newly created lead with ID and timestamps
 * @throws {ValidationError} If input data is invalid
 * @throws {ConflictError} If lead with email already exists
 * 
 * @example
 * const lead = await createLead({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   phone: '+1234567890',
 * });
 */
export async function createLead(data: CreateLeadInput): Promise<Lead> {
  // Implementation...
}
```

#### Component Documentation
```tsx
/**
 * Button component with multiple variants and sizes.
 * Supports all standard button attributes and accessibility features.
 * 
 * @component
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 */
interface ButtonProps {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
}: ButtonProps) {
  // Implementation...
}
```

### 11.2 API Documentation

**Industry Standard**: OpenAPI 3.0, Swagger, Postman Collections

#### OpenAPI Specification
```yaml
# specs/004-centralized-theme-color/contracts/leads-api.openapi.yaml
openapi: 3.0.0
info:
  title: Leads API
  version: 1.0.0
  description: API for managing solar leads

paths:
  /api/leads:
    get:
      summary: List all leads
      description: Returns a paginated list of leads
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  leads:
                    type: array
                    items:
                      $ref: '#/components/schemas/Lead'
                  total:
                    type: integer
                  page:
                    type: integer
    
    post:
      summary: Create a new lead
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLeadRequest'
      responses:
        '201':
          description: Lead created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Lead'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Lead:
      type: object
      properties:
        id:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
          format: email
        status:
          type: string
          enum: [NEW, CONTACTED, QUALIFIED, PURCHASED]
        createdAt:
          type: string
          format: date-time
    
    CreateLeadRequest:
      type: object
      required:
        - firstName
        - lastName
        - email
      properties:
        firstName:
          type: string
          minLength: 1
        lastName:
          type: string
          minLength: 1
        email:
          type: string
          format: email
    
    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
```

### 11.3 Project Documentation

#### README.md Structure
```markdown
# Project Name

Brief description of project (1-2 sentences).

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- Framework: Next.js 14
- Database: PostgreSQL (Prisma ORM)
- Authentication: NextAuth.js
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.8+
- PostgreSQL 14+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/username/project.git
   cd project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start development server
   ```bash
   npm run dev
   ```

## Project Structure

```
project/
├── src/
│   ├── app/          # Next.js pages and API routes
│   ├── components/   # React components
│   ├── lib/          # Utility functions and services
│   └── types/        # TypeScript type definitions
├── prisma/           # Database schema and migrations
└── public/           # Static assets
```

## Development

### Running Tests

```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests
npm run test:e2e   # Run E2E tests
```

### Building for Production

```bash
npm run build
npm run start
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT
```

---

## 12. DevOps & Deployment Standards

### 12.1 CI/CD Pipeline

**Industry Standard**: GitHub Actions, GitLab CI, CircleCI

#### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
  
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx tsc --noEmit
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
  
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/vercel-action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 12.2 Environment Management

#### Environment Variables
```bash
# .env.example (commit to Git)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# .env (DO NOT commit to Git)
DATABASE_URL="postgresql://user:real-password@production.db:5432/production"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-32-chars-long"
```

#### Environment-Specific Configuration
- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

### 12.3 Deployment Platforms

**Industry Standard**: Vercel, Netlify, AWS, Google Cloud, Azure

#### Vercel (Recommended for Next.js)
- **Automatic Deployments**: Push to main = automatic deployment
- **Preview Deployments**: Every pull request gets preview URL
- **Environment Variables**: Manage via Vercel dashboard
- **Analytics**: Built-in Web Vitals monitoring
- **Edge Functions**: Serverless functions at edge locations

#### Deployment Checklist
- [ ] Environment variables set in production
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] Custom domain configured with HTTPS
- [ ] Error monitoring set up (Sentry)
- [ ] Analytics configured (Google Analytics, Vercel Analytics)
- [ ] Backup strategy in place (database backups)

---

## 13. Code Quality Standards

### 13.1 Code Review Checklist

**For every pull request**:

#### Code Quality
- [ ] Code follows project conventions (naming, structure)
- [ ] No duplicated code (DRY principle)
- [ ] Functions are small and focused (< 50 lines)
- [ ] Complex logic is commented
- [ ] No `console.log` or debug code left behind

#### TypeScript
- [ ] No `any` types (or documented why necessary)
- [ ] Interfaces/types defined for all props
- [ ] Return types specified for functions
- [ ] Enums used for status fields (not strings)

#### Testing
- [ ] Unit tests added for business logic
- [ ] Integration tests added for API endpoints
- [ ] Visual regression tests added for UI components
- [ ] Manual QA checklist completed

#### Security
- [ ] Input validation implemented (client + server)
- [ ] Authorization checks in place
- [ ] No secrets committed to Git
- [ ] SQL injection prevented (Prisma ORM)

#### Performance
- [ ] No performance regressions (Lighthouse score maintained)
- [ ] Images optimized (next/image component)
- [ ] Database queries indexed
- [ ] Heavy components lazy loaded

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels for screen readers
- [ ] Focus indicators visible

### 13.2 Git Workflow

**Industry Standard**: Git Flow, GitHub Flow, Trunk-Based Development

#### Branch Strategy
```
main              # Production-ready code
├── develop       # Integration branch for features
├── feature/*     # Feature branches (feature/user-authentication)
├── bugfix/*      # Bug fix branches (bugfix/login-error)
└── hotfix/*      # Emergency production fixes (hotfix/security-patch)
```

#### Commit Message Convention
```
type(scope): subject

body (optional)

footer (optional)

---

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- perf: Performance improvements
- test: Adding tests
- chore: Build process or tooling changes

Examples:
feat(auth): add two-factor authentication

fix(api): resolve race condition in lead creation
- Added transaction to ensure atomicity
- Fixed duplicate lead prevention

refactor(button): migrate to design token system
- Replaced hardcoded colors with semantic tokens
- Added Storybook stories for all variants
- Visual regression tests passed

Closes #123
```

---

## 14. Project Management Standards

### 14.1 Agile/Scrum Practices

**Industry Standard**: Scrum, Kanban, Extreme Programming (XP)

#### Sprint Planning (Recommended: 2-week sprints)
- **Sprint Goal**: Clear objective for the sprint
- **User Stories**: Features written from user perspective
- **Acceptance Criteria**: Clear definition of "done"
- **Story Points**: Estimate complexity (Fibonacci scale: 1, 2, 3, 5, 8, 13)
- **Velocity**: Track average story points completed per sprint

#### Daily Standups (15 minutes max)
- **What did I do yesterday?**
- **What will I do today?**
- **Any blockers?**

#### Sprint Review/Demo
- **Demo completed features** to stakeholders
- **Get feedback** for future sprints

#### Sprint Retrospective
- **What went well?**
- **What could be improved?**
- **Action items** for next sprint

### 14.2 SpecKit Workflow (Current Project)

#### Specification-Driven Development
1. **Write Specification** (spec.md) with user stories, requirements, success criteria
2. **Review & Approve** specification before implementation
3. **Create Tasks** (tasks.md) broken down into 30-60 min chunks
4. **Implement with Testing** (Storybook + visual regression + manual QA)
5. **Validate Against Spec** (ensure implementation matches spec exactly)
6. **User Approval** required before git commit
7. **Document Lessons Learned** (update DOC/Records/)

#### Pre-Phase Workflow (Mandatory)
- [ ] Read spec completely (20 min)
- [ ] Verify database schema (10 min)
- [ ] Verify service signatures (10 min)
- [ ] Verify types (5 min)
- [ ] Review existing patterns (10 min)

#### Post-Phase Workflow (Mandatory)
- [ ] TypeScript compiles (npx tsc --noEmit)
- [ ] Build passes (npm run build)
- [ ] Visual regression tests pass
- [ ] Manual QA checklist complete
- [ ] User approval received

---

## Summary: Industry Standard Compliance Checklist

### Design System
- [ ] Centralized design tokens (colors, typography, spacing, shadows, animations)
- [ ] 8-point grid system for spacing
- [ ] WCAG AA accessibility compliance (4.5:1 contrast)
- [ ] Light/Dark theme support
- [ ] Storybook for component documentation
- [ ] Visual regression testing (Chromatic/Percy)

### Frontend
- [ ] Next.js 14+ App Router architecture
- [ ] Server Components by default
- [ ] TypeScript strict mode
- [ ] Component-based architecture (Atomic Design)
- [ ] State management (React Query for server state)
- [ ] Performance: 90+ Lighthouse score

### Backend
- [ ] Clean Architecture (Controllers → Services → Repositories)
- [ ] RESTful API design
- [ ] Input validation (Zod schemas)
- [ ] Error handling (custom error classes)
- [ ] Audit logging for critical operations

### Database
- [ ] Prisma ORM with migrations
- [ ] Third Normal Form (3NF) design
- [ ] Indexes on frequently queried fields
- [ ] Foreign key constraints
- [ ] Timestamps on all tables

### Authentication & Security
- [ ] NextAuth.js with JWT tokens
- [ ] bcrypt password hashing (10+ rounds)
- [ ] Role-based access control (RBAC)
- [ ] OWASP Top 10 protection
- [ ] Security headers (CSP, HSTS, X-Frame-Options)

### Testing
- [ ] 80%+ code coverage
- [ ] Unit tests for business logic
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- [ ] Visual regression tests for UI
- [ ] Manual QA checklists

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing on every PR
- [ ] Environment variable management
- [ ] Automatic deployments (Vercel)
- [ ] Error monitoring (Sentry)

### Documentation
- [ ] API documentation (OpenAPI 3.0)
- [ ] Code comments (JSDoc/TSDoc)
- [ ] README with setup instructions
- [ ] Contribution guidelines
- [ ] Architecture diagrams

---

## Conclusion

These guidelines represent **professional industry standards** distilled from:
- **Google's Engineering Practices**
- **Microsoft's REST API Guidelines**
- **Airbnb's JavaScript Style Guide**
- **Material Design 3 System**
- **OWASP Security Standards**
- **WCAG 2.1 Accessibility Standards**

**Key Principle**: *Build for maintainability, scalability, and professional quality from day one.*

**Next Steps**:
1. Review these guidelines with the team
2. Identify gaps in current SolarMatch project
3. Create action plan to achieve compliance
4. Use this document for all future projects

**Living Document**: Update this guide as new best practices emerge and as we learn from experience.

---

**Document Version**: 1.0  
**Last Updated**: January 27, 2025  
**Review Schedule**: Quarterly updates recommended
