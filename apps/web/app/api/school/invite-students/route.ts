import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { StudentInvitationEmail } from '@/lib/emails/student-invitation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 2. Récupérer le corps de la requête
    const body = await request.json();
    const { schoolId, students } = body;

    if (!schoolId || !students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // 3. Vérifier que l'utilisateur est admin de cette école
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    const { data: schoolAdmin } = await supabase
      .from('school_admins')
      .select('id')
      .eq('user_profile_id', userProfile.id)
      .eq('school_id', schoolId)
      .single();

    if (!schoolAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé pour cette école' },
        { status: 403 }
      );
    }

    // 4. Créer les invitations
    const invitations = students.map((student: any) => ({
      school_id: schoolId,
      email: student.email.toLowerCase().trim(),
      first_name: student.firstName?.trim() || null,
      last_name: student.lastName?.trim() || null,
      token: crypto.randomUUID(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
      created_by: userProfile.id,
    }));

    const { data: createdInvitations, error: invitationError } = await supabase
      .from('student_invitations')
      .insert(invitations)
      .select();

    if (invitationError) {
      console.error('Error creating invitations:', invitationError);
      return NextResponse.json(
        { error: 'Erreur lors de la création des invitations', details: invitationError },
        { status: 500 }
      );
    }

    // 5. Récupérer le nom de l'école pour les emails
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    const schoolName = school?.name || 'Votre école';

    // 6. Envoyer les emails d'invitation
    const emailResults = await Promise.allSettled(
      createdInvitations.map(async (invitation: any) => {
        const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invitation/${invitation.token}`;

        return await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Fourmis <contact@fourmis.app>',
          to: invitation.email,
          subject: `${schoolName} vous invite à rejoindre Fourmis`,
          react: StudentInvitationEmail({
            firstName: invitation.first_name || '',
            schoolName: schoolName,
            invitationLink: invitationLink,
          }),
        });
      })
    );

    // Compter les emails envoyés avec succès
    const successfulEmails = emailResults.filter((result) => result.status === 'fulfilled').length;
    const failedEmails = emailResults.filter((result) => result.status === 'rejected');

    if (failedEmails.length > 0) {
      console.error('Some emails failed to send:', failedEmails);
    }

    return NextResponse.json({
      success: true,
      sent: createdInvitations.length,
      emailsSent: successfulEmails,
      emailsFailed: failedEmails.length,
      invitations: createdInvitations.map((inv: any) => ({
        id: inv.id,
        email: inv.email,
        token: inv.token,
        expiresAt: inv.expires_at,
      })),
    });
  } catch (error) {
    console.error('Error in invite-students API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error },
      { status: 500 }
    );
  }
}
