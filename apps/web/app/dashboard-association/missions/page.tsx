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

  // 5. Passer les données au Client Component
  return (
    <MissionsClient 
      initialMissions={missions || []}
      associationId={associationMember.association_id}
      currentMemberId={associationMember.id}
    />
  );
}
