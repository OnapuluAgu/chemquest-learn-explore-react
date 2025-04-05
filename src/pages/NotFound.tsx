
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AtomIcon, Home, BookOpen, Beaker } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the path contains any of the interactive module keywords
  const isInteractiveModulePath = location.pathname.includes('molecule') || 
                                 location.pathname.includes('periodic') || 
                                 location.pathname.includes('chemical');

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="text-center px-4">
          <div className="atom-icon flex justify-center mb-6">
            <AtomIcon className="h-24 w-24 text-chemistry-purple animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold mb-4 text-chemistry-purple">404</h1>
          <p className="text-2xl font-semibold mb-2">Experiment Not Found</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {isInteractiveModulePath 
              ? "The interactive module you're looking for might be missing an ID or hasn't been created yet."
              : "The page you're looking for doesn't exist in our lab. Let's get you back to a safe compound."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-chemistry-purple hover:bg-chemistry-blue">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Return to Home</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Browse Courses</span>
              </Link>
            </Button>
            
            {isInteractiveModulePath && (
              <Button asChild variant="outline" className="border-chemistry-purple text-chemistry-purple">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  <span>View Dashboard</span>
                </Link>
              </Button>
            )}
          </div>
          
          {isInteractiveModulePath && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-lg mx-auto">
              <h3 className="font-medium text-gray-800 mb-2">Looking for interactive modules?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Try accessing these modules from the course page or dashboard where they have proper IDs.
              </p>
              <div className="text-xs text-gray-500">
                Path attempted: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
