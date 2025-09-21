import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-bg">
      <div className="text-center p-8">
        <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-medical">
          <span className="text-4xl text-white">🏥</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-primary">Page Not Found</h1>
        <p className="mb-6 text-xl text-muted-foreground max-w-md mx-auto">
          Don't worry! Our health assistant is here to help you find what you need.
        </p>
        <div className="space-y-3">
          <a 
            href="/" 
            className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-medical transition-all"
          >
            Return to Health Dashboard
          </a>
          <p className="text-sm text-muted-foreground">
            You can also ask our AI assistant for help with appointments, finding doctors, or health questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
