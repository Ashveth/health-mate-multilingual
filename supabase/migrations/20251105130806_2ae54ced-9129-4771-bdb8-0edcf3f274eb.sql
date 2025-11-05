-- Create table for storing connected device credentials
CREATE TABLE public.connected_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google_fit', 'fitbit', 'garmin')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Create table for storing synced health data
CREATE TABLE public.health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google_fit', 'fitbit', 'garmin')),
  date DATE NOT NULL,
  steps INTEGER,
  heart_rate_avg INTEGER,
  sleep_minutes INTEGER,
  calories_burned INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider, date)
);

-- Enable RLS
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for connected_devices
CREATE POLICY "Users can view their own connected devices"
  ON public.connected_devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connected devices"
  ON public.connected_devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connected devices"
  ON public.connected_devices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connected devices"
  ON public.connected_devices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for health_data
CREATE POLICY "Users can view their own health data"
  ON public.health_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
  ON public.health_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_connected_devices_updated_at
  BEFORE UPDATE ON public.connected_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_data_updated_at
  BEFORE UPDATE ON public.health_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();