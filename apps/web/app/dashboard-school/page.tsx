'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar,
  UserCheck,
  Clock,
  Building2,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  UserPlus,
  CheckCircle2,
  CalendarDays,
  X
} from 'lucide-react';

export default function SchoolDashboardPage() {
  const { locale } = useLocale();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    preset: '30days'
  });

  const t = {
    fr: {
      welcome: 'Tableau de bord École',
      subtitle: 'Vue d\'ensemble de l\'établissement - Université Paris-Saclay',
      
      // KPIs principaux
      totalStudents: 'Étudiants inscrits',
      activeStudents: 'Étudiants actifs',
      newThisMonth: 'Nouveaux ce mois',
      completionRate: 'Taux de complétion',
      
      // Stats engagement
      engagementTitle: 'Engagement étudiant',
      participatingStudents: 'Étudiants participants',
      avgMissionsPerStudent: 'Missions / Étudiant',
      totalHours: 'Heures totales',
      satisfactionRate: 'Taux de satisfaction',
      
      // Missions
      missionsTitle: 'Missions & Associations',
      activeMissions: 'Missions actives',
      totalAssociations: 'Associations',
      pendingApprovals: 'En attente',
      completedThisMonth: 'Complétées ce mois',
      
      // Graphiques
      evolutionTitle: 'Évolution des inscriptions',
      byLevelTitle: 'Répartition par niveau',
      topMissionsTitle: 'Missions les plus populaires',
      topAssociationsTitle: 'Associations les plus actives',
      
      // Activité récente
      recentActivityTitle: 'Activité récente',
      newRegistrations: 'Nouvelles inscriptions',
      recentCompletions: 'Missions récemment complétées',
      
      // Alertes
      alertsTitle: 'Alertes & Notifications',
      pendingReview: 'missions en attente de validation',
      lowParticipation: 'étudiants avec faible participation',
      expiringMissions: 'missions se terminent cette semaine',
      
      viewAll: 'Voir tout',
      thisMonth: 'ce mois',
      vs_lastMonth: 'vs mois dernier',
      
      // Sélecteur de période
      selectPeriod: 'Sélectionner une période',
      customPeriod: 'Période personnalisée',
      from: 'Du',
      to: 'Au',
      apply: 'Appliquer',
      cancel: 'Annuler',
      last7days: '7 derniers jours',
      last30days: '30 derniers jours',
      last3months: '3 derniers mois',
      last6months: '6 derniers mois',
      thisYear: 'Cette année',
      allTime: 'Depuis le début',
    },
    en: {
      welcome: 'School Dashboard',
      subtitle: 'Institution Overview - Université Paris-Saclay',
      
      totalStudents: 'Registered Students',
      activeStudents: 'Active Students',
      newThisMonth: 'New This Month',
      completionRate: 'Completion Rate',
      
      engagementTitle: 'Student Engagement',
      participatingStudents: 'Participating Students',
      avgMissionsPerStudent: 'Missions / Student',
      totalHours: 'Total Hours',
      satisfactionRate: 'Satisfaction Rate',
      
      missionsTitle: 'Missions & Clubs',
      activeMissions: 'Active Missions',
      totalAssociations: 'Clubs',
      pendingApprovals: 'Pending',
      completedThisMonth: 'Completed This Month',
      
      evolutionTitle: 'Registration Evolution',
      byLevelTitle: 'Distribution by Level',
      topMissionsTitle: 'Most Popular Missions',
      topAssociationsTitle: 'Most Active Clubs',
      
      recentActivityTitle: 'Recent Activity',
      newRegistrations: 'New Registrations',
      recentCompletions: 'Recently Completed Missions',
      
      alertsTitle: 'Alerts & Notifications',
      pendingReview: 'missions pending review',
      lowParticipation: 'students with low participation',
      expiringMissions: 'missions ending this week',
      
      viewAll: 'View All',
      thisMonth: 'this month',
      vs_lastMonth: 'vs last month',
      
      selectPeriod: 'Select Period',
      customPeriod: 'Custom Period',
      from: 'From',
      to: 'To',
      apply: 'Apply',
      cancel: 'Cancel',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      last3months: 'Last 3 months',
      last6months: 'Last 6 months',
      thisYear: 'This year',
      allTime: 'All time',
    },
  };

  const text = t[locale];

  const presets = [
    { id: '7days', label: text.last7days, days: 7 },
    { id: '30days', label: text.last30days, days: 30 },
    { id: '3months', label: text.last3months, days: 90 },
    { id: '6months', label: text.last6months, days: 180 },
    { id: 'year', label: text.thisYear, days: 365 },
    { id: 'all', label: text.allTime, days: null },
  ];

  const handlePresetClick = (preset: { id: string; days: number | null }) => {
    if (preset.days === null) {
      setDateRange({ start: new Date(2020, 0, 1), end: new Date(), preset: preset.id });
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - preset.days);
      setDateRange({ start, end, preset: preset.id });
    }
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header avec sélecteur de période */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#18534F]" />
            {text.welcome}
          </h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>

        {/* Sélecteur de période */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#18534F] hover:shadow-md transition-all"
          >
            <CalendarDays className="w-5 h-5 text-[#18534F]" />
            <div className="text-left">
              <p className="text-xs text-gray-500">{text.selectPeriod}</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
              </p>
            </div>
          </button>

          {/* Popup sélecteur */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{text.customPeriod}</h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Presets rapides */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dateRange.preset === preset.id
                          ? 'bg-[#18534F] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates personnalisées */}
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {text.from}
                    </label>
                    <input
                      type="date"
                      value={dateRange.start.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setDateRange({ ...dateRange, start: newDate, preset: 'custom' });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {text.to}
                    </label>
                    <input
                      type="date"
                      value={dateRange.end.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setDateRange({ ...dateRange, end: newDate, preset: 'custom' });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    {text.cancel}
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-4 py-2 bg-[#18534F] text-white rounded-lg font-medium hover:bg-[#226D68] transition-colors"
                  >
                    {text.apply}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total étudiants */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Users className="w-6 h-6 text-[#18534F]" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 12%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalStudents}</p>
          <p className="text-3xl font-bold text-gray-900">1,245</p>
          <p className="text-xs text-gray-500 mt-2">+45 {text.thisMonth}</p>
        </div>

        {/* Étudiants actifs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <UserCheck className="w-6 h-6 text-[#226D68]" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 8%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.activeStudents}</p>
          <p className="text-3xl font-bold text-gray-900">892</p>
          <p className="text-xs text-gray-500 mt-2">71.6% du total</p>
        </div>

        {/* Heures d'engagement */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Clock className="w-6 h-6 text-[#D6955B]" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 23%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalHours}</p>
          <p className="text-3xl font-bold text-gray-900">12,450</p>
          <p className="text-xs text-gray-500 mt-2">+2,340h {text.vs_lastMonth}</p>
        </div>

        {/* Taux de satisfaction */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Award className="w-6 h-6 text-[#D6955B]" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 3%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.satisfactionRate}</p>
          <p className="text-3xl font-bold text-gray-900">4.7/5</p>
          <p className="text-xs text-gray-500 mt-2">basé sur 1,234 avis</p>
        </div>
      </div>

      {/* Stats d'engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#18534F]" />
            <h3 className="font-semibold text-gray-900">{text.engagementTitle}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{text.participatingStudents}</span>
              <span className="text-lg font-bold text-gray-900">892</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#18534F] h-2 rounded-full" style={{ width: '71.6%' }}></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">{text.avgMissionsPerStudent}</span>
              <span className="text-lg font-bold text-gray-900">3.4</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-[#226D68]" />
            <h3 className="font-semibold text-gray-900">{text.missionsTitle}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{text.activeMissions}</span>
              <span className="text-2xl font-bold text-[#226D68]">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{text.totalAssociations}</span>
              <span className="text-2xl font-bold text-[#18534F]">18</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{text.completedThisMonth}</span>
              <span className="text-2xl font-bold text-green-600">156</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-[#D6955B]" />
            <h3 className="font-semibold text-gray-900">{text.byLevelTitle}</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Licence</span>
                <span className="font-semibold">645 (52%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#18534F] h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Master</span>
                <span className="font-semibold">485 (39%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#226D68] h-2 rounded-full" style={{ width: '39%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Doctorat</span>
                <span className="font-semibold">115 (9%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#D6955B] h-2 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes & Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alertes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🔔 {text.alertsTitle}
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm font-medium text-yellow-800">5 {text.pendingReview}</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm font-medium text-blue-800">12 {text.lowParticipation}</p>
            </div>
            <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
              <p className="text-sm font-medium text-orange-800">8 {text.expiringMissions}</p>
            </div>
          </div>
        </div>

        {/* Nouvelles inscriptions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#18534F]" />
              {text.newRegistrations}
            </h3>
            <button className="text-xs text-[#18534F] hover:underline">{text.viewAll}</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#18534F] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Jean Dupont</p>
                <p className="text-xs text-gray-600">Master 1 • Il y a 2h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#226D68] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                ML
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Marie Leblanc</p>
                <p className="text-xs text-gray-600">Licence 3 • Il y a 5h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#D6955B] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                TC
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Thomas Chen</p>
                <p className="text-xs text-gray-600">Licence 1 • Il y a 8h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Missions complétées */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              {text.recentCompletions}
            </h3>
            <button className="text-xs text-[#18534F] hover:underline">{text.viewAll}</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-semibold text-gray-900">Formation PSC1</p>
              <p className="text-xs text-gray-600">18 participants • Croix-Rouge</p>
              <p className="text-xs text-green-700 mt-1">Complétée aujourd'hui</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-gray-900">Collecte alimentaire</p>
              <p className="text-xs text-gray-600">12 participants • Restos du Cœur</p>
              <p className="text-xs text-blue-700 mt-1">Complétée hier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Missions & Associations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Missions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#18534F]" />
            {text.topMissionsTitle}
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Formation Premiers Secours', participants: 156, association: 'Croix-Rouge', trend: '+23%' },
              { title: 'Tutorat Mathématiques', participants: 124, association: 'Club Étudiants', trend: '+18%' },
              { title: 'Distribution alimentaire', participants: 98, association: 'Restos du Cœur', trend: '+15%' },
              { title: 'Atelier Développement Durable', participants: 87, association: 'Club Écologie', trend: '+12%' },
            ].map((mission, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{mission.title}</p>
                  <p className="text-xs text-gray-600">{mission.association}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#18534F]">{mission.participants}</p>
                  <p className="text-xs text-green-600">{mission.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Associations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#226D68]" />
            {text.topAssociationsTitle}
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Croix-Rouge Française', missions: 8, students: 234, rating: 4.8 },
              { name: 'Bureau des Étudiants (BDE)', missions: 12, students: 189, rating: 4.7 },
              { name: 'Club Informatique', missions: 6, students: 156, rating: 4.9 },
              { name: 'Enactus', missions: 5, students: 98, rating: 4.6 },
            ].map((asso, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{asso.name}</p>
                  <p className="text-xs text-gray-600">{asso.missions} missions • {asso.students} étudiants</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold text-gray-900">{asso.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
