'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  Target,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { CreateMissionModal } from './CreateMissionModal';
import { MissionActionsDropdown } from '@/components/missions/MissionActionsDropdown';
import { DeleteMissionDialog } from '@/components/missions/DeleteMissionDialog';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  maximum_participant: number | null;
  duration: number | null;
  status: string;
  recurrence_type: string;
  association_member_id: string;
  created_at: string;
}

interface RegistrationStats {
  totalRegistrations: number;
  completedRegistrations: number;
  registrationsByMission: Record<string, {
    total: number;
    completed: number;
    confirmed: number;
  }>;
}

interface MissionsClientProps {
  initialMissions: Mission[];
  associationId: string;
  currentMemberId: string;
  registrationStats: RegistrationStats;
}

export function MissionsClient({ 
  initialMissions, 
  associationId, 
  currentMemberId,
  registrationStats,
}: MissionsClientProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const missions = initialMissions; // Server-fetched data, revalidated on router.refresh()
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRecurrence, setFilterRecurrence] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showMyMissionsOnly, setShowMyMissionsOnly] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<{ id: string; title: string } | null>(null);

  const t = {
    fr: {
      title: 'Gestion des Missions',
      subtitle: 'Créez et gérez vos missions d\'engagement',
      
      createMission: 'Créer une mission',
      search: 'Rechercher une mission...',
      filterStatus: 'Filtrer par statut',
      allStatus: 'Tous les statuts',
      myMissions: 'Mes missions',
      filterDate: 'Date',
      filterRecurrence: 'Type de récurrence',
      allRecurrences: 'Tous les types',
      oneTime: 'Ponctuelle',
      recurring: 'Récurrente',
      
      // Stats
      totalMissions: 'Total missions',
      activeMissions: 'Missions actives',
      totalParticipants: 'Participants totaux',
      completionRate: 'Taux de complétion',
      
      // Status
      draft: 'Brouillon',
      published: 'Publiée',
      archived: 'Archivée',
      cancelled: 'Annulée',
      
      // Table
      mission: 'Mission',
      startDate: 'Date de début',
      duration: 'Durée',
      participants: 'Participants',
      status: 'Statut',
      actions: 'Actions',
      
      // Actions
      edit: 'Modifier',
      delete: 'Supprimer',
      view: 'Voir les détails',
      
      // Messages
      noMissions: 'Aucune mission pour le moment',
      createFirst: 'Créez votre première mission pour commencer',
      
      hours: 'heures',
      minutes: 'min',
    },
    en: {
      title: 'Mission Management',
      subtitle: 'Create and manage your engagement missions',
      
      createMission: 'Create Mission',
      search: 'Search for a mission...',
      filterStatus: 'Filter by status',
      allStatus: 'All statuses',
      myMissions: 'My missions',
      filterDate: 'Date',
      filterRecurrence: 'Recurrence type',
      allRecurrences: 'All types',
      oneTime: 'One-time',
      recurring: 'Recurring',
      
      totalMissions: 'Total Missions',
      activeMissions: 'Active Missions',
      totalParticipants: 'Total Participants',
      completionRate: 'Completion Rate',
      
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      cancelled: 'Cancelled',
      
      mission: 'Mission',
      startDate: 'Start Date',
      duration: 'Duration',
      participants: 'Participants',
      status: 'Status',
      actions: 'Actions',
      
      edit: 'Edit',
      delete: 'Delete',
      view: 'View Details',
      
      noMissions: 'No missions yet',
      createFirst: 'Create your first mission to get started',
      
      hours: 'hours',
      minutes: 'min',
    },
  };

  const text = t[locale];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700 hover:bg-green-100 border-0';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 hover:bg-red-100 border-0';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return text.published;
      case 'DRAFT':
        return text.draft;
      case 'ARCHIVED':
        return text.archived;
      case 'CANCELLED':
        return text.cancelled;
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
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

  // Statistiques calculées
  const stats = {
    total: missions.length,
    active: missions.filter(m => m.status === 'PUBLISHED').length,
    participants: registrationStats.totalRegistrations,
    completionRate: registrationStats.totalRegistrations > 0 
      ? Math.round((registrationStats.completedRegistrations / registrationStats.totalRegistrations) * 100)
      : 0,
  };

  // Missions filtrées
  const filteredMissions = missions.filter(mission => {
    const missionDate = new Date(mission.start_at);
    
    // Filtre par statut
    if (filterStatus !== 'all' && mission.status !== filterStatus) return false;
    
    // Filtre par recherche
    if (searchQuery !== '' && !mission.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filtre mes missions
    if (showMyMissionsOnly && mission.association_member_id !== currentMemberId) return false;
    
    // Filtre par date sélectionnée
    if (selectedDate) {
      const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const missionDay = new Date(missionDate.getFullYear(), missionDate.getMonth(), missionDate.getDate());
      
      if (missionDay.getTime() !== selectedDay.getTime()) return false;
    }
    
    // Filtre par récurrence
    if (filterRecurrence !== 'all') {
      if (filterRecurrence === 'oneTime' && mission.recurrence_type !== 'NONE') return false;
      if (filterRecurrence === 'recurring' && mission.recurrence_type === 'NONE') return false;
    }
    
    return true;
  });

  const handleMissionCreated = () => {
    setShowCreateModal(false);
    // Rafraîchir la page pour recharger les données depuis le serveur
    router.refresh();
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Target className="w-8 h-8 text-[#18534F]" />
              {text.title}
            </h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            {text.createMission}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Target className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalMissions}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <CheckCircle className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.activeMissions}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Users className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalParticipants}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.participants}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Target className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.completionRate}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Recherche */}
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={text.search}
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Filtre Statut */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 h-11">
              <SelectValue placeholder={text.filterStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allStatus}</SelectItem>
              <SelectItem value="PUBLISHED">{text.published}</SelectItem>
              <SelectItem value="DRAFT">{text.draft}</SelectItem>
              <SelectItem value="ARCHIVED">{text.archived}</SelectItem>
              <SelectItem value="CANCELLED">{text.cancelled}</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtre Date */}
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder={text.filterDate}
            locale={locale}
            className="w-44"
          />

          {/* Filtre Récurrence */}
          <Select value={filterRecurrence} onValueChange={setFilterRecurrence}>
            <SelectTrigger className="w-44 h-11">
              <SelectValue placeholder={text.filterRecurrence} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allRecurrences}</SelectItem>
              <SelectItem value="oneTime">{text.oneTime}</SelectItem>
              <SelectItem value="recurring">{text.recurring}</SelectItem>
            </SelectContent>
          </Select>

          {/* Checkbox Mes missions */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={showMyMissionsOnly}
              onCheckedChange={(checked) => setShowMyMissionsOnly(checked === true)}
              id="my-missions-filter"
            />
            <label 
              htmlFor="my-missions-filter"
              className="text-sm font-medium text-gray-700 group-hover:text-[#18534F] transition-colors cursor-pointer"
            >
              {text.myMissions}
            </label>
          </label>
        </div>
      </div>

      {/* Liste des missions */}
      {missions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{text.noMissions}</h3>
          <p className="text-gray-600 mb-6">{text.createFirst}</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#18534F] hover:bg-[#226D68] gap-2"
          >
            <Plus className="w-5 h-5" />
            {text.createMission}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.mission}
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.startDate}
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.duration}
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.participants}
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.status}
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMissions.map((mission) => (
                <TableRow 
                  key={mission.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => router.push(`/dashboard-association/missions/${mission.id}`)}
                >
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{mission.title}</p>
                      {mission.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{mission.description}</p>
                      )}
                      {mission.address && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{mission.address}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(mission.start_at)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-900">
                      <Clock className="w-4 h-4" />
                      {formatDuration(mission.duration)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {mission.maximum_participant || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex justify-center">
                      <Badge className={getStatusColor(mission.status)}>
                        {getStatusLabel(mission.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex justify-center">
                      <MissionActionsDropdown
                        missionId={mission.id}
                        locale={locale}
                        onEdit={() => {
                          // TODO: Implémenter la modification
                          console.log('Edit mission', mission.id);
                        }}
                        onDelete={() => {
                          setMissionToDelete({ id: mission.id, title: mission.title });
                          setDeleteDialogOpen(true);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <CreateMissionModal
          associationId={associationId}
          currentMemberId={currentMemberId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleMissionCreated}
        />
      )}

      {/* Delete confirmation dialog */}
      {missionToDelete && (
        <DeleteMissionDialog
          missionId={missionToDelete.id}
          missionTitle={missionToDelete.title}
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setMissionToDelete(null);
          }}
          locale={locale}
        />
      )}
    </div>
  );
}
