
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Protected route auth state:", { user, isLoading, path: location.pathname });
  }, [user, isLoading, location.pathname]);

  if (isLoading) {
    // Show loading spinner while auth state is being determined
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        <p className="ml-3 text-chemistry-purple">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    console.log("No authenticated user, redirecting to /auth");
    // Redirect to login page with the return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
