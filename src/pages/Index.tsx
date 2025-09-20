import { useNavigate, useLocation } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { HealthHeader } from "@/components/HealthHeader";
import { HealthDashboard } from "@/components/HealthDashboard";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveView = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/")) return path.substring(1);
    return "dashboard";
  };

  const handleViewChange = (view: string) => {
    if (view === "dashboard") {
      navigate("/");
    } else if (view === "settings") {
      navigate("/settings");
    } else {
      navigate(`/${view}`);
    }
  };

  const renderContent = () => {
    const activeView = getActiveView();
    switch (activeView) {
      case "chat":
        return <ChatInterface />;
      case "dashboard":
        return <HealthDashboard />;
      default:
        return <HealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex">
      <Sidebar activeView={getActiveView()} onViewChange={handleViewChange} />
      
      <div className="flex-1 flex flex-col md:ml-0">
        <HealthHeader />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <motion.div
              key={getActiveView()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
