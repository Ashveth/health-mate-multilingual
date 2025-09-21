import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, DollarSign, User, Search, Navigation, Target } from 'lucide-react';
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
  const [locationInput, setLocationInput] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        });
      });
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setUserLocation(location);
      await fetchNearbyDoctors(location);
      
      toast({
        title: "Location Access Granted",
        description: "Now showing doctors near your location",
      });
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: "Location access denied",
        description: "Please enter your location manually to find nearby doctors.",
        variant: "destructive",
      });
      await fetchAllDoctors();
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  const geocodeLocation = async (location: string) => {
    try {
      // Using free Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    
    setIsLoadingLocation(true);
    const coordinates = await geocodeLocation(locationInput);
    
    if (coordinates) {
      setUserLocation(coordinates);
      await fetchNearbyDoctors(coordinates);
      toast({
        title: "Location Found",
        description: `Now showing doctors near ${locationInput}`,
      });
    } else {
      toast({
        title: "Location Not Found",
        description: "Please try a different location or be more specific",
        variant: "destructive",
      });
    }
    setIsLoadingLocation(false);
  };

  const fetchNearbyDoctors = async (location: { lat: number; lng: number }) => {
    if (!user) return;
    
    setLoading(true);
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
          
          const doctorData = data?.[0];
          if (!doctorData) return null;

          const distance = calculateDistance(
            location.lat,
            location.lng,
            doctor.latitude,
            doctor.longitude
          );

          return {
            ...doctorData,
            distance
          };
        })
      );

      // Filter out null values and sort by distance
      const validDoctors = doctorsWithInfo
        .filter(doctor => doctor !== null)
        .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));

      setDoctors(validDoctors as Doctor[]);
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
    if (!user) return;
    
    setLoading(true);
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
      setDoctors(validDoctors as Doctor[]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllDoctors();
    }
  }, [user]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.address.toLowerCase().includes(searchTerm.toLowerCase())
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
              Find Doctors Near You
            </h1>
            
            {/* Location Access Section */}
            <div className="bg-primary-light/10 p-4 rounded-lg border border-primary-light/20 space-y-4">
              <p className="text-muted-foreground">
                Get location access or enter your area to find nearby doctors
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <Button
                  onClick={requestLocationPermission}
                  variant="outline"
                  disabled={isLoadingLocation}
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
                </Button>
                
                {/* Manual Location Input */}
                <div className="flex gap-2 flex-1">
                  <Input
                    placeholder="Enter your city or area (e.g., Mumbai, Delhi)"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleLocationSearch}
                    disabled={isLoadingLocation || !locationInput.trim()}
                    className="bg-gradient-primary"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {isLoadingLocation ? 'Searching...' : 'Find Nearby'}
                  </Button>
                </div>
              </div>

              {userLocation && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    📍 Showing doctors near your location • Sorted by distance
                  </p>
                </div>
              )}
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, specialization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading doctors...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-medical transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{doctor.name}</CardTitle>
                            <Badge variant="secondary">{doctor.specialty}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{doctor.address}</span>
                        </div>
                        {doctor.distance && (
                          <div className="flex items-center gap-1 text-blue-600 font-medium">
                            <Navigation className="w-4 h-4" />
                            <span>{doctor.distance} km away</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{doctor.availability_hours}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>₹{doctor.consultation_fee}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleBookAppointment(doctor)}
                          className="flex-1 bg-gradient-primary"
                          size="sm"
                        >
                          Book Appointment
                        </Button>
                        <Button
                          onClick={() => handleCallDoctor(doctor)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredDoctors.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No doctors found</h2>
              <p className="text-muted-foreground mb-4">
                I couldn't find any doctors matching your request. Please try another search or contact support.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>💡 **Try searching for:**</p>
                <p>• Specialization: "cardiologist", "pediatrician"</p>
                <p>• Doctor name: "Dr. Smith"</p>
                <p>• Location: "Mumbai", "Delhi"</p>
              </div>
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