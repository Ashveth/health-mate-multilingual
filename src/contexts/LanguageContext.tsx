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
    
    // Auth
    'auth.login_required': 'Please log in to access this feature',
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    
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
    
    // Sidebar
    'sidebar.ai_assistant': 'AI Assistant',
    'sidebar.chat_desc': 'Chat with health AI',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.dashboard_desc': 'Health overview',
    'sidebar.appointments': 'Appointments',
    'sidebar.appointments_desc': 'Manage bookings',
    'sidebar.find_doctors': 'Find Doctors',
    'sidebar.doctors_desc': 'Browse specialists',
    'sidebar.emergency': 'Emergency',
    'sidebar.emergency_desc': 'Urgent care',
    'sidebar.health_status': 'Health Status',
    'sidebar.all_systems_normal': 'All systems normal',
    'sidebar.online': 'Online',
    
    // Find Doctors Page
    'doctors.title': 'Find Doctors Near You',
    'doctors.location_prompt': 'Get location access or enter your area to find nearby doctors',
    'doctors.use_my_location': 'Use My Location',
    'doctors.getting_location': 'Getting Location...',
    'doctors.enter_location': 'Enter your city or area (e.g., Mumbai, Delhi)',
    'doctors.find_nearby_btn': 'Find Nearby',
    'doctors.searching': 'Searching...',
    'doctors.location_found': 'Location Found',
    'doctors.showing_near': 'Now showing doctors near',
    'doctors.location_not_found': 'Location Not Found',
    'doctors.try_different': 'Please try a different location or be more specific',
    'doctors.showing_nearby': 'Showing doctors near your location • Sorted by distance',
    'doctors.search_placeholder': 'Search by name, specialization, or location...',
    'doctors.loading': 'Loading doctors...',
    'doctors.years_experience': 'years experience',
    'doctors.km_away': 'km away',
    'doctors.no_doctors': 'No doctors found',
    'doctors.no_doctors_desc': 'I couldn\'t find any doctors matching your request. Please try another search or contact support.',
    'doctors.try_search': 'Try searching for:',
    'doctors.specialization': 'Specialization: "cardiologist", "pediatrician"',
    'doctors.doctor_name': 'Doctor name: "Dr. Smith"',
    'doctors.location_example': 'Location: "Mumbai", "Delhi"',
    
    // Appointments Page
    'appointments.book_new': 'Book New',
    'appointments.no_appointments': 'No appointments yet',
    'appointments.book_first': 'Book your first appointment with a doctor.',
    'appointments.book_appointment': 'Book Appointment',
    'appointments.reschedule': 'Reschedule',
    'appointments.cancel': 'Cancel',
    'appointments.cancelled': 'Appointment Cancelled',
    'appointments.cancelled_desc': 'Your appointment has been cancelled successfully.',
    
    // Emergency Page  
    'emergency.emergency_services': 'Emergency Services',
    'emergency.police': 'Police',
    'emergency.no_contacts': 'No emergency contacts',
    'emergency.add_contacts_desc': 'Add your emergency contacts for quick access during urgent situations.',
    'emergency.edit_contact': 'Edit Contact',
    'emergency.contact_type': 'Contact Type',
    'emergency.emergency_service': 'Emergency Service',
    'emergency.enter_name': 'Enter name',
    'emergency.enter_phone': '+91-XXXXXXXXXX',
    'emergency.relationship_eg': 'e.g., Father, Mother, Spouse',
    'emergency.contact_saved': 'Emergency contact saved successfully',
    'emergency.contact_deleted': 'Emergency contact deleted successfully',
    'emergency.book': 'Book',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.chat': 'AI चैट',
    'nav.doctors': 'डॉक्टर खोजें',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.emergency': 'आपातकाल',
    'nav.settings': 'सेटिंग्स',
    
    // Auth
    'auth.login_required': 'कृपया इस सुविधा का उपयोग करने के लिए लॉग इन करें',
    'auth.sign_in': 'साइन इन करें',
    'auth.sign_up': 'साइन अप करें',
    
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
    
    // Emergency
    'emergency.contacts': 'आपातकालीन संपर्क',
    'emergency.ambulance': 'एम्बुलेंस',
    'emergency.add_contact': 'आपातकालीन संपर्क जोड़ें',
    'emergency.personal_doctor': 'निजी डॉक्टर',
    'emergency.family_member': 'परिवारजन',
    'emergency.name': 'नाम',
    'emergency.phone': 'फोन नंबर',
    'emergency.relationship': 'रिश्ता',
    
    // Settings
    'settings.profile': 'प्रोफाइल सेटिंग्स',
    'settings.language': 'भाषा',
    'settings.notifications': 'सूचनाएं',
    'settings.full_name': 'पूरा नाम',
    'settings.email': 'ईमेल',
    'settings.phone': 'फोन नंबर',
    'settings.location': 'स्थान',
    
    // Sidebar
    'sidebar.ai_assistant': 'AI सहायक',
    'sidebar.chat_desc': 'स्वास्थ्य AI के साथ चैट करें',
    'sidebar.dashboard': 'डैशबोर्ड',
    'sidebar.dashboard_desc': 'स्वास्थ्य अवलोकन',
    'sidebar.appointments': 'अपॉइंटमेंट',
    'sidebar.appointments_desc': 'बुकिंग प्रबंधित करें',
    'sidebar.find_doctors': 'डॉक्टर खोजें',
    'sidebar.doctors_desc': 'विशेषज्ञों को ब्राउज़ करें',
    'sidebar.emergency': 'आपातकाल',
    'sidebar.emergency_desc': 'तत्काल देखभाल',
    'sidebar.health_status': 'स्वास्थ्य स्थिति',
    'sidebar.all_systems_normal': 'सभी सिस्टम सामान्य',
    'sidebar.online': 'ऑनलाइन',
    
    // Find Doctors Page
    'doctors.title': 'अपने आस-पास डॉक्टर खोजें',
    'doctors.location_prompt': 'अपने आस-पास के डॉक्टर खोजने के लिए लोकेशन एक्सेस दें या अपना क्षेत्र दर्ज करें',
    'doctors.use_my_location': 'मेरा स्थान उपयोग करें',
    'doctors.getting_location': 'स्थान प्राप्त कर रहे हैं...',
    'doctors.enter_location': 'अपना शहर या क्षेत्र दर्ज करें (जैसे, मुंबई, दिल्ली)',
    'doctors.find_nearby_btn': 'नजदीकी खोजें',
    'doctors.searching': 'खोज रहे हैं...',
    'doctors.location_found': 'स्थान मिला',
    'doctors.showing_near': 'अब दिखा रहे हैं डॉक्टर के पास',
    'doctors.location_not_found': 'स्थान नहीं मिला',
    'doctors.try_different': 'कृपया एक अलग स्थान आज़माएं या अधिक विशिष्ट रहें',
    'doctors.showing_nearby': 'आपके स्थान के पास डॉक्टर दिखा रहे हैं • दूरी के अनुसार क्रमबद्ध',
    'doctors.search_placeholder': 'नाम, विशेषज्ञता, या स्थान से खोजें...',
    'doctors.loading': 'डॉक्टर लोड हो रहे हैं...',
    'doctors.years_experience': 'साल का अनुभव',
    'doctors.km_away': 'किमी दूर',
    'doctors.no_doctors': 'कोई डॉक्टर नहीं मिला',
    'doctors.no_doctors_desc': 'मुझे आपके अनुरोध से मेल खाने वाले कोई डॉक्टर नहीं मिले। कृपया दूसरी खोज आज़माएं या समर्थन से संपर्क करें।',
    'doctors.try_search': 'खोजने का प्रयास करें:',
    'doctors.specialization': 'विशेषज्ञता: "हृदय रोग विशेषज्ञ", "बाल रोग विशेषज्ञ"',
    'doctors.doctor_name': 'डॉक्टर का नाम: "डॉ. स्मिथ"',
    'doctors.location_example': 'स्थान: "मुंबई", "दिल्ली"',
    
    // Appointments Page
    'appointments.book_new': 'नया बुक करें',
    'appointments.no_appointments': 'अभी तक कोई अपॉइंटमेंट नहीं',
    'appointments.book_first': 'किसी डॉक्टर के साथ अपना पहला अपॉइंटमेंट बुक करें।',
    'appointments.book_appointment': 'अपॉइंटमेंट बुक करें',
    'appointments.reschedule': 'पुनर्निर्धारित करें',
    'appointments.cancel': 'रद्द करें',
    'appointments.cancelled': 'अपॉइंटमेंट रद्द',
    'appointments.cancelled_desc': 'आपका अपॉइंटमेंट सफलतापूर्वक रद्द कर दिया गया है।',
    
    // Emergency Page
    'emergency.emergency_services': 'आपातकालीन सेवाएं',
    'emergency.police': 'पुलिस',
    'emergency.no_contacts': 'कोई आपातकालीन संपर्क नहीं',
    'emergency.add_contacts_desc': 'आपात स्थितियों के दौरान त्वरित पहुंच के लिए अपने आपातकालीन संपर्क जोड़ें।',
    'emergency.edit_contact': 'संपर्क संपादित करें',
    'emergency.contact_type': 'संपर्क प्रकार',
    'emergency.emergency_service': 'आपातकालीन सेवा',
    'emergency.enter_name': 'नाम दर्ज करें',
    'emergency.enter_phone': '+91-XXXXXXXXXX',
    'emergency.relationship_eg': 'जैसे, पिता, माता, जीवनसाथी',
    'emergency.contact_saved': 'आपातकालीन संपर्क सफलतापूर्वक सहेजा गया',
    'emergency.contact_deleted': 'आपातकालीन संपर्क सफलतापूर्वक हटाया गया',
    'emergency.book': 'बुक करें',
  },
  ta: {
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.chat': 'AI அரட்டை',
    'nav.doctors': 'டாக்டரைக் கண்டறியவும்',
    'nav.appointments': 'சந்திப்புகள்',
    'nav.emergency': 'அவசரநிலை',
    'nav.settings': 'அமைப்புகள்',
    'auth.login_required': 'இந்த அம்சத்தைப் பயன்படுத்த தயவு செய்து உள்நுழையவும்',
    'common.loading': 'ஏற்றுகிறது...',
    'common.search': 'தேடல்',
    'doctors.find_nearby': 'அருகிலுள்ள டாக்டர்களைக் கண்டுபிடிக்கவும்',
    'emergency.contacts': 'அவசரகால தொடர்புகள்',
    'settings.profile': 'சுயவிவர அமைப்புகள்',
  },
  te: {
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.chat': 'AI చాట్',
    'nav.doctors': 'డాక్టర్‌ను కనుగొనండి',
    'nav.appointments': 'అపాయింట్మెంట్లు',
    'nav.emergency': 'అత్యవసర',
    'nav.settings': 'సెట్టింగులు',
    'auth.login_required': 'దయచేసి ఈ ఫీచర్‌ని ఉపయోగించడానికి లాగిన్ చేయండి',
    'common.loading': 'లోడవుతోంది...',
    'common.search': 'వెతకండి',
    'doctors.find_nearby': 'సమీపంలోని డాక్టర్లను కనుగొనండి',
    'emergency.contacts': 'అత్యవసర పరిచయాలు',
    'settings.profile': 'ప్రొఫైల్ సెట్టింగులు',
  },
  kn: {
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.chat': 'AI ಚಾಟ್',
    'nav.doctors': 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ',
    'nav.appointments': 'ನೇಮಕಾತಿಗಳು',
    'nav.emergency': 'ತುರ್ತು',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'auth.login_required': 'ದಯವಿಟ್ಟು ಈ ಫೀಚರ್ ಬಳಸಲು ಲಾಗಿನ್ ಮಾಡಿ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.search': 'ಹುಡುಕಿ',
    'doctors.find_nearby': 'ಹತ್ತಿರದ ವೈದ್ಯರನ್ನು ಹುಡುಕಿ',
    'emergency.contacts': 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    'settings.profile': 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
  },
  bn: {
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.chat': 'AI চ্যাট',
    'nav.doctors': 'ডাক্তার খুঁজুন',
    'nav.appointments': 'অ্যাপয়েন্টমেন্ট',
    'nav.emergency': 'জরুরি',
    'nav.settings': 'সেটিংস',
    'auth.login_required': 'এই ফিচারটি ব্যবহার করতে অনুগ্রহ করে লগইন করুন',
    'common.loading': 'লোড হচ্ছে...',
    'common.search': 'অনুসন্ধান',
    'doctors.find_nearby': 'কাছাকাছি ডাক্তার খুঁজুন',
    'emergency.contacts': 'জরুরি যোগাযোগ',
    'settings.profile': 'প্রোফাইল সেটিংস',
  },
  mr: {
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.chat': 'AI चॅट',
    'nav.doctors': 'डॉक्टर शोधा',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.emergency': 'आपत्कालीन',
    'nav.settings': 'सेटिंग्स',
    'auth.login_required': 'कृपया या वैशिष्ट्याचा वापर करण्यासाठी लॉगिन करा',
    'common.loading': 'लोड होत आहे...',
    'common.search': 'शोध',
    'doctors.find_nearby': 'जवळपासचे डॉक्टर शोधा',
    'emergency.contacts': 'आपत्कालीन संपर्क',
    'settings.profile': 'प्रोफाइल सेटिंग्स',
  },
  gu: {
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.chat': 'AI ચેટ',
    'nav.doctors': 'ડૉક્ટર શોધો',
    'nav.appointments': 'એપોઇન્ટમેન્ટ',
    'nav.emergency': 'કટોકટી',
    'nav.settings': 'સેટિંગ્સ',
    'auth.login_required': 'કૃપા કરીને આ ફીચરનો ઉપયોગ કરવા માટે લૉગિન કરો',
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.search': 'શોધ',
    'doctors.find_nearby': 'નજીકના ડૉક્ટરો શોધો',
    'emergency.contacts': 'કટોકટીના સંપર્કો',
    'settings.profile': 'પ્રોફાઈલ સેટિંગ્સ',
  },
  ml: {
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.chat': 'AI ചാറ്റ്',
    'nav.doctors': 'ഡോക്ടറെ കണ്ടെത്തുക',
    'nav.appointments': 'അപ്പോയിന്റ്മെന്റുകൾ',
    'nav.emergency': 'അടിയന്തര',
    'nav.settings': 'സെറ്റിംഗുകൾ',
    'auth.login_required': 'ഈ ഫീച്ചർ ഉപയോഗിക്കാൻ ദയവായി ലോഗിൻ ചെയ്യുക',
    'common.loading': 'ലോഡ് ചെയ്യുന്നു...',
    'common.search': 'തിരയുക',
    'doctors.find_nearby': 'അടുത്തുള്ള ഡോക്ടർമാരെ കണ്ടെത്തുക',
    'emergency.contacts': 'അടിയന്തര കോൺടാക്റ്റുകൾ',
    'settings.profile': 'പ്രൊഫൈൽ സെറ്റിംഗുകൾ',
  },
  pa: {
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.chat': 'AI ਚੈਟ',
    'nav.doctors': 'ਡਾਕਟਰ ਲੱਭੋ',
    'nav.appointments': 'ਮੁਲਾਕਾਤਾਂ',
    'nav.emergency': 'ਐਮਰਜੈਂਸੀ',
    'nav.settings': 'ਸੈਟਿੰਗਾਂ',
    'auth.login_required': 'ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਫੀਚਰ ਦੀ ਵਰਤੋਂ ਲਈ ਲਾਗਿਨ ਕਰੋ',
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.search': 'ਖੋਜ',
    'doctors.find_nearby': 'ਨੇੜਲੇ ਡਾਕਟਰ ਲੱਭੋ',
    'emergency.contacts': 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
    'settings.profile': 'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ',
  }
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