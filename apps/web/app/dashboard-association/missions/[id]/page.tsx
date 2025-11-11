import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { MissionDetailClient } from './_components/MissionDetailClient';

interface MissionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MissionDetailPage({ params }: MissionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) {
    redirect('/onboarding');
  }

  // 3. Récupérer l'association_member
  const { data: associationMember } = await supabase
    .from('association_members')
    .select('id, association_id')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!associationMember) {
    redirect('/dashboard-association/missions');
  }

  // 4. Récupérer la mission avec les infos de l'association
  const { data: mission, error: missionError } = await supabase
    .from('missions')
    .select(
      `
      *,
      associations (
        name,
        logo_url
      )
    `
    )
    .eq('id', id)
    .single();

  if (missionError || !mission) {
    notFound();
  }

  // Vérifier que la mission appartient à l'association de l'utilisateur
  if (mission.association_id !== associationMember.association_id) {
    redirect('/dashboard-association/missions');
  }

  // 5. Récupérer les inscriptions avec les infos des participants
  const { data: registrations } = await supabase
    .from('mission_registrations')
    .select(
      `
      id,
      status,
      created_at,
      school_members (
        id,
        user_profiles (
          full_name,
          email
        ),
        academic_levels (
          name
        )
      )
    `
    )
    .eq('mission_id', id);

  // 6. Calculer les statistiques
  const totalRegistrations = registrations?.length || 0;
  const completedRegistrations =
    registrations?.filter((r) => r.status === 'COMPLETED').length || 0;
  const completionRate =
    totalRegistrations > 0
      ? Math.round((completedRegistrations / totalRegistrations) * 100)
      : 0;

  // TODO: Calculer la note moyenne quand le système de notation sera implémenté
  const avgRating = 0;

  // 7. Formater les participants pour l'affichage
  const participants =
    registrations?.map((reg: any) => {
      const fullName = reg.school_members?.user_profiles?.full_name || '';
      const nameParts = fullName.split(' ');
      return {
        id: reg.id,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: reg.school_members?.user_profiles?.email || '',
        level: reg.school_members?.academic_levels?.name || 'Non spécifié',
        enrolledOn: new Date(reg.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: reg.status,
      };
    }) || [];

  return (
    <MissionDetailClient
      mission={{
        id: mission.id,
        title: mission.title,
        description: mission.description,
        start_at: mission.start_at,
        end_at: mission.end_at,
        duration: mission.duration,
        maximum_participant: mission.maximum_participant,
        recurrence_type: mission.recurrence_type,
        created_at: mission.created_at,
        association_id: mission.association_id,
        association_member_id: mission.association_member_id,
        status: mission.status,
      }}
      associationName={mission.associations?.name || ''}
      participants={participants}
      stats={{
        enrolled: totalRegistrations,
        maxParticipants: mission.maximum_participant,
        completed: completedRegistrations,
        avgRating,
        completionRate,
      }}
      locale="fr"
    />
  );
}
