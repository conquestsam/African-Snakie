/*
  # Fix Profile Policies Recursion

  1. Changes
    - Remove recursive admin checks
    - Implement non-recursive role-based policies
    - Fix profile management permissions

  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Enable proper profile creation and management
*/

-- Drop all existing profile policies to start fresh
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add admin-specific policies using role claim
CREATE POLICY "Enable full access for admin users"
  ON profiles FOR ALL
  TO authenticated
  USING (
    CASE WHEN auth.jwt()->>'role' = 'admin' 
    THEN true 
    ELSE auth.uid() = id 
    END
  );