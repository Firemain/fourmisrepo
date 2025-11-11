import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChatClient from './_components/ChatClient';

export default async function ChatPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Récupérer le user_profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, role, full_name')
    .eq('user_id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'ASSOCIATION') {
    redirect('/dashboard');
  }

  // 3. Récupérer l'association_member
  const { data: associationMember } = await supabase
    .from('association_members')
    .select('id, first_name, last_name, association_id')
    .eq('user_profile_id', userProfile.id)
    .single();

  if (!associationMember) {
    redirect('/dashboard?error=no_association');
  }

  // TODO: Récupérer les vraies missions où je suis référent
  // const { data: myMissions } = await supabase
  //   .from('missions')
  //   .select('id, title')
  //   .eq('association_member_id', associationMember.id);

  // Pour l'instant, données mockées
  const mockConversations = [
    {
      id: '1',
      missionTitle: 'Collecte alimentaire - Quartier Nord',
      lastMessage: 'Bonjour, à quelle heure commence la mission ?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
      unreadCount: 3,
      participants: 8,
    },
    {
      id: '2',
      missionTitle: 'Distribution de repas - Centre-ville',
      lastMessage: 'Merci pour votre réponse !',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      unreadCount: 0,
      participants: 12,
    },
    {
      id: '3',
      missionTitle: 'Atelier cuisine solidaire',
      lastMessage: 'Est-ce qu\'il faut apporter quelque chose ?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      unreadCount: 1,
      participants: 5,
    },
  ];

  return (
    <ChatClient 
      conversations={mockConversations}
      currentUserName={`${associationMember.first_name} ${associationMember.last_name}`}
    />
  );
}
