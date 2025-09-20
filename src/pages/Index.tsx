import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { HealthHeader } from "@/components/HealthHeader";
import { HealthDashboard } from "@/components/HealthDashboard";
import { Sidebar } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "chat":
        return <ChatInterface />;
      case "dashboard":
        return <HealthDashboard />;
      case "appointments":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "doctors":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Find Doctors</h2>
            <p className="text-muted-foreground">Doctor directory coming soon...</p>
          </div>
        );
      default:
        return <HealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col md:ml-0">
        <HealthHeader />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
