import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from './_components/SettingsClient';

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Récupérer le profil utilisateur
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, role, email')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) {
    redirect('/login');
  }

  // 3. Récupérer les informations de l'étudiant depuis school_members
  const { data: schoolMember } = await supabase
    .from('school_members')
    .select(`
      id,
      first_name,
      last_name,
      email,
      calendar_url,
      contact:contacts (
        id,
        street,
        city,
        postal_code,
        country,
        phone_number
      ),
      academic_level:ref_academic_levels (
        id,
        name
      )
    `)
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!schoolMember) {
    redirect('/login');
  }

  // 4. Formater les données
  const studentData = {
    id: schoolMember.id,
    firstName: schoolMember.first_name,
    lastName: schoolMember.last_name,
    email: schoolMember.email,
    calendarUrl: schoolMember.calendar_url,
    contact: schoolMember.contact
      ? {
          id: (schoolMember.contact as any).id,
          street: (schoolMember.contact as any).street,
          city: (schoolMember.contact as any).city,
          postalCode: (schoolMember.contact as any).postal_code,
          country: (schoolMember.contact as any).country,
          phoneNumber: (schoolMember.contact as any).phone_number,
        }
      : null,
    academicLevel: schoolMember.academic_level
      ? {
          id: (schoolMember.academic_level as any).id,
          name: (schoolMember.academic_level as any).name,
        }
      : null,
  };

  return <SettingsClient studentData={studentData} />;
}
