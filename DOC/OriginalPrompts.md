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
  - After generating an instant quote, guests can request a quote from an installer.
  - Two request types are available:
    - **Call/Visit** (stored in a `CallVisitQuoteRequest` table)
    - **Written Quote** (stored in a `WrittenQuoteRequest` table)
  - Upon selecting a request type, guests are prompted to sign up (user authentication required).
    - A user authentication table is needed for sign up/login.
    - After account creation, the guest becomes a Homeowner and is redirected to the Homeowner Dashboard.

- **Homeowner Dashboard:**
  - Homeowners can view all their quote requests and results (no modals/pages exist yet for these records).
  - Homeowners can submit new quote requests; each request is saved and editable.
  - When submitting a new quote, the Instant Quote form should be pre-filled with their previous inputs (editable before submission).
  - All quote requests and results should be visible and manageable from the Homeowner Dashboard.

- **Admin Dashboard:**
  - Needs modals/pages to track:
    - Total users who generated instant quotes
    - Users who signed up and requested installer quotes
    - Cost calculations and user input details for each quote

- **Installer Dashboard:**
  - Reference the existing "Lead Feed" modal to understand the data structure for installer leads.
  - After purchasing a Call/Visit lead, installers should see all instant quote inputs and calculated results.
  - A "Purchased Lead" page should be created to display all purchased leads and detailed Homeowner information.

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






