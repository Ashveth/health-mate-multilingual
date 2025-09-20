import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, MapPin, Clock, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface DiseaseOutbreak {
  id: string;
  disease_name: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  precautions: string[];
  source: string;
  reported_at: string;
  latitude?: number;
  longitude?: number;
}

const severityConfig = {
  low: { color: "bg-green-100 text-green-800 border-green-200", icon: "🟢" },
  medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "🟡" },
  high: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: "🟠" },
  critical: { color: "bg-red-100 text-red-800 border-red-200", icon: "🔴" }
};

export const DiseaseOutbreakAlert = () => {
  const [outbreaks, setOutbreaks] = useState<DiseaseOutbreak[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutbreaks();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('disease-outbreaks')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'disease_outbreaks' },
        (payload) => {
          const newOutbreak = payload.new as DiseaseOutbreak;
          setOutbreaks(prev => [newOutbreak, ...prev]);
          
          // Show notification for new outbreaks
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`⚠️ Health Alert: ${newOutbreak.disease_name}`, {
              body: `New outbreak reported in ${newOutbreak.location}. Severity: ${newOutbreak.severity}`,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOutbreaks = async () => {
    try {
      const { data, error } = await supabase
        .from('disease_outbreaks')
        .select('*')
        .eq('is_active', true)
        .order('reported_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOutbreaks((data || []) as DiseaseOutbreak[]);
    } catch (error) {
      console.error('Error fetching outbreaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  const activeOutbreaks = outbreaks.filter(outbreak => !dismissedAlerts.has(outbreak.id));

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (activeOutbreaks.length === 0) {
    return (
      <Card className="border-primary-light/20">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-2">All Clear</h3>
          <p className="text-muted-foreground text-sm">
            No active disease outbreaks reported in your area.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={requestNotificationPermission}
          >
            Enable Alerts
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-poppins flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Health Alerts
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={requestNotificationPermission}
        >
          Enable Notifications
        </Button>
      </div>

      <AnimatePresence>
        {activeOutbreaks.map((outbreak, index) => (
          <motion.div
            key={outbreak.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
          >
            <Alert className={`${severityConfig[outbreak.severity].color} border-l-4 relative`}>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-black/10"
                onClick={() => dismissAlert(outbreak.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <AlertDescription className="pr-10">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{severityConfig[outbreak.severity].icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{outbreak.disease_name}</h4>
                        <Badge variant="outline" className={severityConfig[outbreak.severity].color}>
                          {outbreak.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{outbreak.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(outbreak.reported_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{outbreak.description}</p>
                      
                      {outbreak.precautions && outbreak.precautions.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm mb-1">Recommended Precautions:</h5>
                          <ul className="text-xs space-y-1">
                            {outbreak.precautions.map((precaution, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-primary">•</span>
                                <span>{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Source: {outbreak.source}
                        </span>
                        <div className="flex gap-2">
                          {outbreak.latitude && outbreak.longitude && (
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              View Map
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};