
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AtomIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="text-center px-4">
          <div className="molecule-icon animate-float mx-auto mb-6">
            <div className="atom atom-1"></div>
            <div className="atom atom-2"></div>
            <div className="atom atom-3"></div>
            <div className="bond bond-1"></div>
            <div className="bond bond-2"></div>
          </div>
          <h1 className="text-6xl font-bold mb-4 text-chemistry-purple">404</h1>
          <p className="text-2xl font-semibold mb-2">Experiment Not Found</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The molecule you're looking for doesn't exist in our lab. Let's get you back to a stable compound.
          </p>
          <Button asChild className="bg-chemistry-purple hover:bg-chemistry-blue">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
