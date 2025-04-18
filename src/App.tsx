
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { checkSupabaseConfiguration } from "@/lib/supabase";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import ModuleInteractivePage from "./pages/ModuleInteractivePage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Create a new query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Using meta.onError instead of direct onError which is not supported
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log("App rendering, checking Supabase configuration");
    const isConfigured = checkSupabaseConfiguration();
    console.log("Supabase configuration check result:", isConfigured);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/course/:courseId/module/:moduleId" element={
                <ProtectedRoute>
                  <ModuleDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/module/:moduleId" element={
                <ProtectedRoute>
                  <ModuleDetailPage />
                </ProtectedRoute>
              } />
              
              {/* Main interactive module route */}
              <Route path="/module-interactive/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage />
                </ProtectedRoute>
              } />
              
              {/* Route for molecule view */}
              <Route path="/molecule/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="molecule" />
                </ProtectedRoute>
              } />
              
              {/* Route for periodic table */}
              <Route path="/periodic-table/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="periodic-table" />
                </ProtectedRoute>
              } />
              
              {/* Route for chemical reaction */}
              <Route path="/chemical-reaction/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="chemical-reaction" />
                </ProtectedRoute>
              } />
              
              {/* Interactive type routes with better URL patterns */}
              <Route path="/interactive/molecule/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="molecule" />
                </ProtectedRoute>
              } />
              <Route path="/interactive/periodic-table/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="periodic-table" />
                </ProtectedRoute>
              } />
              <Route path="/interactive/chemical-reaction/:interactiveId" element={
                <ProtectedRoute>
                  <ModuleInteractivePage interactiveType="chemical-reaction" />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
