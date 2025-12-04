import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Deactivate old alerts (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error: deactivateError } = await supabase
      .from('disease_outbreaks')
      .update({ is_active: false })
      .lt('reported_at', sevenDaysAgo.toISOString())
      .eq('is_active', true);

    if (deactivateError) {
      throw deactivateError;
    }

    // Sample health alerts - in production, this would fetch from WHO API or CDC
    const currentAlerts = [
      {
        disease_name: "Seasonal Flu",
        severity: "moderate",
        location: "Northern Region",
        description: "Increase in seasonal influenza cases reported in northern areas.",
        latitude: 28.7041,
        longitude: 77.1025,
        precautions: [
          "Get vaccinated",
          "Wash hands frequently",
          "Avoid close contact with sick individuals",
          "Stay home if you feel unwell"
        ],
        source: "Regional Health Department",
        is_active: true,
        reported_at: new Date().toISOString()
      },
      {
        disease_name: "Dengue Outbreak",
        severity: "high",
        location: "Coastal Areas",
        description: "Significant increase in dengue cases due to recent rainfall.",
        latitude: 19.0760,
        longitude: 72.8777,
        precautions: [
          "Use mosquito repellent",
          "Remove standing water",
          "Wear long-sleeved clothing",
          "Seek medical attention for fever"
        ],
        source: "Municipal Health Authority",
        is_active: true,
        reported_at: new Date().toISOString()
      }
    ];

    // Check if alerts for today already exist
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingAlerts } = await supabase
      .from('disease_outbreaks')
      .select('id')
      .gte('reported_at', today.toISOString())
      .limit(1);

    // Only insert new alerts if none exist for today
    if (!existingAlerts || existingAlerts.length === 0) {
      const { error: insertError } = await supabase
        .from('disease_outbreaks')
        .insert(currentAlerts);

      if (insertError) {
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Health alerts updated successfully',
        deactivated: true,
        inserted: !existingAlerts || existingAlerts.length === 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
