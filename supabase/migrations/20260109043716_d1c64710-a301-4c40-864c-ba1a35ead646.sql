-- Drop all RLS policies that depend on has_role function

-- Bookings policies
DROP POLICY IF EXISTS "Admin can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can update payment proof only" ON public.bookings;

-- Schedules policies
DROP POLICY IF EXISTS "Admin can insert schedules" ON public.schedules;
DROP POLICY IF EXISTS "Admin can update schedules" ON public.schedules;
DROP POLICY IF EXISTS "Admin can delete schedules" ON public.schedules;

-- Trip operations policies
DROP POLICY IF EXISTS "Admin can view trip_operations" ON public.trip_operations;
DROP POLICY IF EXISTS "Admin can insert trip_operations" ON public.trip_operations;
DROP POLICY IF EXISTS "Admin can update trip_operations" ON public.trip_operations;
DROP POLICY IF EXISTS "Admin can delete trip_operations" ON public.trip_operations;

-- Admin activity logs policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Allow insert for logging" ON public.admin_activity_logs;

-- User roles policies
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Now drop the tables
DROP TABLE IF EXISTS public.admin_activity_logs CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Drop the enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create new simple policies for bookings (public update for payment proof)
CREATE POLICY "Anyone can update bookings"
ON public.bookings
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create new simple policies for bookings (public delete - for admin use without auth)
CREATE POLICY "Anyone can delete bookings"
ON public.bookings
FOR DELETE
USING (true);

-- Create new simple policies for schedules
CREATE POLICY "Anyone can manage schedules"
ON public.schedules
FOR ALL
USING (true)
WITH CHECK (true);

-- Create new simple policies for trip_operations
CREATE POLICY "Anyone can manage trip_operations"
ON public.trip_operations
FOR ALL
USING (true)
WITH CHECK (true);