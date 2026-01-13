-- =============================================
-- FIX RLS POLICIES FOR CONTENT TABLES
-- =============================================

-- 1. BANNERS TABLE
DROP POLICY IF EXISTS "Anyone can manage banners" ON public.banners;

CREATE POLICY "Admins can manage banners" 
ON public.banners 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. PROMOS TABLE
DROP POLICY IF EXISTS "Anyone can manage promos" ON public.promos;

CREATE POLICY "Admins can manage promos" 
ON public.promos 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. FAQS TABLE
DROP POLICY IF EXISTS "Anyone can manage faqs" ON public.faqs;

CREATE POLICY "Admins can manage faqs" 
ON public.faqs 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. TESTIMONIALS TABLE
DROP POLICY IF EXISTS "Anyone can manage testimonials" ON public.testimonials;

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. VIDEOS TABLE
DROP POLICY IF EXISTS "Anyone can manage videos" ON public.videos;

CREATE POLICY "Admins can manage videos" 
ON public.videos 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. SCHEDULES TABLE
DROP POLICY IF EXISTS "Anyone can manage schedules" ON public.schedules;

CREATE POLICY "Admins can manage schedules" 
ON public.schedules 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));