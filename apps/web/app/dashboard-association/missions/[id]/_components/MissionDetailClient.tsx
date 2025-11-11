'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MissionDetailHeader } from '@/components/missions/MissionDetailHeader';
import { MissionStatsCards } from '@/components/missions/MissionStatsCards';
import { MissionInfoSidebar } from '@/components/missions/MissionInfoSidebar';
import { MissionParticipantsList } from '@/components/missions/MissionParticipantsList';
import { DeleteMissionDialog } from '@/components/missions/DeleteMissionDialog';
import { EditMissionModal } from './EditMissionModal';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  duration: number | null;
  maximum_participant: number | null;
  recurrence_type: string;
  created_at: string;
  association_id: string;
  association_member_id: string;
  status: string;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  enrolledOn: string;
  status: string;
}

interface MissionDetailClientProps {
  mission: Mission;
  associationName: string;
  participants: Participant[];
  stats: {
    enrolled: number;
    maxParticipants: number | null;
    completed: number;
    avgRating: number;
    completionRate: number;
  };
  locale: 'fr' | 'en';
}

export function MissionDetailClient({
  mission,
  associationName,
  participants,
  stats,
  locale,
}: MissionDetailClientProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    router.refresh();
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      <MissionDetailHeader
        title={mission.title}
        status={mission.status}
        associationName={associationName}
        missionId={mission.id}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MissionStatsCards
        enrolled={stats.enrolled}
        maxParticipants={stats.maxParticipants}
        completed={stats.completed}
        avgRating={stats.avgRating}
        completionRate={stats.completionRate}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {mission.description && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'fr' ? 'Description' : 'Description'}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {mission.description}
              </p>
            </div>
          )}

          <MissionParticipantsList participants={participants} locale={locale} />
        </div>

        <div className="space-y-8">
          <MissionInfoSidebar
            mission={{
              startAt: mission.start_at,
              endAt: mission.end_at,
              duration: mission.duration,
              maxParticipants: mission.maximum_participant,
              recurrenceType: mission.recurrence_type,
              createdAt: mission.created_at,
            }}
            locale={locale}
          />
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteMissionDialog
        missionId={mission.id}
        missionTitle={mission.title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        locale={locale}
      />

      {/* Edit Modal */}
      {editModalOpen && (
        <EditMissionModal
          mission={mission}
          associationId={mission.association_id}
          currentMemberId={mission.association_member_id}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
