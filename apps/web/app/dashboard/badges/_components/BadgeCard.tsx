'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Lock, Sparkles } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  category: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  earnedAt?: string;
  locale: 'fr' | 'en';
}

export default function BadgeCard({ badge, isEarned, earnedAt, locale }: BadgeCardProps) {
  const t = {
    fr: {
      earned: 'Débloqué',
      points: 'points',
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire',
    },
    en: {
      earned: 'Earned',
      points: 'points',
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
    },
  };

  const text = t[locale];
  const dateLocale = locale === 'fr' ? fr : enUS;

  const rarityStyles = {
    common: 'from-gray-100 to-gray-200 border-gray-300',
    rare: 'from-blue-100 to-blue-200 border-blue-300',
    epic: 'from-purple-100 to-purple-200 border-purple-300',
    legendary: 'from-yellow-100 to-yellow-200 border-yellow-400',
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-lg shadow-blue-200',
    epic: 'shadow-lg shadow-purple-200',
    legendary: 'shadow-xl shadow-yellow-300 animate-pulse',
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 group ${
        isEarned ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
      } ${isEarned && rarityGlow[badge.rarity]}`}
    >
      {/* Badge de rareté */}
      {isEarned && (
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityStyles[badge.rarity]} z-10`}>
          {text[badge.rarity]}
        </div>
      )}

      {/* Icône de verrouillage */}
      {!isEarned && (
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center z-10">
          <Lock size={16} className="text-gray-500" />
        </div>
      )}

      {/* Header avec gradient */}
      <div
        className={`relative h-32 flex items-center justify-center overflow-hidden ${
          isEarned ? 'bg-gradient-to-br' : 'bg-gray-100'
        }`}
        style={
          isEarned
            ? {
                backgroundImage: `linear-gradient(135deg, ${badge.color}20 0%, ${badge.color}40 100%)`,
              }
            : {}
        }
      >
        {/* Effet de brillance pour badges légendaires */}
        {isEarned && badge.rarity === 'legendary' && (
          <div className="absolute inset-0">
            <Sparkles className="absolute top-2 left-2 text-yellow-400 animate-pulse" size={16} />
            <Sparkles className="absolute bottom-2 right-2 text-yellow-400 animate-pulse delay-75" size={16} />
          </div>
        )}

        {/* Icône du badge */}
        <div
          className={`text-6xl transform transition-transform ${
            isEarned ? 'group-hover:scale-110' : 'grayscale'
          }`}
        >
          {badge.icon}
        </div>

        {/* Overlay pour badges verrouillés */}
        {!isEarned && <div className="absolute inset-0 bg-white/40"></div>}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className={`font-bold text-center mb-1 ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
          {locale === 'fr' ? badge.name : badge.nameEn}
        </h3>
        <p className={`text-xs text-center mb-3 line-clamp-2 min-h-8 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
          {locale === 'fr' ? badge.description : badge.descriptionEn}
        </p>

        {/* Points */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isEarned ? 'bg-[#FEEAA1] text-[#D6955B]' : 'bg-gray-200 text-gray-500'
            }`}
          >
            +{badge.points} {text.points}
          </div>
        </div>

        {/* Date d'obtention */}
        {isEarned && earnedAt && (
          <p className="text-xs text-center text-gray-500 mt-2">
            {text.earned}{' '}
            {formatDistanceToNow(new Date(earnedAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
