🏥 AI HealthMate – Multilingual Public Health Assistant

AI HealthMate is a full-stack, AI-powered public health chatbot that delivers reliable, evidence-based medical assistance using LLMs, Knowledge Graphs, and WHO-verified health data.
It offers doctor discovery, appointment booking, emergency support, multilingual chat, voice features, dashboards, and more — all in one seamless platform.

🚀 Features
🤖 AI Health Chatbot

Multilingual responses (10+ Indian languages)

WHO-verified medical guidance

Medical Knowledge Graph for disease insights

Context-aware conversations (stores last 10 messages)

Markdown-formatted responses

Workflow detection (appointments, doctor search, emergencies)

Safe & validated health responses

🎙️ Voice Features

Speech-to-Text (voice input)

Text-to-Speech (AI voice output)

Auto-read responses

Adjustable TTS speed (0.5× – 2.0×)

🔊 Sound Effects

Message send sound ("whoosh")

Response notification sound

Powered by Web Audio API (no external assets)

⏳ Enhanced Typing Indicator

Bouncing dots animation

“AI is typing…” label

Smooth Framer Motion transitions

📱 User Interface

Fully responsive

Dark/Light mode

Glassmorphism elements

Sidebar navigation

Animated splash screen

👨‍⚕️ Find Doctors

Geolocation-based search

Manual city/area lookup

Distance calculation (Haversine Formula)

Doctor profiles (rating, experience, fee)

Secure contact reveal (post-appointment)

Real-time filters

📅 Appointment Booking

Date & time picker

Doctor-specific booking

Notes for appointment

Status: Scheduled / Completed / Cancelled

Appointment history with rescheduling

🚨 Emergency Services

Quick dial: Ambulance (108), Police (100)

Personal emergency contacts (CRUD)

Book appointments with personal doctor

👤 User Profile & Settings

Personal details

Preferred language

Notification preferences

Voice settings + TTS speed slider

🌍 Multilingual Support (10 Languages)

English, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Malayalam, Punjabi

🔐 Authentication & Security

Email/Password login

Google OAuth

Protected routes

Row Level Security (RLS)

Input sanitization

API rate limiting

📊 Health Dashboard

Health insights

Featured doctors

Daily health tips

WHO outbreak alerts

Quick emergency tools

📋 Medical Disclaimer

WHO, CDC, and medical journal sources

Explanation of verification process

Limitations of AI medical advice

Terms & usage guidelines

🛠️ Tech Stack
Frontend

React • TypeScript • Vite • TailwindCSS • Framer Motion • React Router DOM • TanStack React Query

UI & Components

Radix UI • shadcn/ui • Lucide Icons • Recharts • Embla Carousel • Sonner Toasts • class-variance-authority • tailwind-merge

Backend & Database

Lovable Cloud (Supabase) • PostgreSQL • Supabase Auth • Edge Functions • RLS Policies

AI & NLP

Google Gemini 2.5 Flash • Lovable AI Gateway • Medical Knowledge Graph • WHO Guidelines

Forms & Validation

React Hook Form • Zod • @hookform/resolvers

Utilities

date-fns • React Markdown • cmdk • react-day-picker

🗄️ Database Schema
Tables

profiles — User profiles

doctors — Doctor listings

appointments — Appointment records

emergency_contacts — User emergency contacts

health_alerts — WHO outbreak data

doctor_contact_access_log — Audit log for doctor contact access

Functions

handle_new_user()

get_doctor_info()

user_has_appointment_with_doctor()

log_doctor_contact_access()

🌐 Edge Functions
chat-with-claude

Generates chat responses

WHO integration

Medical knowledge graph

Input validation

Rate limiting

update-health-alerts

Fetches latest WHO outbreak data

Updates database 

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
/auth	Sign In / Sign Up	❌
/profile	User Profile	✅
/doctors	Find Doctors	✅
/appointments	Appointments	✅
/emergency	Emergency	✅
/settings	Settings	✅
/disclaimer	Medical Disclaimer	✅
🔗 Live Links

🌐 Web App : https://health-mate-multilingual.vercel.app/

▶️ Demo Video : https://youtu.be/MvbbQbFw0ak?si=_QkAmXsZZ1vbuR7x

📜 License

MIT License
