import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AssociationDashboardClient from './_components/AssociationDashboardClient';

export default async function AssociationDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, first_name')
    .eq('user_id', user.id)
    .single();

  const { data: associationMember } = await supabase
    .from('association_members')
    .select('first_name')
    .eq('user_profile_id', userProfile?.id)
    .single();

  const firstName = associationMember?.first_name || userProfile?.first_name || 'Responsable';

  return <AssociationDashboardClient firstName={firstName} />;
}