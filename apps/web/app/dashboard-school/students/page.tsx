import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StudentsListClient from './_components/StudentsListClient';

export default async function StudentsPage(props: {
  searchParams: Promise<{ search?: string; level?: string; status?: string; page?: string }>;
}) {
  console.log('[STUDENTS PAGE] Fetching students data');

  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // 1. Récupérer l'utilisateur authentifié
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Récupérer le profil utilisateur
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !userProfile) {
    console.error('[STUDENTS PAGE] User profile not found:', profileError);
    redirect('/dashboard?error=no_profile');
  }

  // 3. Vérifier que l'utilisateur est un admin d'école
  const { data: schoolAdmin, error: adminError } = await supabase
    .from('school_admins')
    .select('id, school_id')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (adminError || !schoolAdmin) {
    console.error('[STUDENTS PAGE] School admin not found:', adminError);
    redirect('/dashboard?error=no_school');
  }

  console.log('[STUDENTS PAGE] School admin:', {
    id: schoolAdmin.id,
    schoolId: schoolAdmin.school_id,
  });

  // 4. Paramètres de recherche et pagination
  const searchQuery = searchParams.search || '';
  const levelFilter = searchParams.level || 'all';
  const statusFilter = searchParams.status || 'all';
  const currentPage = parseInt(searchParams.page || '1');
  const itemsPerPage = 20;
  const offset = (currentPage - 1) * itemsPerPage;

  // 5. FETCH - Total étudiants de l'école
  const { count: totalStudents, error: totalError } = await supabase
    .from('school_members')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolAdmin.school_id);

  if (totalError) {
    console.error('[STUDENTS PAGE] Error fetching total students:', totalError);
  }

  console.log('[STUDENTS PAGE] Total students:', totalStudents);

  // 6. FETCH - Étudiants actifs (avec au moins une mission)
  // D'abord récupérer les IDs de tous les étudiants de l'école
  const { data: schoolMembersIds, error: membersIdsError } = await supabase
    .from('school_members')
    .select('id')
    .eq('school_id', schoolAdmin.school_id);

  const memberIds = schoolMembersIds?.map((m) => m.id) || [];

  // Ensuite compter les étudiants actifs
  const { data: activeStudentsData, error: activeError } = await supabase
    .from('mission_registrations')
    .select('school_member_id')
    .in('school_member_id', memberIds);

  const activeStudentsCount = activeStudentsData
    ? new Set(activeStudentsData.map((r) => r.school_member_id)).size
    : 0;

  if (activeError || membersIdsError) {
    console.error('[STUDENTS PAGE] Error fetching active students:', activeError || membersIdsError);
  }

  console.log('[STUDENTS PAGE] Active students:', activeStudentsCount);

  // 7. FETCH - Moyenne de missions par étudiant
  const { data: allRegistrations, error: registrationsError } = await supabase
    .from('mission_registrations')
    .select('school_member_id')
    .in('school_member_id', memberIds);

  const avgMissions =
    totalStudents && totalStudents > 0
      ? ((allRegistrations?.length || 0) / totalStudents).toFixed(1)
      : '0.0';

  if (registrationsError) {
    console.error('[STUDENTS PAGE] Error fetching registrations:', registrationsError);
  }

  console.log('[STUDENTS PAGE] Avg missions per student:', avgMissions);

  // 8. FETCH - Moyenne d'heures par étudiant (missions complétées * 4h)
  const { data: completedRegistrations, error: completedError } = await supabase
    .from('mission_registrations')
    .select('school_member_id')
    .eq('status', 'COMPLETED')
    .in('school_member_id', memberIds);

  const totalHours = (completedRegistrations?.length || 0) * 4;
  const avgHours =
    totalStudents && totalStudents > 0
      ? (totalHours / totalStudents).toFixed(1)
      : '0.0';

  if (completedError) {
    console.error('[STUDENTS PAGE] Error fetching completed registrations:', completedError);
  }

  console.log('[STUDENTS PAGE] Avg hours per student:', avgHours);

  // 9. Construire la query pour la liste des étudiants
  let studentsQuery = supabase
    .from('school_members')
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      created_at,
      ref_academic_levels (
        id,
        display_name,
        name
      )
    `,
      { count: 'exact' }
    )
    .eq('school_id', schoolAdmin.school_id)
    .order('created_at', { ascending: false });

  // Filtrer par recherche (nom ou email)
  if (searchQuery) {
    studentsQuery = studentsQuery.or(
      `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
    );
  }

  // Filtrer par niveau
  if (levelFilter !== 'all') {
    const { data: levels } = await supabase
      .from('ref_academic_levels')
      .select('id')
      .eq('name', levelFilter)
      .eq('school_id', schoolAdmin.school_id);

    if (levels && levels.length > 0) {
      studentsQuery = studentsQuery.in(
        'academic_level_id',
        levels.map((l) => l.id)
      );
    }
  }

  // Appliquer pagination
  studentsQuery = studentsQuery.range(offset, offset + itemsPerPage - 1);

  const { data: students, error: studentsError, count: filteredCount } = await studentsQuery;

  if (studentsError) {
    console.error('[STUDENTS PAGE] Error fetching students:', studentsError);
  }

  console.log('[STUDENTS PAGE] Students fetched:', students?.length);

  // 10. Pour chaque étudiant, récupérer le nombre de missions et heures
  const studentsWithStats = await Promise.all(
    (students || []).map(async (student: any) => {
      // Compter les missions de l'étudiant
      const { count: missionsCount } = await supabase
        .from('mission_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('school_member_id', student.id);

      // Compter les heures (missions complétées * 4h)
      const { count: completedCount } = await supabase
        .from('mission_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('school_member_id', student.id)
        .eq('status', 'COMPLETED');

      const hours = (completedCount || 0) * 4;

      // Dernière activité (dernière inscription à une mission)
      const { data: lastRegistration } = await supabase
        .from('mission_registrations')
        .select('created_at')
        .eq('school_member_id', student.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Déterminer le statut (actif si au moins une mission dans les 30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const isActive = lastRegistration
        ? new Date(lastRegistration.created_at) > thirtyDaysAgo
        : false;

      return {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        level: student.ref_academic_levels?.display_name || 'Non défini',
        levelCode: student.ref_academic_levels?.name || 'N/A',
        missions: missionsCount || 0,
        hours,
        status: (isActive ? 'active' : 'inactive') as 'active' | 'inactive',
        lastActivity: lastRegistration?.created_at || student.created_at,
        createdAt: student.created_at,
      };
    })
  );

  // Filtrer par statut si demandé
  let finalStudents = studentsWithStats;
  if (statusFilter !== 'all') {
    finalStudents = studentsWithStats.filter((s) => s.status === statusFilter);
  }

  // 11. Récupérer les niveaux académiques pour les filtres
  const { data: academicLevels, error: levelsError } = await supabase
    .from('ref_academic_levels')
    .select('id, name, display_name')
    .eq('school_id', schoolAdmin.school_id)
    .order('name');

  if (levelsError) {
    console.error('[STUDENTS PAGE] Error fetching academic levels:', levelsError);
  }

  const levelsOptions = academicLevels?.map((level: any) => ({
    value: level.name,
    label: level.display_name,
  })) || [];

  console.log('[STUDENTS PAGE] Academic levels:', levelsOptions.length);

  // Préparer les données pour le client
  const data = {
    stats: {
      totalStudents: totalStudents || 0,
      activeStudents: activeStudentsCount,
      avgMissions: parseFloat(avgMissions),
      avgHours: parseFloat(avgHours),
    },
    students: finalStudents,
    levels: levelsOptions,
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems: filteredCount || 0,
      totalPages: Math.ceil((filteredCount || 0) / itemsPerPage),
    },
    filters: {
      search: searchQuery,
      level: levelFilter,
      status: statusFilter,
    },
  };

  return <StudentsListClient data={data} schoolId={schoolAdmin.school_id} />;
}
