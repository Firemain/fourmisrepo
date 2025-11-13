import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, firstName, lastName, password } = body as {
      token: string;
      firstName: string;
      lastName: string;
      password: string;
    };

    // Créer un client Supabase avec la clé service pour les opérations admin
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Vérifier que l'invitation existe et est valide
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('student_invitations')
      .select('*, school:schools(id, name)')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation invalide ou expirée' },
        { status: 400 }
      );
    }

    // 2. Créer le compte utilisateur avec Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password: password,
        email_confirm: true, // Confirmer l'email automatiquement
      });

    if (authError || !authData.user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        {
          error:
            authError?.message || 'Erreur lors de la création du compte',
        },
        { status: 400 }
      );
    }

    // 3. Créer le profil utilisateur
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: invitation.email,
        first_name: firstName,
        last_name: lastName,
        role: 'student',
        avatar_url: null,
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Si le profil échoue, on essaie de supprimer le user auth créé
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil' },
        { status: 500 }
      );
    }

    // 4. Créer la liaison avec l'école (school_members)
    const { error: memberError } = await supabaseAdmin
      .from('school_members')
      .insert({
        school_id: invitation.school_id,
        user_profile_id: authData.user.id,
        status: 'active',
      });

    if (memberError) {
      console.error('Member error:', memberError);
      // En cas d'erreur, on nettoie le profil et l'auth
      await supabaseAdmin.from('user_profiles').delete().eq('id', authData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la liaison à l\'école' },
        { status: 500 }
      );
    }

    // 5. Marquer l'invitation comme utilisée
    const { error: updateError } = await supabaseAdmin
      .from('student_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Update invitation error:', updateError);
      // On continue quand même car le compte est créé
    }

    // 6. Connecter l'utilisateur automatiquement
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: invitation.email,
        password: password,
      });

    if (sessionError || !sessionData.session) {
      // Le compte est créé mais la connexion a échoué
      // L'utilisateur peut se connecter manuellement
      return NextResponse.json(
        {
          success: true,
          message: 'Compte créé avec succès. Veuillez vous connecter.',
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: authData.user,
        session: sessionData.session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
