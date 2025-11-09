'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { locale } = useLocale();

  const t = {
    fr: {
      welcome: 'Bienvenue',
      subtitle: 'Voici votre espace personnel Fourmis',
      activeMissions: 'Missions actives',
      badgesEarned: 'Badges gagnés',
      associations: 'Associations',
      validatedHours: 'Heures validées',
      upcomingMissions: 'Missions à venir',
      recentActivity: 'Activité récente',
      tutoring: 'Tutorat Mathématiques',
      tomorrow: 'Demain à 14h00',
      workshop: 'Atelier Écologie',
      friday: 'Vendredi à 10h00',
      badgeUnlocked: 'Badge débloqué:',
      expertTutor: 'Tuteur Expert',
      daysAgo: 'Il y a',
      missionCompleted: 'Mission complétée:',
      schoolSupport: 'Soutien scolaire',
      newRegistration: 'Nouvelle inscription:',
      sustainableClub: 'Club Développement Durable',
    },
    en: {
      welcome: 'Welcome',
      subtitle: 'This is your personal Fourmis space',
      activeMissions: 'Active missions',
      badgesEarned: 'Badges earned',
      associations: 'Clubs',
      validatedHours: 'Validated hours',
      upcomingMissions: 'Upcoming missions',
      recentActivity: 'Recent activity',
      tutoring: 'Math Tutoring',
      tomorrow: 'Tomorrow at 2:00 PM',
      workshop: 'Ecology Workshop',
      friday: 'Friday at 10:00 AM',
      badgeUnlocked: 'Badge unlocked:',
      expertTutor: 'Expert Tutor',
      daysAgo: '',
      missionCompleted: 'Mission completed:',
      schoolSupport: 'School Support',
      newRegistration: 'New registration:',
      sustainableClub: 'Sustainable Development Club',
    },
  };

  const text = t[locale];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {text.welcome}, {user?.email?.split('@')[0]} ! 👋
        </h1>
        <p className="text-gray-600">
          {text.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.activeMissions}</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.badgesEarned}</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.associations}</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.validatedHours}</p>
              <p className="text-3xl font-bold text-gray-900">45h</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {text.upcomingMissions}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-[#ECF8F6] rounded-lg">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{text.tutoring}</h3>
                <p className="text-sm text-gray-600">{text.tomorrow}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#18534F] text-white">
                    2h
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#ECF8F6] rounded-lg">
              <div className="text-3xl">🌱</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{text.workshop}</h3>
                <p className="text-sm text-gray-600">{text.friday}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#18534F] text-white">
                    3h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {text.recentActivity}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#18534F]"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{text.badgeUnlocked}</span> {text.expertTutor}
                </p>
                <p className="text-xs text-gray-500">{text.daysAgo} 2 jours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#226D68]"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{text.missionCompleted}</span> {text.schoolSupport}
                </p>
                <p className="text-xs text-gray-500">{text.daysAgo} 3 jours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#D6955B]"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{text.newRegistration}</span> {text.sustainableClub}
                </p>
                <p className="text-xs text-gray-500">{text.daysAgo} 5 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
