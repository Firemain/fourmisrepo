'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus,
  Search,git pull origin main

  Filter,
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  maximum_participant: number | null;
  duration: number | null;
  status: string;
  recurrence_type: string;
  created_at: string;
}

export default function AssociationMissionsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const supabase = createClient();

  const t = {
    fr: {
      title: 'Gestion des Missions',
      subtitle: 'Créez et gérez vos missions d\'engagement',
      
      createMission: 'Créer une mission',
      search: 'Rechercher une mission...',
      filterStatus: 'Filtrer par statut',
      allStatus: 'Tous les statuts',
      
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
      
      // Modal
      newMission: 'Nouvelle Mission',
      missionTitle: 'Titre de la mission',
      missionDescription: 'Description',
      missionStartDate: 'Date de début',
      missionEndDate: 'Date de fin',
      missionDuration: 'Durée (en minutes)',
      maxParticipants: 'Nombre maximum de participants',
      recurrenceType: 'Récurrence',
      none: 'Aucune',
      daily: 'Quotidienne',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuelle',
      cancel: 'Annuler',
      create: 'Créer la mission',
      
      // Messages
      loading: 'Chargement...',
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
      
      newMission: 'New Mission',
      missionTitle: 'Mission Title',
      missionDescription: 'Description',
      missionStartDate: 'Start Date',
      missionEndDate: 'End Date',
      missionDuration: 'Duration (in minutes)',
      maxParticipants: 'Maximum number of participants',
      recurrenceType: 'Recurrence',
      none: 'None',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      cancel: 'Cancel',
      create: 'Create Mission',
      
      loading: 'Loading...',
      noMissions: 'No missions yet',
      createFirst: 'Create your first mission to get started',
      
      hours: 'hours',
      minutes: 'min',
    },
  };

  const text = t[locale];

  // Charger les missions depuis Supabase
  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      
      // 1. Récupérer l'association de l'utilisateur
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!userProfile) {
        setLoading(false);
        return;
      }

      // 2. Récupérer l'association member
      const { data: associationMember } = await supabase
        .from('association_members')
        .select('association_id')
        .eq('user_profile_id', userProfile.id)
        .single();

      if (!associationMember) {
        setLoading(false);
        return;
      }

      // 3. Récupérer les missions de l'association
      const { data: missionsData, error } = await supabase
        .from('missions')
        .select('*')
        .eq('association_id', associationMember.association_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching missions:', error);
      } else {
        setMissions(missionsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
    participants: missions.reduce((acc, m) => acc + (m.maximum_participant || 0), 0),
    completionRate: 85, // À calculer avec les vraies données
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
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={text.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44">
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
        </div>
      </div>

      {/* Liste des missions */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18534F] mx-auto mb-4"></div>
          <p className="text-gray-600">{text.loading}</p>
        </div>
      ) : missions.length === 0 ? (
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
              {missions
                .filter(mission => 
                  (filterStatus === 'all' || mission.status === filterStatus) &&
                  (searchQuery === '' || mission.title.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((mission) => (
                  <TableRow key={mission.id} className="cursor-pointer" onClick={() => router.push(`/dashboard-association/missions/${mission.id}`)}>
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{mission.title}</p>
                        {mission.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">{mission.description}</p>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{text.actions}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard-association/missions/${mission.id}`);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              {text.view}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="w-4 h-4 mr-2" />
                              {text.edit}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              {text.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          locale={locale}
          text={text}
          user={user}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchMissions();
          }}
        />
      )}
    </div>
  );
}

// Modal de création de mission
function CreateMissionModal({ locale, text, user, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    duration: '',
    maximum_participant: '',
    recurrence_type: 'NONE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Récupérer le user_profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!userProfile) {
        setError('Profil utilisateur introuvable');
        setLoading(false);
        return;
      }

      // 2. Récupérer l'association_member
      const { data: associationMember } = await supabase
        .from('association_members')
        .select('id, association_id')
        .eq('user_profile_id', userProfile.id)
        .single();

      if (!associationMember) {
        setError('Membre d\'association introuvable');
        setLoading(false);
        return;
      }

      // 3. Créer la mission
      const { error: insertError } = await supabase
        .from('missions')
        .insert({
          association_id: associationMember.association_id,
          association_member_id: associationMember.id,
          title: formData.title,
          description: formData.description || null,
          start_at: formData.start_at,
          end_at: formData.end_at || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          maximum_participant: formData.maximum_participant ? parseInt(formData.maximum_participant) : null,
          recurrence_type: formData.recurrence_type,
          status: 'PUBLISHED',
        });

      if (insertError) {
        console.error('Error creating mission:', insertError);
        setError('Erreur lors de la création de la mission');
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{text.newMission}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.missionTitle} *
            </label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Formation aux premiers secours"
              className="h-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.missionDescription}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] text-sm"
              placeholder="Décrivez la mission, les objectifs, le lieu..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.missionStartDate} *
              </label>
              <Input
                type="datetime-local"
                required
                value={formData.start_at}
                onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                className="h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.missionEndDate}
              </label>
              <Input
                type="datetime-local"
                value={formData.end_at}
                onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.missionDuration}
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="120"
                min="1"
                className="h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.maxParticipants}
              </label>
              <Input
                type="number"
                value={formData.maximum_participant}
                onChange={(e) => setFormData({ ...formData, maximum_participant: e.target.value })}
                placeholder="20"
                min="1"
                className="h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.recurrenceType}
            </label>
            <Select value={formData.recurrence_type} onValueChange={(value) => setFormData({ ...formData, recurrence_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">{text.none}</SelectItem>
                <SelectItem value="DAILY">{text.daily}</SelectItem>
                <SelectItem value="WEEKLY">{text.weekly}</SelectItem>
                <SelectItem value="MONTHLY">{text.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {text.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#18534F] hover:bg-[#226D68]"
            >
              {loading ? text.loading : text.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
