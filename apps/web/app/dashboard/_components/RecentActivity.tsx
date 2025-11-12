'use client';

import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'mission_completed' | 'new_registration';
  title: string;
  association: string;
  date: string;
  status: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  const getActivityColor = (type: string) => {
    if (type === 'mission_completed') return 'bg-[#18534F]';
    return 'bg-[#D6955B]';
  };

  const getActivityIcon = (type: string) => {
    if (type === 'mission_completed') return '✅';
    return '📝';
  };

  const getActivityLabel = (type: string) => {
    if (type === 'mission_completed') return 'Mission complétée:';
    return 'Nouvelle inscription:';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity className="text-[#226D68]" size={24} />
        Activité récente
      </h2>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.type)}`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{getActivityLabel(activity.type)}</span> {activity.title}
                  </p>
                </div>
                <p className="text-xs text-[#D6955B] font-medium ml-7">{activity.association}</p>
                <p className="text-xs text-gray-500 ml-7">{formatTimeAgo(activity.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-gray-600">Aucune activité récente</p>
          <p className="text-sm text-gray-500 mt-1">Commencez à participer aux missions !</p>
        </div>
      )}
    </div>
  );
}
