'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { Users, Target, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

interface AssociationDashboardClientProps {
  firstName: string;
  associationName: string;
  stats: {
    totalMembers: number;
    publishedMissions: number;
    totalMissions: number;
    engagementRate: number;
  };
  recentMembers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    level: string;
    joinedAt: string;
  }>;
  activeMissions: Array<{
    id: string;
    title: string;
    startAt: string;
    recurrenceType: string;
    confirmedCount: number;
    maxParticipants: number;
    fillRate: number;
  }>;
}

export default function AssociationDashboardClient({ 
  firstName,
  associationName,
  stats,
  recentMembers,
  activeMissions,
}: AssociationDashboardClientProps) {
  const { locale } = useLocale();

  const t = {
    fr: {
      title: 'Tableau de bord',
      welcome: `Bienvenue, ${firstName}`,
      subtitle: `Gérez les missions de ${associationName}`,
      members: 'Membres engagés',
      missions: 'Missions publiées',
      totalMissions: 'Total missions',
      engagement: 'Taux d\'engagement',
      recentMembers: 'Membres récemment actifs',
      activeMissions: 'Missions à venir',
      viewAll: 'Voir tout',
      places: 'places',
      noMembers: 'Aucun membre récent',
      noMissions: 'Aucune mission à venir',
      createMission: 'Créer une mission',
      daily: 'Quotidienne',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuelle',
      none: 'Ponctuelle',
    },
    en: {
      title: 'Dashboard',
      welcome: `Welcome, ${firstName}`,
      subtitle: `Manage ${associationName}'s missions`,
      members: 'Engaged members',
      missions: 'Published missions',
      totalMissions: 'Total missions',
      engagement: 'Engagement rate',
      recentMembers: 'Recently active members',
      activeMissions: 'Upcoming missions',
      viewAll: 'View all',
      places: 'spots',
      noMembers: 'No recent members',
      noMissions: 'No upcoming missions',
      createMission: 'Create a mission',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      none: 'One-time',
    },
  };

  const text = t[locale];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRecurrenceLabel = (type: string) => {
    const labels: Record<string, string> = {
      DAILY: text.daily,
      WEEKLY: text.weekly,
      MONTHLY: text.monthly,
      NONE: text.none,
    };
    return labels[type] || text.none;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return locale === 'fr' ? 'Aujourd\'hui' : 'Today';
    if (diffInDays === 1) return locale === 'fr' ? 'Hier' : 'Yesterday';
    if (diffInDays < 7) return locale === 'fr' ? `Il y a ${diffInDays}j` : `${diffInDays}d ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return locale === 'fr' ? `Il y a ${weeks}sem` : `${weeks}w ago`;
    }
    return formatDate(dateString);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {text.welcome} 🤝
        </h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.members}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.missions}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.publishedMissions}</p>
              <p className="text-xs text-gray-500 mt-1">sur {stats.totalMissions} {text.totalMissions.toLowerCase()}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.engagement}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.activeMissions}</p>
              <p className="text-3xl font-bold text-gray-900">{activeMissions.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {text.recentMembers}
            </h2>
            <Link 
              href="/dashboard-association/members"
              className="text-sm font-medium text-[#18534F] hover:text-[#226D68] transition-colors"
            >
              {text.viewAll} →
            </Link>
          </div>

          {recentMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{text.noMembers}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMembers.map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-[#ECF8F6] rounded-xl hover:bg-[#D6EBE9] transition-colors"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #18534F)`,
                      }}
                    >
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{member.level}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{getTimeAgo(member.joinedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Missions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {text.activeMissions}
            </h2>
            <Link 
              href="/dashboard-association/missions"
              className="text-sm font-medium text-[#18534F] hover:text-[#226D68] transition-colors"
            >
              {text.viewAll} →
            </Link>
          </div>

          {activeMissions.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">{text.noMissions}</p>
              <Link
                href="/dashboard-association/missions"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#18534F] hover:bg-[#226D68] text-white rounded-lg transition-colors"
              >
                {text.createMission}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeMissions.map((mission, index) => (
                <Link
                  key={mission.id}
                  href={`/dashboard-association/missions/${mission.id}`}
                  className="block p-4 bg-[#ECF8F6] rounded-xl hover:bg-[#D6EBE9] transition-colors"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                    <span className="text-xs font-medium px-3 py-1 bg-white border border-[#18534F] text-[#18534F] rounded-full">
                      {mission.confirmedCount}/{mission.maxParticipants} {text.places}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">{formatDate(mission.startAt)}</p>
                    <span className="text-xs text-gray-500">{getRecurrenceLabel(mission.recurrenceType)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#18534F] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${mission.fillRate}%` }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
