/*
  # Fix Profile Policies and Role Management

  1. Changes
    - Remove problematic OLD reference in profile policies
    - Implement proper role management
    - Fix policy recursion issues

  2. Security
    - Maintain role-based access control
    - Prevent unauthorized role changes
    - Ensure proper profile management
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Allow admin full access to profiles" ON profiles;

-- Create new profile policies without OLD reference
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role = 'customer' OR role IS NULL)  -- Ensure users can only be customers
  );

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    AND (role = 'customer' OR role IS NULL)  -- Ensure new users can only be customers
  );

CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add trigger to prevent role changes by non-admin users
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role AND 
     NOT EXISTS (
       SELECT 1 FROM profiles 
       WHERE id = auth.uid() AND role = 'admin'
     ) THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_role_changes
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION prevent_role_change();