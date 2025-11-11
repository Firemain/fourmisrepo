import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le user_profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Profil utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'association_member
    const { data: associationMember } = await supabase
      .from('association_members')
      .select('id, association_id')
      .eq('user_profile_id', userProfile.id)
      .single();

    if (!associationMember) {
      return NextResponse.json(
        { error: 'Vous devez être membre d\'une association' },
        { status: 403 }
      );
    }

    // Vérifier que la mission appartient bien à l'association de l'utilisateur
    const { data: mission } = await supabase
      .from('missions')
      .select('id, association_id, association_member_id')
      .eq('id', params.id)
      .single();

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission non trouvée' },
        { status: 404 }
      );
    }

    if (mission.association_id !== associationMember.association_id) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas la permission de supprimer cette mission' },
        { status: 403 }
      );
    }

    // Supprimer la mission
    const { error: deleteError } = await supabase
      .from('missions')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting mission:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la mission' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Mission supprimée avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in DELETE /api/missions/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
