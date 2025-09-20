import { motion } from "framer-motion";
import { Heart, Shield, Users, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export const HealthHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-gradient-bg border-b border-primary-light/20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-medical">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-poppins">AI HealthMate</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
            </div>
          </motion.div>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Badge className="bg-primary-light text-primary-dark border-primary-light">
              <Shield className="w-3 h-3 mr-1" />
              Secure & Private
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="flex gap-3 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button variant="outline" size="sm" className="text-xs hover:bg-accent-light/10">
            <Users className="w-3 h-3 mr-1" />
            Find Doctors
          </Button>
          <Button variant="outline" size="sm" className="text-xs hover:bg-accent-light/10">
            <Calendar className="w-3 h-3 mr-1" />
            Book Appointment
          </Button>
          <Badge variant="secondary" className="text-xs">
            Multilingual Support
          </Badge>
        </motion.div>
      </div>
    </header>
  );
};