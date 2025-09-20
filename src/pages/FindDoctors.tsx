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
import { AppointmentBooking } from '@/components/AppointmentBooking';
import { useAuth } from '@/hooks/useAuth';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  experience_years: number;
  consultation_fee: number;
  availability_hours: string;
  can_view_contact: boolean;
  distance?: number;
}

export default function FindDoctors() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view doctor information.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get all doctor IDs first
      const { data: doctorIds, error: idsError } = await supabase
        .from('doctors')
        .select('id, latitude, longitude');

      if (idsError) throw idsError;

      // Fetch secure doctor info for each doctor
      const doctorsWithInfo = await Promise.all(
        doctorIds.map(async (doctor) => {
          const { data, error } = await supabase
            .rpc('get_doctor_info', { doctor_uuid: doctor.id });
          
          if (error) {
            console.error('Error fetching doctor info:', error);
            return null;
          }
          
          return data?.[0] ? {
            ...data[0],
            distance: calculateDistance(
              location.lat,
              location.lng,
              doctor.latitude,
              doctor.longitude
            )
          } : null;
        })
      );

      // Filter out null values and sort by distance
      const validDoctors = doctorsWithInfo
        .filter(doctor => doctor !== null)
        .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));

      setDoctors(validDoctors);
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
    if (!user) {
      return; // Don't fetch if user is not authenticated
    }
    
    try {
      // Get all doctor IDs first
      const { data: doctorIds, error: idsError } = await supabase
        .from('doctors')
        .select('id');

      if (idsError) throw idsError;

      // Fetch secure doctor info for each doctor
      const doctorsWithInfo = await Promise.all(
        doctorIds.map(async (doctor) => {
          const { data, error } = await supabase
            .rpc('get_doctor_info', { doctor_uuid: doctor.id });
          
          if (error) {
            console.error('Error fetching doctor info:', error);
            return null;
          }
          
          return data?.[0] || null;
        })
      );

      // Filter out null values
      const validDoctors = doctorsWithInfo.filter(doctor => doctor !== null);
      setDoctors(validDoctors);
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
    if (user) {
      fetchAllDoctors();
    }
  }, [user]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleCallDoctor = (doctor: Doctor) => {
    if (!doctor.phone || !doctor.can_view_contact) {
      toast({
        title: "Contact Restricted",
        description: "Phone number is only available after booking an appointment.",
        variant: "destructive",
      });
      return;
    }
    window.open(`tel:${doctor.phone}`, '_self');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {!user ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-12"
        >
          <h1 className="text-3xl font-bold font-poppins text-primary">
            {t('doctors.find_nearby')}
          </h1>
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                {t('auth.login_required')}
              </p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-primary"
              >
                {t('auth.sign_in')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
...
            </motion.div>
          ))}
          </div>

          {filteredDoctors.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No doctors found matching your search.</p>
            </div>
          )}
        </>
      )}
      
      {selectedDoctor && (
        <AppointmentBooking
          doctor={selectedDoctor}
          isOpen={showBooking}
          onClose={() => {
            setShowBooking(false);
            setSelectedDoctor(null);
          }}
          onSuccess={() => {
            // Optionally refresh appointments or navigate
            toast({
              title: "Success",
              description: "Appointment booked successfully!"
            });
          }}
        />
      )}
    </div>
  );
}