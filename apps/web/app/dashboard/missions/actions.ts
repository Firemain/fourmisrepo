'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all published missions with associations
 */
export async function getMissions(keywords?: string[]) {
  const supabase = await createClient();

  let query = supabase
    .from('missions')
    .select(`
      *,
      association:associations(name)
    `)
    .eq('status', 'PUBLISHED')
    .order('start_at', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching missions:', error);
    return { missions: [], error: error.message };
  }

  // Filter by keywords if provided
  let filteredData = data || [];
  if (keywords && keywords.length > 0) {
    filteredData = filteredData.filter((mission: any) =>
      keywords.some((keyword) =>
        mission.title.toLowerCase().includes(keyword.toLowerCase()) ||
        mission.description?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  return { missions: filteredData, error: null };
}

/**
 * Get student preferences for the current user
 */
export async function getStudentPreferences(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('student_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching preferences:', error);
    return { preferences: null, error: error.message };
  }

  return { preferences: data, error: null };
}

/**
 * Save or update student preferences
 */
export async function saveStudentPreferences(preferences: {
  user_id: string;
  user_profile_id: string;
  interests: string[];
  availability: string | null;
  group_size: string | null;
  mission_swipes: any[];
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('student_preferences')
    .upsert({
      ...preferences,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/missions');
  return { success: true, data, error: null };
}

/**
 * Get recommended missions based on user preferences (placeholder for ML)
 */
export async function getRecommendedMissions(userId: string) {
  const supabase = await createClient();

  // 1. Get user preferences
  const { data: preferences } = await supabase
    .from('student_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!preferences) {
    return { missions: [], error: 'No preferences found' };
  }

  // 2. For now, simple filtering based on interests
  // TODO: Implement ML recommendation algorithm
  const { data: missions, error } = await supabase
    .from('missions')
    .select(`
      *,
      association:associations(name)
    `)
    .eq('status', 'PUBLISHED')
    .order('start_at', { ascending: true });

  if (error) {
    console.error('Error fetching recommended missions:', error);
    return { missions: [], error: error.message };
  }

  // Simple filtering: match mission description/title with user interests
  const recommended = missions?.filter((mission: any) => {
    const interests = preferences.interests || [];
    return interests.some((interest: string) =>
      mission.title?.toLowerCase().includes(interest.toLowerCase()) ||
      mission.description?.toLowerCase().includes(interest.toLowerCase())
    );
  }) || [];

  return { missions: recommended, error: null };
}

/**
 * Register student for a mission
 */
export async function registerForMission(missionId: string, schoolMemberId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('mission_registrations')
    .insert({
      mission_id: missionId,
      school_member_id: schoolMemberId,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) {
    console.error('Error registering for mission:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/missions');
  return { success: true, data, error: null };
}

/**
 * Get user's mission registrations
 */
export async function getUserMissionRegistrations(schoolMemberId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('mission_registrations')
    .select(`
      *,
      mission:missions(
        *,
        association:associations(name)
      )
    `)
    .eq('school_member_id', schoolMemberId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    return { registrations: [], error: error.message };
  }

  return { registrations: data, error: null };
}
