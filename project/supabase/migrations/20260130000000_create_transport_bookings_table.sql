-- Create transport_bookings table
CREATE TABLE IF NOT EXISTS transport_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('pickup', 'dropoff')),
  shift_end_time VARCHAR(20),
  gender VARCHAR(20),
  route VARCHAR(255),
  pickup_time VARCHAR(20),
  pickup_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transport_bookings_date ON transport_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_user ON transport_bookings(user_email);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_type ON transport_bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_route ON transport_bookings(route);
