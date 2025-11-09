import { createClient } from '@/lib/supabase/client';

export type UserRole = 'STUDENT' | 'SCHOOL' | 'ASSOCIATION' | 'ADMIN';

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createClient();

  // 1. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', userId)
    .single();

  if (!userProfile) {
    return null;
  }

  return userProfile.role as UserRole;
}

export async function getUserProfileId(userId: string): Promise<string | null> {
  const supabase = createClient();

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  return userProfile?.id || null;
}
