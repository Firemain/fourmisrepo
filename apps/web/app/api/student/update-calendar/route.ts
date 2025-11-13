import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      id: string;
      calendarUrl: string;
    };

    const supabase = await createClient();

    // Mettre à jour le calendar_url du school_member
    const { error } = await supabase
      .from('school_members')
      .update({
        calendar_url: body.calendarUrl || null,
      })
      .eq('id', body.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json({ error: 'Failed to update calendar' }, { status: 500 });
  }
}
