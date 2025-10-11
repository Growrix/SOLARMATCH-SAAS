# 🚀 Copilot Prompt: Building End-to-End Features (API, DB, Prisma, Migration)

## Always Tell Copilot:

- **Describe the feature clearly:**
  - What is the business goal?
  - What data needs to be stored/managed?

- **Specify the stack:**
  - Next.js (App Router)
  - TypeScript
  - Prisma ORM
  - PostgreSQL (local, Docker, or Supabase)

- **For Database/Prisma:**
  - Define the Prisma model(s) for the feature
  - Use clear, descriptive field names and types
  - Add constraints (e.g., `@unique`, `@default`, `@id`)
  - Ask Copilot to generate a migration with a clear name (e.g., `add_newsletter_subscribers`)
  - Request comments in the migration file for clarity

- **For API Endpoints:**
  - Specify the route (e.g., `/api/newsletter/subscribe`)
  - Define HTTP methods (GET, POST, PUT, DELETE)
  - Describe expected request/response shape
  - Ask for input validation and error handling
  - Require status codes and clear JSON responses

- **For Migrations:**
  - Always use descriptive migration names
  - Ask for a comment block at the top of the migration SQL
  - Confirm the migration matches the Prisma schema

- **Testing & Docs:**
  - Request a testing checklist for the feature
  - Ask for troubleshooting tips and best practices
  - Request a summary of what was built and why

---

## 📝 Example Prompt

> "Build a complete newsletter subscription feature using Next.js, Prisma, and PostgreSQL. Define the Prisma model, create a migration named `add_newsletter_subscribers`, generate the API endpoints with validation and error handling, and provide a testing checklist. Add comments to the migration file and summarize the data flow."

---

**Reuse this prompt for any end-to-end feature: just change the business goal and model details!**
