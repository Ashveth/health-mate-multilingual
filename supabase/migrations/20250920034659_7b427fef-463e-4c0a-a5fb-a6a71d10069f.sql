-- Create doctors table for nearby doctor search
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  rating NUMERIC(3,2) DEFAULT 4.5,
  experience_years INTEGER DEFAULT 5,
  consultation_fee INTEGER DEFAULT 500,
  availability_hours TEXT DEFAULT '9:00 AM - 6:00 PM',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency contacts table
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('personal_doctor', 'family_member', 'emergency_service')),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update profiles table with language preference and location
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"health_tips": true, "disease_alerts": true, "appointment_reminders": true}'::jsonb;

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors (public read access)
CREATE POLICY "Everyone can view doctors" 
ON public.doctors 
FOR SELECT 
USING (true);

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for emergency contacts
CREATE POLICY "Users can view their own emergency contacts" 
ON public.emergency_contacts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency contacts" 
ON public.emergency_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts" 
ON public.emergency_contacts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts" 
ON public.emergency_contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors data
INSERT INTO public.doctors (name, specialty, phone, email, address, latitude, longitude, rating, experience_years, consultation_fee) VALUES
('Dr. Amit Sharma', 'General Physician', '+91-9876543210', 'amit.sharma@email.com', '123 Medical Plaza, Delhi', 28.6139, 77.2090, 4.8, 12, 600),
('Dr. Priya Gupta', 'Cardiologist', '+91-9876543211', 'priya.gupta@email.com', '456 Heart Care Center, Mumbai', 19.0760, 72.8777, 4.9, 15, 1200),
('Dr. Raj Kumar', 'Dermatologist', '+91-9876543212', 'raj.kumar@email.com', '789 Skin Clinic, Bangalore', 12.9716, 77.5946, 4.7, 8, 800),
('Dr. Maya Patel', 'Pediatrician', '+91-9876543213', 'maya.patel@email.com', '321 Children Hospital, Pune', 18.5204, 73.8567, 4.9, 10, 700),
('Dr. Arjun Singh', 'Orthopedic', '+91-9876543214', 'arjun.singh@email.com', '654 Bone Care, Chennai', 13.0827, 80.2707, 4.6, 18, 1000);