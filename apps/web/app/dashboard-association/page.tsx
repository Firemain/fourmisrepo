import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AssociationDashboardClient from './_components/AssociationDashboardClient';

export default async function AssociationDashboardPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer le user_profile (utilise full_name, pas first_name)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) redirect('/login'); // Si pas de profil, retour au login

  // 3. Récupérer l'association_member avec l'association
  const { data: associationMember } = await supabase
    .from('association_members')
    .select(`
      id,
      first_name,
      association_id,
      associations (
        id,
        name
      )
    `)
    .eq('user_profile_id', userProfile.id)
    .single();

  // Note: La vérification de associationMember est faite dans le layout.tsx
  // Si on arrive ici, c'est qu'on a les permissions
  
  if (!associationMember) {
    // Ne devrait pas arriver ici grâce au layout, mais au cas où
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Erreur : impossible de récupérer vos informations d'association.
          </p>
        </div>
      </div>
    );
  }

  const associationId = associationMember.association_id;

  // 4. Récupérer les statistiques des missions
  const { data: missions } = await supabase
    .from('missions')
    .select('id, status, maximum_participant, start_at')
    .eq('association_id', associationId);

  // 5. Récupérer les inscriptions aux missions
  const { data: registrations } = await supabase
    .from('mission_registrations')
    .select(`
      id,
      mission_id,
      status,
      created_at,
      school_members (
        id,
        user_profiles (
          full_name
        ),
        academic_levels (
          name
        )
      )
    `)
    .in('mission_id', (missions || []).map(m => m.id));

  // 6. Récupérer les missions actives avec leurs inscriptions
  const now = new Date().toISOString();
  const { data: activeMissions } = await supabase
    .from('missions')
    .select(`
      id,
      title,
      start_at,
      maximum_participant,
      recurrence_type,
      mission_registrations (
        id,
        status
      )
    `)
    .eq('association_id', associationId)
    .eq('status', 'PUBLISHED')
    .gte('start_at', now)
    .order('start_at', { ascending: true })
    .limit(5);

  // 7. Calculer les statistiques
  const totalMissions = missions?.length || 0;
  const publishedMissions = missions?.filter(m => m.status === 'PUBLISHED').length || 0;
  const totalRegistrations = registrations?.length || 0;
  const completedRegistrations = registrations?.filter(r => r.status === 'COMPLETED').length || 0;
  const engagementRate = totalRegistrations > 0 
    ? Math.round((completedRegistrations / totalRegistrations) * 100) 
    : 0;

  // 8. Récupérer les membres récents (via les inscriptions)
  const recentMembers = registrations
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(reg => {
      const schoolMember = reg.school_members as any;
      const fullName = schoolMember?.user_profiles?.full_name || '';
      const nameParts = fullName.split(' ');
      return {
        id: schoolMember?.id || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        level: schoolMember?.academic_levels?.name || 'Non spécifié',
        joinedAt: reg.created_at,
      };
    })
    .filter((member, index, self) => 
      // Supprimer les doublons par ID
      index === self.findIndex(m => m.id === member.id)
    ) || [];

  // 9. Formater les missions actives
  const formattedActiveMissions = (activeMissions || []).map(mission => {
    const confirmedCount = mission.mission_registrations?.filter(r => r.status === 'CONFIRMED' || r.status === 'COMPLETED').length || 0;
    const maxParticipants = mission.maximum_participant || 0;
    const fillRate = maxParticipants > 0 ? Math.round((confirmedCount / maxParticipants) * 100) : 0;

    return {
      id: mission.id,
      title: mission.title,
      startAt: mission.start_at,
      recurrenceType: mission.recurrence_type,
      confirmedCount,
      maxParticipants,
      fillRate,
    };
  });

  // association_members a first_name, user_profiles a full_name
  const firstName = associationMember.first_name || userProfile?.full_name?.split(' ')[0] || 'Responsable';
  const associationName = (associationMember.associations as any)?.name || 'Association';

  return (
    <AssociationDashboardClient 
      firstName={firstName}
      associationName={associationName}
      stats={{
        totalMembers: recentMembers.length, // Approximation basée sur les membres uniques
        publishedMissions,
        totalMissions,
        engagementRate,
      }}
      recentMembers={recentMembers}
      activeMissions={formattedActiveMissions}
    />
  );
}