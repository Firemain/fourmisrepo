'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import BadgeCard from './BadgeCard';
import BadgeStats from './BadgeStats';
import BadgeFilters from './BadgeFilters';
import { Trophy, Award } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  category: 'progression' | 'streak' | 'special' | 'social' | 'thematic' | 'secret';
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface EarnedBadge {
  id: string;
  earnedAt: string;
  badge: Badge;
}

interface BadgesClientProps {
  earnedBadges: EarnedBadge[];
  allBadges: Badge[];
  userStats: {
    totalBadges: number;
    totalPoints: number;
    totalAvailable: number;
    completionRate: number;
  };
  userName: string;
}

export default function BadgesClient({
  earnedBadges,
  allBadges,
  userStats,
  userName,
}: BadgesClientProps) {
  const { locale } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [showOnlyEarned, setShowOnlyEarned] = useState(false);

  const t = {
    fr: {
      title: 'Mes Badges',
      subtitle: 'Collectionne des badges en accomplissant des missions',
      earned: 'Débloqués',
      locked: 'Verrouillés',
      all: 'Tous',
      progression: 'Progression',
      streak: 'Constance',
      special: 'Spéciaux',
      social: 'Sociaux',
      thematic: 'Thématiques',
      secret: 'Secrets',
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire',
      noBadges: 'Aucun badge trouvé',
      tryAdjust: 'Essaie de changer tes filtres',
      congratulations: 'Félicitations',
      keepGoing: 'Continue comme ça !',
    },
    en: {
      title: 'My Badges',
      subtitle: 'Collect badges by completing missions',
      earned: 'Earned',
      locked: 'Locked',
      all: 'All',
      progression: 'Progression',
      streak: 'Streak',
      special: 'Special',
      social: 'Social',
      thematic: 'Thematic',
      secret: 'Secret',
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      noBadges: 'No badges found',
      tryAdjust: 'Try changing your filters',
      congratulations: 'Congratulations',
      keepGoing: 'Keep it up!',
    },
  };

  const text = t[locale];

  // Map pour savoir quels badges sont débloqués
  const earnedBadgeIds = new Set(earnedBadges.map((eb) => eb.badge.id));

  // Filtrer les badges
  let filteredBadges = allBadges;

  if (selectedCategory) {
    filteredBadges = filteredBadges.filter((b) => b.category === selectedCategory);
  }

  if (selectedRarity) {
    filteredBadges = filteredBadges.filter((b) => b.rarity === selectedRarity);
  }

  if (showOnlyEarned) {
    filteredBadges = filteredBadges.filter((b) => earnedBadgeIds.has(b.id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#ECF8F6] to-[#FEEAA1]/10">
      {/* Header avec effet */}
      <div className="relative bg-gradient-to-r from-[#18534F] via-[#226D68] to-[#18534F] overflow-hidden">
        {/* Décorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEEAA1] rounded-full opacity-20 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D6955B] rounded-full opacity-20 blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto p-8 py-12">
          <div className="flex items-center gap-4 mb-3">
            <Trophy className="text-[#FEEAA1]" size={40} />
            <h1 className="text-4xl font-bold text-white">{text.title}</h1>
          </div>
          <p className="text-[#ECF8F6] text-lg mb-6">{text.subtitle}</p>

          {/* Message de motivation */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 inline-flex items-center gap-3">
            <Award className="text-[#FEEAA1]" size={24} />
            <div>
              <p className="text-white font-semibold">
                {text.congratulations}, {userName} ! {text.keepGoing}
              </p>
              <p className="text-[#ECF8F6]/80 text-sm">
                {userStats.totalBadges} / {userStats.totalAvailable} badges • {userStats.totalPoints} points
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Stats */}
        <BadgeStats stats={userStats} locale={locale} />

        {/* Filtres */}
        <BadgeFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedRarity={selectedRarity}
          onRarityChange={setSelectedRarity}
          showOnlyEarned={showOnlyEarned}
          onToggleEarned={setShowOnlyEarned}
          locale={locale}
        />

        {/* Grille de badges */}
        {filteredBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBadges.map((badge) => {
              const earnedBadge = earnedBadges.find((eb) => eb.badge.id === badge.id);
              return (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={!!earnedBadge}
                  earnedAt={earnedBadge?.earnedAt}
                  locale={locale}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Award className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{text.noBadges}</h3>
            <p className="text-gray-600">{text.tryAdjust}</p>
          </div>
        )}
      </div>
    </div>
  );
}
