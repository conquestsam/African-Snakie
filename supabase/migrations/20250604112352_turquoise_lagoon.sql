/*
  # Fix Cart Cleanup and Constraints

  1. Changes
    - Remove and recreate unique constraint
    - Clean up duplicate carts directly
    - Update policies and triggers
    - Add performance optimizations

  2. Security
    - Maintain data integrity
    - Prevent duplicate carts
    - Ensure proper user access
*/

-- First, remove the constraint if it exists
ALTER TABLE carts DROP CONSTRAINT IF EXISTS unique_user_cart;

-- Delete cart items for duplicate carts (keeping only the newest cart per user)
DELETE FROM cart_items 
WHERE cart_id IN (
  SELECT c1.id
  FROM carts c1
  JOIN carts c2 ON c1.user_id = c2.user_id
  WHERE c1.created_at < c2.created_at
);

-- Delete duplicate carts (keeping only the newest cart per user)
DELETE FROM carts c1
WHERE EXISTS (
  SELECT 1
  FROM carts c2
  WHERE c1.user_id = c2.user_id
  AND c1.created_at < c2.created_at
);

-- Add the unique constraint back
ALTER TABLE carts ADD CONSTRAINT unique_user_cart UNIQUE (user_id);

-- Update cart policies
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

-- Update cart creation function
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

-- Recreate trigger
DROP TRIGGER IF EXISTS ensure_single_cart ON carts;

CREATE TRIGGER ensure_single_cart
  BEFORE INSERT ON carts
  FOR EACH ROW
  EXECUTE FUNCTION handle_cart_creation();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id_created ON carts(user_id, created_at);