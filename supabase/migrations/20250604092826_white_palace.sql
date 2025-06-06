/*
  # Fix Authentication and Profile Creation Issues

  1. Changes
    - Add missing RLS policies for profile creation
    - Fix profile creation permissions
    - Ensure proper role assignment

  2. Security
    - Maintain existing security model
    - Allow authenticated users to create their own profiles
    - Preserve admin capabilities
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create new policies for profile management
CREATE POLICY "Users can manage own profile"
  ON profiles
  USING (auth.uid() = id);

CREATE POLICY "Users can create profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON profiles
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );