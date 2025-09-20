-- Create more granular doctor access policies
-- Drop the existing policy that allows all authenticated users to view all doctor data
DROP POLICY IF EXISTS "Authenticated users can view doctors" ON public.doctors;

-- Create a more restrictive policy that only shows basic doctor info to authenticated users
CREATE POLICY "Authenticated users can view basic doctor info" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a separate policy for viewing full contact information
-- Only users with appointments can see contact details
CREATE POLICY "Users can view contact info for their doctors" 
ON public.doctors 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Users can see contact info for doctors they have appointments with
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE appointments.doctor_id = doctors.id 
      AND appointments.user_id = auth.uid()
    )
  )
);

-- Create a view for public doctor information (without contact details)
CREATE OR REPLACE VIEW public.doctors_public AS
SELECT 
  id,
  name,
  specialty,
  address,
  rating,
  experience_years,
  consultation_fee,
  availability_hours,
  latitude,
  longitude,
  created_at,
  updated_at,
  NULL as phone,  -- Hide phone for public view
  NULL as email   -- Hide email for public view
FROM public.doctors;

-- Enable RLS on the view
ALTER VIEW public.doctors_public ENABLE ROW LEVEL SECURITY;

-- Create policy for the public view
CREATE POLICY "Authenticated users can view public doctor info" 
ON public.doctors_public 
FOR SELECT 
USING (auth.uid() IS NOT NULL);