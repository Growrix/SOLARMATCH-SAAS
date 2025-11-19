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




Now I am having issues with creating the bidding quote, the other 2 typers were successfully generated. Audit and understand the scenarion and identify the issues . here are terminal output if it helps you : 




***Admin Dashboard Lead Management***
-the admin dashboard lead management page has no back button the visit back to the dashbaord. update it by adding a back button
- the lead management page has : Homeowner	Location	Status	Verified	Energy Bill	Price	Created	Actions . You need to add Quote type column after Location column to show the type of quote requested by the homeowner. e.g Call/Visit, Written, Bidding.
- when the users verifeied their contact number via OTP during the quote request process, the verified column should show a green checkmark icon. if not verified it should show a red cross icon.
- In the Actions column, there is a view button to view the lead details in a modal. 
  - In that modal, you need to show the Quote Type field to show the type of quote requested by the homeowner. 
  - Also show the contact number field in that modal. 
  - Also show the unique quote id and timestamp in that modal.
- In the lead management page, there is no search functionality to search leads by homeowner name or quote id. add a search bar to search leads by homeowner name or quote id.
- there is no approve/reject functionality for the leads in the lead details page. add approve and reject buttons in the Actions column to approve or reject the leads. make sure it updates the lead status accordingly. 
- The lead price should not be shown in the homeowners dashboard in the lead cards. it should be shown only in the admin dashboard. 
- The details lead page should fetch exactly all the data that users inputs during the quote request process. 
- currently it is not showing the contact numbers. also the Energy Bill.
- there is a lead deatils already existed, you need to update that lead details as per the above mentioned requirements. 


***instructions*** 

first keep in mind that the admin lead managenemt was created earlier, but during the build process we faced some issues and challenges, so I had to modify the tasks.md file to make it more clear and clean. So you need to audit all the files and folders related to the admin lead management and understand the current situation. So now I see the admin lead management page has 2 different type of response and actions. the leads were generated earlier has the approve/redeject options, but the newly generated leads does not have approve/reject options. so you need to identify the issues and fix them. also implement the above mentioned requirements in the lastest lead generation process. you need to indentfy the dual response with old vs newly implimented lead generation process. you need to focus on the new version of lead generation process. and replace the old process with the new one. make sure there are only one process is left, no reduant or duplicate system should be there. Audit, analyze, understand the current situation and then plan the implementation accordingly. do not impliment if you are not clear about the situation. create a phase in the tasks.md and start implimenting. The goal is to have a clean and clear admin lead management system with all the above mentioned requirements. you also can read back the tasks.md file to understand what have we done earlier for this admin lead management system. this is crucial. 



***User Verification Status Update Feature***

now I can see the user verification status does not show on the admin lead management page , it should be updated immidiately after user has verified their phone number. all the leads should be updated with the verfiried badge. the icos should indicate that the contact is verified. 
- e.g the homewoners generated the first lead without OTP verifications, so the lead shows unverified status. then when the homeowner requests for more quotes and verifies the contact number via OTP, then all the leads of that homeowner should be updated with verified status automatically.
- the lead card will show the verified badhe icon accordingly. and visisble to all users including the admin,homeowners and installers on their respective dashboards.
- make sure the verified status is updated immidiately after the OTP verification is successful. notify the admin dashboard to update the status immidiately without refreshing the page.

***instructions***
- audit and understand the current API, prisma schema, db tables and frontend files and folders related to the lead management system. then plan the implementation accordingly without breaking any existing functionality. create a new phase in the tasks.md file and start implementing. make sure to document all the changes made in an implementation.md file with clear user stories.


***Countdown Timer for Lead Expiry Feature***

When the admin approved the leads , it should add a countdown timer bar on the top of the lead card that will show a 7 days countdown time for the expiry of this leads. And the leads should be expire and gets deactivated after 7 days autonmatically. The countdown timer should be visible to both the admin and the homeowner on their respective dashboards. After expiry , the lead status should be updated to expired automatically.

- The admin should have options to add/remove/restet the countdown timer for each lead from the lead details modal.
- The homeowner should also see the countdown timer on their dashboard lead cards for each lead they have requested.
- The countdown timer should be in days format e.g 7 days left, 6 days left etc.
- The countdown timer should be in red color when there are 2 days left to expiry.
- The countdown timer should be in green color when there are more than 5 days left to expiry.
- This countdown timer feature should be added to the existing lead management system without breaking any existing functionality. and it should be visible to homeowners,admin and also installers. but the admin should have the control to reset/add/remove the countdown timer. 
- admin should decide either to add contdown timer or not while approving the lead. if they choose to add countdown timer, then it will be added with 7 days by default. if they choose not to add countdown timer, then no countdown timer will be added.
- admin can set custom days for the countdown timer while approving the lead. e.g instead of 7 days, they can set 10 days or 5 days etc.  
- admins can reactivate any leads that are expired from the lead details modal. upon reactivation , the countdown timer will be reset to 7 days by default but admin can change it while reactivating. - installers should also see the countdown timer on their purchased leads dashboard for each lead they have purchased.
- the countdown timers automatically tunred off if a installer purchaed it (call/vist or written) . but for bidding leads it will remain until expiry unless admin reactivates it. 
- each leads should be unique with unique ids and timestamps and should be manageable with countdown timers individually. 

***Instructions*** 
1. audit and understand the current API, prisma schema, db tables and frontend files and folders related to the lead management system. then plan the implementation accordingly without breaking any existing functionality. create a new phase in the tasks.md file and start implementing. make sure to document all the changes made in an implementation.md file with clear user stories.
1. Implement the user verification status update feature as described.
2. Ensure that the countdown timer for lead expiry is functional and meets all specified requirements.
3. Test the system thoroughly to confirm that all features work as intended and that there are no regressions in existing functionality.
4. Document any changes made to the codebase, including new features and modifications to existing ones.
6. Follow the mandatory pre and post implementation checklist rules as mentioned in the workflow tasks.md file (D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\002-lead-journey-life\tasks.md) instructions.






I am not giving you any specific tasks but Instructions that how I want to work furhter with this speckit. My workflow is like this :
- You should follow the task planning and execution rules accordingly.
- I will always give you tasks by asking to create a phase in the tasks.md file. becuase pre-planned tasks always dont meet the results, so always I have to modify and update the plan on the go. So , from now now I will always ask you to create a phase in the tasks.md file based on the current situation and then start implementing accordingly. So that all the tasks will be performed as per the tasks.md files . As I am working in an exsiting project , so I need to keep the tasks.md file always updated and aligned with the current situation to avoid any messup situation. 



### Before Starting Any Phase:
1. **Pre-Phase Audit & Planning** (30-60 minutes):
   - Read ALL spec files thoroughly (`spec.md`, `data-model.md`, `contracts/*.openapi.yaml`)
   - must audit the current state of the site related to the planned tasks. Understand existing flows, identify gaps. Analyze API,DB,Prisma schema,frontend files etc.
   - must get a clear picture of the current state before start implimenting.
   - Never start any blind implimentation. Stop the process if you are not clear about my instructions vs the audit findings. Ask me to clarify.
   - Map out EXACT data structures from spec (don't invent new ones)
   - Identify existing code patterns to follow (auth, services, API routes)
   - Check Prisma schema matches spec BEFORE writing any code
   - List all files to create/modify with their exact purposes
   - Verify external dependencies are installed and configured
   - Document any spec ambiguities - ASK USER before assuming
   - **RULE**: If spec says PhoneVerification links to User, schema MUST link to User. Don't change mid-implementation.

### During Phase Implementation:
2. **Spec-Driven Implementation** (Task by Task):
   - **For each task**: Re-read relevant spec section FIRST
   - Never migrate entire database without my permission. 
   - you are only allowed to migrate DB for the specific parts. discuss with me further if needed.
   - no need to ask me if you are creating new tables in the DB 
   - Copy exact field names, types, and structures from spec
   - Follow existing code patterns (e.g., how other services are structured)
   - Use EXISTING utilities (don't reinvent: getSetting, createAuditLog, etc.)
   - Check function signatures in services BEFORE calling them
   - **Incremental Build Check**: After every 3-5 tasks, run `npm run build`
     - If errors appear: FIX according to spec, not by changing architecture
     - Don't create "temporary workarounds" that contradict spec
   - **Type Safety First**: Let TypeScript errors guide you to spec compliance
     - Missing field? Check spec - should it exist in schema?
     - Wrong type? Check spec - is service signature correct?
   - **No Spec Drift**: If you modify Prisma schema, update it ONCE at start of phase, not mid-phase
   - **Manual QA Checklist Required**: For any task that includes BOTH backend and frontend changes, add a short "Manual QA Checklist" directly under that task with steps to validate UI states, API calls (success and one error path), and data accuracy. Keep it observable and role-specific (Admin/Homeowner).

3. **Post-Phase Validation** (MUST COMPLETE BEFORE COMMIT):
   - ✅ **Schema Validation**: Run `npx prisma validate` - schema must match spec
   - ✅ **Type Check**: Run `npx tsc --noEmit` - all TypeScript must be valid
   - ✅ **Build**: Run `npm run build` - MUST pass with 0 errors
     - **Build Error Protocol**:
       1. Read error message carefully
       2. Check spec: Is implementation following spec exactly?
       3. Fix by aligning with spec, NOT by changing architecture
       4. If spec is ambiguous: STOP, document issue, ask user
       5. **Time Limit**: If fixing takes >30 min, STOP and report to user
   - ✅ **Lint**: Run `npm run lint` - fix critical issues only
   - ✅ **Manual Spot Check**: Open 2-3 key files, verify they match spec intent
   - ✅ **Task Checklist**: Every task T### must be checked off with proof
   - ✅ **Regression Check**: Run dev server, verify existing features still work

### Manual QA Checklist (After Backend + Frontend Work)
- Start with a clean browser session (incognito or cleared storage) to avoid cached data during validation.
- Walk through every new UI entry point in sequence; e.g., dashboard → OTP verification modal → verify code → Request More Quotes flow → confirm prefilled instant quote fields → submit and observe dashboard refresh.
- Exercise at least one error path for the updated feature (invalid OTP, missing required field, exhausted quota) and ensure UI messaging matches spec with no console errors.
- Inspect network requests in dev tools or Thunder Client while executing the flow to confirm payloads and responses match the API contracts.
- Document findings (successes, failures, screenshots) and extend this checklist with feature-specific steps before handing off for review.

4. **Commit Approval** (MANDATORY):
   - ❌ **NEVER commit without explicit user approval**
   - Present validation results:
     - Build output (success/warnings)
     - Files changed count
     - Key changes summary
     - Any deviations from spec (with justification)
   - Wait for user confirmation: "Yes, commit this phase"
   - Only then: `git add .` → `git commit -m "Phase X: <summary>"`

### Phase Completion Criteria:
- ✅ All tasks marked complete with evidence
- ✅ Implementation matches spec exactly (data model, API contracts, types)
- ✅ Prisma schema validated
- ✅ TypeScript compiles with no errors
- ✅ Build passes (`npm run build`)
- ✅ No critical lint errors
- ✅ No spec drift or architectural changes mid-phase
- ✅ User approval received
- ✅ Git commit created with detailed message

### 🚨 RED FLAGS - STOP IMMEDIATELY:
- Schema doesn't match spec → Review spec, fix schema ONCE
- Service function signatures differ from usage → Check existing services, align
- Build errors persist >30 minutes → Report to user, don't spiral
- Creating new patterns not in existing codebase → Use existing patterns
- Inventing field names not in spec → Use exact spec names
- "I'll fix it later" thoughts → Fix now according to spec, or ask user

---

## 🛡️ BUILD ERROR PREVENTION CHECKLIST

**Use this BEFORE writing any integration code:**

### 1. Schema Verification (5 min)
```bash
# Check Prisma schema for exact model structure
cat prisma/schema.prisma | grep -A 20 "model YourModel"

# Validate schema is correct
npx prisma validate

# Check what relations exist
grep -E "model (User|Lead|PhoneVerification)" prisma/schema.prisma -A 15
```

### 2. Service Signature Verification (10 min)
```bash
# Check what a service actually exports
grep "^export" src/lib/services/your-service.ts

# Check function signatures
grep "export async function" src/lib/services/your-service.ts -A 3

# Example: Before calling getSetting()
grep "export.*getSetting" src/lib/services/settings-service.ts -A 5
# Result: getSetting(key: string) - only ONE parameter!
```

### 3. Type Verification (5 min)
```bash
# Check NextAuth session type
grep -A 20 "interface Session" src/types/next-auth.d.ts

# Check if field exists in session.user
grep "interface.*User" src/lib/auth.ts -A 10

# Check Prisma Client types
grep "export.*CreateNotificationInput" src/types/notification.ts -A 10
```




I want you to do a deep audit the understand the current state clearly and validate the implimentation plan , if the plan is needed to update/modify according to the audit findings then do it accordingly. make sure the sites current state and the new implimentation plans are aligned . The plans is to work on ## Phase 5: User Story 3 - Installer Discovers and Purchases Lead (Priority: P1) 🎯 MVP (Persona: Installer) . follow all the implimentation mandatory rules. 




***UI BLUEPRINT INTEGRATION AND UPDATION OF RELEVANT FILES***

We have updateed the constitution.md and all the speckit files to reflect the new design token system for centralized theme colors. I have got a blueprint from the chatGPT and I am sharing with you. The goal is to update the constitution.md file without losing any important information and make it more concise and clear. not to replace the existing constitution.md file completely but you should merge the important points from the blueprint into the existing constitution.md file. Make sure to keep all the important information from the existing constitution.md file while integrating the new blueprint details. The final constitution.md file should be well-structured, easy to understand, and reflect the centralized theme system using CSS variables as per the blueprint. As we will be useing shadcn/ui components, make sure the constitution.md file aligns with shadcn/ui theming practices. And also check the tasks.md file were we have already implimented until T1040 according to the old constitution.md file. Make sure the new constitution.md file is aligned with the already implimented tasks in the tasks.md file. And also make sure the new constitution.md file is aligned with the current tailwind.config.js file and globals.css file. Also update the speck.md, plan.md. research.md files accordingly to reflect the new constitution.md file. or you decide which relevant files need to be updated to reflect the new constitution.md file and update it accordingly. 


 Here is the blueprint : 

GitHub Spec: Centralized Theme System Blueprint

Stack: Shadcn/UI · Tailwind CSS · Storybook

Title: Specification for Centralized Design Token & Theming Implementation
Goal:
Establish a single, scalable source of truth for all visual styles using CSS Variables (Design Tokens).
Enable easy, site-wide theme switching (Light / Dark / Brand) across all shadcn/ui components, with complete documentation and visual verification in Storybook.

I. 🎨 Design Token Naming Convention

All themeable properties — such as colors, radius, and shadows — must be defined via CSS Variables.

Category	CSS Variable Format (in globals.css)	Tailwind Class Usage
Colors	--<category>-<role>-<variant>	bg-<role>, text-<role>, border-<role>
Example	--primary, --background, --foreground, --card-border	bg-primary, text-foreground, border-card-border
Radius	--radius	rounded-[var(--radius)] or rounded-<size>
🎯 Required Core Color Tokens (Shadcn-Compatible Baseline)
Token	Role	Purpose
--background	Main Canvas	Page background.
--foreground	Main Text	Text color on --background.
--card, --card-foreground	Surface Container	Background/Text for cards, modals, etc.
--primary, --primary-foreground	Accent / Action	Primary interactive color.
--secondary, --secondary-foreground	Secondary Accent	Secondary button or less-dominant accent.
--destructive, --destructive-foreground	Negative Action	Error, danger, or destructive actions.
--muted, --muted-foreground	Subtle Surfaces	Muted background or secondary text.
--border, --input	Boundaries	Color for borders, dividers, and input outlines.
--ring	Focus Indicator	Outline color for accessibility focus states.

💡 Note: Use HSL color format (h s% l%) for easy programmatic manipulation and theme generation.

II. 🛠️ Implementation Workflow Blueprint

A predictable and repeatable process for introducing new themes or components.

A. Base Theme Setup (Phase 1)

Define Tokens in :root:
All tokens from Section I must exist in :root (inside app/globals.css).
These values represent the Default (Light) Theme.

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --radius: 0.5rem;
}


Tailwind Configuration Mapping:
In tailwind.config.js, map each CSS variable to its Tailwind utility class.

theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: 'hsl(var(--primary))',
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
  },
}


Component Styling Rule (Critical):
✅ Use tokenized Tailwind classes (bg-primary, text-foreground) only.
❌ Never use hardcoded values (#fff, bg-blue-500, etc.).

B. Multi-Theme Setup (Phase 2)

Theme Switch Mechanism:
Use a global attribute on <html> to control theme selection.

<html data-theme="dark">


Theme Overrides in CSS:
Define overrides per theme directly in globals.css.

html[data-theme="dark"] {
  --background: 222.2 47.4% 11.2%;
  --foreground: 0 0% 100%;
  /* Override only the changed tokens */
}


Theme Provider Logic:
Implement a central ThemeProvider (e.g., via next-themes or Context API) that:

Toggles the data-theme attribute

Persists preference in localStorage

Reactively updates the UI

III. 📖 Storybook Integration & Verification

Load Global Styles:
In preview.js, import the global CSS.

import '../app/globals.css';


Enable Theme Switching in Storybook:
Use @storybook/addon-themes or a custom Decorator to sync with the app’s ThemeProvider.
Provide toolbar options for light, dark, and brand themes.

Verification Process:
Before merging any theme-related PR:

Visually confirm components render correctly in all themes.

Cross-check token mappings.

IV. 🤖 GitHub PR & Review Guardrails
Check Type	Enforcement
Style Check	PRs must not include hardcoded colors or spacing.
Token Check	New or modified tokens must include all-theme updates in globals.css.
Storybook Proof	Each PR must link a Storybook preview or screenshot of the affected components under all themes.
Lint/Test Hook	Add CI automation to flag hardcoded CSS colors or unregistered tokens.
V. 🔒 Extension & Maintenance Guidelines

New Token Addition:

Must include a semantic name (e.g., --success-bg, not --green)

Must be reflected across all themes before merge

Must include Storybook visual coverage

Deprecation Policy:

Tokens removed must include a migration note in /docs/CHANGELOG.md

Automation Hooks (Optional):

Add GitHub Action to auto-verify Storybook builds for visual consistency

Add lint rule (no-hardcoded-styles) using Stylelint or ESLint plugin

VI. ✅ Outcome

This Spec ensures:

Predictable visual consistency

Faster theme creation

Zero duplication across shadcn/ui, Tailwind, and Storybook

Visual testing at every PR

A single token change updates hundreds of components instantly — making the system scalable, accessible, and future-proof.





***UI LAYOUT BLUEPRINT INTEGRATION AND UPDATION OF RELEVANT FILES***

We have updateed the constitution.md and all the speckit files to reflect the new UI layout structure system. I have got a blueprint from the chatGPT and I am sharing with you. The goal is to update the constitution.md file without losing any important information and make it more concise and clear. not to replace the existing constitution.md file completely but you should merge the important points from the blueprint into the existing constitution.md file. Make sure to keep all the important information from the existing constitution.md file while integrating the new blueprint details. The final constitution.md file should be well-structured, easy to understand, and reflect the centralized. Update all the selected files accordingly to reflect the new constitution.md file. or you decide which relevant files need to be updated to reflect the new constitution.md file and update it accordingly. Ensure that the tasks.md file is aligned with the new constitution.md file. Here is the blueprint :
---

# 🧭 GitHub Spec: Page, Dashboard & Layout Architecture Blueprint

**Stack:** Next.js (App Router) · Shadcn/UI · TypeScript
**Goal:**
Ensure all pages, dashboard subpages, layouts, and routes follow a **single, predictable structure** that promotes scalability, consistent design, and clean navigation — eliminating layout duplication, routing chaos, and standalone page issues.

---

## I. 🎯 Core Principles

1. **Single Source of Truth for Layouts**
   All dashboard pages **must** inherit from a shared layout under `app/(dashboard)/layout.tsx`.
   No component or page should redefine sidebars, navbars, or containers independently.

2. **Hierarchical Routing Only**
   Subpages must live inside their **parent route folder** (never as siblings of `/dashboard`).

3. **Reusable UI Regions**

   * **Sidebar**, **Navbar**, and **Content area** are controlled centrally.
   * **Local page sections** may add secondary tabs or filters but cannot alter or duplicate the global layout.

4. **Consistent Folder Naming Convention**

   * Lowercase, kebab-case folders
   * Group related features together (`/dashboard/members`, `/dashboard/members/[id]`)
   * No plural/singular mix inconsistencies (`/members`, not `/member` unless explicitly single-resource view)

---

## II. 📁 Folder & File Structure Blueprint

```
app/
 ├─ (marketing)/               # Public site pages
 │   ├─ layout.tsx             # Public layout
 │   ├─ page.tsx               # Home page
 │   └─ about/page.tsx
 │
 ├─ (dashboard)/               # Authenticated app
 │   ├─ layout.tsx             # Main dashboard layout (shared UI)
 │   ├─ page.tsx               # Default dashboard overview
 │   │
 │   ├─ settings/              # Dashboard section (Parent Page)
 │   │   ├─ page.tsx           # Main settings page
 │   │   ├─ profile/page.tsx   # Subpage (nested under Settings)
 │   │   ├─ billing/page.tsx   # Subpage
 │   │   ├─ layout.tsx (optional) # Local layout if section-specific
 │   │
 │   ├─ members/
 │   │   ├─ page.tsx
 │   │   ├─ [id]/page.tsx
 │   │
 │   ├─ reports/
 │   │   ├─ page.tsx
 │   │   ├─ monthly/page.tsx
 │   │   ├─ yearly/page.tsx
 │   │
 │   └─ analytics/
 │       ├─ page.tsx
 │       ├─ layout.tsx         # If analytics section needs custom tabs
 │       └─ trends/page.tsx
 │
 ├─ (auth)/                    # Login, Register, Forgot Password
 │   ├─ layout.tsx
 │   └─ login/page.tsx
 │
 ├─ api/                       # API routes
 │   ├─ users/route.ts
 │   └─ reports/route.ts
 │
 └─ globals.css
```

---

## III. 🧩 Layout Architecture Rules

### A. Global Layouts

| Layout File                   | Purpose                                             | Scope                 |
| ----------------------------- | --------------------------------------------------- | --------------------- |
| `/app/layout.tsx`             | Root HTML shell (metadata, fonts, global providers) | Entire site           |
| `/app/(marketing)/layout.tsx` | Marketing/public-facing layout                      | Marketing site        |
| `/app/(dashboard)/layout.tsx` | Sidebar + Top Nav + Dashboard shell                 | All dashboard routes  |
| `/app/(auth)/layout.tsx`      | Authentication layout (no sidebar/nav)              | Login/Register routes |

**Example: `/app/(dashboard)/layout.tsx`**

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

> 💡 **Rule:** No page within `(dashboard)` should re-import or redefine `<Sidebar>` or `<Topbar>`.
> These are provided automatically by `layout.tsx`.

---

### B. Local Layouts (Optional, Scoped)

If a dashboard section needs its own tabs or sub-navigation (e.g., `/settings` or `/analytics`),
create a **local layout file** inside that folder.

**Example:** `/dashboard/settings/layout.tsx`

```tsx
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <div className="flex gap-4 border-b mb-6">
        {/* Local tabs */}
      </div>
      {children}
    </section>
  );
}
```

> ⚠️ **Do not** include sidebar or topbar here — they come from the parent `(dashboard)` layout.

---

## IV. 🧭 Routing & Navigation Standards

1. **Centralized Navigation Definition**

   * The sidebar menu is defined in `/config/navigation.ts` or `/lib/navigation.ts`.
   * Each route entry includes:

     ```ts
     {
       label: "Settings",
       href: "/dashboard/settings",
       icon: SettingsIcon,
       subRoutes: [
         { label: "Profile", href: "/dashboard/settings/profile" },
         { label: "Billing", href: "/dashboard/settings/billing" },
       ],
     }
     ```

2. **Dynamic Active State**

   * Sidebar should automatically highlight active links using the current route from `next/navigation`.
   * Subpages inherit their parent’s highlight (e.g., `/dashboard/settings/profile` → highlights “Settings”).

3. **No Standalone Pages Inside Dashboard**

   * Any new dashboard page **must** be nested under `(dashboard)/` and integrated into the sidebar via config.
   * Standalone pages (not under `(dashboard)`) must use `(marketing)` or `(auth)` scope.

4. **Breadcrumbs (Optional Enhancement)**

   * Derived automatically from the route path.
   * `/dashboard/members/123` → Dashboard › Members › Details

---

## V. 🧩 Component Responsibility Rules

| Component                 | Responsibility                         | Reuse Scope                       |
| ------------------------- | -------------------------------------- | --------------------------------- |
| `Sidebar`                 | Handles navigation links, active state | Shared across all dashboard pages |
| `Topbar`                  | Search, profile menu, notifications    | Shared                            |
| `PageHeader`              | Optional per-section title/header      | Local (inside pages)              |
| `Card`, `Table`, `Button` | Pure UI components (tokenized)         | Global                            |
| `Layout` files            | Handle only structure, not logic       | Scoped (global or local)          |

---

## VI. ⚙️ PR Guardrails & Spec Checks

| Guard                             | Description                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| **Layout Consistency Check**      | All new pages must be nested under `(dashboard)` and rendered inside the main layout.    |
| **Navigation Check**              | Every new dashboard route must have a matching sidebar entry in `navigation.ts`.         |
| **No Layout Duplication**         | CI should scan for multiple imports of `Sidebar`/`Topbar` outside `layout.tsx`.          |
| **Storybook Visual Layout Check** | Each section should have a Storybook “Layout Demo” story verifying consistent structure. |

---

## VII. ✅ Outcome

This structure guarantees:

* 🧱 **Predictable, modular routing**
* 🎨 **Consistent visual and layout experience**
* ⚙️ **Easy onboarding and maintenance**
* 🧩 **Seamless AI/spec-based generation alignment** (no rogue folders or duplicated layouts)



***Tasks.md Audit Report***
Here is the current audit report of the tasks.md file related to the on going tasks that we are implimenting. As we are updating our specs on the go, so it is crucial to keep the tasks.md file aligned with the current specs and the site current state. So I have audited the tasks.md file and created this report for you to understand the current situation clearly. Please read it carefully before start implimenting any further tasks.

PHASE AUDIT SUMMARY
✅ Phases COMPLETE (Can mark all tasks done now):
Phase 4 (T038-T048): Typography System - 100% Complete
Phase 5 (T049-T058): Spacing System - 100% Complete
Phase 8 (T075-T079): Border Radius - 100% Complete (minus Chromatic T077)
Phase 9 (T080-T084): Animations - 100% Complete (minus Chromatic T082)
Phase 10 (T085-T088): QA Tools - 100% Complete (minus Chromatic T089-T090)
Phase 11 (T091-T095): White-Label - 100% Complete (minus Chromatic, WCAG T094)

⚠️ Phases INCOMPLETE (Missing files):
Phase 7 (T066-T074): Shadow/Elevation - 67% Complete (6/9 tasks)

✅ T066: Shadows.stories.tsx exists
✅ T067: ElevationHierarchy.stories.tsx exists
✅ T068: ElevatedButton.stories.tsx exists
❌ T069: Dropdown.stories.tsx MISSING
❌ T070: Modal.stories.tsx MISSING
⏸️ T071-T073: Chromatic testing (blocked)
✅ T074: elevation-system-guide.md exists
Phase 12 (T096-T318): Legacy Migration - <5% Complete (223 tasks)

❌ T096: scan-hardcoded-values.ts script MISSING
✅ T097: migration docs exist (hardcoded-color-scan.md, migration-dashboard.md)
❌ T098-T318: 221 page migration tasks NOT STARTED
Phase 13 (T319-T329): Polish - 0% Complete (11 tasks)

All documentation, CI/CD, and deployment tasks NOT STARTED



***Backend and the DevOps,CI/CD blueprint***

 I have got a blueprint from the chatGPT and I am sharing with you. The goal is to update the constitution.md file without losing any important information and make it more concise and clear. not to replace the existing constitution.md file completely but you should merge the important points from the blueprint into the existing constitution.md file. Make sure to keep all the important information from the existing constitution.md file while integrating the new blueprint details. The final constitution.md file should be well-structured, easy to understand, and reflect the centralized. Update all the selected files accordingly to reflect the new constitution.md file. or you decide which relevant files need to be updated to reflect the new constitution.md file and update it accordingly. Ensure that the tasks.md file is aligned with the new constitution.md file. Here is the blueprint :




Perfect — I’ll give you a complete, industry-standard **Backend Blueprint** tailored to your stack: **Docker (local DB) + Prisma (ORM)** with smooth portability to **Supabase (managed Postgres)** or any other Postgres DB provider. This will cover dev & prod practices, migration strategy, CI/CD, security, monitoring, and the exact pitfalls to avoid when switching between local Docker DB and a managed Postgres service.

I’ll structure it as: summary → concrete configs & examples → workflows and guardrails → production considerations → final checklist.

# Summary (what you’ll get)

* Local dev with Docker Compose + Postgres for parity with production.
* Prisma as single ORM layer; same Prisma schema works for local Postgres, Supabase Postgres, and others.
* Safe migration approach (dev vs prod): `prisma migrate dev` locally, `prisma migrate deploy` in CI/CD.
* Zero-downtime migration guidelines and data-migration/backfill patterns.
* Connection pooling and production DB tuning (PgBouncer, SSL).
* Integration options with Supabase Auth / RLS and trade-offs.
* CI/CD pipeline with migration job, client generation, and safe deploy.
* Backups, monitoring, observability, secrets, and security best practices.

---

# 1) Project layout & config (recommended)

```
/project
 ├─ prisma/
 │   ├─ schema.prisma
 │   ├─ seed.ts
 ├─ src/
 │   ├─ lib/
 │   │   ├─ db.ts            # Prisma client instance
 │   ├─ api/
 │   ├─ services/
 │   ├─ controllers/
 ├─ docker-compose.yml
 ├─ Dockerfile
 ├─ .env.example
 ├─ package.json
 └─ ci/
     ├─ deploy.yml
```

`src/lib/db.ts` (singleton Prisma client):

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn']
});

export default prisma;
```

`.env.example`

```
# Local Docker
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb?schema=public

# For production (Supabase or other)
# DATABASE_URL=postgresql://user:password@dbhost:5432/dbname?sslmode=require
```

---

# 2) Docker Compose for local development

Use Docker for reproducible local dev. This mirrors production Postgres features more reliably than sqlite.

`docker-compose.yml`

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  db_data:
```

Dev workflow:

* `docker compose up -d`
* `npx prisma migrate dev` (creates migration + updates local DB)
* `npm run dev`

---

# 3) Prisma best practices & schema tips

* Use a single Prisma schema for all environments. Keep `schema.prisma` clean and semantic.
* Use `schema.prisma` `@@map` and `@map` for column/table names if you need to match legacy DB.
* Keep relations explicit and add unique constraints where necessary.
* Add explicit `createdAt` / `updatedAt` timestamps and use `@updatedAt` for automation.

Example snippet:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Important:** Avoid using Prisma migrations to perform long-running, blocking operations (e.g., migrating huge text fields) without staged approach (see zero-downtime migrations).

---

# 4) Migrations: dev vs production flow

**Local dev**

* `npx prisma migrate dev --name add-some-field` — creates migration + updates local DB; use during feature work.

**CI / Production**

* Build step should run `npx prisma migrate deploy` to apply already-committed SQL migrations.
* NEVER run `prisma migrate dev` in production.

**CI tips**

* Use a shadow DB for generating migrations in CI if needed.
* In CI, run `npx prisma migrate deploy` before deploying your app container.
* For zero-downtime: run migrations as a separate step before rolling traffic to new code.

---

# 5) Zero-downtime & safe migration patterns

When changing schema in production:

1. **Additive changes only (safe):** Add nullable columns, new tables, indexes.
2. **Backfill:** Run background job to backfill data to new columns.
3. **Switch reads/writes:** Update application to start writing to new column while still reading old one if needed.
4. **Make column NOT NULL:** After backfill and sufficient verification, alter to NOT NULL in a separate migration.
5. **Remove legacy column:** Once safe, deploy migration to drop old column.

For large tables:

* Create indexes concurrently (Postgres `CREATE INDEX CONCURRENTLY`).
* Avoid `ALTER TABLE` on big tables that rewrites whole table in single migration.

---

# 6) Connection management & production tuning

* **Connection pooling:** Use PgBouncer in transaction pooling mode for production or use cloud provider’s pooling. Prisma opens many connections; without pooling you’ll exhaust DB connections in serverless environments.
* **Prisma Data Proxy:** Consider Prisma Data Proxy if deploying to serverless platforms to avoid too many DB connections.
* **SSL:** Force `?sslmode=require` and verify certs in production provider.
* **Max connections:** Tune `max_connections` on DB provider and `pool_size`/`connection_limit` on pooling layer.

Example DATABASE_URL with params:

```
postgresql://user:pass@host:5432/dbname?schema=public&sslmode=require
```

---

# 7) Supabase integration specifics (important)

Supabase uses PostgreSQL — Prisma works with Supabase out of the box. But be careful about:

**A. Row Level Security (RLS) and Auth**

* Supabase encourages RLS with policies based on JWT claims.
* If you use Prisma with a server-side DB user (service role), you bypass RLS — responsibility shifts to your backend for access control.
* Options:

  1. **Backend-only Prisma (recommended for full control)**

     * Use Prisma with a dedicated DB user (service-role-like) and implement all access control in your server/service layer.
  2. **Use Supabase APIs directly for client-side use + Prisma for server tasks**

     * For operations needing RLS/audited queries, use Supabase JS/PostgREST with logged-in user's JWT.
  3. **Hybrid:** Keep RLS for certain tables and use a service role via Prisma for internal work; be explicit and auditable.

**B. Extensions & Schema**

* Supabase may include extensions (pgcrypto, postgis). If your Prisma schema relies on extensions, ensure the target DB supports them.
* Supabase projects have `public` schema by default; confirm schema names match Prisma `schema` param.

**C. Service Role Key**

* Supabase exposes a `service_role` key which has elevated privileges; do **not** ship this to clients. Use it server-side only (and store in secure secret manager).

---

# 8) Security & secrets management

* **Never commit `.env`**. Keep `.env.example`.
* Use cloud provider secrets manager (Vercel, Netlify, AWS Secrets Manager, Google Secret Manager) for production envs.
* Use principle of least privilege for DB users.
* Secure DB access: require SSL, restrict IPs where possible.
* Sanitize and validate all input using `zod` (server-side) before it reaches Prisma.
* Encrypt sensitive fields at application layer if necessary (never store raw PII unless required).

---

# 9) API design & consistency

* Use **Controller → Service → Repository** separation:

  * **Controller**: HTTP layer, request parsing, response formatting.
  * **Service**: business logic, transactions.
  * **Repository (or Prisma client)**: raw DB access.
* Use consistent API response envelope:

```json
{ "status": "success" | "error", "data": {...}, "error": { code, message } }
```

* Use `Zod` to validate request bodies and transform into typed DTOs for Prisma.

---

# 10) Testing & CI

* **Unit tests** for services and utilities.
* **Integration tests** using:

  * **Testcontainers** (spins up ephemeral Postgres in CI) OR
  * Docker Compose with a test Postgres instance + `prisma migrate deploy` + seeding
* **E2E tests** against staging environment.
* CI pipeline steps (example order):

  1. Install deps
  2. `npx prisma generate`
  3. Run lint, unit tests
  4. Start test DB (docker compose or testcontainers)
  5. `npx prisma migrate deploy` (to test DB)
  6. Run integration tests
  7. Build + prisma client generation
  8. Deploy / Run migration job on production (see deploy strategy)

---

# 11) Backups, observability & incident handling

* **Backups**

  * Managed DBs: enable daily backups + PITR (point-in-time recovery) if available.
  * Self-hosted: schedule `pg_dump` (and WAL archiving) to remote storage.
* **Monitoring**

  * Monitor DB metrics: connection count, query time, slow queries, replication lag.
  * Tools: PgHero, pg_stat_statements, Datadog, Prometheus + Grafana.
* **Logging & Error Tracking**

  * Use centralized logging (e.g., LogDNA, Papertrail) and error tracking (Sentry) for backend services.
* **Alerting**

  * Set alerts for high error rates, high CPU, connection exhaustion, long-running queries.

---

# 12) Deployment & migration run strategy (recommended)

* **Pre-deploy job** (CI) — `prisma migrate deploy` to production DB. Fail the pipeline if migration fails.
* **Canary / phased rollout** — deploy service to staging first, smoke-test.
* **Blue/Green or rolling** deploys so old and new code can coexist during migration window when needed.
* **Run backfill jobs** after migration if needed; these should be idempotent.

---

# 13) Practical commands & snippets

Generate client whenever schema changes:

```bash
npx prisma generate
```

Apply migrations in prod:

```bash
npx prisma migrate deploy
```

Reset local dev DB:

```bash
npx prisma migrate reset
# WARNING: drops all data. Use only in dev.
```

Seeding example (`prisma/seed.ts`):

```ts
import prisma from "../src/lib/db";

async function main() {
  await prisma.user.create({ data: { email: "admin@example.com", name: "Admin" } });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

Add to `package.json`:

```json
"prisma:seed": "ts-node prisma/seed.ts"
```

---

# 14) Common pitfalls & how to avoid them

* **Pitfall:** Too many DB connections in serverless — fix with PgBouncer or Prisma Data Proxy.
* **Pitfall:** Relying on `prisma migrate dev` in production — always use `prisma migrate deploy`.
* **Pitfall:** Directly dropping or altering big tables in one migration — follow zero-downtime pattern.
* **Pitfall:** Using Supabase service key in frontend — store server-side only.
* **Pitfall:** RLS mismatch — if you switch between Supabase Auth + RLS and Prisma server-side, pick one model and document access control clearly.

---

# 15) Checklist — ready-to-go (copy into your repo as `BACKEND_GUIDELINES.md`)

* [ ] `docker-compose.yml` for local Postgres and healthcheck present.
* [ ] `prisma/schema.prisma` stored and canonical for all envs.
* [ ] `.env.example` with `DATABASE_URL`.
* [ ] `src/lib/db.ts` as single Prisma client instance.
* [ ] CI step: `prisma generate` + `prisma migrate deploy` before deployment.
* [ ] Connection pooling strategy selected (PgBouncer or Prisma Data Proxy).
* [ ] Backups configured in prod (daily + PITR if available).
* [ ] Logging + Sentry configured and tested.
* [ ] Test DB flow for CI (testcontainers or compose).
* [ ] Migrations follow zero-downtime strategy for critical tables.
* [ ] Secrets stored in secret manager (no commits).
* [ ] Security review for Supabase RLS / service-role usage documented.



🧰 DevOps, CI/CD, & Engineering Governance Blueprint

This section ensures that every part of the development lifecycle — from testing and building to deploying and monitoring — follows consistent, automated, and auditable workflows.

⚙️ CI/CD Principles & Workflow Standards
1️⃣ Core CI/CD Stages
Stage	Purpose	Required Checks
Test	Run all automated tests and lint checks	ESLint, Prettier, Jest, Prisma validate
Build	Compile Next.js / backend services	npm run build must succeed without warnings
Migrate	Run DB schema migrations	prisma migrate deploy (never migrate dev)
Deploy	Deploy to staging → production	Zero-downtime deploy via container or cloud
Verify	Post-deploy checks (ping endpoints, DB, Storybook visual tests)	Health check + Storybook snapshot review

✅ Golden Rule: The pipeline should block merges if any stage fails.
CI/CD must enforce both lint and migration checks before deployment.

2️⃣ Recommended GitHub Actions / CI Setup
# .github/workflows/ci.yml
name: CI Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run test

  migrate-deploy:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx prisma migrate deploy


🧩 Optional: Add deploy.yml for staging/production using your host’s CLI (Vercel, Fly.io, Render, etc.).

3️⃣ Environment Strategy
Environment	Purpose	Database	Rules
Local	Developer sandbox	Docker Postgres	Can reset, seed, migrate dev
Staging	Pre-production testing	Supabase or Managed Postgres	Auto-deploy via CI on merge to develop
Production	Live system	Managed Postgres	Migrate only via CI/CD using migrate deploy
4️⃣ Backup, Logs & Monitoring

Database Backups:

Nightly full dumps + 7-day retention (Supabase provides PITR).

App Logs:

Centralized logging via services like Datadog, Logtail, or Sentry.

Metrics:

Track request latency, DB query performance, error rates.

Alerts:

Automated alerts for failed deploys, downtime, or high error rate.

🧩 Code Review & PR Governance Blueprint
1️⃣ Pull Request Standards

Every PR must include:

Requirement	Description
Title	Short and descriptive (feat: add billing dashboard)
Linked Issue	Reference issue number (e.g., Fixes #23)
Description	Purpose, summary of changes, and screenshots if UI-related
Checklist	Confirm tests passed, code formatted, no console logs
Storybook Proof	For UI changes, attach Storybook preview link/screenshots
Migration Proof	For DB changes, confirm prisma migrate deploy runs successfully
2️⃣ Review Process

Minimum 2 approvals before merging to main (for production apps)

Reviewer responsibilities:

Check architecture consistency (folder, naming, layout)

Ensure no hardcoded styles (must use tokens)

Validate API contract adherence (no breaking schema changes)

Confirm lint/test pass

Merges must be squash merges to keep commit history clean.

3️⃣ Branching Model (Recommended)
main          → Production (protected)
develop       → Staging (auto-deploy)
feature/*     → Feature branches
hotfix/*      → Urgent production fixes


✅ Only develop merges into main via approved PRs after staging validation.

🧾 Documentation, Versioning & Change Control Blueprint
1️⃣ Docs Directory

All project documentation should live inside /docs:

/docs
 ├─ constitution.md
 ├─ backend_blueprint.md
 ├─ ui_ux_blueprint.md
 ├─ api_reference.md
 ├─ changelog.md
 └─ onboarding.md


Each new feature or module must include a short markdown file under /docs.

Storybook serves as the visual source of truth for UI components.

2️⃣ Versioning & Release Tags

Use semantic versioning:

v1.0.0  → Initial stable release
v1.1.0  → Minor features added
v1.1.1  → Bug fixes / patches


Add release notes in CHANGELOG.md:

## [1.1.0] - 2025-10-29
### Added
- New billing dashboard UI
- Prisma zero-downtime migration system

3️⃣ Developer Onboarding

Each new developer must:

Read /docs/constitution.md and follow system philosophy.

Clone project, run docker compose up -d, then npm run dev.

Generate Prisma client & run seed:

npx prisma generate && npm run prisma:seed


Access Storybook and run npm run storybook for component overview.

4️⃣ Continuous Documentation Health

Any new feature = new doc or section in /docs.

Docs reviewed in PRs (like code).

Weekly or sprint-end “doc sync” to align Constitution with new features.

5️⃣ Quality Gates Summary
Gate	Check	Enforced By
Code Quality	ESLint, Prettier, TypeScript	CI
Design Consistency	Storybook, Token usage	PR Review
Data Consistency	Prisma schema validation	CI
Test Coverage	Jest / Playwright	CI
Security	Secrets scan + RLS check	CI + manual audit
✅ Final Outcome

When you merge these Minor Blueprints with your UI/UX and Backend Blueprints, your constitution.md will represent a complete engineering constitution — a self-governing, production-ready system covering:

🎨 UI/UX Design System

🧭 Layout & Routing Standards

🧱 Backend Architecture

⚙️ CI/CD & DevOps Governance

🧩 Code Review, Documentation & Version Control














I have fount that the buttons has inconcistent classes. Audit on all the buttons used in the site. and make a list of classes used for buttons. Icons using same class that used for other components. its a messy and inconcistent use of classes in this site. Now I want to re-classify the messy classes and make it concistent and control everything centrally. As I am working on the design system and theming system so its very important to have a concistent class naming convention. So please audit all the button classes and make a list of all the classes used for buttons in the site. After that create a new class naming convention for buttons that is concistent and easy to understand. Finally update all the button classes in the site to reflect the new class naming convention. As we are worining on an existing site so we will only work on the messy parts and keep the existing concistent parts as it is. we will now go component by component and update all the classes accordingly. It is not only just about button or icon classes, its about all the classes used in the site. So please audit all the classes used in the site and make a list of all the classes used in the site. After that create a new class naming convention that is concistent and easy to understand. Finally update all the classes in the site to reflect the new class naming convention. As we are worining on an existing site so we will only work on the messy parts and keep the existing concistent parts as it is. we will now go component by component and update all the classes accordingly. we have been working on the UI design system and theming system for a while now. As part of this effort, we have identified that the current class naming convention used in the site is messy and inconcistent. This is causing confusion and making it difficult to maintain the codebase. To address this issue, we will conduct a thorough audit of all the classes used in the site. We will create a comprehensive list of all the classes used, along with their current usage and context. Based on this audit, we will develop a new class naming convention that is concistent, easy to understand, and aligns with best practices in UI design and development. Once the new naming convention is established, we will systematically update all the classes in the site to reflect the new convention. This process will be done component by component, ensuring that we only modify the messy parts while preserving any existing concistent parts. The goal is to create a clean, maintainable, and scalable class structure that supports our ongoing efforts in building a robust UI design system and theming system. For your better understanding please read all the existing tasks that were done in D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\004-centralized-theme-color folder. Specially read the tasks.md file in that folder to understand what has been done so far. 

***instructions***
you have to create a comprehensive audit report of all the classes used in the site. Then create a new class naming convention that is concistent and easy to understand. Finally update all the classes in the site to reflect the new class naming convention. As we are worining on an existing site so we will only work on the messy parts and keep the existing concistent parts as it is. we will now go component by component and update all the classes accordingly. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. for the dev purpose always comment beside classes that used what colors and in which component it is used. This will help us in future to track the classes and colors used in the site. 





------------------------------------------------------

***migration & Redesign in neumorphic***
lets migrate the Blog page and blog post page  

***Instructions for migration***
You must follow the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for all the migration instructions. you must perform the Pre Audit before the task implimentation. Understand each and every classes , Hardcodings, Styles used in the componenet. The Audit Goal is to keep everything in your memeory so that the migration task can be performed completely, not partially. After the Audit. before migration started you must read this D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\MIGRATION-PAIN-POINTS.md  file to learn from previous migration issues. so that you do not repeate the same mistakes. and after that read this D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\DESIGN-SYSTEM-SOT.md file to understand the design system better. for better clarification and referrence read this file too D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\MIGRATION-QUICK-REFERENCE.md
 Make sure we are only migrating the UI , nothing else. No functionality changes, no logic changes, no data changes. just pure UI migration. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on.
 After that 

  ***task execution***
 you must  create a phase in the tasks.md file for this migration task. then start the migration task as per the instructions given in the tasks.md file and other supporting .md files.  Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. 

***Special notes*** There are rounting issues noticed in the installerr dashboard. the URl does not show correctly. so please make sure to fix that too while migrating the UI. e.g while navigating to lead feed page the URL should be /installer/lead-feed but currently it shows installer/dashboard . so please make sure to fix that too while migrating the UI.  Identify all such routing issues and fix them while migrating the UI.

------------------------------------------------

***Identify Pain points***
read above all the conversations and specially my commands and identify all the pain points that I have been facing whilte migrating/desiging UI. the goal is to identify all ongoing problems and pain points in order to enhance the workflow. 

***pick up the solutions point***
read above all the conversations and specially my commands and identify all the solutions that I have suggested whilte migrating/desiging UI. the goal is to identify all ongoing solutions in order to enhance the workflow. e.g wrong/hardcoded place holder used before, But now solved with using a specific class. So you need to pick that class in order to solve similar issues further without heistations

***Must follow Instructions***
You must audit the necessary relevant files/strutcures etc whatever needed to understand the pain points and solutions. then you must update the above mentioned files accordingly. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. Note that , these file are my on going SOT . So never relace anything entirely, always update specific areas, always check for outdated areas but let me know before updating it directly. 

***Files to update***
Your Findings should be updated in the existing workflow files : 
-D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\MIGRATION-PAIN-POINTS.md
-D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\DESIGN-SYSTEM-SOT.md
-D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\MIGRATION-QUICK-REFERENCE.md
- D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md


---------------------------------------------------

***The scenario***
Previously we have built a next.js auth system which is D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\nextjsAuth.md\AuditNextjsAuth.md . and also built the sites lead generation system with user based actions. The auth modals were bit different than now. It had more fileds to fillup and more steps. Now we have redesigned the auth modals to be more user friendly and less fileds to fillup. So now we need to update the existing auth system to reflect the new auth modals and flow. Please read the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\nextjsAuth.md\AuditNextjsAuth.md file carefully to understand the existing auth system. After that read the new auth modals design and flow carefully to understand the new auth system. After that create a mapping of old auth flow to new auth flow. Identify what needs to be changed in the existing auth system in order to reflect the new auth modals and flow. Finally update the existing auth system to reflect the new auth modals and flow. Make sure to keep everything aligned with the flows related to the auth such as lead generations , lead management etc.

not only that, we will completely build the auth system e.g the google/apple auth integration, forgot password flow, email verification flow everything from scratch as per the new auth modals and flow. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on.


I need a detailed plan from you before you start implimenting anything. The plan should include the steps you will take to update the existing auth system and build the new auth system from scratch. The plan should also include the timeline for each step. Make sure to cover everything in the plan. create the plan in this D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\nextjsAuth.md folder. The plan should have 2 parts : one for updating the existing auth system and one for building the new auth system from scratch. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on , two the uncompeted auth system to build from scratch. 

first we need to make sure the users can signup/login using the email and password as per the new auth modals and flow. after that we will integrate the google/apple auth. then we will build the forgot password flow, email verification flow everything step by step. 

***UI/UX Blueprint: Layout & Routing Standards*** 
follow : D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\DESIGN-SYSTEM-SOT.md
D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\MIGRATION-QUICK-REFERENCE.md

***instructions***
check the audit report that mentioned above , but you can perform more audit if needed. then create a detailed plan as mentioned above. Make sure to plan meets Industry standards and best practices. do not overcomplicate things. keep it simple yet robust. 
***The goal*** is to have a complete, robust, user friendly auth system that reflects the new auth modals and flow. it should work end to end without any issues.

-------------------------------------------------------------------------

***homeowners lead modal***
lets now work on this part : ## 🟡 P1 - HIGH PRIORITY ISSUES (Should Fix Soon), 
### P1-01: No Lead Editing Capability,### P1-02: Lead Cancellation Not Connected , ### P1-04: No Lead Preview for Homeowners,### P1-05: Phone Number Not Synced Between User and Lead (check the details from this D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM\05-ISSUES-AND-RECOMMENDATIONS.md file). 

***existing system audit*** I had these edit, draft etc modals before and worked , but after we have updated the lead submission process a bit , we need to check the current lead generation process and data inputs and outputs etc to see what needs to be changed in order to reflect the edit, draft , preview , cancel modals and flows. previously we hade some buttons on the lead card but now we do not have these. So we need to audit the existing lead generation process and data inputs and outputs etc to see what needs to be changed in order to reflect the edit, draft , preview , cancel modals and flows. these changes in the leads by the homeowners must reflect in the leads shown to admins for now. we havent worked on the installers side yet. but the changes must be reflected in the leads shown to admins for now. 


***Instructions*** you must audit deeply the current state and all the existing modals , flows, frontend , backend etc to get the clear picture and create a audit report and a plan to implimenet these changes. After that you must start implimenting the changes step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***Strickt rules*** never spoil any other functionality while working on these modals and flows. always test everything after making changes. 

-----------------------------------------------------------------------
***Admin Dashboard, homeowner Management***
as we have updated the auth under data inputs, I can see there are few issues in the homeowners management. 


***test result*** the test is passed , the first lead is now can be edited and also shows the update in the admin lead details. 

***new issues found***
 but I have found new issues now : - I have generated a second lead in the homeowners dashboard and while generated , I have changed the value of the Kwh field and created a new lead. but this new lead is not showing the correct kwh value in the leadedit , As each leads are unique, each leads should show their own data in the lead edit modal.

the homeowners can change/edit form fields or can select between commercial and residential quote requests. each leads should show their own data in the lead edit modal. the prefilled area also should import the exactly that specific leads data while editing. 

The generated leads should show the exactly same data in the admin side accordningly. 

***instructions***
you must audit all the related and relevant files including frontend and backend. create a comprhensive audit report of the issues found and the plan to fix them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***strict rules***
never spoil any other functionality while working on these modals and flows. always test everything after making changes. 

-------------------------------------------------------------------------

***new issues found***

- I have created a new homeowners account
- generated first lead
- verified contact
- generated 2nd and 3rd lead
- edited 3rd lead and chosed commercial quote request from the residential and filled up all the quote fields accordingly. and submitted the quote. 

# the first issue : editlead modal is not showing the commercial parts while opening editing option of the lead. it should work just same as the residential part is working while generating, eiditing leads. 

***additionally*** The lead modal in the homeowners dashboard should show the quote type Residential/commercial based on the users selection. Add icon and texts accordningly in the lead modal card in the homeowners dashboard.

***instruction*** 
Audit the related and relevant frontend and backend and identify the main cause and gaps/missing implimentations that were not fouced earlier. create a comprhensive audit report of the issues found and the plan to fix them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***strict rules*** Never spoil any other functionality while working on these modals and flows. always test everything after making changes. 

--------------------------------------------------------------------------

***Admin dashboard lead details issues***
now I can see in the lead details modal is only showing the name,contct,address in the first lead only, but not showing in the 2nd and 3rd lead details modal. it should show the name,contact,address in all the leads details modal accordningly. all these user information should be always updated in real time whenever user update their profile information. 

***instructions***
you must audit all the related and relevant files including frontend and backend. create a comprhensive audit report of the issues found and the plan to fix them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***strict rules***
never spoil any other functionality while working on these modals and flows. always test everything after making changes. do to attempt blindly if you dont have clear picture. 
------------------------------------------------------------------------------

***http://localhost:3000/admin/homeowners***
In the admin dashboard , homeowners management page imports needs to be updated as per the new auth system. currently its using old auth system imports. so please update the imports accordingly. The existing rows should import the data correctly accordning to the new auth system. Now this is importing partially ,e.g Homeowners name is not showing but the email is showing. so please fix all these issues accordingly.

***what I need to import additionally*** to add row and import : Quote type (residential/commercial), Address , IP address, 

***note*** the data can be collected based on users activity. e.g when a user signup , we can collect their IP address and signup data, when a user generate first lead we can collect their address, contact,name, postcode etc. you must understand how we can collect these data based on users activity and then import them accordingly in the admin dashboard homeowners management page. 

***instructions*** Audit and understand the current imports and data flow. create a comprhensive audit report of the issues found and identify the gaps between the existing partial imports and also for the additional imports that are requested to add and the plan to fix and impliment them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***strict rules*** never spoil any other functionality while working on these modals and flows. always test everything after making changes. do to attempt blindly if you dont have clear picture.

-------------------------------------------------------------------------

***Homeowners Lead generation from the homepage*** there are multiple flow for the homeowners to generate leads. and I found one issue with the one flow. The flows are not built actually.

***When a user is signed up but not generaated any lead yet and wants to genearate first lead*** user try to generate lead from the homepage instantQuote form. now the current flow : InstantQuote calcualor > showing results> quote option modal > and not continuing to the next flows. 
the next flow should be : InstantQuote calcualor > showing results> quote option modal > detailed information modal > lead succssful modal (and the lead should be generated). 

***second lead generation from the homepage InstantQuote form*** when a user is signed up and already generated one lead and then the user try to generate 2nd lead from the homepage instantQuote form. now the current flow : InstantQuote calcualor > showing results> get detailed quotes from installers > contact verification modal > after the contact verified > QuoteType Distribution modal > generate leads as per the users selection. 

***second+ lead generation from the homepage InstantQuote form***
when the user has quote generation limits , the flow should be : InstantQuote calcualor > showing results> get detailed quotes from installers > QuoteType Distribution modal > generate leads as per the users selection. 

***when the limit reached*** when the user has reached the lead generation limits , the flow should be : InstantQuote calcualor > showing results> get detailed quotes from installers > Lead limit reached modal(create a new modal for this). this is the end point for now.

***instructions*** Audit and understand the current flows and data flow. create a comprhensive audit report of the issues found and identify the gaps between the existing flows and the requested flows and the plan to fix and impliment them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***notes** the dashboard flows are working fine, do not tocuh or harm them anyways. undersatand the lead generation principals including data inputs and data imports. 

***strict rules*** never spoil any other flows and functionality while working on these modals and flows. All the existing lead generation flows should work as it is working now. only work on the new area that mentioned. always test everything after making changes. do to attempt blindly if you dont have clear picture. 

----------------------------------------------------------------------------------------

***Homeowners Lead generation from the homepage- test*** i have tested the flows that you have implimented. I have found issues with the very first flow , it is not working as expected and also not as per your audit and plan.

***instructions*** you must re-audit the flow and identify the gaps between the existing flow and the requested flow. create a comprhensive audit report of the issues found and the plan to fix and impliment them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. 
Compare with the previous audit report(D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM\10-HOMEPAGE-LEAD-GENERATION-FLOWS-AUDIT.md) that you have created for this flow and identify what went wrong and why the implimentation is not as per the plan. 
And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created. 

***strict rules*** never spoil any other flows and functionality while working on these modals and flows. All the existing lead generation flows should work as it is working now. only work on the new area that mentioned. always test everything after making changes. do to attempt blindly if you dont have clear picture.

----------------------------------------------------------------------

***test- flow 2*** instantquote> results> quoteoption modal> Quote Request Limit Reached (which is the wrong modal), and it is not generating the leads.

check back the plan, what it was suppose to be . this is a completely wrong implimenetation. 

-----------------------------------------------------------------------------------

***test- flow issue highlight*** instantquote> results> contact verification modal> after verfication (which is showing up even the contact is verified already) in stated it should show the lead distribution modal here. this is the most focus area to fix. Your fix did not work as expected. so I am just repeating the same prompt that given earlier. please read carefully and fix the issue accordingly. 

***When a user is signed up and has 0 leads and trying to generate first lead from the homepage InstantQuote form***
Now when the user has 0 lead and user already signedup, then show the first lead generation flow , which is working fine now. when the user has 1st lead already and try to generate 2nd lead, then show the 2nd lead generation flow which is also working fine now (the verification requred is also working fine).

***The areas to work on : for 3rd , 4th and 5th lead generation flows :***
- when the user has 2 or more than 2 leads already and try to generate more leads, then the flow should be the: instantquote> results> lead distribution modal> generate leads as per the users selection. and this flow repeates until the user reach the lead generation limit which is 5 leads in total. 
- when the user has reached the lead generation limit which is 5 leads in total, then the flow should be instantquote> results> lead limit reached modal ,this is the end point for lead generation now.

***current issues*** now the verification modal is showing even the user has 2 or more leads already. this is wrong. please fix this issue. because users need the contact verification only once while generating the 2nd lead. after that no need to verify again and again. 

***plan***you can create conditions based on the leads count of the user. identify the leads count of the user and then create conditions based on that to show the correct flow accordingly. 

***instructions*** Audit and understand the current flows and data flow. audit the relevant fronend and backend in deailed and create a comprhensive audit report of the issues found and identify the gaps between the existing flows and the requested flows and the plan to fix and impliment them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***note*** currently the first lead and second lead generation flows are working fine, do not touch or harm them anyways. undersatand the lead generation principals including data inputs and data imports. understand all the logics and condition. read above all the conversation again and again to find any better approach

***strict rules*** never spoil any other flows and functionality while working on these modals and flows. All the existing lead generation flows should work as it is working now. only work on the new area that mentioned. always test everything after making changes. do to attempt blindly if you dont have clear picture. 

- never edit any auth modal to fix this issue. only work on the lead generation flows and modals. Do not repeate the same mistake you did above while fixing the flow issues.
-----------------------------------------------------------------------------------


***Bidding lead Generation issue*** Main focus should be on the bidding lead generation from the QuoteDistributionModal only.


***QuoteDistributionModal issue*** There are few issues with it :

1. while generating bidding leads from the QuoteDistributionModal , after selecting the bidding quote type and clicking on the generate lead button, it is not generating the bidding lead, but it is counting the lead. 
2. The homepage leadgeneration flow is not generating bidding leads from the QuoteDistributionModal. but the dashboard leadgeneration flow is generating bidding leads from the QuoteDistributionModal. You can just follow the dashboard QuoteDistributionModal logic/condition/flow to fix the homepage QuoteDistributionModal flow for bidding leads.
3. As the quotedistributionmodal is used in multiple places now, so make sure to keep everything aligned and working fine in all the places after fixing the bidding lead generation issue.

***instructions*** Audit and understand the current flows and data flow. audit the relevant fronend and backend in deailed and create a comprhensive audit report of the issues found and identify the gaps between the existing flows and the requested flows and the plan to fix and impliment them. after that start fixing the issues step by step. Make sure to keep everything aligned with the constitution.md file and the overall theming system that we are working on. create the audit report under this folder D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\DOC\AUDIT-REPORTS\LEAD-GENERATION-SYSTEM. And create a phase in the D:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch\specs\006-component-by-component\tasks.md file for this task and start implimenting the changes step by step as per the plan you created.

***strict rules*** never spoil any other flows and functionality while working on these modals and flows. All the existing lead generation flows should work as it is working now. only work on the new area that mentioned. always test everything after making changes. do to attempt blindly if you dont have clear picture. Do not commit or push until I ask. focus on the main issues.

--------------------------------------------------------------------------

lets work on the src/components/homeowner/FirstQuoteSuccessModal.tsx

 modal to enhance the migration of UI. make sure to use the semantic approach. read the global css and use only semantic classes for icon,texts,buttons,main card, background card, nuemorphic classes etc.  check the main file and implimnet as per needed. 

***strict rules*** no hardcoded ui , no inline styles, only semantic classes from the global css. always test everything after making changes. do to attempt blindly if you dont have clear picture. never touch any backend or UX even. only work with the UI

-------------------------------------------------------------------------------

***INSTALLERS***


As we are just started with the installers part, so we have plenty options to re-organize everything regarding installers. Now lets implimenet the fix as per your recommendation for the homepage issues .

***strict rules*** never spoli homeowners. Admin parts while working on the installers part. be careful while implimenting , your implimentation should not create issues for other functionality of the site. forget about the commit or push , I will let you know when to do it. focus on the main task first. 

_______________________________________________________________________________
