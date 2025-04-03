
import { createClient } from '@supabase/supabase-js';

// Import the configured client from the integration directory
import { supabase as configuredSupabase } from '@/integrations/supabase/client';

// Export the already configured Supabase client
export const supabase = configuredSupabase;

// Flag to check if Supabase is properly configured
export const isSupabaseConfigured = true;

// Function to check if Supabase is configured
export const checkSupabaseConfiguration = () => {
  console.log("Using configured Supabase client from integration");
  return true;
};
