-- Hapus policy SELECT yang terlalu permisif pada bookings
-- Karena kita sudah punya function get_booking_by_order_id yang SECURITY DEFINER
-- Kita tidak perlu policy SELECT publik yang terbuka

DROP POLICY IF EXISTS "Public can view own booking by phone and order_id" ON public.bookings;

-- Sekarang bookings hanya bisa dilihat oleh:
-- 1. Admin (via policy "Admins can view all bookings")
-- 2. Public via function get_booking_by_order_id (SECURITY DEFINER)
-- Ini lebih aman karena function memvalidasi phone + order_id