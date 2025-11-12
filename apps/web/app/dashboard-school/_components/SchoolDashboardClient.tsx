'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { GraduationCap, Users, Clock, Target, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface SchoolDashboardClientProps {
  firstName: string;
  schoolName: string;
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalHours: number;
    activeMissions: number;
    totalRegistrations: number;
    completedMissions: number;
    completionRate: number;
    newStudentsThisMonth: number;
  };
  recentStudents: Array<{
    id: string;
    firstName: string;
    lastName: string;
    level: string;
    registeredAt: string;
  }>;
  topMissions: Array<{
    id: string;
    title: string;
    associationName: string;
    participantsCount: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

export default function SchoolDashboardClient({ 
  firstName,
  schoolName,
  stats,
  recentStudents,
  topMissions,
  dateRange,
}: SchoolDashboardClientProps) {
  const { locale } = useLocale();
  const router = useRouter();

  const handleDateRangeChange = (range: { start: Date; end: Date }) => {
    router.push(`/dashboard-school?start=${range.start.toISOString().split('T')[0]}&end=${range.end.toISOString().split('T')[0]}`);
  };

  const t = {
    fr: {
      title: 'Tableau de bord',
      welcome: `Bienvenue, ${firstName}`,
      subtitle: `Gérez l'engagement des étudiants de ${schoolName}`,
      
      // Stats
      totalStudents: 'Total étudiants',
      activeStudents: 'Étudiants actifs',
      totalHours: 'Heures totales',
      activeMissions: 'Missions actives',
      totalRegistrations: 'Inscriptions',
      completedMissions: 'Missions complétées',
      completionRate: 'Taux de complétion',
      newStudentsThisMonth: 'Nouveaux ce mois',
      
      // Sections
      recentStudents: 'Inscriptions récentes',
      topMissions: 'Missions populaires',
      viewAll: 'Voir tout',
      participants: 'participants',
      noStudents: 'Aucune inscription récente',
      noMissions: 'Aucune mission active',
      manageStudents: 'Gérer les étudiants',
    },
    en: {
      title: 'Dashboard',
      welcome: `Welcome, ${firstName}`,
      subtitle: `Manage ${schoolName}'s student engagement`,
      
      totalStudents: 'Total Students',
      activeStudents: 'Active Students',
      totalHours: 'Total Hours',
      activeMissions: 'Active Missions',
      totalRegistrations: 'Registrations',
      completedMissions: 'Completed Missions',
      completionRate: 'Completion Rate',
      newStudentsThisMonth: 'New This Month',
      
      recentStudents: 'Recent Registrations',
      topMissions: 'Popular Missions',
      viewAll: 'View all',
      participants: 'participants',
      noStudents: 'No recent registrations',
      noMissions: 'No active missions',
      manageStudents: 'Manage students',
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

  const avatarColors = ['#18534F', '#226D68', '#D6955B', '#FEEAA1'];
  const getAvatarColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header avec sélecteur de dates */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {text.welcome} 🎓
          </h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>
        
        {/* Date Range Picker */}
        <DateRangePicker
          dateRange={{
            start: new Date(dateRange.start),
            end: new Date(dateRange.end),
          }}
          onDateRangeChange={handleDateRangeChange}
          locale={locale}
        />
      </div>

      {/* Stats Cards - 8 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalStudents}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">+{stats.newStudentsThisMonth} ce mois</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.activeStudents}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalStudents > 0 ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}% du total
              </p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalHours}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalHours}h</p>
              <p className="text-xs text-gray-500 mt-1">{stats.completedMissions} missions complétées</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.activeMissions}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeMissions}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalRegistrations}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.completionRate}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
        </div>

        {/* Deux cartes supplémentaires pour faire 8 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B] hover:shadow-md transition-shadow col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne heures/étudiant</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeStudents > 0 ? (stats.totalHours / stats.activeStudents).toFixed(1) : '0'}h
              </p>
              <p className="text-xs text-gray-500 mt-1">Sur la période sélectionnée</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {text.recentStudents}
            </h2>
            <Link 
              href="/dashboard-school/students"
              className="text-sm font-medium text-[#18534F] hover:text-[#226D68] transition-colors"
            >
              {text.viewAll} →
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{text.noStudents}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((student, index) => (
                <Link
                  key={student.id}
                  href={`/dashboard-school/students/${student.id}`}
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
                        backgroundColor: getAvatarColor(student.id),
                      }}
                    >
                      {getInitials(student.firstName, student.lastName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.level}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{getTimeAgo(student.registeredAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Missions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {text.topMissions}
            </h2>
            <Link 
              href="/dashboard-school/missions"
              className="text-sm font-medium text-[#18534F] hover:text-[#226D68] transition-colors"
            >
              {text.viewAll} →
            </Link>
          </div>

          {topMissions.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{text.noMissions}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topMissions.map((mission, index) => (
                <div
                  key={mission.id}
                  className="p-4 bg-[#ECF8F6] rounded-xl hover:bg-[#D6EBE9] transition-colors"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                    <span className="text-xs font-medium px-3 py-1 bg-white border border-[#18534F] text-[#18534F] rounded-full">
                      {mission.participantsCount} {text.participants}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{mission.associationName}</p>
                </div>
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
