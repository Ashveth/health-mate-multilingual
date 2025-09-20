import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'bn' | 'mr' | 'gu' | 'ml' | 'pa';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'AI Chat',
    'nav.doctors': 'Find Doctor',
    'nav.appointments': 'Appointments',
    'nav.emergency': 'Emergency',
    'nav.settings': 'Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.call': 'Call',
    'common.book': 'Book',
    'common.emergency': 'Emergency',
    
    // Health Dashboard
    'dashboard.welcome': 'Welcome to AI HealthMate',
    'dashboard.health_score': 'Health Score',
    'dashboard.steps': 'Steps Today',
    'dashboard.water': 'Water Intake',
    'dashboard.sleep': 'Sleep Hours',
    'dashboard.nearby_doctors': 'Nearby Doctors',
    'dashboard.health_tips': 'Health Tips',
    
    // Chat
    'chat.placeholder': 'Ask about your health concerns...',
    'chat.send': 'Send',
    'chat.ai_thinking': 'AI is thinking...',
    
    // Doctors
    'doctors.find_nearby': 'Find Nearby Doctors',
    'doctors.location_access': 'Allow location access to find doctors near you',
    'doctors.enable_location': 'Enable Location',
    'doctors.experience': 'years experience',
    'doctors.consultation_fee': 'Consultation Fee',
    'doctors.book_appointment': 'Book Appointment',
    
    // Appointments
    'appointments.my_appointments': 'My Appointments',
    'appointments.date': 'Date',
    'appointments.time': 'Time',
    'appointments.doctor': 'Doctor',
    'appointments.status': 'Status',
    'appointments.notes': 'Notes',
    
    // Emergency
    'emergency.contacts': 'Emergency Contacts',
    'emergency.ambulance': 'Ambulance',
    'emergency.add_contact': 'Add Emergency Contact',
    'emergency.personal_doctor': 'Personal Doctor',
    'emergency.family_member': 'Family Member',
    'emergency.name': 'Name',
    'emergency.phone': 'Phone Number',
    'emergency.relationship': 'Relationship',
    
    // Settings
    'settings.profile': 'Profile Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.emergency_contacts': 'Emergency Contacts',
    'settings.full_name': 'Full Name',
    'settings.email': 'Email',
    'settings.phone': 'Phone Number',
    'settings.location': 'Location',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.chat': 'AI चैट',
    'nav.doctors': 'डॉक्टर खोजें',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.emergency': 'आपातकाल',
    'nav.settings': 'सेटिंग्स',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.search': 'खोजें',
    'common.call': 'कॉल करें',
    'common.book': 'बुक करें',
    'common.emergency': 'आपातकाल',
    
    // Health Dashboard
    'dashboard.welcome': 'AI हेल्थमेट में आपका स्वागत है',
    'dashboard.health_score': 'स्वास्थ्य स्कोर',
    'dashboard.steps': 'आज के कदम',
    'dashboard.water': 'पानी का सेवन',
    'dashboard.sleep': 'नींद के घंटे',
    'dashboard.nearby_doctors': 'नजदीकी डॉक्टर',
    'dashboard.health_tips': 'स्वास्थ्य सुझाव',
    
    // Chat
    'chat.placeholder': 'अपनी स्वास्थ्य समस्याओं के बारे में पूछें...',
    'chat.send': 'भेजें',
    'chat.ai_thinking': 'AI सोच रहा है...',
    
    // Doctors
    'doctors.find_nearby': 'नजदीकी डॉक्टर खोजें',
    'doctors.location_access': 'अपने आस-पास के डॉक्टर खोजने के लिए लोकेशन एक्सेस दें',
    'doctors.enable_location': 'लोकेशन चालू करें',
    'doctors.experience': 'साल का अनुभव',
    'doctors.consultation_fee': 'परामर्श शुल्क',
    'doctors.book_appointment': 'अपॉइंटमेंट बुक करें',
    
    // And more translations...
  },
  // Add more language translations as needed
  ta: {
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.chat': 'AI அரட்டை',
    'nav.doctors': 'டாக்டரைக் கண்டறியவும்',
    'nav.appointments': 'சந்திப்புகள்',
    'nav.emergency': 'அவசரநிலை',
    'nav.settings': 'அமைப்புகள்',
    // Add more Tamil translations
  },
  te: {
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.chat': 'AI చాట్',
    'nav.doctors': 'డాక్టర్‌ను కనుగొనండి',
    'nav.appointments': 'అపాయింట్మెంట్లు',
    'nav.emergency': 'అత్యవసర',
    'nav.settings': 'సెట్టింగులు',
    // Add more Telugu translations
  },
  // Add more languages: kn, bn, mr, gu, ml, pa
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('healthmate-language') as SupportedLanguage;
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('healthmate-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
] as const;