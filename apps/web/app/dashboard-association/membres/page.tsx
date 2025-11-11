import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MembersListClient from './_components/MembersListClient';

export default async function AssociationMembersPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'ASSOCIATION') {
    redirect('/dashboard');
  }

  // 3. Récupérer l'association_member
  const { data: associationMember } = await supabase
    .from('association_members')
    .select('id, association_id')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!associationMember) {
    redirect('/dashboard?error=no_association');
  }

  // 4. Récupérer tous les membres de l'association avec leurs contacts
  const { data: members, error: membersError } = await supabase
    .from('association_members')
    .select(`
      id,
      first_name,
      last_name,
      email,
      status,
      created_at,
      contacts (
        street,
        apartment_number,
        city,
        postal_code,
        country,
        phone_number
      )
    `)
    .eq('association_id', associationMember.association_id)
    .order('created_at', { ascending: false });

  console.log('[MEMBERS PAGE] Association ID:', associationMember.association_id);
  console.log('[MEMBERS PAGE] Members found:', members?.length);
  console.log('[MEMBERS PAGE] Error:', membersError);
  console.log('[MEMBERS PAGE] Members data:', JSON.stringify(members, null, 2));

  // 5. Pour chaque membre, compter ses missions
  const membersWithMissions = await Promise.all(
    (members || []).map(async (member) => {
      // Compter les missions dont ce membre est référent
      const { count: missionCount } = await supabase
        .from('missions')
        .select('id', { count: 'exact', head: true })
        .eq('association_member_id', member.id);

      return {
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
        status: member.status,
        joinedAt: member.created_at,
        missionCount: missionCount || 0,
        contact: member.contacts ? {
          address: [
            (member.contacts as any).street,
            (member.contacts as any).apartment_number
          ].filter(Boolean).join(', '),
          city: (member.contacts as any).city || '',
          postalCode: (member.contacts as any).postal_code || '',
          country: (member.contacts as any).country || '',
          phoneNumber: (member.contacts as any).phone_number || '',
        } : null,
      };
    })
  );

  return <MembersListClient members={membersWithMissions} />;
}
