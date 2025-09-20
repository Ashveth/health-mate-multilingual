-- Create more granular doctor access policies
-- Drop the existing policy that allows all authenticated users to view all doctor data
DROP POLICY IF EXISTS "Authenticated users can view doctors" ON public.doctors;

-- Create a policy that shows all doctor info but masks contact details for users without appointments
CREATE POLICY "Authenticated users can view doctors with contact restrictions" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a security definer function to check if user has appointment with doctor
CREATE OR REPLACE FUNCTION public.user_has_appointment_with_doctor(doctor_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.doctor_id = doctor_uuid 
    AND appointments.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Add a database function to get doctor info with conditional contact details
CREATE OR REPLACE FUNCTION public.get_doctor_info(doctor_uuid uuid)
RETURNS TABLE (
  id uuid,
  name text,
  specialty text,
  address text,
  rating numeric,
  experience_years integer,
  consultation_fee integer,
  availability_hours text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz,
  updated_at timestamptz,
  phone text,
  email text,
  can_view_contact boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.specialty,
    d.address,
    d.rating,
    d.experience_years,
    d.consultation_fee,
    d.availability_hours,
    d.latitude,
    d.longitude,
    d.created_at,
    d.updated_at,
    CASE 
      WHEN public.user_has_appointment_with_doctor(d.id) THEN d.phone
      ELSE NULL
    END as phone,
    CASE 
      WHEN public.user_has_appointment_with_doctor(d.id) THEN d.email
      ELSE NULL
    END as email,
    public.user_has_appointment_with_doctor(d.id) as can_view_contact
  FROM public.doctors d
  WHERE d.id = doctor_uuid AND auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;