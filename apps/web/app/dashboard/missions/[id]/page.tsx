import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MissionDetailWrapper from './_components/MissionDetailWrapper';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('🔍 [MISSION DETAIL] User auth:', user?.id, user?.email);

  if (!user) {
    console.log('❌ [MISSION DETAIL] No user, redirecting to login');
    redirect('/auth/login');
  }

  // 2. Récupérer les données utilisateur
  const { data: userProfile, error: userError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('🔍 [MISSION DETAIL] User profile:', userProfile?.id, userError);

  if (!userProfile) {
    console.log('❌ [MISSION DETAIL] No user profile, redirecting to login');
    redirect('/auth/login');
  }

  // 3. Récupérer school_member
  const { data: schoolMember, error: schoolMemberError } = await supabase
    .from('school_members')
    .select('id')
    .eq('user_profile_id', userProfile.id)
    .single();

  console.log('🔍 [MISSION DETAIL] School member:', schoolMember?.id, schoolMemberError);

  if (!schoolMember) {
    console.log('❌ [MISSION DETAIL] No school member, redirecting to dashboard');
    redirect('/dashboard');
  }

  // 4. Récupérer les détails complets de la mission
  const { data: mission, error: missionError } = await supabase
    .from('missions')
    .select(`
      id,
      title,
      description,
      start_at,
      end_at,
      duration,
      maximum_participant,
      status,
      recurrence_type,
      association:associations!inner (
        id,
        name,
        description,
        logo_url
      ),
      contact:contacts (
        id,
        street,
        city,
        postal_code,
        country
      ),
      mission_tags_relation (
        tag:mission_tags (
          id,
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  console.log('🔍 [MISSION DETAIL] Mission data:', mission ? 'found' : 'not found', missionError);

  if (missionError || !mission) {
    console.error('❌ [MISSION DETAIL] Error fetching mission:', missionError);
    redirect('/dashboard/missions');
  }

  // 5. Récupérer toutes les inscriptions pour cette mission
  const { data: registrations } = await supabase
    .from('mission_registrations')
    .select('id, school_member_id, status')
    .eq('mission_id', id);

  // 6. Vérifier si l'étudiant est déjà inscrit
  const { data: userRegistration } = await supabase
    .from('mission_registrations')
    .select('id, status')
    .eq('mission_id', id)
    .eq('school_member_id', schoolMember.id)
    .maybeSingle();

  // 7. Calculer les statistiques
  const totalRegistrations = registrations?.length || 0;
  const spotsLeft = mission.maximum_participant
    ? mission.maximum_participant - totalRegistrations
    : null;

  // 8. Formatter les données
  const formattedMission = {
    id: mission.id,
    title: mission.title,
    description: mission.description || '',
    startAt: mission.start_at,
    endAt: mission.end_at,
    duration: mission.duration || 0,
    maximumParticipant: mission.maximum_participant,
    status: mission.status,
    recurrenceType: mission.recurrence_type,
    association: {
      id: (mission.association as any)?.id || '',
      name: (mission.association as any)?.name || '',
      description: (mission.association as any)?.description || '',
      logoUrl: (mission.association as any)?.logo_url || null,
    },
    location: mission.contact
      ? {
          street: (mission.contact as any)?.street || '',
          city: (mission.contact as any)?.city || '',
          postalCode: (mission.contact as any)?.postal_code || '',
          country: (mission.contact as any)?.country || 'France',
        }
      : null,
    tags: mission.mission_tags_relation?.map((mt: any) => ({
      id: mt.tag?.id || '',
      name: mt.tag?.name || '',
    })) || [],
    stats: {
      totalRegistrations,
      spotsLeft,
    },
    userRegistration: userRegistration
      ? {
          id: userRegistration.id,
          status: userRegistration.status,
        }
      : null,
  };

  console.log('📋 Mission details loaded:', {
    id: formattedMission.id,
    title: formattedMission.title,
    isRegistered: !!userRegistration,
    spotsLeft,
  });

  return (
    <MissionDetailWrapper
      mission={formattedMission}
      schoolMemberId={schoolMember.id}
    />
  );
}
