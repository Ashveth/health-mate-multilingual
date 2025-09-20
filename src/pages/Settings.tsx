import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Bell, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage, languageOptions } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string;
  phone_number: string;
  location: string;
  preferred_language: string;
  notification_preferences: {
    health_tips: boolean;
    disease_alerts: boolean;
    appointment_reminders: boolean;
  };
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone_number: '',
    location: '',
    preferred_language: 'en',
    notification_preferences: {
      health_tips: true,
      disease_alerts: true,
      appointment_reminders: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          location: data.location || '',
          preferred_language: data.preferred_language || 'en',
          notification_preferences: (data.notification_preferences as UserProfile['notification_preferences']) || {
            health_tips: true,
            disease_alerts: true,
            appointment_reminders: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          location: profile.location,
          preferred_language: profile.preferred_language,
          notification_preferences: profile.notification_preferences
        });

      if (error) throw error;

      // Update language context if language changed
      if (profile.preferred_language !== currentLanguage) {
        setLanguage(profile.preferred_language as any);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof profile.notification_preferences, value: boolean) => {
    setProfile({
      ...profile,
      notification_preferences: {
        ...profile.notification_preferences,
        [key]: value
      }
    });
  };

  const handleLanguageChange = (language: string) => {
    setProfile({
      ...profile,
      preferred_language: language
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-poppins text-primary mb-2">
          {t('settings.profile')}
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('settings.full_name')}</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.email')}</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed from here
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('settings.phone')}</Label>
                <Input
                  id="phone"
                  value={profile.phone_number}
                  onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('settings.location')}</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="Enter your city/location"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language & Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={profile.preferred_language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Health Tips</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily health tips and wellness advice
                  </p>
                </div>
                <Switch
                  checked={profile.notification_preferences.health_tips}
                  onCheckedChange={(checked) => handleNotificationChange('health_tips', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Disease Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about disease outbreaks in your area
                  </p>
                </div>
                <Switch
                  checked={profile.notification_preferences.disease_alerts}
                  onCheckedChange={(checked) => handleNotificationChange('disease_alerts', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for upcoming appointments
                  </p>
                </div>
                <Switch
                  checked={profile.notification_preferences.appointment_reminders}
                  onCheckedChange={(checked) => handleNotificationChange('appointment_reminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-gradient-primary min-w-[120px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : t('common.save')}
        </Button>
      </motion.div>
    </div>
  );
}