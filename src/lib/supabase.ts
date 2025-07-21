
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('Environment variables check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables are not configured');
      return null;
    }

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
