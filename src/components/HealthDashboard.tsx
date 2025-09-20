import { motion } from "framer-motion";
import { Activity, Heart, Users, TrendingUp, Clock, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DiseaseOutbreakAlert } from "@/components/DiseaseOutbreakAlert";
import heroImage from "@/assets/hero-medical.jpg";
import healthIcons from "@/assets/health-icons.jpg";
import doctorFemale from "@/assets/doctor-female.jpg";
import doctorMale from "@/assets/doctor-male.jpg";

const healthStats = [
  { icon: Heart, label: "Health Score", value: "92%", trend: "+5%", color: "text-primary" },
  { icon: Activity, label: "Active Users", value: "12,847", trend: "+12%", color: "text-accent" },
  { icon: Users, label: "Consultations", value: "5,234", trend: "+8%", color: "text-primary" },
  { icon: TrendingUp, label: "Recovery Rate", value: "96%", trend: "+2%", color: "text-accent" },
];

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Cardiology",
    rating: 4.9,
    experience: "15+ years",
    image: doctorFemale,
    available: true,
    nextSlot: "2:00 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Kumar",
    specialty: "General Medicine",
    rating: 4.8,
    experience: "12+ years", 
    image: doctorMale,
    available: true,
    nextSlot: "3:30 PM"
  },
];

const healthTips = [
  {
    title: "Stay Hydrated",
    description: "Drink 8-10 glasses of water daily for optimal health.",
    category: "Wellness"
  },
  {
    title: "Regular Exercise",
    description: "30 minutes of moderate exercise can boost your immunity.",
    category: "Fitness"
  },
  {
    title: "Balanced Diet",
    description: "Include fruits, vegetables, and proteins in every meal.",
    category: "Nutrition"
  }
];

export const HealthDashboard = () => {
  return (
    <div className="space-y-8 font-inter">
      {/* Disease Outbreak Alerts */}
      <DiseaseOutbreakAlert />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-2xl overflow-hidden shadow-medical"
      >
        <img 
          src={heroImage} 
          alt="Medical professionals" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
          <div className="p-8 text-white max-w-2xl">
            <h2 className="text-3xl font-bold font-poppins mb-2">
              Your Health, Our Priority
            </h2>
            <p className="text-lg opacity-90 mb-4">
              Get personalized health insights and connect with top medical professionals
            </p>
            <Button className="bg-white text-primary hover:bg-white/90">
              Start Health Assessment
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-medical transition-all duration-300 border-primary-light/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-poppins">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Doctors Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card border-primary-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Users className="w-5 h-5 text-primary" />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-primary-light/30 bg-gradient-bg hover:shadow-medical transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary-light">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(3)}.{doctor.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold font-poppins text-lg">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">({doctor.experience})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {doctor.available && (
                        <>
                          <Badge className="bg-primary-light text-primary-dark mb-2">
                            Available
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {doctor.nextSlot}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-primary hover:shadow-medical">
                    Book Consultation
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-card border-primary-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <img src={healthIcons} alt="Health tips" className="w-6 h-6 rounded" />
              Daily Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-lg bg-gradient-bg border border-accent-light/30 hover:shadow-card transition-all"
                >
                  <Badge variant="outline" className="mb-3 border-accent text-accent">
                    {tip.category}
                  </Badge>
                  <h4 className="font-semibold font-poppins mb-2">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold font-poppins text-red-800 mb-1">
                  Emergency Services
                </h3>
                <p className="text-sm text-red-600">
                  24/7 emergency medical assistance available
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="destructive" 
                  className="bg-red-600 hover:bg-red-700"
                >
                  Call Emergency
                </Button>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Hospital
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};