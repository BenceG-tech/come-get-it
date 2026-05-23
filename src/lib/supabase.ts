import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    return supabaseClient;
  } catch {
    return null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseClient() !== null;
};
