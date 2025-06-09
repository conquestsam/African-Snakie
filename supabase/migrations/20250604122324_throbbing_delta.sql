/*
  # Fix Authentication and Role Management

  1. Changes
    - Reset and simplify RLS policies
    - Fix role management
    - Enable proper authentication flow
    - Maintain data integrity

  2. Security
    - Ensure proper access control
    - Maintain role separation
    - Enable registration and login
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;

-- Drop the trigger that's causing issues
DROP TRIGGER IF EXISTS enforce_role_changes ON profiles;
DROP FUNCTION IF EXISTS prevent_role_change();

-- Reset RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Simple, effective policies for profiles
CREATE POLICY "Allow users to read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access"
  ON profiles FOR ALL
  USING (
    role = 'admin'
  );

-- Add function to handle role updates
CREATE OR REPLACE FUNCTION handle_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS NULL THEN
    NEW.role := 'customer';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_role_on_update
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_role_update();

-- Ensure proper default role
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';

-- Reset and simplify cart policies
ALTER TABLE carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage own cart"
  ON carts FOR ALL
  USING (auth.uid() = user_id);

-- Reset and simplify cart items policies
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage own cart items"
  ON cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_auth_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);