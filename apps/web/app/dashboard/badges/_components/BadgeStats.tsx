'use client';

import { TrendingUp, Award, Target, Percent } from 'lucide-react';

interface BadgeStatsProps {
  stats: {
    totalBadges: number;
    totalPoints: number;
    totalAvailable: number;
    completionRate: number;
  };
  locale: 'fr' | 'en';
}

export default function BadgeStats({ stats, locale }: BadgeStatsProps) {
  const t = {
    fr: {
      earned: 'Badges débloqués',
      points: 'Points totaux',
      available: 'Badges disponibles',
      completion: 'Taux de complétion',
    },
    en: {
      earned: 'Badges earned',
      points: 'Total points',
      available: 'Available badges',
      completion: 'Completion rate',
    },
  };

  const text = t[locale];

  const statCards = [
    {
      label: text.earned,
      value: stats.totalBadges,
      icon: Award,
      color: 'bg-[#18534F]',
      bgColor: 'bg-[#ECF8F6]',
    },
    {
      label: text.points,
      value: stats.totalPoints,
      icon: TrendingUp,
      color: 'bg-[#D6955B]',
      bgColor: 'bg-[#FEEAA1]/30',
    },
    {
      label: text.available,
      value: stats.totalAvailable,
      icon: Target,
      color: 'bg-[#226D68]',
      bgColor: 'bg-[#ECF8F6]',
    },
    {
      label: text.completion,
      value: `${stats.completionRate}%`,
      icon: Percent,
      color: 'bg-gradient-to-r from-[#18534F] to-[#226D68]',
      bgColor: 'bg-gradient-to-r from-[#ECF8F6] to-[#FEEAA1]/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="text-white" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
