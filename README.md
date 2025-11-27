🏥 AI HealthMate – Multilingual Public Health Assistant

AI HealthMate is a full-stack, AI-powered, multilingual public health chatbot that empowers users with reliable, evidence-based health guidance using LLMs, Knowledge Graphs, and WHO-verified information.
It provides medical assistance, doctor discovery, appointment booking, emergency support, and multilingual communication — all in one seamless platform.

🚀 Features
🤖 AI Health Chatbot

Multilingual responses (10+ Indian languages)

WHO-verified guidance

Medical Knowledge Graph for disease data

Context-aware conversations (keeps last 10 messages)

Markdown-formatted responses

Workflow detection (appointment booking, doctor search, emergency)

Safe & validated medical responses

🎙️ Voice Features

Speech-to-Text (voice input)

Text-to-Speech (voice output)

Auto-read responses

Adjustable TTS speed (0.5× – 2.0×)

🔊 Sound Effects

Message send sound (“whoosh”)

Response sound notification

Built using Web Audio API (no external assets)

⏳ Enhanced Typing Indicator

Bouncing dots animation

“AI is typing…” display

Smooth Framer Motion transitions

📱 User Interface

Responsive — works on all devices

Dark/Light theme support

Glassmorphism UI

Sidebar navigation

Animated splash screen

👨‍⚕️ Find Doctors

Geolocation-based search

Manual city/area search

Distance calculation using Haversine Formula

Doctor profiles (rating, experience, fee)

Secure contact reveal (after valid appointment)

Real-time filters

📅 Appointment Booking

Date & time picker

Doctor-specific booking

Appointment notes

Status states: Scheduled / Completed / Cancelled

Appointment history + rescheduling

🚨 Emergency Services

Quick dial: Ambulance (108), Police (100)

Personal emergency contacts

CRUD for contacts

Book appointments with personal doctor

👤 User Profile & Settings

Personal information

Language preferences

Notifications (tips, alerts, reminders)

Voice settings + speech rate slider

🌍 Multilingual Support (10 Languages)

English

Hindi

Tamil

Telugu

Kannada

Bengali

Marathi

Gujarati

Malayalam

Punjabi

🔐 Authentication & Security

Email/Password auth

Google OAuth

Protected routes

Row Level Security (RLS)

Input sanitization

API rate limiting

📊 Health Dashboard

Health statistics

Featured doctors

Daily health tips

Outbreak alerts (WHO-sourced)

Emergency quick access

📋 Medical Disclaimer

Data sources (WHO, CDC, medical journals)

Verification process

AI limitations & safety warnings

Terms of use

🛠️ Tech Stack
Frontend
Technology	Version	Purpose
React	18.3.1	UI Framework
TypeScript	5.8.3	Type-safe development
Vite	5.4.19	Build tooling
TailwindCSS	3.4.17	Styling
Framer Motion	12.23.16	Animations
React Router DOM	6.30.1	Routing
TanStack React Query	5.83.0	Server state

UI & Components

Radix UI

shadcn/ui

Lucide Icons

Recharts

Embla Carousel

Sonner Toasts

class-variance-authority

tailwind-merge

Backend & Database
Technology	Purpose
Lovable Cloud (Supabase)	Backend
PostgreSQL	Database
Supabase Auth	Authentication
Edge Functions	Serverless logic
RLS Policies	Data access control
AI & NLP
Technology	Purpose
Google Gemini 2.5 Flash	Primary AI model
Lovable AI Gateway	Model management
Medical Knowledge Graph	Structured medical data
WHO Guidelines	Verified medical information
Forms & Validation

React Hook Form

Zod

@hookform/resolvers

Utilities

date-fns

React Markdown

cmdk

react-day-picker

🗄️ Database Schema
Tables
Table	Purpose
profiles	User profiles
doctors	Doctor listings
appointments	Bookings
emergency_contacts	Emergency contacts
health_alerts	WHO outbreak data
doctor_contact_access_log	Access audits
Functions

handle_new_user()

get_doctor_info()

user_has_appointment_with_doctor()

log_doctor_contact_access()

🌐 Edge Functions
chat-with-claude

Chat response generation

WHO integration

Knowledge graph

Input validation

Rate limiting

update-health-alerts

Fetches & updates disease outbreak data

📁 Project Structure
src/
├── components/
│   ├── ui/
│   ├── ChatInterface.tsx
│   ├── HealthDashboard.tsx
│   ├── HealthHeader.tsx
│   ├── Sidebar.tsx
│   ├── AppointmentBooking.tsx
│   ├── DiseaseOutbreakAlert.tsx
│   ├── EmergencyContactBooking.tsx
│   ├── LanguageSelector.tsx
│   ├── LoadingAnimation.tsx
│   └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.tsx
│   ├── useSpeechRecognition.ts
│   ├── useTextToSpeech.ts
│   ├── useSound.ts
│   ├── useRateLimit.ts
│   └── use-mobile.tsx
├── contexts/
│   └── LanguageContext.tsx
├── pages/
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── Profile.tsx
│   ├── FindDoctors.tsx
│   ├── Appointments.tsx
│   ├── Emergency.tsx
│   ├── Settings.tsx
│   ├── MedicalDisclaimer.tsx
│   └── NotFound.tsx
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
└── assets/

🚀 App Routes
Route	Page	Auth
/	Dashboard	✅
/chat	AI Chat	✅
/auth	Sign in / Sign up	❌
/profile	User profile	✅
/doctors	Find doctors	✅
/appointments	Appointments	✅
/emergency	Emergency	✅
/settings	Settings	✅
/disclaimer	Medical disclaimer	✅
🔗 Live Links

🌐 Web App: https://health-mate-multilingual.vercel.app/

▶️ Demo Video : https://youtu.be/MvbbQbFw0ak?si=QsVcm2PKWu6rjBqf 

📜 License

MIT License
