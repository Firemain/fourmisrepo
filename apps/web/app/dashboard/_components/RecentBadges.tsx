import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  color: string;
}

interface RecentBadgesProps {
  badges: Badge[];
  locale: 'fr' | 'en';
}

export default function RecentBadges({ badges, locale }: RecentBadgesProps) {
  const t = {
    fr: {
      title: 'Mes derniers badges',
      viewMore: 'Voir plus',
      noBadges: 'Aucun badge obtenu pour le moment',
      noBadgesPrompt: 'Complétez des missions pour gagner vos premiers badges !',
      earnedPrefix: 'Obtenu'
    },
    en: {
      title: 'My recent badges',
      viewMore: 'View more',
      noBadges: 'No badges earned yet',
      noBadgesPrompt: 'Complete missions to earn your first badges!',
      earnedPrefix: 'Earned'
    }
  };

  const text = t[locale];
  const dateLocale = locale === 'fr' ? fr : enUS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Award size={24} className="text-[#D6955B]" />
          {text.title}
        </h2>
        <Link 
          href="/dashboard/badges"
          className="flex items-center gap-1 text-sm text-[#18534F] hover:text-[#226D68] font-medium transition-colors"
        >
          {text.viewMore}
          <ArrowRight size={16} />
        </Link>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#ECF8F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-[#18534F]" />
          </div>
          <p className="text-gray-500 text-sm">
            {text.noBadges}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {text.noBadgesPrompt}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-[#18534F] transition-all hover:shadow-sm"
              style={{ backgroundColor: `${badge.color}10` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: badge.color }}
              >
                {badge.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {badge.description}
                </p>
                <p className="text-xs text-gray-400">
                  {text.earnedPrefix} {formatDistanceToNow(new Date(badge.earnedAt), { 
                    addSuffix: true,
                    locale: dateLocale 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
