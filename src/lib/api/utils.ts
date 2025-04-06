
import { supabase, isSupabaseConfigured } from '../supabase';

// Helper function to check if user is authenticated
export const isUserAuthenticated = () => {
  return supabase.auth.getSession().then(({ data }) => !!data.session);
};

// Helper function to determine if we should use mock data
export const shouldUseMockData = async () => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured) {
    console.log('Using mock data (Supabase not configured)');
    return true;
  }

  // Check if user is authenticated
  const isAuthenticated = await isUserAuthenticated();
  if (!isAuthenticated) {
    console.log('Using mock data (User not authenticated)');
    return true;
  }

  return false;
};
