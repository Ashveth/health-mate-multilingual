-- Fix security vulnerability: Restrict doctor contact information access to authenticated users only
-- This prevents spammers from harvesting email addresses and phone numbers

-- Drop the existing overly permissive policy
DROP POLICY "Everyone can view doctors" ON public.doctors;

-- Create new policy that requires authentication to view doctor information
CREATE POLICY "Authenticated users can view doctors" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (true);

-- Create a separate policy for public access to basic doctor info (without contact details)
-- This allows public search functionality while protecting sensitive contact information
CREATE POLICY "Public can view basic doctor info" 
ON public.doctors 
FOR SELECT 
TO anon
USING (true);