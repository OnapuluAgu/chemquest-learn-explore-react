
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could add a loading spinner here
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with the return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
