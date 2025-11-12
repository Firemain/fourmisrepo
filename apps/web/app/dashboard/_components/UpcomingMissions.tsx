'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Mission {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  duration: number;
  association: string;
  status: string;
}

interface UpcomingMissionsProps {
  missions: Mission[];
  locale: 'fr' | 'en';
}

export default function UpcomingMissions({ missions, locale }: UpcomingMissionsProps) {
  const t = {
    fr: {
      title: 'Missions à venir',
      viewMore: 'Voir plus',
      noMissions: 'Aucune mission à venir',
      registerPrompt: 'Inscrivez-vous à de nouvelles missions !',
      today: 'Aujourd\'hui',
      tomorrow: 'Demain',
      at: 'à'
    },
    en: {
      title: 'Upcoming missions',
      viewMore: 'View more',
      noMissions: 'No upcoming missions',
      registerPrompt: 'Register for new missions!',
      today: 'Today',
      tomorrow: 'Tomorrow',
      at: 'at'
    }
  };

  const text = t[locale];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (isToday) return `${text.today} ${text.at} ${time}`;
    if (isTomorrow) return `${text.tomorrow} ${text.at} ${time}`;

    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="text-[#18534F]" size={24} />
          {text.title}
        </h2>
        <Link 
          href="/dashboard/missions"
          className="flex items-center gap-1 text-sm text-[#18534F] hover:text-[#226D68] font-medium transition-colors"
        >
          {text.viewMore}
          <ArrowRight size={16} />
        </Link>
      </div>

      {missions.length > 0 ? (
        <div className="space-y-4">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/dashboard/missions/${mission.id}`}
              className="group flex items-start gap-4 p-4 bg-gradient-to-r from-[#ECF8F6] to-white hover:from-[#ECF8F6] hover:to-[#ECF8F6] rounded-lg border border-[#ECF8F6] transition-all duration-300 cursor-pointer"
            >
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                <p className="text-sm text-[#D6955B] font-medium">{mission.association}</p>
                <p className="text-sm text-gray-600 mt-1">{formatDate(mission.startAt)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-[#18534F] text-white hover:bg-[#226D68] flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(mission.duration)}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-gray-600">{text.noMissions}</p>
          <p className="text-sm text-gray-500 mt-1">{text.registerPrompt}</p>
        </div>
      )}
    </div>
  );
}
