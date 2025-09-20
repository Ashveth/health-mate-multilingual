-- Fix the RLS policy properly - only authenticated users should access doctor contact info
-- Remove the public policy that still exposes sensitive data

DROP POLICY "Public can view basic doctor info" ON public.doctors;

-- Now only authenticated users can view doctor information
-- This fully addresses the security vulnerability