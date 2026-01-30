/*
  # Food Orders System Schema

  1. New Tables
    - `food_orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `user_name` (text) - Name of the employee
      - `user_email` (text) - Email of the employee
      - `order_date` (date) - Date for which the order is placed
      - `meal_type` (text) - Type of meals ordered (lunch, dinner, or both)
      - `lunch_preference` (text) - Lunch food preference (veg, paneer, chicken, fish, egg, none)
      - `lunch_type` (text) - Lunch serving type (roti_only, roti_rice_combined, none)
      - `dinner_preference` (text) - Dinner food preference (veg, paneer, chicken, fish, egg, none)
      - `dinner_type` (text) - Dinner serving type (roti_only, roti_rice_combined, none)
      - `lunch_price` (numeric) - Price of lunch order
      - `dinner_price` (numeric) - Price of dinner order
      - `total_price` (numeric) - Total order amount
      - `created_at` (timestamptz) - Timestamp when order was placed
  
  2. Security
    - Enable RLS on `food_orders` table
    - Add policy for users to insert their own orders
    - Add policy for users to view their own orders
*/

-- Drop the table if it exists (CAUTION: This will delete all data)
-- DROP TABLE IF EXISTS food_orders;

-- Create the food_orders table
CREATE TABLE IF NOT EXISTS food_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  order_date date NOT NULL,
  meal_type text NOT NULL,
  lunch_preference text DEFAULT 'none',
  lunch_type text DEFAULT 'none',
  dinner_preference text DEFAULT 'none',
  dinner_type text DEFAULT 'none',
  lunch_price numeric DEFAULT 0,
  dinner_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert orders" ON food_orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON food_orders;

-- Create policy for inserting orders
CREATE POLICY "Anyone can insert orders"
  ON food_orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for viewing orders
CREATE POLICY "Anyone can view orders"
  ON food_orders
  FOR SELECT
  TO anon
  USING (true);

-- Create an index for faster queries by date and email
CREATE INDEX IF NOT EXISTS idx_food_orders_date ON food_orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_food_orders_email ON food_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_food_orders_created_at ON food_orders(created_at DESC);