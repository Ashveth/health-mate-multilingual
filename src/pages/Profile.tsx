import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Settings, Heart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const healthStats = [
    { icon: Heart, label: "Heart Rate", value: "72 bpm", status: "Normal" },
    { icon: Activity, label: "Steps Today", value: "8,547", status: "Good" },
    { icon: Calendar, label: "Last Checkup", value: "2 weeks ago", status: "Recent" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-poppins text-primary mb-6">My Profile</h1>

        {/* Profile Header */}
        <Card className="shadow-card border-primary-light/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary-light">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold font-poppins mb-2">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.user_metadata?.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.user_metadata.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-gradient-primary"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <Badge className="bg-primary-light text-primary-dark">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Health Statistics */}
        <Card className="shadow-card border-primary-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Activity className="w-5 h-5 text-primary" />
              Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-primary-light/30 bg-gradient-bg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">{stat.label}</h3>
                  </div>
                  <p className="text-2xl font-bold font-poppins mb-1">{stat.value}</p>
                  <Badge variant="secondary" className="text-xs">{stat.status}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card border-primary-light/20">
          <CardHeader>
            <CardTitle className="font-poppins">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/appointments')}>
                <Calendar className="w-4 h-4 mr-2" />
                View Appointments
              </Button>
              <Button variant="outline" onClick={() => navigate('/doctors')}>
                <User className="w-4 h-4 mr-2" />
                Find Doctors
              </Button>
              <Button variant="outline" onClick={() => navigate('/chat')}>
                <Activity className="w-4 h-4 mr-2" />
                Health Assessment
              </Button>
              <Button variant="outline" onClick={() => navigate('/emergency')}>
                <MapPin className="w-4 h-4 mr-2" />
                Emergency Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
