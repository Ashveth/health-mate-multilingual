-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily health alerts update at 8:00 AM UTC
SELECT cron.schedule(
  'daily-health-alerts-update',
  '0 8 * * *', -- Every day at 8:00 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://zkxifbvetcvncsyvyksb.supabase.co/functions/v1/update-health-alerts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreGlmYnZldGN2bmNzeXZ5a3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI0NzYsImV4cCI6MjA3Mzg5ODQ3Nn0.knn5Prh09nQFrcEeoI1LmBgjP_HvVCZyWsm2wSU1KXc"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
