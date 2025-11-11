-- ============================================================================
-- ADMIN USER SETUP - SQL Script
-- ============================================================================
-- This SQL creates or updates the admin user in your PostgreSQL database
--
-- CREDENTIALS:
--   Email:    admin@solarmatch.com
--   Password: Admin123!Secure
--
-- HOW TO RUN:
--   1. Open your database tool (Supabase SQL Editor, TablePlus, pgAdmin, or psql)
--   2. Connect to your database
--   3. Copy and paste this entire script
--   4. Execute it
--
-- WHAT IT DOES:
--   - Creates admin user if it doesn't exist
--   - Updates password if admin already exists
--   - Sets role to ADMIN
--   - Activates the account
-- ============================================================================

-- Check if admin already exists
SELECT id, email, role, name, "isActive" 
FROM users 
WHERE email = 'admin@solarmatch.com';

-- Create or update admin user
-- Password hash for: Admin123!Secure
INSERT INTO users (
  id,
  email,
  password,
  role,
  name,
  "isActive",
  "emailVerified",
  "profileComplete",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_' || replace(gen_random_uuid()::text, '-', ''),
  'admin@solarmatch.com',
  '$2b$10$.U9nEw7n96tMg3HnYVsO1umXsWdpCK73IJt1ueBiEBHeFo5nks5fW',
  'ADMIN',
  'SolarMatch Admin',
  true,
  NOW(),
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  password = '$2b$10$.U9nEw7n96tMg3HnYVsO1umXsWdpCK73IJt1ueBiEBHeFo5nks5fW',
  role = 'ADMIN',
  "isActive" = true,
  "updatedAt" = NOW();

-- Verify admin was created/updated
SELECT 
  id, 
  email, 
  role, 
  name, 
  "isActive", 
  "emailVerified",
  "createdAt",
  "updatedAt"
FROM users 
WHERE email = 'admin@solarmatch.com';

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- You can now login at: http://localhost:3001/admin
-- Email:    admin@solarmatch.com
-- Password: Admin123!Secure
-- ============================================================================
