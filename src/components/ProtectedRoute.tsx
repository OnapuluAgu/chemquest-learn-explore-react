
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isSupabaseReady } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Protected route auth state:", { 
      user, 
      isLoading, 
      isSupabaseReady,
      path: location.pathname 
    });
  }, [user, isLoading, isSupabaseReady, location.pathname]);

  // Show a message if Supabase is not configured
  if (!isSupabaseReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 max-w-lg">
          <p className="font-bold">Supabase Configuration Missing</p>
          <p>Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable authentication.</p>
        </div>
        <p className="mb-4 text-lg">The application can still be viewed, but authentication features will not work.</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-chemistry-purple text-white rounded hover:bg-chemistry-blue transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

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
