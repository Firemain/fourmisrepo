import { Users, CheckCircle, Star, Target } from 'lucide-react';

interface MissionStatsCardsProps {
  enrolled: number;
  maxParticipants: number | null;
  completed: number;
  avgRating: number;
  completionRate: number;
  locale: 'fr' | 'en';
}

const translations = {
  fr: {
    enrolled: 'Inscrits',
    completed: 'Complétées',
    avgRating: 'Note moyenne',
    completionRate: 'Taux de complétion',
  },
  en: {
    enrolled: 'Enrolled',
    completed: 'Completed',
    avgRating: 'Average Rating',
    completionRate: 'Completion Rate',
  },
};

export function MissionStatsCards({
  enrolled,
  maxParticipants,
  completed,
  avgRating,
  completionRate,
  locale,
}: MissionStatsCardsProps) {
  const text = translations[locale];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-[#ECF8F6] rounded-lg">
            <Users className="w-6 h-6 text-[#18534F]" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{text.enrolled}</p>
        <p className="text-3xl font-bold text-gray-900">
          {enrolled}/{maxParticipants || '∞'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-[#ECF8F6] rounded-lg">
            <CheckCircle className="w-6 h-6 text-[#226D68]" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{text.completed}</p>
        <p className="text-3xl font-bold text-gray-900">{completed}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-[#ECF8F6] rounded-lg">
            <Star className="w-6 h-6 text-[#D6955B]" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{text.avgRating}</p>
        <p className="text-3xl font-bold text-gray-900">
          {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : '-'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 bg-[#ECF8F6] rounded-lg">
            <Target className="w-6 h-6 text-[#D6955B]" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{text.completionRate}</p>
        <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
      </div>
    </div>
  );
}
