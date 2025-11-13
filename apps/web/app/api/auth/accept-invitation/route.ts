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

    // 2. Vérifier si l'utilisateur existe déjà
    console.log('[ACCEPT-INVITATION] Vérification si user existe:', invitation.email);
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === invitation.email);
    
    if (existingUser) {
      console.log('[ACCEPT-INVITATION] User existe déjà, suppression...');
      // Supprimer l'ancien user et son profil
      await supabaseAdmin.from('user_profiles').delete().eq('user_id', existingUser.id);
      await supabaseAdmin.from('school_members').delete().eq('user_profile_id', existingUser.id);
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
    }

    // 3. Créer le compte utilisateur avec Supabase Auth
    console.log('[ACCEPT-INVITATION] Création du compte pour:', invitation.email);
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password: password,
        email_confirm: true, // Confirmer l'email automatiquement
      });

    if (authError || !authData.user) {
      console.error('[ACCEPT-INVITATION] Auth error:', authError);
      return NextResponse.json(
        {
          error:
            authError?.message || 'Erreur lors de la création du compte',
        },
        { status: 400 }
      );
    }

    console.log('[ACCEPT-INVITATION] User créé:', authData.user.id);

    // 4. Créer ou mettre à jour le profil utilisateur
    console.log('[ACCEPT-INVITATION] Création/mise à jour du profil...');
    
    // D'abord vérifier si le profil existe déjà (trigger auto de Supabase)
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', authData.user.id)
      .single();

    let profileError;
    let userProfileId;
    
    if (existingProfile) {
      // Mettre à jour le profil existant
      console.log('[ACCEPT-INVITATION] Profil existe déjà, mise à jour...');
      userProfileId = existingProfile.id;
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          email: invitation.email,
          full_name: `${firstName} ${lastName}`,
          role: 'STUDENT',
        })
        .eq('user_id', authData.user.id);
      profileError = error;
    } else {
      // Créer le profil
      console.log('[ACCEPT-INVITATION] Création du profil...');
      const { data: newProfile, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          email: invitation.email,
          full_name: `${firstName} ${lastName}`,
          role: 'STUDENT',
          avatar_url: null,
        })
        .select('id')
        .single();
      profileError = error;
      userProfileId = newProfile?.id;
    }

    if (profileError || !userProfileId) {
      console.error('[ACCEPT-INVITATION] Profile error:', profileError);
      // Si le profil échoue, on essaie de supprimer le user auth créé
      console.log('[ACCEPT-INVITATION] Suppression du user auth...');
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil' },
        { status: 500 }
      );
    }

    console.log('[ACCEPT-INVITATION] Profil créé avec succès, ID:', userProfileId);

    // 5. Créer la liaison avec l'école (school_members)
    // Créer un contact vide (l'étudiant pourra renseigner son adresse dans les paramètres)
    
    const { data: contact, error: contactError } = await supabaseAdmin
      .from('contacts')
      .insert({
        country: null,
        city: null,
        postal_code: null,
        street: null,
        phone_number: null,
      })
      .select()
      .single();

    if (contactError || !contact) {
      console.error('Contact error:', contactError);
      await supabaseAdmin.from('user_profiles').delete().eq('id', userProfileId);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la création du contact' },
        { status: 500 }
      );
    }

    // Récupérer un niveau académique de l'école (prendre le premier disponible)
    const { data: academicLevel } = await supabaseAdmin
      .from('ref_academic_levels')
      .select('id')
      .eq('school_id', invitation.school_id)
      .limit(1)
      .single();

    if (!academicLevel) {
      console.error('Aucun niveau académique trouvé pour cette école');
      await supabaseAdmin.from('contacts').delete().eq('id', contact.id);
      await supabaseAdmin.from('user_profiles').delete().eq('id', userProfileId);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Aucun niveau académique configuré pour cette école' },
        { status: 500 }
      );
    }

    // Ensuite créer le school_member avec tous les champs requis
    const { error: memberError } = await supabaseAdmin
      .from('school_members')
      .insert({
        school_id: invitation.school_id,
        user_profile_id: userProfileId,
        first_name: firstName,
        last_name: lastName,
        type: 'STUDENT',
        academic_level_id: academicLevel.id,
        contact_id: contact.id,
        email: invitation.email,
      });

    if (memberError) {
      console.error('Member error:', memberError);
      // En cas d'erreur, on nettoie le profil et l'auth
      await supabaseAdmin.from('contacts').delete().eq('id', contact.id);
      await supabaseAdmin.from('user_profiles').delete().eq('id', userProfileId);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la liaison à l\'école' },
        { status: 500 }
      );
    }

    // 6. Marquer l'invitation comme utilisée
    const { error: updateError } = await supabaseAdmin
      .from('student_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Update invitation error:', updateError);
      // On continue quand même car le compte est créé
    }

    // 7. Succès - l'utilisateur peut maintenant se connecter
    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès. Vous pouvez maintenant vous connecter.',
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
