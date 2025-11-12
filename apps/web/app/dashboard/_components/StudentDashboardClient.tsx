'use client';

'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import UpcomingMissions from './UpcomingMissions';
import RecentBadges from './RecentBadges';

interface Stats {
  activeMissions: number;
  completedMissions: number;
  associations: number;
  validatedHours: number;
}

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

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  color: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface StudentDashboardClientProps {
  user: User;
  stats: Stats;
  upcomingMissions: Mission[];
  recentBadges: Badge[];
}

export default function StudentDashboardClient({
  user,
  stats,
  upcomingMissions,
  recentBadges
}: StudentDashboardClientProps) {
  const { locale } = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ECF8F6]">
      <DashboardHeader user={user} locale={locale} />
      
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <StatsCards stats={stats} locale={locale} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingMissions missions={upcomingMissions} locale={locale} />
          <RecentBadges badges={recentBadges} locale={locale} />
        </div>
      </div>
    </div>
  );
}
