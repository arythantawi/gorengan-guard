-- Add dropoff_address column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN dropoff_address text;