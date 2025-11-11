import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MissionsClient } from './_components/MissionsClient';

export default async function AssociationMissionsPage() {
  // Server-side: Fetch data from Supabase
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
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
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Vous devez être membre d'une association pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  // 4. Récupérer les missions de l'association
  const { data: missions, error: missionsError } = await supabase
    .from('missions')
    .select('*')
    .eq('association_id', associationMember.association_id)
    .order('created_at', { ascending: false });

  if (missionsError) {
    console.error('Error fetching missions:', missionsError);
  }

  // 5. Récupérer les statistiques des inscriptions
  const { data: registrations } = await supabase
    .from('mission_registrations')
    .select('mission_id, status')
    .in('mission_id', (missions || []).map(m => m.id));

  // Calculer les stats
  const registrationsByMission = (registrations || []).reduce((acc, reg) => {
    if (!acc[reg.mission_id]) {
      acc[reg.mission_id] = { total: 0, completed: 0, confirmed: 0 };
    }
    acc[reg.mission_id].total++;
    if (reg.status === 'COMPLETED') acc[reg.mission_id].completed++;
    if (reg.status === 'CONFIRMED') acc[reg.mission_id].confirmed++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; confirmed: number }>);

  const totalRegistrations = (registrations || []).length;
  const completedRegistrations = (registrations || []).filter(r => r.status === 'COMPLETED').length;

  // 6. Passer les données au Client Component
  return (
    <MissionsClient 
      initialMissions={missions || []}
      associationId={associationMember.association_id}
      currentMemberId={associationMember.id}
      registrationStats={{
        totalRegistrations,
        completedRegistrations,
        registrationsByMission,
      }}
    />
  );
}
