import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Activity, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  Phone,
  Heart,
  Menu,
  X,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const sidebarItems = [
  { 
    id: "chat", 
    label: "AI Assistant", 
    icon: MessageCircle, 
    badge: "AI",
    description: "Chat with health AI"
  },
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: Activity, 
    description: "Health overview"
  },
  { 
    id: "appointments", 
    label: "Appointments", 
    icon: Calendar,
    badge: "3",
    description: "Manage bookings"
  },
  { 
    id: "doctors", 
    label: "Find Doctors", 
    icon: Users,
    description: "Browse specialists"
  },
  { 
    id: "records", 
    label: "Health Records", 
    icon: FileText,
    description: "Medical history"
  },
  { 
    id: "emergency", 
    label: "Emergency", 
    icon: Phone,
    description: "Urgent care"
  },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background shadow-medical"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 0 : 280,
          opacity: isCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-primary-light/20 shadow-card z-40 overflow-hidden",
          "md:relative md:opacity-100",
          isCollapsed && "md:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-primary-light/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-medical">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1"
                  >
                    <h2 className="text-lg font-bold font-poppins text-primary">
                      HealthMate
                    </h2>
                    <p className="text-xs text-muted-foreground">AI Health Assistant</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={activeView === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left p-3 h-auto transition-all duration-200",
                    activeView === item.id 
                      ? "bg-gradient-primary text-white shadow-medical" 
                      : "hover:bg-primary-light/10 hover:shadow-card",
                    isCollapsed && "justify-center px-3"
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isCollapsed ? "" : "mr-3"
                  )} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs opacity-70 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="ml-2 text-xs px-2 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-primary-light/20">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left p-3 h-auto hover:bg-accent-light/10",
                isCollapsed && "justify-center px-3"
              )}
              onClick={() => onViewChange("settings")}
            >
              <Settings className={cn(
                "w-5 h-5 flex-shrink-0",
                isCollapsed ? "" : "mr-3"
              )} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium text-sm"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* Health Status */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 rounded-lg bg-gradient-bg border border-primary-light/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Health Status</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All systems normal
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-primary">Online</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
};