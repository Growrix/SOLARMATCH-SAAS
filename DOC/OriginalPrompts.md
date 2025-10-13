Original : 

understand the scenario and user story before building any API and DB.First, the guests Generates Instant quotes by filling up instant quote form (I want all the guests from Inputs and the results in a table which is separate as Guest's InstantQuote Table), By this table I Want to see total users that generated InstantQuotes In my AdminDashboard (I do not have any modal yet for this). Second , When the Guests Clicks on the "Get Qoute From a Installer" here starts the another phase. They see 2 types of Quote request options "call/Visit" and "Written Quote"(Should have 2 different tables for 2 types of lead). Whatever option the user chose it opens a signup modal (This should have a Table that will authenticate users instantly and also when they login back later). Once the user submits "Create Account & Submit Request" the guests users become the Homeowner and they get redirected to the Homeowners Dashboard (The page "My Quote request are created but there are no modals created yet for any types of quote the user requested, so you have to create it too"). In the homeowners Dashboard They should See the record when they have requested the qoute including its calculated results. All the user inputs should fill up the InstantQuote form when they request for the second time, but users are allowd to edit if they want to change anything in the form and submit. Each time they request new quote it should be saved and show on the homeowners dashboard.

Also Make a plan TO build Modal/Pages in the admin dashboard to track how many users generated instantquote, how many signed up and requested real quote to the installers , Also an option in the modal that will show the cost calcuations and user inputs. 

In the Installers Feed there is already a modal built "Lead Feed". Understand the modal. You can check the leadfeed modals and understand what data is being displayed and how it is structured. The installer should see the all the instantquote inputs and calculated results after they purchse the Call/visit lead. And there should be a page "Purchased Lead" created in the Installer's Dashboard , it should show all the purchsed lead and all of its detailed information of the Homeowners. 



Now lets built The API end points, DB prisma, SQL migration I mean the whole Feature. Your job is to Audit and Analyze the current user experiece flow, Modals, Homeowner-Installer-Admin Dashboard Pages and modals that are realted to InstantQuote Generation flow. We need to make a plan first before any implimentation. lets get the flow and understanding of all the modals to build further dev. Create a InstantquoteFeature.md file with the audit and also the next phase implementaion plan. 


Original : 
**Enhanced Prompt for Copilot:**

---

## Instant Quote & Lead Flow: User Story and Feature Audit

### 1. **User Journey Overview**

- **Guest Experience:**
  - Guests can generate instant solar quotes by completing an Instant Quote form.(This modal is already built)
  - All guest submissions (inputs and calculated results) are saved in a dedicated `GuestInstantQuote` table.
  - Admins need visibility into the total number of guests who have generated instant quotes (to be shown in the Admin Dashboard; modal/page not yet created).

- **Quote Request Phase:**
  - After generating an instant quote, guests can proceed to request a detailed quote from an installer by clicking "Get Detailed Quotes from Installers".
  - Two request types are available:
    - **Call/Visit** (to be stored in a `CallVisitQuoteRequest` table)
    - **Written Quote** (to be stored in a `WrittenQuoteRequest` table)
  - Upon selecting a request type, guests are prompted to sign up or log in (user authentication required).
    - Implement or extend a user authentication table/model to support instant sign-up and login.
    - Identify and reuse any existing authentication modal; if missing, design a new one for a seamless experience.
    - After account creation, the guest becomes a Homeowner and is redirected to the Homeowner Dashboard.

---

### 3. **Dashboard & Modal Enhancements**

#### **Admin Dashboard**
  - Build a unified modal/page to display all lead types ("Call/Visit" and "Written Quote" requests) with comprehensive details:
    - User inputs, calculated quote results, lead status, and timestamps.
    - Filtering and sorting by lead type, status, and date.
    - Summary statistics at the top (e.g., total instant quotes, leads by type, conversion rates).
    - Ensure the design and data structure are consistent with `src/app/admin/instant-quotes/page.tsx`.
    - Add visibility into installer comments and lead quality ratings.
    - Enable quick actions for lead management and tracking.

#### **Homeowner Dashboard**
  - Provide a dedicated, responsive modal/page listing all quote requests (current and historical) with:
    - Original Instant Quote inputs, selected request type, calculated results, cost breakdown, and status indicators.
    - Timestamps for submission and updates.
    - Ability to initiate new quote requests (Instant Quote form pre-filled with latest data, but fully editable).
    - Actions to edit/resubmit previous requests, view detailed results, and track progress.
    - Status updates reflecting when a lead is purchased by an installer (e.g., "Deal Closed").
    - Accessibility and dark mode support.

#### **Installer Dashboard**
  - Reference and extend the existing "Lead Feed" modal for consistency.
  - After purchasing a Call/Visit lead, unlock a detailed modal showing all instant quote inputs and calculated results (matching Homeowner/Admin views).
  - Create a "Purchased Lead" page to manage all purchased leads, displaying detailed Homeowner information and lead status.
    - Only show Call/Visit quotes here.
    - Include "Submit Quote" and "Start Chat" buttons, mirroring current Lead Feed functionality.
    - Add options to mark leads as "Done Deal", "Void", or "User No Response".
    - Provide a comment section for installers to rate/comment on lead quality (visible to Admins for quality tracking).

---

### 4. **Lead Lifecycle & Data Flow**

- Ensure all leads are trackable and data is shared appropriately across Admin, Installer, and Homeowner dashboards, respecting user roles and permissions.
- Define clear lead lifecycle statuses: New, Pending, In Progress, Deal Closed, Void, No Response, etc.
- Categorize and display leads by status in all relevant dashboards.
- Implement robust auditing of the existing API, Prisma models, and database structure before each development phase to avoid inconsistencies.

---

### 5. **Implementation Plan & Best Practices**

- **Audit:**  
  - Thoroughly review current user flows, modals, API endpoints, and database models.
  - Identify gaps and redundancies in the existing structure.
- **Plan:**  
  - Document all findings and next steps in `InstantquoteFeature.md`.
  - Clearly outline new/updated models, API endpoints, and migration requirements.
  - Prioritize a clean, maintainable build process with a focus on UX, accessibility, and responsiveness.
  - Ensure all dashboards and modals are consistent, intuitive, and provide actionable insights for each user type.
  - Validate all new features with real user scenarios to guarantee a seamless experience.

---

**Goal:**  
Deliver a robust, user-friendly Instant Quote and Lead Management feature set that empowers Admins, Homeowners, and Installers with clear, actionable data and a seamless workflow—while maintaining code quality, scalability, and a clean development process.

---

### 2. **Feature Audit & Planning**

- **Audit:**  
  - Analyze the current user flow, modals, and dashboard pages related to instant quote generation and lead management.
  - Identify missing modals/pages for Admin, Homeowner, and Installer dashboards.

- **Plan:**  
  - Document findings and outline the implementation plan in a new file: `InstantquoteFeature.md`.
  - Ensure all new models, API endpoints, and migrations are organized and clearly described.
  - Reference the "Lead Feed" modal for installer data requirements.

---

**Instructions for Copilot:**

- Fully understand the user journey and data flow before implementation.
- Audit and document the current state of user flows and dashboard modals/pages.
- Create a clear, actionable implementation plan for the next development phase.
- Ensure all dashboard requirements (Admin, Homeowner, Installer) are addressed.
- Organize all new database models, API endpoints, and migrations as described.
- Summarize findings and plans in `InstantquoteFeature.md`.


Now the homeowners auth

***Installers Authentication Flow*** The Installers can signup from the header menu button. when the users are logged in they can access the installers Dashboard and also can see the Guest's Homepage. They are not allowed to see/access anything else in this site.
After successful signup the Installers see a modal that shared in the screenshot. When the click co the button "Visit Installer's HOme" it should redirect to the installers home page and that page is only dedicated to Installers. This Homeowners should not see it anyway. Add another button "Visit Dashboard" that will redirect to the installers Dashboard. The installers area is the Installers Dashboard and the Installers home and nothing else. When they logged out, they see the Guest's homepage. This is the Authentication ssytem for the Installers. Now you Do audit, understand the existing what have you done. do the necessary updates as per Expkained the installers story. 


***HOmeowners Authentication Flow*** The Homeowners can signup from the header menu button and also while requeting the quote from the installers. both signup process serves the same purpose. when the users are logged in they can access the homeowners Dashboard and also can see the Guest's Homepage. They are not allowed to see/access anything else in this site. and after logout the homeowners can see only the guests homepage by default. 