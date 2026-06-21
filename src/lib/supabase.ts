// DEPRECATED: használd a `@/integrations/supabase/client`-et közvetlenül.
// Ez a wrapper most már ugyanazt a singletont adja vissza, hogy ne legyen
// két GoTrueClient instance (ami "Something went wrong" hibát okozott mobilon).
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseClient = (): SupabaseClient | null => supabase as unknown as SupabaseClient;

export const isSupabaseConfigured = (): boolean => true;
