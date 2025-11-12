import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BadgesClient from './_components/BadgesClient';

export default async function BadgesPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Récupérer le profil utilisateur
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!userProfile) {
    console.log('❌ BADGES PAGE - No user profile found, redirecting to login');
    redirect('/login');
  }

  // 3. Récupérer les informations de l'étudiant depuis school_members
  const { data: schoolMember, error: memberError } = await supabase
    .from('school_members')
    .select('id, first_name, last_name')
    .eq('user_profile_id', userProfile.id)
    .single();

  console.log('🎖️ BADGES PAGE - School member:', {
    userProfileId: userProfile.id,
    member: schoolMember,
    error: memberError?.message,
  });

  if (!schoolMember) {
    console.log('❌ BADGES PAGE - No school member found, redirecting to login');
    redirect('/login');
  }

  // TODO: Pour l'instant, données mockées - à remplacer par une vraie requête DB
  // const { data: earnedBadges } = await supabase
  //   .from('user_badges')
  //   .select('*, badge:badges(*)')
  //   .eq('user_profile_id', userProfile.id)
  //   .order('earned_at', { ascending: false });

  // Données mockées réalistes
  const mockEarnedBadges = [
    {
      id: '1',
      badgeId: 'first-mission',
      earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
    },
    {
      id: '2',
      badgeId: 'early-bird',
      earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
    },
    {
      id: '3',
      badgeId: 'team-player',
      earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hier
    },
  ];

  // Tous les badges disponibles (catalogue complet)
  const allAvailableBadges = [
    // Badges de progression
    {
      id: 'first-mission',
      name: 'Premier pas',
      nameEn: 'First Step',
      description: 'Complète ta première mission',
      descriptionEn: 'Complete your first mission',
      icon: '🎯',
      category: 'progression',
      color: '#4CAF50',
      rarity: 'common',
      points: 10,
    },
    {
      id: '5-missions',
      name: 'Explorateur',
      nameEn: 'Explorer',
      description: 'Complète 5 missions',
      descriptionEn: 'Complete 5 missions',
      icon: '🗺️',
      category: 'progression',
      color: '#2196F3',
      rarity: 'common',
      points: 25,
    },
    {
      id: '10-missions',
      name: 'Aventurier',
      nameEn: 'Adventurer',
      description: 'Complète 10 missions',
      descriptionEn: 'Complete 10 missions',
      icon: '⛰️',
      category: 'progression',
      color: '#9C27B0',
      rarity: 'rare',
      points: 50,
    },
    {
      id: '25-missions',
      name: 'Champion',
      nameEn: 'Champion',
      description: 'Complète 25 missions',
      descriptionEn: 'Complete 25 missions',
      icon: '👑',
      category: 'progression',
      color: '#FF9800',
      rarity: 'epic',
      points: 100,
    },
    {
      id: '50-missions',
      name: 'Légende',
      nameEn: 'Legend',
      description: 'Complète 50 missions',
      descriptionEn: 'Complete 50 missions',
      icon: '⭐',
      category: 'progression',
      color: '#FFD700',
      rarity: 'legendary',
      points: 250,
    },

    // Badges de constance
    {
      id: 'streak-7',
      name: 'Une semaine de feu',
      nameEn: 'On Fire Week',
      description: '7 jours consécutifs d\'activité',
      descriptionEn: '7 consecutive days of activity',
      icon: '🔥',
      category: 'streak',
      color: '#FF5722',
      rarity: 'rare',
      points: 30,
    },
    {
      id: 'streak-30',
      name: 'Mois parfait',
      nameEn: 'Perfect Month',
      description: '30 jours consécutifs d\'activité',
      descriptionEn: '30 consecutive days of activity',
      icon: '🌟',
      category: 'streak',
      color: '#FF4081',
      rarity: 'epic',
      points: 150,
    },
    {
      id: 'streak-100',
      name: 'Flamme éternelle',
      nameEn: 'Eternal Flame',
      description: '100 jours consécutifs d\'activité',
      descriptionEn: '100 consecutive days of activity',
      icon: '💫',
      category: 'streak',
      color: '#E91E63',
      rarity: 'legendary',
      points: 500,
    },

    // Badges de rapidité
    {
      id: 'early-bird',
      name: 'Lève-tôt',
      nameEn: 'Early Bird',
      description: 'Complète une mission avant 8h',
      descriptionEn: 'Complete a mission before 8am',
      icon: '🌅',
      category: 'special',
      color: '#FFC107',
      rarity: 'rare',
      points: 20,
    },
    {
      id: 'night-owl',
      name: 'Oiseau de nuit',
      nameEn: 'Night Owl',
      description: 'Complète une mission après 22h',
      descriptionEn: 'Complete a mission after 10pm',
      icon: '🦉',
      category: 'special',
      color: '#673AB7',
      rarity: 'rare',
      points: 20,
    },
    {
      id: 'speed-runner',
      name: 'Éclair',
      nameEn: 'Lightning',
      description: 'Complète 3 missions en une journée',
      descriptionEn: 'Complete 3 missions in one day',
      icon: '⚡',
      category: 'special',
      color: '#FFEB3B',
      rarity: 'epic',
      points: 75,
    },

    // Badges de collaboration
    {
      id: 'team-player',
      name: 'Esprit d\'équipe',
      nameEn: 'Team Spirit',
      description: 'Participe à 5 missions en groupe',
      descriptionEn: 'Participate in 5 group missions',
      icon: '🤝',
      category: 'social',
      color: '#00BCD4',
      rarity: 'common',
      points: 30,
    },
    {
      id: 'social-butterfly',
      name: 'Papillon social',
      nameEn: 'Social Butterfly',
      description: 'Travaille avec 10 personnes différentes',
      descriptionEn: 'Work with 10 different people',
      icon: '🦋',
      category: 'social',
      color: '#E1BEE7',
      rarity: 'rare',
      points: 50,
    },
    {
      id: 'leader',
      name: 'Leader né',
      nameEn: 'Born Leader',
      description: 'Organise 3 missions',
      descriptionEn: 'Organize 3 missions',
      icon: '🎖️',
      category: 'social',
      color: '#795548',
      rarity: 'epic',
      points: 100,
    },

    // Badges thématiques
    {
      id: 'eco-warrior',
      name: 'Éco-guerrier',
      nameEn: 'Eco Warrior',
      description: 'Complète 5 missions environnementales',
      descriptionEn: 'Complete 5 environmental missions',
      icon: '🌱',
      category: 'thematic',
      color: '#8BC34A',
      rarity: 'rare',
      points: 40,
    },
    {
      id: 'helper',
      name: 'Main tendue',
      nameEn: 'Helping Hand',
      description: 'Complète 5 missions d\'entraide',
      descriptionEn: 'Complete 5 solidarity missions',
      icon: '🫱',
      category: 'thematic',
      color: '#FF6B9D',
      rarity: 'rare',
      points: 40,
    },
    {
      id: 'culture-lover',
      name: 'Amoureux de la culture',
      nameEn: 'Culture Lover',
      description: 'Complète 5 missions culturelles',
      descriptionEn: 'Complete 5 cultural missions',
      icon: '🎭',
      category: 'thematic',
      color: '#9C27B0',
      rarity: 'rare',
      points: 40,
    },

    // Badges secrets/easter eggs
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      nameEn: 'Perfectionist',
      description: 'Obtiens une note parfaite 5 fois',
      descriptionEn: 'Get a perfect rating 5 times',
      icon: '💯',
      category: 'secret',
      color: '#F44336',
      rarity: 'epic',
      points: 80,
    },
    {
      id: 'unicorn',
      name: 'Licorne',
      nameEn: 'Unicorn',
      description: '???',
      descriptionEn: '???',
      icon: '🦄',
      category: 'secret',
      color: '#E91E63',
      rarity: 'legendary',
      points: 500,
    },
  ];

  // Formater les données comme si elles venaient de la DB
  const earnedBadges = mockEarnedBadges.map((eb) => {
    const badge = allAvailableBadges.find((b) => b.id === eb.badgeId);
    return {
      id: eb.id,
      earnedAt: eb.earnedAt,
      badge: badge!,
    };
  });

  const userStats = {
    totalBadges: earnedBadges.length,
    totalPoints: earnedBadges.reduce((sum, eb) => sum + eb.badge.points, 0),
    totalAvailable: allAvailableBadges.length,
    completionRate: Math.round((earnedBadges.length / allAvailableBadges.length) * 100),
  };

  return (
    <BadgesClient
      earnedBadges={earnedBadges}
      allBadges={allAvailableBadges}
      userStats={userStats}
      userName={schoolMember.first_name}
    />
  );
}
