/*
  # Fix RLS Policies and Cart Constraints

  1. Changes
    - Remove recursive admin RLS policy on profiles
    - Add new admin policies using JWT claims
    - Add user self-management policies for profiles
    - Add unique constraint to carts table user_id
    - Clean up duplicate cart entries

  2. Security
    - Update RLS policies to use JWT claims for admin checks
    - Add policies for users to manage their own profiles
    - Maintain existing security model while fixing recursion
*/

-- First, drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Add new admin policies using JWT claims
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add policies for users to manage their own profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Clean up duplicate cart entries
-- Keep only the most recent cart for each user
WITH latest_carts AS (
  SELECT DISTINCT ON (user_id) id
  FROM carts
  ORDER BY user_id, created_at DESC
)
DELETE FROM cart_items
WHERE cart_id NOT IN (SELECT id FROM latest_carts);

DELETE FROM carts
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM carts
  ORDER BY user_id, created_at DESC
);

-- Add unique constraint to carts table
ALTER TABLE carts ADD CONSTRAINT unique_user_cart UNIQUE (user_id);