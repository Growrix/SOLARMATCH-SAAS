# SolarMatch Constitution
**Solar Lead Generation Platform - Technical Standards & Principles**

---

## Core Principles

### I. Next.js App Router First
**All features must use Next.js 14+ App Router architecture**
- Server Components by default (use 'use client' only when necessary)
- File-based routing in `src/app/` directory
- API routes as `route.ts` files with GET/POST/PATCH/DELETE exports
- Parallel routes and layouts for role-based dashboards
- Middleware for authentication and route protection

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
**Tailwind CSS with dark mode support**
- Utility-first CSS approach (no custom CSS unless justified)
- Dark mode: Class-based (`darkMode: 'class'` in `tailwind.config.js`)
- ThemeProvider Context API for global theme state
- Custom color palette: Primary (teal-600), Secondary (amber-400)
- Responsive design: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Consistent spacing, typography, and component styling

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

### Breaking Changes
- Database schema changes: Create migration, test locally, document
- API contract changes: Version endpoints or maintain backward compatibility
- Authentication changes: Test all user flows before deployment
- Component API changes: Update all usages in codebase

### Development Principles
- **Iterate quickly**: Build one feature at a time, test immediately
- **Document decisions**: Record what was done and why
- **Security first**: Validate all inputs, protect all routes
- **Teaching mindset**: Write code that future developers can understand
- **YAGNI**: Build what's needed now, not what might be needed later

---

**Version**: 1.0.0  
**Ratified**: October 13, 2025  
**Last Amended**: October 13, 2025  
**Project**: SolarMatch - Solar Lead Generation Platform