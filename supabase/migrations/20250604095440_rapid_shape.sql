/*
  # Fix Authentication and Cart Issues

  1. Changes
    - Add missing RLS policies for cart operations
    - Fix profile creation permissions
    - Add indexes for better performance

  2. Security
    - Maintain existing security model
    - Allow proper cart management
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Fix profile creation permissions
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';

-- Update cart RLS policies
DROP POLICY IF EXISTS "Users can view their own cart" ON carts;
DROP POLICY IF EXISTS "Users can update their own cart" ON carts;
DROP POLICY IF EXISTS "Users can insert into their own cart" ON carts;

CREATE POLICY "Enable cart management for users"
  ON carts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update cart items RLS policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert into their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

CREATE POLICY "Enable cart items management for users"
  ON cart_items FOR ALL
  TO authenticated
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    cart_id IN (
      SELECT id FROM carts WHERE user_id = auth.uid()
    )
  );