import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SchoolDashboardClient from './_components/SchoolDashboardClient';

export default async function SchoolDashboardPage(props: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) redirect('/login');

  // 3. Récupérer le school_admin avec l'école
  const { data: schoolAdmin } = await supabase
    .from('school_admins')
    .select(`
      id,
      first_name,
      school_id,
      schools (
        id,
        name
      )
    `)
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!schoolAdmin) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Erreur : impossible de récupérer vos informations d'école.
          </p>
        </div>
      </div>
    );
  }

  const schoolId = schoolAdmin.school_id;

  // 4. Gestion des filtres de dates
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setDate(defaultStart.getDate() - 30); // 30 derniers jours par défaut

  const startDate = searchParams.start ? new Date(searchParams.start) : defaultStart;
  const endDate = searchParams.end ? new Date(searchParams.end) : now;

  // 5. Récupérer les statistiques des étudiants
  const { count: totalStudents } = await supabase
    .from('school_members')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  // 6. Récupérer tous les school_member_ids pour les requêtes suivantes
  const { data: schoolMembers } = await supabase
    .from('school_members')
    .select('id')
    .eq('school_id', schoolId);

  const memberIds = schoolMembers?.map(m => m.id) || [];

  // 7. Récupérer TOUTES les inscriptions aux missions
  const { data: allRegistrations } = await supabase
    .from('mission_registrations')
    .select(`
      id,
      school_member_id,
      status,
      created_at,
      mission_id
    `)
    .in('school_member_id', memberIds);

  // 8. Filtrer les inscriptions par période
  const registrationsInPeriod = allRegistrations?.filter(r => {
    const createdAt = new Date(r.created_at);
    return createdAt >= startDate && createdAt <= endDate;
  }) || [];

  // 9. KPI : Étudiants actifs (avec au moins une inscription dans la période)
  const activeStudentsInPeriod = registrationsInPeriod.length > 0
    ? new Set(registrationsInPeriod.map(r => r.school_member_id)).size
    : 0;

  // 10. KPI : Total inscriptions dans la période
  const totalRegistrations = registrationsInPeriod.length;

  // 11. KPI : Missions complétées dans la période
  const completedInPeriod = registrationsInPeriod.filter(r => r.status === 'COMPLETED').length;

  // 12. KPI : Heures totales (missions complétées * 4h)
  const totalHours = completedInPeriod * 4;

  // 13. KPI : Taux de complétion
  const completionRate = totalRegistrations > 0 
    ? Math.round((completedInPeriod / totalRegistrations) * 100)
    : 0;

  // 14. KPI : Nouveaux étudiants ce mois
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const { count: newStudentsThisMonth } = await supabase
    .from('school_members')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .gte('created_at', monthStart.toISOString());

  // 15. Récupérer les missions actives (publiées et futures)
  const nowIso = new Date().toISOString();
  const { data: activeMissions } = await supabase
    .from('missions')
    .select('id, title, association_id')
    .eq('status', 'PUBLISHED')
    .gte('start_at', nowIso);

  const activeMissionsCount = activeMissions?.length || 0;

  // 16. Récupérer les inscriptions récentes avec les détails des étudiants
  const { data: recentRegistrations } = await supabase
    .from('mission_registrations')
    .select(`
      id,
      created_at,
      school_member_id,
      school_members (
        id,
        first_name,
        last_name,
        ref_academic_levels (
          display_name
        )
      )
    `)
    .in('school_member_id', memberIds)
    .order('created_at', { ascending: false })
    .limit(10);

  // 11. Formater les étudiants récents (éviter les doublons)
  const recentStudentsMap = new Map();
  recentRegistrations?.forEach(reg => {
    const schoolMember = reg.school_members as any;
    if (schoolMember && !recentStudentsMap.has(schoolMember.id)) {
      recentStudentsMap.set(schoolMember.id, {
        id: schoolMember.id,
        firstName: schoolMember.first_name || '',
        lastName: schoolMember.last_name || '',
        level: schoolMember.ref_academic_levels?.display_name || 'Non spécifié',
        registeredAt: reg.created_at,
      });
    }
  });

  const recentStudents = Array.from(recentStudentsMap.values()).slice(0, 5);

  // 17. Récupérer les missions les plus populaires (sur TOUTES les inscriptions)
  const missionParticipants = new Map<string, number>();
  allRegistrations?.forEach((reg: any) => {
    const count = missionParticipants.get(reg.mission_id) || 0;
    missionParticipants.set(reg.mission_id, count + 1);
  });

  const sortedMissions = Array.from(missionParticipants.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 18. Récupérer les détails des missions populaires
  const topMissionIds = sortedMissions.map(([id]) => id);
  const { data: topMissionsData } = await supabase
    .from('missions')
    .select(`
      id,
      title,
      associations (
        name
      )
    `)
    .in('id', topMissionIds);

  const topMissions = topMissionsData?.map(mission => ({
    id: mission.id,
    title: mission.title,
    associationName: (mission.associations as any)?.name || 'Association',
    participantsCount: missionParticipants.get(mission.id) || 0,
  })) || [];

  // 19. Préparer les données pour le client
  const firstName = schoolAdmin.first_name || userProfile?.full_name?.split(' ')[0] || 'Responsable';
  const schoolName = (schoolAdmin.schools as any)?.name || 'École';

  return (
    <SchoolDashboardClient 
      firstName={firstName}
      schoolName={schoolName}
      stats={{
        totalStudents: totalStudents || 0,
        activeStudents: activeStudentsInPeriod,
        totalHours,
        activeMissions: activeMissionsCount,
        totalRegistrations,
        completedMissions: completedInPeriod,
        completionRate,
        newStudentsThisMonth: newStudentsThisMonth || 0,
      }}
      recentStudents={recentStudents}
      topMissions={topMissions}
      dateRange={{
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      }}
    />
  );
}
