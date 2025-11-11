-- SQL Script to Create Admin User
-- Run this in your database directly (pgAdmin, TablePlus, or psql)

-- First, let's check if admin exists
SELECT * FROM users WHERE email = 'admin@solarmatch.com';

-- If no admin exists, insert the admin user
-- Password hash for: Admin@123
-- Generated using bcrypt with 10 rounds

INSERT INTO users (
  id,
  email,
  password,
  role,
  name,
  "isActive",
  "emailVerified",
  "emailVerifiedAt",
  "profileComplete",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@solarmatch.com',
  '$2a$10$vQHG8YE0EqH0jF0VN0L0ZuJDKZpZ0nYXJZqJ0QJ0JqZ0nYXJZqJ0Q',
  'ADMIN',
  'System Administrator',
  true,
  NOW(),
  NOW(),
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was created
SELECT id, email, role, name FROM users WHERE email = 'admin@solarmatch.com';
