'use client';

interface Stats {
  activeMissions: number;
  completedMissions: number;
  associations: number;
  validatedHours: number;
}

interface StatsCardsProps {
  stats: Stats;
  locale: 'fr' | 'en';
}

export default function StatsCards({ stats, locale }: StatsCardsProps) {
  const t = {
    fr: {
      activeMissions: 'Missions actives',
      completedMissions: 'Missions complétées',
      associations: 'Associations',
      validatedHours: 'Heures validées'
    },
    en: {
      activeMissions: 'Active missions',
      completedMissions: 'Completed missions',
      associations: 'Associations',
      validatedHours: 'Validated hours'
    }
  };

  const text = t[locale];

  const cards = [
    {
      label: text.activeMissions,
      value: stats.activeMissions,
      icon: '📚',
      color: 'border-[#18534F]',
      bgColor: 'bg-[#ECF8F6]'
    },
    {
      label: text.completedMissions,
      value: stats.completedMissions,
      icon: '🏆',
      color: 'border-[#226D68]',
      bgColor: 'bg-[#ECF8F6]'
    },
    {
      label: text.associations,
      value: stats.associations,
      icon: '👥',
      color: 'border-[#D6955B]',
      bgColor: 'bg-[#FEEAA1]'
    },
    {
      label: text.validatedHours,
      value: `${stats.validatedHours}h`,
      icon: '⏱️',
      color: 'border-[#FEEAA1]',
      bgColor: 'bg-[#FEEAA1]/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${card.color} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`text-4xl w-14 h-14 rounded-full ${card.bgColor} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
