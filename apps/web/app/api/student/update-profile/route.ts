import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, firstName, lastName } = await request.json();
    const supabase = await createClient();

    // Mettre à jour le school_member
    const { error } = await supabase
      .from('school_members')
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
