import React, { useState } from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  contact_type: string;
  name: string;
  phone_number: string;
  relationship?: string;
}

interface EmergencyContactBookingProps {
  contact: EmergencyContact;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmergencyContactBooking({ contact, isOpen, onClose, onSuccess }: EmergencyContactBookingProps) {
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a simplified appointment record for emergency contact
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: null, // We'll use notes to store contact info since this is not a formal doctor
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          notes: `Appointment with emergency contact: ${contact.name} (${contact.phone_number})\n\nAdditional notes: ${formData.notes}`,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Appointment Scheduled!",
        description: `Your appointment with ${contact.name} has been scheduled. Please call them to confirm.`,
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Appointment
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">Personal Doctor</p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Phone className="w-3 h-3" />
                  {contact.phone_number}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select 
                    value={formData.appointment_time} 
                    onValueChange={(value) => handleInputChange('appointment_time', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your symptoms or reason for visit..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This will create a reminder for you. Please call {contact.name} at {contact.phone_number} to confirm the appointment.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-primary"
                >
                  {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}