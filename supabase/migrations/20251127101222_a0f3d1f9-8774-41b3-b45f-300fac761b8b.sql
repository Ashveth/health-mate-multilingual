-- Add voice preference columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS voice_input_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS voice_output_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_read_responses boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS speech_rate numeric DEFAULT 1.0;