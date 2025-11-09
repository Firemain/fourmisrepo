'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';

export default function AssociationDashboardPage() {
  const { locale } = useLocale();

  const t = {
    fr: {
      title: 'Tableau de bord Association',
      welcome: 'Bienvenue, responsable d\'association',
      subtitle: 'Gérez vos missions et vos membres',
      members: 'Membres actifs',
      missions: 'Missions publiées',
      events: 'Événements',
      engagement: 'Taux d\'engagement',
      recentMembers: 'Nouveaux membres',
      activeMissions: 'Missions en cours',
      upcomingEvents: 'Événements à venir',
    },
    en: {
      title: 'Association Dashboard',
      welcome: 'Welcome, association manager',
      subtitle: 'Manage your missions and members',
      members: 'Active members',
      missions: 'Published missions',
      events: 'Events',
      engagement: 'Engagement rate',
      recentMembers: 'New members',
      activeMissions: 'Ongoing missions',
      upcomingEvents: 'Upcoming events',
    },
  };

  const text = t[locale];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {text.welcome} 🤝
        </h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.members}</p>
              <p className="text-3xl font-bold text-gray-900">48</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.missions}</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.events}</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.engagement}</p>
              <p className="text-3xl font-bold text-gray-900">78%</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {text.recentMembers}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#ECF8F6] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#18534F] rounded-full flex items-center justify-center text-white font-semibold">
                  AB
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Alice Bernard</p>
                  <p className="text-sm text-gray-600">Master 2 - Marketing</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Hier</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#ECF8F6] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#226D68] rounded-full flex items-center justify-center text-white font-semibold">
                  TC
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Thomas Cohen</p>
                  <p className="text-sm text-gray-600">Licence 3 - Informatique</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Il y a 2j</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {text.activeMissions}
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#ECF8F6] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Aide aux devoirs</h3>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  22/25 places
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Tous les mardis et jeudis</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#18534F] h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-[#ECF8F6] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Collecte alimentaire</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  10/15 places
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Vendredi 15 janvier</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#226D68] h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
