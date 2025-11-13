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

    // 4. Récupérer le nom de l'école pour les emails
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    const schoolName = school?.name || 'Votre école';

    // 5. Traiter chaque invitation individuellement (créer + envoyer email)
    const results = await Promise.allSettled(
      students.map(async (student: any) => {
        // 5.1 Créer l'invitation
        const invitationData = {
          school_id: schoolId,
          email: student.email.toLowerCase().trim(),
          first_name: student.firstName?.trim() || null,
          last_name: student.lastName?.trim() || null,
          token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: userProfile.id,
        };

        const { data: invitation, error: invitationError } = await supabase
          .from('student_invitations')
          .insert(invitationData)
          .select()
          .single();

        if (invitationError) {
          throw new Error(`Erreur création invitation pour ${student.email}: ${invitationError.message}`);
        }

        // 5.2 Envoyer l'email
        try {
          const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invitation/${invitation.token}`;

          const emailResult = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Fourmis <contact@fourmis.app>',
            to: invitation.email,
            subject: `${schoolName} vous invite à rejoindre Fourmis`,
            react: StudentInvitationEmail({
              firstName: invitation.first_name || '',
              schoolName: schoolName,
              invitationLink: invitationLink,
            }),
          });

          return {
            success: true,
            invitation,
            emailId: emailResult.data?.id,
          };
        } catch (emailError) {
          // L'email a échoué, supprimer l'invitation créée
          await supabase
            .from('student_invitations')
            .delete()
            .eq('id', invitation.id);

          throw new Error(`Erreur envoi email pour ${student.email}: ${emailError instanceof Error ? emailError.message : 'Erreur inconnue'}`);
        }
      })
    );

    // 6. Analyser les résultats
    const successful = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    if (failed.length > 0) {
      console.error('Échecs lors de l\'envoi des invitations:', failed.map((f) => f.status === 'rejected' ? f.reason : null));
    }

    return NextResponse.json({
      success: true,
      total: students.length,
      sent: successful.length,
      failed: failed.length,
      invitations: successful.map((r) => {
        if (r.status === 'fulfilled') {
          const inv = r.value.invitation;
          return {
            id: inv.id,
            email: inv.email,
            token: inv.token,
            expiresAt: inv.expires_at,
          };
        }
        return null;
      }).filter(Boolean),
      errors: failed.map((f) => ({
        message: f.status === 'rejected' ? f.reason.message : 'Erreur inconnue',
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
