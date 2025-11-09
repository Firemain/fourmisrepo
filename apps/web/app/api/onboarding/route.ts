import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      firstName: string;
      lastName: string;
      schoolId: string;
      academicLevelId: string;
      type: 'STUDENT' | 'STAFF';
      country: string;
      city: string;
      postalCode: string;
      street: string;
      apartmentNumber?: string;
      phoneNumber?: string;
    };
    
    const {
      firstName,
      lastName,
      schoolId,
      academicLevelId,
      type,
      country,
      city,
      postalCode,
      street,
      apartmentNumber,
      phoneNumber,
    } = body;

    // 0. Récupérer ou créer le user_profile
    let { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Si le profil n'existe pas, le créer
    if (!userProfile) {
      const userProfileId = randomUUID();
      const { data: newProfile, error: createProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userProfileId,
          user_id: user.id,
          email: user.email!,
          role: 'STUDENT',
        })
        .select('id')
        .single();

      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError);
        return NextResponse.json({ error: createProfileError.message }, { status: 500 });
      }

      userProfile = newProfile;
    }

    // 1. Créer le contact
    const contactId = randomUUID();
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        id: contactId,
        country,
        city,
        postal_code: postalCode,
        street,
        apartment_number: apartmentNumber,
        phone_number: phoneNumber,
      })
      .select()
      .single();

    if (contactError) {
      console.error('Contact creation error:', contactError);
      return NextResponse.json({ error: contactError.message }, { status: 500 });
    }

    // 2. Créer le school_member
    const schoolMemberId = randomUUID();
    const { error: memberError } = await supabase
      .from('school_members')
      .insert({
        id: schoolMemberId,
        school_id: schoolId,
        first_name: firstName,
        last_name: lastName,
        type,
        academic_level_id: academicLevelId,
        contact_id: contact.id,
        email: user.email!,
        user_profile_id: userProfile.id,
      });

    if (memberError) {
      console.error('School member creation error:', memberError);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
