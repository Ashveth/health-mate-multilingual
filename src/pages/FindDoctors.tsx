import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, DollarSign, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  experience_years: number;
  consultation_fee: number;
  availability_hours: string;
  distance?: number;
}

export default function FindDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        fetchNearbyDoctors(location);
      },
      (error) => {
        console.error('Location error:', error);
        toast({
          title: "Location access denied",
          description: "Please enable location access to find nearby doctors.",
          variant: "destructive",
        });
        // Fetch all doctors even without location
        fetchAllDoctors();
        setLoading(false);
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const fetchNearbyDoctors = async (location: { lat: number; lng: number }) => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');

      if (error) throw error;

      // Calculate distances and sort by proximity
      const doctorsWithDistance = data.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          location.lat,
          location.lng,
          doctor.latitude,
          doctor.longitude
        )
      })).sort((a, b) => a.distance - b.distance);

      setDoctors(doctorsWithDistance);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctor: Doctor) => {
    // Navigate to appointment booking (implement this)
    toast({
      title: "Booking Appointment",
      description: `Redirecting to book appointment with ${doctor.name}`,
    });
  };

  const handleCallDoctor = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold font-poppins text-primary">
          {t('doctors.find_nearby')}
        </h1>
        
        {!userLocation && (
          <div className="bg-primary-light/10 p-4 rounded-lg border border-primary-light/20">
            <p className="text-muted-foreground mb-4">
              {t('doctors.location_access')}
            </p>
            <Button 
              onClick={requestLocationPermission}
              disabled={loading}
              className="bg-gradient-primary"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {loading ? t('common.loading') : t('doctors.enable_location')}
            </Button>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-medical transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {doctor.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{doctor.address}</span>
                  {doctor.distance && (
                    <Badge variant="outline" className="ml-auto">
                      {doctor.distance.toFixed(1)} km
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience_years} {t('doctors.experience')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{t('doctors.consultation_fee')}: ₹{doctor.consultation_fee}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {doctor.availability_hours}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCallDoctor(doctor.phone)}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {t('common.call')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookAppointment(doctor)}
                    className="flex-1 bg-gradient-primary"
                  >
                    {t('doctors.book_appointment')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No doctors found matching your search.</p>
        </div>
      )}
    </div>
  );
}