-- Drop existing INSERT policy that's too restrictive
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;

-- Create new INSERT policy that allows anyone to create bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);