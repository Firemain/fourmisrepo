import { createClient } from '@/lib/supabase/client';

export async function checkOnboardingStatus(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  // 1. D'abord récupérer le user_profile correspondant à cet user_id (Supabase Auth)
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (profileError || !userProfile) {
    // Si pas de user_profile, l'onboarding n'est pas complété
    return false;
  }

  // 2. Vérifier si l'utilisateur a un school_member associé
  const { data, error } = await supabase
    .from('school_members')
    .select('id')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (error) {
    // Si pas trouvé, l'onboarding n'est pas complété
    return false;
  }

  // Si trouvé, l'onboarding est complété
  return !!data;
}
