import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MissionsClient from './_components/MissionsClient';

export default async function MissionsPage() {
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

  // 4. Récupérer TOUTES les missions publiées
  const { data: allMissions, error: missionsError } = await supabase
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
      association_id,
      contact_id,
      associations (
        id,
        name
      ),
      contact:contacts (
        id,
        street,
        city,
        postal_code
      )
    `)
    .in('status', ['PUBLISHED', 'ACTIVE']) // Accepter PUBLISHED et ACTIVE
    .gte('end_at', new Date().toISOString())
    .order('start_at', { ascending: true });

  if (missionsError) {
    console.error('❌ Error fetching missions:', missionsError);
  }
  console.log('🔍 Raw missions data:', allMissions);

  // 5. Récupérer les préférences de l'étudiant (pour les recommandations)
  const { data: preferences } = await supabase
    .from('student_preferences')
    .select('*')
    .eq('school_member_id', schoolMember.id)
    .single();

  // 6. Formater les missions
  const missions = allMissions?.map((mission: any) => ({
    id: mission.id,
    title: mission.title,
    description: mission.description || '',
    start_at: mission.start_at,
    end_at: mission.end_at,
    duration: mission.duration || 120, // en minutes
    maxParticipants: mission.maximum_participant || 20,
    location: mission.contact 
      ? `${mission.contact.street}, ${mission.contact.city}` 
      : 'À définir',
    status: mission.status, // ✅ Ajouté pour MissionCard
    association: mission.associations?.name || 'Association',
    associationId: mission.association_id,
    // TODO: Ajouter les vraies données quand les tables seront prêtes
    participants: 0, // À récupérer depuis mission_registrations
    odd: [], // À récupérer depuis la table de tags/ODDs
    difficulty: 'Modéré' as const, // À récupérer depuis la mission ou calculer
    skills: [] // À récupérer depuis la table de compétences
  })) || [];

  console.log('📊 MISSIONS PAGE DATA:');
  console.log('👤 School member:', schoolMember.id);
  console.log('🎯 Total missions found:', missions.length);
  console.log('⚙️ Has preferences:', !!preferences);

  // 7. Préparer les données utilisateur
  const userData = {
    id: schoolMember.id,
    firstName: schoolMember.first_name || userProfile.full_name?.split(' ')[0] || 'Étudiant',
    lastName: schoolMember.last_name || '',
    preferences: preferences || null
  };

  return (
    <MissionsClient 
      missions={missions}
      user={userData}
    />
  );
}