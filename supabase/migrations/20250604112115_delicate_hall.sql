/*
  # Fix Cart Duplicates and Constraints

  1. Changes
    - Clean up duplicate carts properly
    - Maintain single cart per user
    - Add proper constraints and triggers

  2. Security
    - Preserve existing security model
    - Ensure data integrity
*/

-- First, remove the problematic constraint
ALTER TABLE carts DROP CONSTRAINT IF EXISTS unique_user_cart;

-- Clean up any duplicate carts
WITH duplicate_carts AS (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM carts
  ) t
  WHERE rn > 1
)
DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM duplicate_carts);
DELETE FROM carts WHERE id IN (SELECT id FROM duplicate_carts);

-- Now add the constraint back
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS ensure_single_cart ON carts;

-- Create new trigger
CREATE TRIGGER ensure_single_cart
  BEFORE INSERT ON carts
  FOR EACH ROW
  EXECUTE FUNCTION handle_cart_creation();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id_created ON carts(user_id, created_at);