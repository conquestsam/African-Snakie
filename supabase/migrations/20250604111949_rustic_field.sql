/*
  # Fix Cart Constraints and Management

  1. Changes
    - Remove and recreate cart constraints
    - Update cart management policies
    - Fix duplicate cart issues
    - NO changes to user/profile policies

  2. Security
    - Maintain existing user security
    - Fix cart operations
*/

-- First, remove the problematic constraint
ALTER TABLE carts DROP CONSTRAINT IF EXISTS unique_user_cart;

-- Clean up any duplicate carts
WITH DuplicateCarts AS (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM carts
  ) t
  WHERE rn > 1
)
DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM DuplicateCarts);

DELETE FROM carts WHERE id IN (SELECT id FROM DuplicateCarts);

-- Now add the constraint back
ALTER TABLE carts ADD CONSTRAINT unique_user_cart UNIQUE (user_id);

-- Update cart policies to handle constraint violations
DROP POLICY IF EXISTS "Allow users to manage own cart" ON carts;

CREATE POLICY "Allow users to manage own cart"
  ON carts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM carts
      WHERE user_id = auth.uid()
      AND id != COALESCE(NEW.id, id)
    )
  );

-- Add function to handle cart creation
CREATE OR REPLACE FUNCTION handle_cart_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- If a cart already exists for this user, return NULL to prevent creation
  IF EXISTS (
    SELECT 1 FROM carts
    WHERE user_id = NEW.user_id
  ) THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_cart
  BEFORE INSERT ON carts
  FOR EACH ROW
  EXECUTE FUNCTION handle_cart_creation();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id_created ON carts(user_id, created_at);