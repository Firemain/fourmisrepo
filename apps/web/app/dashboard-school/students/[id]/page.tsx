'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Edit,
  MoreVertical,
  GraduationCap,
  Target,
  Activity,
  BookOpen,
  Users,
  Zap
} from 'lucide-react';

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const { id } = params;

  const t = {
    fr: {
      back: 'Retour à la liste',
      title: 'Profil Étudiant',
      contact: 'Contact',
      sendEmail: 'Envoyer un email',
      edit: 'Modifier',
      export: 'Exporter le profil',
      
      // Infos personnelles
      personalInfo: 'Informations personnelles',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      registeredSince: 'Inscrit depuis',
      lastActivity: 'Dernière activité',
      
      // Stats principales
      mainStats: 'Statistiques principales',
      totalMissions: 'Missions réalisées',
      totalHours: 'Heures d\'engagement',
      avgRating: 'Note moyenne',
      completionRate: 'Taux de complétion',
      
      // Missions
      missionsHistory: 'Historique des missions',
      inProgress: 'En cours',
      completed: 'Terminées',
      cancelled: 'Annulées',
      upcoming: 'À venir',
      
      // Performance
      performance: 'Performance',
      engagement: 'Engagement',
      reliability: 'Fiabilité',
      skills: 'Compétences acquises',
      
      // Badges
      badges: 'Badges obtenus',
      noBadges: 'Aucun badge pour le moment',
      
      // Mission details
      mission: 'Mission',
      association: 'Association',
      date: 'Date',
      duration: 'Durée',
      status: 'Statut',
      rating: 'Note',
      hours: 'heures',
      
      // Actions
      viewMission: 'Voir la mission',
      contactStudent: 'Contacter l\'étudiant',
      
      // Niveaux
      level: 'Niveau académique',
      
      // Tendances
      trends: 'Tendances',
      thisMonth: 'Ce mois-ci',
      vs: 'vs',
      lastMonth: 'mois dernier',
      missionsCompleted: 'missions terminées',
      hoursLogged: 'heures enregistrées',
      avgRatingThisMonth: 'note moyenne',
    },
    en: {
      back: 'Back to list',
      title: 'Student Profile',
      contact: 'Contact',
      sendEmail: 'Send email',
      edit: 'Edit',
      export: 'Export profile',
      
      personalInfo: 'Personal Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      registeredSince: 'Registered since',
      lastActivity: 'Last activity',
      
      mainStats: 'Main Statistics',
      totalMissions: 'Completed Missions',
      totalHours: 'Engagement Hours',
      avgRating: 'Average Rating',
      completionRate: 'Completion Rate',
      
      missionsHistory: 'Mission History',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      upcoming: 'Upcoming',
      
      performance: 'Performance',
      engagement: 'Engagement',
      reliability: 'Reliability',
      skills: 'Skills Acquired',
      
      badges: 'Badges Earned',
      noBadges: 'No badges yet',
      
      mission: 'Mission',
      association: 'Association',
      date: 'Date',
      duration: 'Duration',
      status: 'Status',
      rating: 'Rating',
      hours: 'hours',
      
      viewMission: 'View mission',
      contactStudent: 'Contact student',
      
      level: 'Academic Level',
      
      trends: 'Trends',
      thisMonth: 'This month',
      vs: 'vs',
      lastMonth: 'last month',
      missionsCompleted: 'missions completed',
      hoursLogged: 'hours logged',
      avgRatingThisMonth: 'average rating',
    },
  };

  const text = t[locale];

  // Données de test - en production, charger depuis la DB avec l'ID
  const student = {
    id,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@universite-paris-saclay.fr',
    phone: '+33 6 12 34 56 78',
    address: '15 rue des Étudiants, 91400 Orsay',
    level: 'Master 1 - Informatique',
    registeredDate: '12 septembre 2024',
    lastActivity: 'Il y a 2 heures',
    avatar: 'JD',
    color: '#18534F',
    
    stats: {
      totalMissions: 15,
      totalHours: 92,
      avgRating: 4.8,
      completionRate: 94,
      inProgress: 2,
      completed: 12,
      cancelled: 1,
      upcoming: 3,
    },
    
    trends: {
      missionsThisMonth: 4,
      missionsLastMonth: 3,
      hoursThisMonth: 24,
      hoursLastMonth: 18,
      ratingThisMonth: 4.9,
      ratingLastMonth: 4.7,
    },
    
    performance: {
      engagement: 95,
      reliability: 92,
      skills: 88,
    },
    
    badges: [
      { id: '1', name: 'Premier Secours', icon: '🚑', date: '15 oct. 2024' },
      { id: '2', name: 'Engagement Social', icon: '🤝', date: '22 oct. 2024' },
      { id: '3', name: 'Leader', icon: '⭐', date: '05 nov. 2024' },
      { id: '4', name: '50h d\'engagement', icon: '⏰', date: '18 nov. 2024' },
    ],
    
    missions: [
      {
        id: '1',
        title: 'Formation PSC1',
        association: 'Croix-Rouge',
        date: '15 oct. 2024',
        duration: 8,
        status: 'completed',
        rating: 5,
        associationLogo: '🔴',
      },
      {
        id: '2',
        title: 'Distribution de repas',
        association: 'Restos du Cœur',
        date: '22 oct. 2024',
        duration: 4,
        status: 'completed',
        rating: 5,
        associationLogo: '❤️',
      },
      {
        id: '3',
        title: 'Tutorat Mathématiques',
        association: 'Association Tutorat',
        date: '05 nov. 2024',
        duration: 3,
        status: 'completed',
        rating: 4,
        associationLogo: '📚',
      },
      {
        id: '4',
        title: 'Collecte de dons',
        association: 'Croix-Rouge',
        date: '18 nov. 2024',
        duration: 5,
        status: 'in-progress',
        rating: null,
        associationLogo: '🔴',
      },
      {
        id: '5',
        title: 'Atelier Codage',
        association: 'Club Informatique',
        date: '25 nov. 2024',
        duration: 2,
        status: 'upcoming',
        rating: null,
        associationLogo: '💻',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'upcoming':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return locale === 'fr' ? 'Terminée' : 'Completed';
      case 'in-progress':
        return locale === 'fr' ? 'En cours' : 'In Progress';
      case 'upcoming':
        return locale === 'fr' ? 'À venir' : 'Upcoming';
      case 'cancelled':
        return locale === 'fr' ? 'Annulée' : 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#18534F] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {text.back}
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              style={{ backgroundColor: student.color }}
            >
              {student.avatar}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-[#ECF8F6] text-[#18534F] rounded-full text-sm font-semibold">
                  {student.level}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {student.registeredDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              {text.export}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {text.edit}
            </button>
            <button className="px-4 py-2 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {text.sendEmail}
            </button>
          </div>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <CheckCircle className="w-6 h-6 text-[#18534F]" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalMissions}</p>
          <p className="text-3xl font-bold text-gray-900">{student.stats.totalMissions}</p>
          <p className="text-xs text-green-600 mt-2">
            +{student.trends.missionsThisMonth - student.trends.missionsLastMonth} {text.thisMonth}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Clock className="w-6 h-6 text-[#226D68]" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalHours}</p>
          <p className="text-3xl font-bold text-gray-900">{student.stats.totalHours}h</p>
          <p className="text-xs text-green-600 mt-2">
            +{student.trends.hoursThisMonth - student.trends.hoursLastMonth}h {text.thisMonth}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Star className="w-6 h-6 text-[#D6955B]" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.avgRating}</p>
          <p className="text-3xl font-bold text-gray-900">{student.stats.avgRating}/5</p>
          <p className="text-xs text-green-600 mt-2">
            +{(student.trends.ratingThisMonth - student.trends.ratingLastMonth).toFixed(1)} {text.thisMonth}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Target className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.completionRate}</p>
          <p className="text-3xl font-bold text-gray-900">{student.stats.completionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">
            {student.stats.completed}/{student.stats.totalMissions} {text.completed.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#18534F]" />
              {text.personalInfo}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Mail className="w-5 h-5 text-[#18534F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{text.email}</p>
                  <p className="font-medium text-gray-900">{student.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Phone className="w-5 h-5 text-[#18534F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{text.phone}</p>
                  <p className="font-medium text-gray-900">{student.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#18534F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{text.address}</p>
                  <p className="font-medium text-gray-900">{student.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ECF8F6] rounded-lg">
                  <Activity className="w-5 h-5 text-[#18534F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{text.lastActivity}</p>
                  <p className="font-medium text-gray-900">{student.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#18534F]" />
              {text.performance}
            </h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{text.engagement}</span>
                  <span className="text-sm font-bold text-[#18534F]">{student.performance.engagement}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#18534F] to-[#226D68] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.performance.engagement}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{text.reliability}</span>
                  <span className="text-sm font-bold text-[#226D68]">{student.performance.reliability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#226D68] to-[#18534F] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.performance.reliability}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{text.skills}</span>
                  <span className="text-sm font-bold text-[#D6955B]">{student.performance.skills}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#D6955B] to-[#FEEAA1] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.performance.skills}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Historique des missions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#18534F]" />
              {text.missionsHistory}
            </h2>
            
            <div className="space-y-4">
              {student.missions.map((mission) => (
                <div 
                  key={mission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#18534F] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{mission.associationLogo}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {mission.association}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                      {getStatusLabel(mission.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {mission.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mission.duration} {text.hours}
                    </span>
                    {mission.rating && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {mission.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-8">
          {/* Statut des missions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{text.missionsHistory}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{text.inProgress}</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{student.stats.inProgress}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{text.completed}</span>
                </div>
                <span className="text-lg font-bold text-green-600">{student.stats.completed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{text.upcoming}</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{student.stats.upcoming}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{text.cancelled}</span>
                </div>
                <span className="text-lg font-bold text-red-600">{student.stats.cancelled}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#18534F]" />
              {text.badges}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {student.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-[#18534F] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-semibold text-gray-900 text-center mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{text.contact}</h2>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {text.sendEmail}
              </button>
              
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                {locale === 'fr' ? 'Appeler' : 'Call'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
