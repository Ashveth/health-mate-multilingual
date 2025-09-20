import { ChatInterface } from "@/components/ChatInterface";
import { HealthHeader } from "@/components/HealthHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <HealthHeader />
      <main className="h-[calc(100vh-140px)]">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
