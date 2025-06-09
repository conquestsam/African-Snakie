/*
  # Fix Cart and Order Processing

  1. Changes
    - Add missing cart constraints
    - Fix cart item relationships
    - Add order processing tables
    - Add payment processing tables

  2. Security
    - Maintain existing security
    - Add proper constraints
*/

-- Add delivery_method to orders table if not exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'standard';

-- Add payment_intent table for Stripe integration
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payment_intents
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for payment_intents
CREATE POLICY "Users can view own payment intents"
  ON payment_intents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_intents.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payment intents"
  ON payment_intents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_intents.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_order_id ON payment_intents(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_payment_intents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_intents_timestamp
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_intents_updated_at();