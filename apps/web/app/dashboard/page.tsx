import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StudentDashboardClient from './_components/StudentDashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, full_name, role')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) redirect('/login');

  // 3. Récupérer le school_member
  const { data: schoolMember } = await supabase
    .from('school_members')
    .select('id, school_id, first_name, last_name')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!schoolMember) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Erreur : impossible de récupérer vos informations d'étudiant.
          </p>
        </div>
      </div>
    );
  }

  // 4. Récupérer les inscriptions aux missions de l'étudiant
  const { data: registrations } = await supabase
    .from('mission_registrations')
    .select(`
      id,
      status,
      created_at,
      mission_id,
      missions (
        id,
        title,
        description,
        start_at,
        end_at,
        duration,
        status,
        association_id,
        associations (
          id,
          name
        )
      )
    `)
    .eq('school_member_id', schoolMember.id)
    .order('created_at', { ascending: false });

  // 5. Calculer les stats
  const now = new Date();
  const completedRegistrations = registrations?.filter(r => r.status === 'COMPLETED') || [];
  const confirmedRegistrations = registrations?.filter(r => r.status === 'CONFIRMED') || [];
  
  // Missions à venir (CONFIRMED et date future)
  const upcomingMissions = confirmedRegistrations
    .filter(r => r.missions && new Date(r.missions.start_at) > now)
    .slice(0, 2) // ✅ Limité à 2 missions
    .map(r => ({
      id: r.missions.id,
      title: r.missions.title,
      description: r.missions.description || '',
      startAt: r.missions.start_at,
      endAt: r.missions.end_at,
      duration: r.missions.duration || 120,
      association: r.missions.associations?.name || 'Association',
      status: r.status
    }));

  // Heures validées (missions complétées × durée)
  const totalHours = Math.floor(
    completedRegistrations.reduce((sum, r) => {
      const duration = r.missions?.duration || 120;
      return sum + duration;
    }, 0) / 60
  );

  // Nombre d'associations uniques
  const uniqueAssociations = new Set(
    registrations
      ?.map(r => r.missions?.association_id)
      .filter(Boolean)
  );

  // TODO: Récupérer les vrais badges depuis la table badges
  // Pour l'instant, on utilise des badges mockés
  const recentBadges = [
    {
      id: '1',
      name: 'Première Mission',
      description: 'Complétez votre première mission',
      icon: '🎯',
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
      color: '#18534F'
    },
    {
      id: '2',
      name: 'Engagement Social',
      description: '5 missions dans le domaine social',
      icon: '🤝',
      earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
      color: '#226D68'
    },
    {
      id: '3',
      name: 'Marathonien',
      description: '20 heures de bénévolat',
      icon: '⏱️',
      earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 10 jours
      color: '#D6955B'
    }
  ];

  const stats = {
    activeMissions: confirmedRegistrations.length,
    completedMissions: completedRegistrations.length,
    associations: uniqueAssociations.size,
    validatedHours: totalHours
  };

  const userData = {
    id: schoolMember.id,
    firstName: schoolMember.first_name || userProfile.full_name?.split(' ')[0] || 'Étudiant',
    lastName: schoolMember.last_name || '',
    email: user.email || ''
  };

  console.log('📊 STUDENT DASHBOARD DATA:');
  console.log('👤 Student:', userData.firstName, userData.lastName);
  console.log('📈 Stats:', stats);
  console.log('🎯 Upcoming missions:', upcomingMissions.length);
  console.log('🏆 Recent badges:', recentBadges.length);

  return (
    <StudentDashboardClient
      user={userData}
      stats={stats}
      upcomingMissions={upcomingMissions}
      recentBadges={recentBadges}
    />
  );
}
