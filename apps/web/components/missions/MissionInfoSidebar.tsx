import { Calendar, Clock, Users, Repeat } from 'lucide-react';

interface MissionInfo {
  startAt: string;
  endAt: string | null;
  duration: number | null;
  maxParticipants: number | null;
  recurrenceType: string;
  createdAt: string;
}

interface MissionInfoSidebarProps {
  mission: MissionInfo;
  locale: 'fr' | 'en';
}

const translations = {
  fr: {
    informations: 'Informations',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    duration: 'Durée',
    maxParticipants: 'Participants maximum',
    recurrence: 'Récurrence',
    createdAt: 'Créée le',
    unlimited: 'Illimité',
    none: 'Aucune',
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuelle',
    minutes: 'min',
  },
  en: {
    informations: 'Information',
    startDate: 'Start Date',
    endDate: 'End Date',
    duration: 'Duration',
    maxParticipants: 'Maximum Participants',
    recurrence: 'Recurrence',
    createdAt: 'Created on',
    unlimited: 'Unlimited',
    none: 'None',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    minutes: 'min',
  },
};

export function MissionInfoSidebar({ mission, locale }: MissionInfoSidebarProps) {
  const text = translations[locale];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} ${text.minutes}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getRecurrenceLabel = (recurrence: string) => {
    switch (recurrence) {
      case 'NONE':
        return text.none;
      case 'DAILY':
        return text.daily;
      case 'WEEKLY':
        return text.weekly;
      case 'MONTHLY':
        return text.monthly;
      default:
        return recurrence;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{text.informations}</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#ECF8F6] rounded-lg">
            <Calendar className="w-5 h-5 text-[#18534F]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{text.startDate}</p>
            <p className="font-medium text-gray-900">{formatDate(mission.startAt)}</p>
          </div>
        </div>

        {mission.endAt && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#ECF8F6] rounded-lg">
              <Calendar className="w-5 h-5 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{text.endDate}</p>
              <p className="font-medium text-gray-900">{formatDate(mission.endAt)}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#ECF8F6] rounded-lg">
            <Clock className="w-5 h-5 text-[#18534F]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{text.duration}</p>
            <p className="font-medium text-gray-900">{formatDuration(mission.duration)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#ECF8F6] rounded-lg">
            <Users className="w-5 h-5 text-[#18534F]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{text.maxParticipants}</p>
            <p className="font-medium text-gray-900">
              {mission.maxParticipants || text.unlimited}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#ECF8F6] rounded-lg">
            <Repeat className="w-5 h-5 text-[#18534F]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{text.recurrence}</p>
            <p className="font-medium text-gray-900">
              {getRecurrenceLabel(mission.recurrenceType)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {text.createdAt}: {formatDate(mission.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
