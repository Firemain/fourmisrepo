'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  Share2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Repeat,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Award,
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';

interface MissionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
  associations: {
    name: string;
    logo_url: string | null;
  };
}

export default function MissionDetailPage({ params }: MissionDetailPageProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const { id } = use(params); // Unwrap the Promise with React.use()
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const supabase = createClient();

  const t = {
    fr: {
      back: 'Retour aux missions',
      title: 'Détails de la Mission',
      
      // Actions
      edit: 'Modifier',
      delete: 'Supprimer',
      share: 'Partager',
      export: 'Exporter',
      
      // Infos
      description: 'Description',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      duration: 'Durée',
      maxParticipants: 'Participants maximum',
      recurrence: 'Récurrence',
      status: 'Statut',
      createdAt: 'Créée le',
      association: 'Association',
      
      // Status
      published: 'Publiée',
      draft: 'Brouillon',
      archived: 'Archivée',
      cancelled: 'Annulée',
      
      // Recurrence
      none: 'Aucune',
      daily: 'Quotidienne',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuelle',
      
      // Stats
      enrolled: 'Inscrits',
      completed: 'Complétées',
      avgRating: 'Note moyenne',
      completionRate: 'Taux de complétion',
      
      // Participants
      participants: 'Participants',
      noParticipants: 'Aucun participant pour le moment',
      waitingForParticipants: 'En attente de participants',
      
      student: 'Étudiant',
      level: 'Niveau',
      email: 'Email',
      enrolledOn: 'Inscrit le',
      participationStatus: 'Statut',
      actions: 'Actions',
      
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      absent: 'Absent',
      
      contactStudent: 'Contacter',
      viewProfile: 'Voir le profil',
      
      hours: 'heures',
      minutes: 'min',
      loading: 'Chargement...',
      
      // Timeline
      timeline: 'Historique',
      missionCreated: 'Mission créée',
      missionPublished: 'Mission publiée',
      participantJoined: 'participant inscrit',
      missionCompleted: 'Mission terminée',
      
      // Delete confirmation
      confirmDelete: 'Confirmer la suppression',
      confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible.',
      cancel: 'Annuler',
      confirmDeleteButton: 'Supprimer',
    },
    en: {
      back: 'Back to missions',
      title: 'Mission Details',
      
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      export: 'Export',
      
      description: 'Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      duration: 'Duration',
      maxParticipants: 'Maximum Participants',
      recurrence: 'Recurrence',
      status: 'Status',
      createdAt: 'Created on',
      association: 'Association',
      
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
      cancelled: 'Cancelled',
      
      none: 'None',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      
      enrolled: 'Enrolled',
      completed: 'Completed',
      avgRating: 'Average Rating',
      completionRate: 'Completion Rate',
      
      participants: 'Participants',
      noParticipants: 'No participants yet',
      waitingForParticipants: 'Waiting for participants',
      
      student: 'Student',
      level: 'Level',
      email: 'Email',
      enrolledOn: 'Enrolled on',
      participationStatus: 'Status',
      actions: 'Actions',
      
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      absent: 'Absent',
      
      contactStudent: 'Contact',
      viewProfile: 'View Profile',
      
      hours: 'hours',
      minutes: 'min',
      loading: 'Loading...',
      
      timeline: 'Timeline',
      missionCreated: 'Mission created',
      missionPublished: 'Mission published',
      participantJoined: 'participant enrolled',
      missionCompleted: 'Mission completed',
      
      confirmDelete: 'Confirm Deletion',
      confirmDeleteMessage: 'Are you sure you want to delete this mission? This action cannot be undone.',
      cancel: 'Cancel',
      confirmDeleteButton: 'Delete',
    },
  };

  const text = t[locale];

  useEffect(() => {
    fetchMission();
  }, [id]);

  const fetchMission = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          associations (
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching mission:', error);
      } else {
        setMission(data);
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
        return 'bg-green-100 text-green-700';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const getRecurrenceLabel = (recurrence: string) => {
    switch (recurrence) {
      case 'NONE':
        return text.none;
      case 'DAILY':
        return text.daily;
      case 'WEEKLY':
        return text.weekly;
      case 'MONTHLY':
        return text.monthly;
      default:
        return recurrence;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
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

  // Données de test pour les participants
  const mockParticipants = [
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      level: 'Master 1',
      enrolledOn: '12 déc. 2024',
      status: 'confirmed',
      avatar: 'JD',
      color: '#18534F',
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Leblanc',
      email: 'marie.leblanc@example.com',
      level: 'Licence 3',
      enrolledOn: '10 déc. 2024',
      status: 'confirmed',
      avatar: 'ML',
      color: '#226D68',
    },
    {
      id: '3',
      firstName: 'Thomas',
      lastName: 'Chen',
      email: 'thomas.chen@example.com',
      level: 'Master 2',
      enrolledOn: '08 déc. 2024',
      status: 'pending',
      avatar: 'TC',
      color: '#D6955B',
    },
  ];

  const stats = {
    enrolled: mockParticipants.length,
    completed: 0,
    avgRating: 4.8,
    completionRate: 0,
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#ECF8F6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18534F] mx-auto mb-4"></div>
          <p className="text-gray-600">{text.loading}</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="p-8 bg-[#ECF8F6] min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Mission introuvable</h3>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-3 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors cursor-pointer"
          >
            {text.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#18534F] mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          {text.back}
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{mission.title}</h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                {getStatusLabel(mission.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{mission.associations.name}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
              <Edit className="w-5 h-5 text-gray-600" />
              {text.edit}
            </button>
            <button className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              {text.delete}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Users className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.enrolled}</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.enrolled}/{mission.maximum_participant || '∞'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <CheckCircle className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.completed}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Star className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.avgRating}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.avgRating}/5</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {mission.description && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{text.description}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{mission.description}</p>
            </div>
          )}

          {/* Participants */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#18534F]" />
              {text.participants} ({mockParticipants.length})
            </h2>
            
            {mockParticipants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">{text.noParticipants}</p>
                <p className="text-sm text-gray-500 mt-1">{text.waitingForParticipants}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockParticipants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#18534F] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: participant.color }}
                      >
                        {participant.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {participant.firstName} {participant.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{participant.level}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {text.enrolledOn}: {participant.enrolledOn}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        participant.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {participant.status === 'confirmed' ? text.confirmed : text.pending}
                      </span>
                      
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={text.contactStudent}
                      >
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={text.viewProfile}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Informations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Informations</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Calendar className="w-5 h-5 text-[#18534F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{text.startDate}</p>
                  <p className="font-medium text-gray-900">{formatDate(mission.start_at)}</p>
                </div>
              </div>

              {mission.end_at && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#ECF8F6] rounded-lg">
                    <Calendar className="w-5 h-5 text-[#18534F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{text.endDate}</p>
                    <p className="font-medium text-gray-900">{formatDate(mission.end_at)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Clock className="w-5 h-5 text-[#18534F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{text.duration}</p>
                  <p className="font-medium text-gray-900">{formatDuration(mission.duration)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Users className="w-5 h-5 text-[#18534F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{text.maxParticipants}</p>
                  <p className="font-medium text-gray-900">{mission.maximum_participant || 'Illimité'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Repeat className="w-5 h-5 text-[#18534F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{text.recurrence}</p>
                  <p className="font-medium text-gray-900">{getRecurrenceLabel(mission.recurrence_type)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {text.createdAt}: {formatDate(mission.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{text.timeline}</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#ECF8F6] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#18534F]" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900">{text.missionCreated}</p>
                  <p className="text-sm text-gray-500">{formatDate(mission.created_at)}</p>
                </div>
              </div>

              {mission.status === 'PUBLISHED' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900">{text.missionPublished}</p>
                    <p className="text-sm text-gray-500">{formatDate(mission.created_at)}</p>
                  </div>
                </div>
              )}

              {mockParticipants.length > 0 && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {mockParticipants.length} {text.participantJoined}
                    </p>
                    <p className="text-sm text-gray-500">Dernière inscription il y a 2h</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
