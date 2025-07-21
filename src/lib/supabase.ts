
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  try {
    const supabaseUrl = "https://siefyekwetkywwgaqqhv.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWZ5ZWt3ZXRreXd3Z2FxcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc3NDgsImV4cCI6MjA2NjQ2Mzc0OH0.ZK7J7DrMW_RD5tpJbvr3zmVYpPWyPQpxOBc7Aoa0s2A";

    console.log('Supabase configuration loaded successfully');

    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      console.log('Supabase client created successfully');
    }

    return supabaseClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseClient() !== null;
};
