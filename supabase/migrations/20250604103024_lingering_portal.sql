/*
  # Complete Database Fix for Authentication and Data Management

  1. Changes
    - Fix profile management and role assignment
    - Update cart and order management
    - Add proper indexes and constraints
    - Fix RLS policies

  2. Security
    - Proper role-based access control
    - Secure cart and order management
    - Protected admin operations
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admin users" ON profiles;
DROP POLICY IF EXISTS "Enable cart management for users" ON carts;
DROP POLICY IF EXISTS "Enable cart items management for users" ON cart_items;

-- Fix profile role handling
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';

-- Create proper profile policies
CREATE POLICY "Allow users to read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      CASE WHEN role IS NOT NULL 
      THEN role = OLD.role  -- Prevent users from changing their role
      ELSE true
      END
    )
  );

CREATE POLICY "Allow profile creation on signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access to profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fix cart management
CREATE POLICY "Allow users to manage own cart"
  ON carts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to manage own cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Fix order management
CREATE POLICY "Allow users to view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow admin to manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fix order items management
CREATE POLICY "Allow users to view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow admin to manage all order items"
  ON order_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

-- Add constraints to prevent data inconsistency
ALTER TABLE cart_items ADD CONSTRAINT check_positive_quantity CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT check_positive_quantity CHECK (quantity > 0);
ALTER TABLE products ADD CONSTRAINT check_positive_price CHECK (price > 0);
ALTER TABLE products ADD CONSTRAINT check_positive_inventory CHECK (inventory_count >= 0);