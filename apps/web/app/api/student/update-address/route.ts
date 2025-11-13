import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      contactId: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phoneNumber: string;
    };

    const supabase = await createClient();

    // Mettre à jour le contact
    const { error } = await supabase
      .from('contacts')
      .update({
        street: body.street,
        city: body.city,
        postal_code: body.postalCode,
        country: body.country,
        phone_number: body.phoneNumber || null,
      })
      .eq('id', body.contactId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
