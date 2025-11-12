'use client';

import { Filter, Check } from 'lucide-react';

interface BadgeFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedRarity: string | null;
  onRarityChange: (rarity: string | null) => void;
  showOnlyEarned: boolean;
  onToggleEarned: (value: boolean) => void;
  locale: 'fr' | 'en';
}

export default function BadgeFilters({
  selectedCategory,
  onCategoryChange,
  selectedRarity,
  onRarityChange,
  showOnlyEarned,
  onToggleEarned,
  locale,
}: BadgeFiltersProps) {
  const t = {
    fr: {
      categories: 'Catégories',
      rarity: 'Rareté',
      all: 'Tous',
      onlyEarned: 'Seulement les badges débloqués',
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
    },
    en: {
      categories: 'Categories',
      rarity: 'Rarity',
      all: 'All',
      onlyEarned: 'Only earned badges',
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
    },
  };

  const text = t[locale];

  const categories = [
    { id: 'progression', label: text.progression, icon: '🎯' },
    { id: 'streak', label: text.streak, icon: '🔥' },
    { id: 'special', label: text.special, icon: '⚡' },
    { id: 'social', label: text.social, icon: '🤝' },
    { id: 'thematic', label: text.thematic, icon: '🌟' },
    { id: 'secret', label: text.secret, icon: '🔐' },
  ];

  const rarities = [
    { id: 'common', label: text.common, color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { id: 'rare', label: text.rare, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { id: 'epic', label: text.epic, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    { id: 'legendary', label: text.legendary, color: 'bg-yellow-100 text-yellow-700 border-yellow-400' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Toggle badges débloqués */}
      <div>
        <button
          onClick={() => onToggleEarned(!showOnlyEarned)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
            showOnlyEarned
              ? 'bg-[#18534F] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              showOnlyEarned ? 'border-white bg-white' : 'border-gray-400'
            }`}
          >
            {showOnlyEarned && <Check size={14} className="text-[#18534F]" />}
          </div>
          <span className="font-medium text-sm">{text.onlyEarned}</span>
        </button>
      </div>

      {/* Catégories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">{text.categories}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-[#18534F] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {text.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#18534F] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rareté */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">{text.rarity}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onRarityChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedRarity === null
                ? 'bg-[#18534F] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {text.all}
          </button>
          {rarities.map((rarity) => (
            <button
              key={rarity.id}
              onClick={() => onRarityChange(rarity.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                selectedRarity === rarity.id ? 'shadow-md scale-105' : ''
              } ${rarity.color}`}
            >
              {rarity.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
