-- Remove the permissive UPDATE policy that allows any field updates
-- Edge function uses service role key which bypasses RLS, so payment proof upload still works
-- Admin updates are handled by the existing "Admins can update bookings" policy

DROP POLICY IF EXISTS "Public can update payment proof only" ON public.bookings;