import { createClient } from "@supabase/supabase-js";

/**
 * Crée un client Supabase
 * À utiliser dans chaque app avec ses propres variables d'environnement
 * 
 * @example
 * // Dans Next.js
 * const supabase = createSupabaseClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 * );
 * 
 * // Dans React Native
 * const supabase = createSupabaseClient(
 *   Constants.expoConfig?.extra?.supabaseUrl,
 *   Constants.expoConfig?.extra?.supabaseAnonKey
 * );
 */
export function createSupabaseClient(url: string, anonKey: string) {
  if (!url || !anonKey) {
    throw new Error("Missing Supabase credentials. Please provide url and anonKey.");
  }

  return createClient(url, anonKey);
}

// Type pour le client Supabase
export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
