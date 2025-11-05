import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@fourmis/types";
import type { SupabaseClient } from "../supabase";

/**
 * Hook pour récupérer le profil de l'utilisateur connecté
 * @param supabase - Instance du client Supabase (doit être passée depuis l'app)
 */
export const useProfile = (supabase: SupabaseClient) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return data as Profile;
    },
  });
};
