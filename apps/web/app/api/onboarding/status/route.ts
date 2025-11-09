import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Vérifier si l'utilisateur a un school_member
    const { data: schoolMember, error } = await supabase
      .from('school_members')
      .select('id')
      .eq('user_profile_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found, ce qui est normal
      console.error('Error checking onboarding:', error);
    }

    return NextResponse.json({
      completed: !!schoolMember,
      userId: user.id,
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
