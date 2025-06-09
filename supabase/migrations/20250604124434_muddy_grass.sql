/*
  # Fix Profile Policies Without Altering Existing Ones

  1. Changes
    - Drop conflicting policies
    - Create new consolidated policies
    - Fix profile access issues

  2. Security
    - Maintain proper access control
    - Preserve existing functionality
*/

-- Drop only the conflicting policy
DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON profiles;

-- Create new consolidated policy with a unique name
CREATE POLICY "profiles_self_update_access" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add missing indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);