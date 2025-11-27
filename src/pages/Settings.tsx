import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Bell, Mic2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage, languageOptions } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

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
  voice_input_enabled: boolean;
  voice_output_enabled: boolean;
  auto_read_responses: boolean;
  speech_rate: number;
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
    },
    voice_input_enabled: true,
    voice_output_enabled: false,
    auto_read_responses: false,
    speech_rate: 1.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { isSupported: isTTSSupported } = useTextToSpeech();

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
          },
          voice_input_enabled: data.voice_input_enabled ?? true,
          voice_output_enabled: data.voice_output_enabled ?? false,
          auto_read_responses: data.auto_read_responses ?? false,
          speech_rate: data.speech_rate ?? 1.0,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Connection Error",
        description: "Sorry, I couldn't load your profile right now. Please try again later or contact support.",
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
          notification_preferences: profile.notification_preferences,
          voice_input_enabled: profile.voice_input_enabled,
          voice_output_enabled: profile.voice_output_enabled,
          auto_read_responses: profile.auto_read_responses,
          speech_rate: profile.speech_rate,
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
        title: "Save Failed",
        description: "Sorry, I couldn't save your changes right now. Please try again later or contact support.",
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

  const handleLanguageChange = async (language: string) => {
    setProfile({
      ...profile,
      preferred_language: language
    });
    
    // Apply language change immediately
    setLanguage(language as any);
    
    // Save to database immediately
    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          preferred_language: language
        });
      
      toast({
        title: "Language Updated",
        description: "Your language preference has been saved.",
      });
    } catch (error) {
      console.error('Error updating language:', error);
    }
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

          {/* Voice & Accessibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic2 className="w-5 h-5" />
                Voice & Accessibility
              </CardTitle>
              <CardDescription>
                Configure voice input and output for chat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isTTSSupported && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
                  Voice features may not be fully supported in your browser.
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Input</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable speech-to-text in chat
                  </p>
                </div>
                <Switch
                  checked={profile.voice_input_enabled}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, voice_input_enabled: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Output</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable text-to-speech for responses
                  </p>
                </div>
                <Switch
                  checked={profile.voice_output_enabled}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, voice_output_enabled: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-read Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically read AI responses aloud
                  </p>
                </div>
                <Switch
                  checked={profile.auto_read_responses}
                  disabled={!profile.voice_output_enabled}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, auto_read_responses: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Speech Rate</Label>
                  <span className="text-sm text-muted-foreground">{profile.speech_rate.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[profile.speech_rate]}
                  onValueChange={([value]) =>
                    setProfile({ ...profile, speech_rate: value })
                  }
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  disabled={!profile.voice_output_enabled}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
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