import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Plus, User, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  contact_type: 'personal_doctor' | 'family_member' | 'emergency_service';
  name: string;
  phone_number: string;
  relationship?: string;
}

export default function Emergency() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    contact_type: 'personal_doctor' | 'family_member' | 'emergency_service';
    name: string;
    phone_number: string;
    relationship: string;
  }>({
    contact_type: 'family_member',
    name: '',
    phone_number: '',
    relationship: ''
  });

  useEffect(() => {
    if (user) {
      fetchEmergencyContacts();
    }
  }, [user]);

  const fetchEmergencyContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('contact_type');

      if (error) throw error;
      setContacts((data || []) as EmergencyContact[]);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch emergency contacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    if (!formData.name || !formData.phone_number) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingContact) {
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            contact_type: formData.contact_type,
            name: formData.name,
            phone_number: formData.phone_number,
            relationship: formData.relationship
          })
          .eq('id', editingContact.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user?.id,
            contact_type: formData.contact_type,
            name: formData.name,
            phone_number: formData.phone_number,
            relationship: formData.relationship
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Emergency contact ${editingContact ? 'updated' : 'added'} successfully.`,
      });

      fetchEmergencyContacts();
      resetForm();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Error",
        description: "Failed to save emergency contact.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Emergency contact deleted successfully.",
      });

      fetchEmergencyContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete emergency contact.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      contact_type: 'family_member',
      name: '',
      phone_number: '',
      relationship: ''
    });
    setIsAddingContact(false);
    setEditingContact(null);
  };

  const startEdit = (contact: EmergencyContact) => {
    setFormData({
      contact_type: contact.contact_type,
      name: contact.name,
      phone_number: contact.phone_number,
      relationship: contact.relationship || ''
    });
    setEditingContact(contact);
    setIsAddingContact(true);
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'personal_doctor': return t('emergency.personal_doctor');
      case 'family_member': return t('emergency.family_member');
      case 'emergency_service': return 'Emergency Service';
      default: return type;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'personal_doctor': return 'bg-blue-100 text-blue-800';
      case 'family_member': return 'bg-green-100 text-green-800';
      case 'emergency_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold font-poppins text-primary">
          {t('emergency.contacts')}
        </h1>
        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              {t('emergency.add_contact')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Edit Contact' : t('emergency.add_contact')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Contact Type</Label>
                <Select 
                  value={formData.contact_type} 
                  onValueChange={(value: any) => setFormData({...formData, contact_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal_doctor">{t('emergency.personal_doctor')}</SelectItem>
                    <SelectItem value="family_member">{t('emergency.family_member')}</SelectItem>
                    <SelectItem value="emergency_service">Emergency Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('emergency.name')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>{t('emergency.phone')}</Label>
                <Input
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              {formData.contact_type === 'family_member' && (
                <div>
                  <Label>{t('emergency.relationship')}</Label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    placeholder="e.g., Father, Mother, Spouse"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveContact} className="flex-1 bg-gradient-primary">
                  {t('common.save')}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Emergency Numbers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleCall('108')}
                className="bg-red-600 hover:bg-red-700 text-white h-16"
              >
                <Phone className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-bold">{t('emergency.ambulance')}</div>
                  <div className="text-sm opacity-90">108</div>
                </div>
              </Button>
              <Button
                onClick={() => handleCall('100')}
                variant="outline"
                className="border-red-300 text-red-700 h-16"
              >
                <Phone className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-bold">Police</div>
                  <div className="text-sm">100</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Contacts */}
      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 2) * 0.1 }}
          >
            <Card className="hover:shadow-medical transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getContactTypeColor(contact.contact_type)}>
                          {getContactTypeLabel(contact.contact_type)}
                        </Badge>
                        {contact.relationship && (
                          <span className="text-sm text-muted-foreground">
                            {contact.relationship}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(contact.phone_number)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(contact)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {contacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Phone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No emergency contacts</h2>
          <p className="text-muted-foreground mb-4">
            Add your emergency contacts for quick access during urgent situations.
          </p>
          <Button onClick={() => setIsAddingContact(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            {t('emergency.add_contact')}
          </Button>
        </motion.div>
      )}
    </div>
  );
}