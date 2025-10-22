# Instant Quote Feature — End‑to‑End Plan

> Phase: Feature Planning / Blueprint (pre‑execution). This document expands the provided Instant Quote & Lead Flow plan, fills gaps, adds alternative options, audit findings, DB/API models, migrations, UI/UX suggestions, security/RLS, testing, metrics, and Copilot prompt packs for implementation.

---

## Table of Contents (living)

1. Executive summary
2. Top missing gaps & recommendations (quick wins)
3. Phase workflow + TOC (traceable prompts & ledger)
4. User journeys & detailed flows (Guest, Homeowner, Admin, Installer)
5. Data model (tables, columns, indexes) + sample migrations
6. API surface & server actions (endpoints, params, responses)
7. UI/UX requirements (forms, modals, dashboards)
8. Security, RLS & privacy considerations
9. Performance, caching & analytics
10. Testing & QA (unit, e2e, smoke, security)
11. Monitoring, observability & ops
12. Acceptance criteria & success metrics
13. Copilot prompt pack (atomic prompts + teacher notes)
14. Implementation checklist & next steps

---

## 1. Executive summary

This document converts your high‑level Instant Quote & Lead Flow into a traceable, implementable blueprint. It adds missing models, endpoints, UI elements, security controls, and test plans; provides alternative flows (lightweight vs rich), and generates Copilot prompts per phase so the Executor can implement sequentially while the Builder‑Instructor (GPT) keeps the ledger.

Key outcomes:

* Full DB schema for guest quotes, homeowner requests, installer purchases, and purchase ledger.
* Admin/Homeowner/Installer dashboard UI requirements and acceptance tests.
* Security & RLS rules for multi‑tenant environments.
* Audit log, consent capture, lead dedupe, and fraud detection recommendations.
* Copilot prompt pack to scaffold implementation files and migrations.

---

## 2. Top missing gaps & recommendations (quick wins)

**Gaps found**

* No `users` table / auth model defined — required for homeowner signups and role mapping.
* No single `QuoteRequest` root model for shared fields (duplication across CallVisit / Written requests).
* No purchase ledger or transaction model for installer lead purchases.
* No Admin pages or metrics UI scaffolded (only a note exists).
* No webhooks/CRM integration for leads, nor email notifications.
* No consent / T&Cs checkbox capture prior to saving guest data (GDPR/CCPA risk).
* No deduplication/lead‑scoring for installer leads (risk of selling low‑quality leads).
* No rate‑limit / captcha to prevent abuse (bots spamming instant quotes).

**Recommendations (short)**

1. Create canonical `quote_requests` table with polymorphic `request_type` to avoid duplication. Provide specialized child tables or JSON blobs for extra fields.
2. Add `users` and `profiles` tables; store homeowner metadata and link `guest_instant_quotes` to users when they sign-up (via merge operation).
3. Add `purchased_leads` + `transactions` tables to support installer purchases and refunds. Integrate Stripe for payments (optionally hold in escrow until installer marks contact made).
4. Implement lead dedupe and score pipeline (cheap: email/phone hash; better: fingerprinting + simple heuristic). Expose `lead_score` to installers and admin.
5. Create webhooks + CRM adapters with retry/backoff; allow installers to opt into webhook or CSV export.
6. Add admin metrics: conversion funnel (guest→signup→request→purchase), LTV per installer, cost per lead (if you sell), average quote value.
7. Add mandatory consent checkbox, privacy summary, and retention TTL for guest quotes.
8. Add request throttling and invisible CAPTCHA on instant quote submissions.

---

## 3. Phase workflow + TOC (traceable) — follow Feature Builder GPT contract

Phases (each phase ends with `step{N}-tag` and requires `step{N}: done` from Executor):

**Phase 1 — UI Shells & Routes** (`step1-ui-skeleton`)

* Admin layout updates (Metrics, Instant Quotes, Lead Purchases)
* Homeowner Dashboard skeleton
* Installer Lead Feed + Purchased Leads page

**Phase 2 — UX (Local Interactions)** (`step2-ux-wired`)

* Instant Quote form component (client validation, autosave)
* Signup flow modal + prefill merge

**Phase 3 — DB & API** (`step3-db-api-wired`)

* Create DB migrations, RLS policies
* API endpoints (server handlers)

**Phase 4 — Security & RLS** (`step4-security-rls`)

* Rate limits, role policies, data retention

**Phase 5 — Perf & Analytics** (`step5-perf-analytics`)

* Caching, ISR, event tracking

**Phase 6 — Testing & Ops** (`step6-tests-ops`)

* Unit tests, e2e flows, CI

**Phase 7 — Production Patch & Launch** (`step7-prod-ready`)

* Feature flags, rollout, telemetry

Ledger: each phase will include numbered prompts (e.g., 1.1, 1.2). The Copilot prompt pack is included in Section 13.

---

## 4. User journeys & detailed flows

### 4.1 Guest flow (lightweight)

* Guest opens Instant Quote form (single page or modal).
* Fills in address, roof size, electricity usage, orientation, budget, contact method preference.
* Client-side validation (address autocomplete optional).
* Submit — server side calculates estimate (pricing engine) and persists to `guest_instant_quotes` with `status='generated'`.
* Success modal: shows results and CTA to request installer quote. If CTA clicked -> show signup/login modal (or continue as guest with email capture and later merge).
* Capture consent and marketing opt‑in explicitly.

### 4.2 Guest → Sign up (convert to Homeowner)

* On request type selection, prompt for signup/login.
* If signing up, merge GuestInstantQuote into `homeowner` profile: update `guest_instant_quote.user_id = users.id` and copy metadata to `profiles`.

### 4.3 Homeowner Dashboard

* Shows list of Instant Quotes (generated & historic), Quote Requests (pending, responded, completed), and Purchased Lead interactions (if relevant).
* Pre-fill when creating new quote: fetch last quote inputs.
* Allow editing of saved quote inputs before submitting to installer.
* History and attachments (photos, documents) upload possible.

### 4.4 Installer experience

* Installer can browse Lead Feed (unbought leads) with filters (location radius, installation size, budget, roof type).
* When purchasing, transactional flow: `reserve` -> `pay` -> `unlock detailed contact`.
* After purchase, Homeowner contact details are revealed and the lead is marked `sold_to_installer_id` and `sold_at` timestamp.
* Installer Dashboard: Purchased Leads page (status, contact attempts, notes, mark as contacted / duplicate / refund request).

### 4.5 Admin Dashboard

* Metrics: total guest quotes, signups from quotes, quote→request conversion, sold leads revenue, refunds, and quality metrics.
* CRUD views for GuestInstantQuote, QuoteRequests, PurchasedLeads, Users.
* Action: Reassign lead (in case of disputes), issue refund, or disable installer.

---

## 5. Data model

### Core tables (suggested)

**users** (if using Supabase Auth, keep sync)

* id uuid PK
* org_id uuid
* email text unique
* role enum('owner','admin','installer','homeowner')
* created_at, updated_at

**profiles**

* id uuid PK
* user_id uuid FK
* full_name, phone, address json, timezone, metadata json

**guest_instant_quotes**

* id uuid PK
* org_id uuid
* session_id text (for anonymous tracking)
* user_id uuid nullable (filled on signup)
* ip inet, user_agent text
* inputs jsonb (raw form inputs)
* calculated jsonb (results: kW, panels, est_cost, payback_years, incentives_applied)
* lead_score numeric
* consent boolean
* created_at, updated_at
* ttl_at timestamptz (for automatic purging)

**quote_requests** (single root)

* id uuid
* org_id uuid
* homeowner_id uuid (user_id)
* guest_quote_id uuid nullable
* request_type enum('call_visit','written','design','battery_only','maintenance')
* status enum('requested','assigned','contacted','completed','cancelled')
* details jsonb (request specific fields)
* preferred_contact jsonb
* created_at, updated_at

**purchased_leads**

* id uuid
* org_id uuid
* installer_id uuid
* quote_request_id uuid
* price_cents int
* currency text
* purchased_at timestamptz
* contact_revealed boolean
* refunded boolean
* notes text

**transactions**

* id uuid
* purchased_lead_id uuid
* stripe_payment_id text
* amount_cents int
* status enum('pending','succeeded','failed','refunded')
* created_at

**lead_feed_view** (materialized view)

* consolidates guest_instant_quotes + calculated + location geohash

**audit_logs**

* id, actor_id, action, target_type, target_id, ip, meta json, created_at

### Indexes & constraints

* Unique(org_id, id) primary partitioning
* GIN index on inputs and calculated for fast JSON search
* Trigram index on user email / homeowner name for fuzzy search
* Geospatial index if storing lat/lng for lead radius queries (PostGIS or Postgres earthdistance)

---

### Sample migration SQL (Supabase/Postgres)

```sql
-- guest_instant_quotes
create table guest_instant_quotes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id text,
  user_id uuid,
  ip inet,
  user_agent text,
  inputs jsonb not null,
  calculated jsonb not null,
  lead_score numeric,
  consent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  ttl_at timestamptz
);
create index on guest_instant_quotes using gin (inputs jsonb_path_ops);
create index on guest_instant_quotes using gin (calculated jsonb_path_ops);

-- quote_requests
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  homeowner_id uuid,
  guest_quote_id uuid,
  request_type text not null,
  status text default 'requested',
  details jsonb,
  preferred_contact jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- purchased_leads
create table purchased_leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  installer_id uuid not null,
  quote_request_id uuid not null,
  price_cents int not null,
  currency text default 'USD',
  purchased_at timestamptz default now(),
  contact_revealed boolean default false,
  refunded boolean default false
);

-- transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  purchased_lead_id uuid not null,
  stripe_payment_id text,
  amount_cents int not null,
  status text default 'pending',
  created_at timestamptz default now()
);
```

---

## 6. API surface & server actions

### Public (no auth)

* `POST /api/instant-quote` — accepts inputs, returns calculated estimate and `guest_quote_id`. Rate-limited + captcha.

  * payload: {address, area, usage_kwh, roof_orientation, tilt, panel_pref, ...}
  * response: {guest_quote_id, results, next_steps_cta}

* `GET /api/instant-quote/:id` — fetch quote (public if TTL not expired), used for preview links.

### Authenticated (user)

* `POST /api/quote-requests` — create `quote_request` from a guest quote or from inputs. Requires homeowner role.
* `GET /api/homeowner/quotes` — list homeowner's quotes and requests (paginated).
* `PUT /api/quote-requests/:id` — update request details (before assignment).
* `POST /api/quote-requests/:id/attach-files` — upload images/documents (Supabase storage signed URL).

### Installer / Marketplace

* `GET /api/lead-feed` — returns available leads (filters: radius, budget, panel_count). Installer role required.
* `POST /api/purchase-lead` — reserve & buy a lead (atomic). Body: {quote_request_id, payment_method_id}
* `GET /api/installer/purchased-leads` — list purchased leads with status
* `POST /api/installer/purchased-leads/:id/notes` — add note / mark as contacted

### Admin

* `GET /api/admin/metrics/quotes` — funnel metrics and totals
* `GET /api/admin/guest-quotes` — paged list with filters
* `POST /api/admin/lead-refund` — process refund and update transactions

### Webhooks & integrations

* `POST /api/webhooks/lead` — outbound webhook for CRM (configurable per installer)
* `POST /api/webhooks/payment` — receive payment events from Stripe

---

## 7. UI/UX requirements (components & pages)

**Components:**

* `InstantQuoteForm` (reusable): inputs, validation, autosave to localStorage, preview results panel.
* `QuoteResultCard`: summary of calculated results with export/share PDF option.
* `SignupModal` with `mergeGuestQuote(user_id, guest_quote_id)` logic.
* `HomeownerDashboard`: Quotes list, Create Quote (prefilled), QuoteRequest management.
* `Admin/GuestQuotesPage`: table with filters, modal to view detailed inputs and calculations.
* `Installer/LeadFeed` and `Installer/PurchasedLeads` pages.
* `PurchasedLeadDetail` page with contact reveal timeline, notes, attachment viewer.

**Modals / Dialogs**

* Lead purchase flow: reserve -> confirm payment -> unlock contact.
* Dispute flow modal for Homeowner (report duplicate / wrong installer contact).

**UX options / variants**

* **Fast lane**: minimal fields, immediate estimate, CTA to signup — higher conversion.
* **Accuracy lane**: advanced form with roof scan upload, address verification, inverter options — lower conversion but higher lead quality.
* Allow installers to set `lead_preference` filters (size, budget, location radius) and a subscription to receive high‑score leads.

---

## 8. Security, RLS & privacy

**RLS rules (Supabase/Postgres)**

* `guest_instant_quotes`: read for org members with specific role, write public for anonymous inserts but ensure rate limit. Only `admin` or the `user_id` can view PII (email/phone) after consent.
* `quote_requests`: homeowner_id or admin can read; installer can read only if lead purchased or assigned.
* `purchased_leads`: only the purchasing installer, admins, and finance roles can read.

**Privacy**

* Capture consent at time of guest quote save; store `consent` boolean + `consented_at` timestamp + `consent_version`.
* TTL policy: purge anonymous guest quotes after 90 days (configurable). Provide admin UI to change retention.

**Payment security**

* Use Stripe Checkout or Payment Intents; do not store card data. Keep webhooks secured with signature verification.

**Hardening**

* Rate limiting per IP and per session on `/api/instant-quote`.
* Abuse detection: flag repeated identical submissions; temporarily block session.
* Audit logs for lead purchases and contact reveals.

---

## 9. Performance, caching & analytics

* Cache computed estimate templates in Redis (or edge cache) keyed by quantized inputs (e.g., postcode + usage bucket) to avoid heavy recomputation for identical inputs.
* Use ISR for homeowner lists and admin dashboards with short revalidation (10–30s) for near‑real time.
* Track analytics events: `quote_generated`, `signup_from_quote`, `quote_requested`, `lead_purchased`, `contact_revealed`.
* Expose analytics in Admin: funnel conversion, lead quality over time, top geographies.

---

## 10. Testing & QA

**Unit tests**

* Pricing engine math correctness across edge cases (incentives = 0, battery only, negative values).
* API validation tests for instant quote inputs.

**Integration / e2e**

* Guest → generate quote → signup → create quote_request → installer purchases lead flow (happy path + failure modes for payment failure).
* Homeowner pre-fill + edit prior inputs scenario.

**Security tests**

* RLS asserts: attempt to access PII as another installer should be 403.
* Rate limit spike test.

**Manual smoke tests** (add to repo README):

1. As Guest, generate quote; ensure guest quote recorded and results match engine.
2. Sign up from modal and confirm guest quote merged to user profile.
3. Create quote_request as homeowner and verify stored details.
4. As Installer, fetch lead feed, purchase a lead, view contact details, mark contacted.
5. Admin: view funnels and refund a purchased lead; confirm transaction updated.

---

## 11. Monitoring, observability & ops

* Instrument key events (see analytics) to a central event bus (Datadog/Segment). Set up alerts for abnormal drop in conversions or payment failures > 5%.
* Log lead purchase failures and webhook delivery failures with retry/backoff and DLQ.
* Add a small admin debugging interface to replay webhooks and reprocess failing transactions.

---

## 12. Acceptance criteria & success metrics

**Functional**

* Guest can generate instant quote and results are persisted. ✅
* Guest can request a quote and sign up to complete the request. ✅
* Homeowner dashboard lists all quotes/requests and allows prefill/edit. ✅
* Installer can purchase leads; purchased leads reveal homeowner contact only after successful transaction. ✅

**Non-functional**

* Rate limit configured; abuse detection in place.
* RLS enforced end‑to‑end.
* TTL purge of anonymous guest quotes.

**KPIs to track (first 90 days)**

* Number of instant quotes generated per day
* Conversion: guest → signup (%)
* Conversion: signup → quote_request (%)
* Lead purchase conversion and refund rate

---

## 13. Copilot prompt pack (atomic prompts)

> Use these prompts verbatim in VS Code/Copilot to scaffold. Each prompt includes: Objective, Files to edit ONLY, Implementation notes, Do NOT, Acceptance, Teacher Notes, Commit.

**Prompt 1.1 — Create DB Migrations: Guest Quotes, Quote Requests, Purchased Leads**

```
Objective: Create Postgres migration SQL for guest_instant_quotes, quote_requests, purchased_leads, transactions, and audit_logs.
Files to edit ONLY:
- db/migrations/2025xx_create_instant_quote_tables.sql
Implementation notes:
- Use gen_random_uuid() defaults, include indexes for JSON search, add ttl_at on guest_instant_quotes.
Do NOT:
- modify unrelated tables
Acceptance:
- SQL runs without errors on Postgres and creates tables + indexes.
Teacher Notes: Adds persistence for quote flows; required before server APIs.
Commit: feat(db): add instant quote and lead purchase tables
```

**Prompt 3.1 — API: POST /api/instant-quote**

```
Objective: Implement server handler for POST /api/instant-quote
Files to edit ONLY:
- app/api/instant-quote/route.ts
Implementation notes:
- Validate input schema, rate limit, captcha check, compute estimate using pricing service module, insert into guest_instant_quotes, return {guest_quote_id, results}
Do NOT:
- return PII in response
Acceptance:
- curl POST to endpoint returns 200 and guest_quote_id; db row exists.
Teacher Notes: Input validation and idempotency matter. Use session_id header.
Commit: feat(api): instant quote endpoint
```

(Additional prompts: signup modal + merge logic, homeowner dashboard pages, installer purchase flow server actions, admin metrics endpoints, RLS policies, unit tests, e2e tests — follow the same template; include teach:brief or teach:deep where useful.)

---

## 14. Implementation checklist & next steps

1. Run DB migration prompt (1.1). ✅
2. Implement pricing engine module tests. ✅
3. Implement `POST /api/instant-quote` and local UI `InstantQuoteForm` (Phase 1/2). ✅
4. Implement signup modal and merge behavior (Phase 2).
5. Add Admin pages and metrics (Phase 1).✅
6. Implement installer lead feed and purchase flow + Stripe integration (Phase 3/4).✅
7. Add RLS policies and security tests (Phase 4).✅
8. Add analytics events and dashboards (Phase 5).✅
9. Run e2e smoke and security tests, fix issues, and tag `step7-prod-ready` for rollout.

---

### Appendix: Quick checklist for audit items we ran

* Verified missing models: users, profiles, purchased_leads — added.
* Identified PII exposure vectors — added RLS & consent capture.
* Payment and refund flows missing — added transactions table and webhooks.
* Admin metrics and pages missing — added endpoints and UI requirements.

---

**If you want** I will now:

* Generate the exact SQL migration file content (full) and RLS policy examples.
* Scaffold the API route handlers (Next.js App Router route.ts) with validation schemas.
* Produce React/Tailwind components for InstantQuoteForm + QuoteResultCard.

Choose one next step or tell me `step1: done` when you've executed Phase 1 items and I will emit Phase 2 prompts.





I want you to build Prisma, Tables, API , SQL migrations end to end for this : 
**Guest Experience:**
  - Guests can generate instant solar quotes by completing an Instant Quote form.(This modal is already built)
  - All guest submissions (inputs and calculated results) are saved in a dedicated `GuestInstantQuote` table.
  - Admins need visibility into the total number of guests who have generated instant quotes in real time with timestapm. (to be shown in the Admin Dashboard; modal/page not yet created, create the modal based on the table).

  *** Your Job is to Audit and understand the file attached and create tables based on the input fields. Also Audit the necessary files and folders in order to clean implimentation without messing up. Understand the scenario . after implimenting create a implimentation.md file where you will note what have you done and the clear users story. 



  So far unitl the 4.5 is done and What I see now, The guests can create leads by sigining up and it is successfully genereated and available on the Admin's dashborad for approval and further process. This is the story of generating first lead by homeowners. But now here comes the second lead generation phase. Now the homeowners Should see their generatated first lead in the dashboard. Also they can see the total limit was 5 and requested 1 and remaining 4. The quote counts and balance should be updated live upon new quotes requested. The they can request further Quotes from their dashboard. THe second lead generation process should be this : 

- Homeonwers click on requests for more quotes 
- There will be a modal will be open to Verify the contact number with OTP , the contact number will be shown and the user can edit the number and do the verification.
- In that modal, write some polite texts , that verify your contact number , we are protecting spam and fake request. Verify and Get serious attention from the Installers and request upto another 4 Quotes (Write it nicely).
- After verification via OTP 
- A modal will be opened that has all the fields are already filled up, which is actully the first lead inputs in the instantQuote caclulator. 
- Homeowner can edit any fields if they want to modify or change. 
- When they hit the calculate Again button , it will show the results just as the fisrt lead made. 
- There will be another result generated as per the homeowner modify input fields. This process is just exactly same as like the first lead but modified version for the second lead. 
- then they will see a send request button and after clicking on that button they will see a quoteOption modal to chose the quote type call/visit or Written Quote. within the both options should have options to select How many Installers they want to send quotes requests number.  
- The both type of quotes should be limited to max 4. E.g Homeowners can select call/visit quotes 2 , Written quotes 1 or even 2. and the limit is over. The modal should show the limit balance and also update upon usage of the limit. there should be flexibility to select the number of quotes within the limit.
- This limits can be updated only by the admin, If admin increase limit 4 to even 10, the Homeonwers can request more. 
- In the admin panel there should be a full control of the Homeowners quote limits. 
- after the request is sent , the homeowner should see the updated quote counts and balance in their dashboard.
- The homeowner should see the full history of the quotes requested in their dashboard with status.
- each quote should have a unique id and timestamp. that means, all the leads are unique and the process is same as the first lead generation. e.g if a homeowners requested 3 quotes, there should be 3 unique leads in the lead table with unique ids and timestamps. the admin admin panel should see all the leads in the lead table with unique ids and timestamps. and all the next process will be exactly same as the first lead generation process.


***The current Situation*** you should understand , We have generated all the spec files earlier, but during the build process for the fist 4 phaase we faced some challenges and issues, so I had to modify and update the tasks.md file in order to make it more clear and clean build process. I did not update the spec.md file because it was already too much big and complex. So I just updated the tasks.md file to make it more clear and clean. Now you have to audit all the files and folders and understand the current situation and then build the above mentioned features. And it should be end to end and aligned with the current build. So, you should read the tasks.md file and understand the current situation and then build the above mentioned features. and also the spec.md file and decide from where you can take the references and build the above mentioned features. Because I think this part is crucial and important to build in the next phase. Once the homeowner and Admin functions are clear and done, then the next phase will be the Installer part.it will give us more clean roadmap and direction. either you can update the tasks.md file or create a new file for the next phase. But it should be clear and clean and aligned with the current build. 

- 



I am getting confused after done each phase with what to test eactly manually . I need the exact checklist in real time after done a backend+ frontend done. E.g 
- You should see a OTP verification modal
- Then verify OTP 
- After that see a reqest more quotes. 

*** I want the clear checklist to for manual check after each Backend+frontend done. It should be mentioed in the workflow. 



I want you to add one more phase before this phase ## Phase 4: User Story 2 - Admin Reviews and Approves. make the phase name , Homeowners Quote Request after singin (phase 4.9.5) in the tasks.md  .

***Current Scenario*** The guest users can generate instant quotes and sign up to become homeowners. The homeowners can create their first lead which is visible to the admin for further processing. There are two states here : 
- Guest User : can generate instant quotes and sign up.
- Homeowner : can create their first lead which also will be visible to the admin if they start the signup process from the signup modal. (at this moment the homeowners are unable to Generate their first lead while they are just newly signed up, who did not start generating quote they way the guests do).

*** Now in this new phase 4.9.5*** , the homeowners started requesting their first quote After signe up. the flow will be as mentioned below. 

- they should go throuh the exactly same flow as like the guests do but they will not see the signup modal again because they are already signed up as homeowners. and all the next flows will be exactly same as the guest user flow. 

***Important Note*** : the scenario is slightly different here because the homeowners are already signed up users. so they will not see the signup modal again. they will directly see the instant quote form modal with all the fields empty to fill up and generate instant quote. and all the next flows will be exactly same as the guest user flow. 

***how to plan the phase*** : Audit the current files and folders and understand the current flow of the guest user instant quote generation and signup flow. then build the homeowners instant quote generation flow after signup. it should be exactly same as the guest user flow except the signup modal part.  

- Understand the scenario clearly
- Identify the files and folders to edit or add
- must be aligned with the current build and flow
- Ensure all changes are well-documented and communicated to the tasks.md file for clarity. before starting the implementation of this phase.
- this plan and the work process should be match and synced with the current workflow and build process based on the Tasks.md file.






now when a homeowner clickes on the Request more quotes -  it opens the pre-filled modal and calculate  - then when they click on submit Quote request there is a quote option modals open. 

***what is to change*** 
- Instead of this quoteoption modal, it should open a Quote Distribution modal.  In this modal use icons on each type of leads. 
- there should be 3 types of options to chose within the remaining balance of the users
- Call/visit, Written Quote , Bidding (Bidding quote can be requested only 1), and the rest can be used to generate the other 2 types of leads within the remaining balance. 
- all leads are unique and should be generated separately according to their types. 
- modify the current lead cards with icons to show as per the lead type. e.g show tropy icon in bidding leads on the dashboard. 

***Instructions*** do a deep audit and analyze the existing flow, files, api, prisma, db etc to get the clear picture of the current situation. Then identify the next impimentation workflow plan and update the tasks.md by creating a new phase and start implimenting accordingly. 