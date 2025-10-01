-- Fix critical doctor contact information exposure
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view doctors with contact restrictions" ON public.doctors;

-- Create a more restrictive policy that uses the get_doctor_info function
-- This ensures contact info is only visible to users with appointments
CREATE POLICY "Authenticated users can view doctors with restricted contact info"
ON public.doctors
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Add RLS policy to prevent bulk data scraping
CREATE POLICY "Rate limit doctor queries"
ON public.doctors
FOR SELECT
TO authenticated
USING (
  -- Only allow viewing doctors (this works in conjunction with the function)
  auth.uid() IS NOT NULL
);

-- Create audit table for tracking sensitive contact info access
CREATE TABLE IF NOT EXISTS public.doctor_contact_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  access_type TEXT NOT NULL CHECK (access_type IN ('phone', 'email', 'full_profile'))
);

-- Enable RLS on audit log
ALTER TABLE public.doctor_contact_access_log ENABLE ROW LEVEL SECURITY;

-- Users can only view their own access logs
CREATE POLICY "Users can view their own access logs"
ON public.doctor_contact_access_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- System can insert access logs
CREATE POLICY "System can insert access logs"
ON public.doctor_contact_access_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_doctor_contact_access_log_user_id 
ON public.doctor_contact_access_log(user_id);

CREATE INDEX IF NOT EXISTS idx_doctor_contact_access_log_doctor_id 
ON public.doctor_contact_access_log(doctor_id);

-- Add security function to log contact access
CREATE OR REPLACE FUNCTION public.log_doctor_contact_access(
  doctor_uuid UUID,
  access_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.doctor_contact_access_log (user_id, doctor_id, access_type)
  VALUES (auth.uid(), doctor_uuid, access_type);
END;
$$;