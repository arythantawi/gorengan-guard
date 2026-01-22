-- Drop existing SELECT policies on admin_profiles to recreate with correct logic
DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.admin_profiles;

-- Create strict SELECT policy: users can ONLY view their own profile
CREATE POLICY "Users can view own profile only"
ON public.admin_profiles
FOR SELECT
USING (user_id = auth.uid());

-- Create separate policy: super admins can view ALL profiles
CREATE POLICY "Super admins can view all profiles"
ON public.admin_profiles
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));