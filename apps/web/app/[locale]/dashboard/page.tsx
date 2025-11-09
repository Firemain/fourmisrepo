'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Clock,
  Award,
  TrendingUp,
  Users,
  Target,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tMission = useTranslations('mission');
  
  // TODO: Récupérer les vraies données depuis Supabase/Prisma
  const stats = [
    {
      label: t('availableMissions'),
      value: '24',
      icon: Briefcase,
      change: `+3 ${t('thisWeek')}`,
      changeType: 'positive' as const,
      color: 'text-[#18534F]',
      bgColor: 'bg-[#18534F]/10',
    },
    {
      label: t('validatedHours'),
      value: '48h',
      icon: Clock,
      change: `+12h ${t('thisMonth')}`,
      changeType: 'positive' as const,
      color: 'text-[#226D68]',
      bgColor: 'bg-[#226D68]/10',
    },
    {
      label: t('pointsEarned'),
      value: '480',
      icon: Award,
      change: t('topPercent', { percent: '15' }),
      changeType: 'neutral' as const,
      color: 'text-[#D6955B]',
      bgColor: 'bg-[#D6955B]/10',
    },
    {
      label: t('associationsHelped'),
      value: '7',
      icon: Users,
      change: t('newOnes', { count: '2' }),
      changeType: 'positive' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const recentMissions = [
    {
      id: 1,
      title: 'Aide à l\'organisation du gala de l\'école',
      association: 'Bureau des Élèves',
      hours: 8,
      status: 'pending',
      date: '15 Nov 2025',
    },
    {
      id: 2,
      title: 'Distribution de repas aux sans-abris',
      association: 'Restos du Cœur INSA',
      hours: 4,
      status: 'approved',
      date: '10 Nov 2025',
    },
    {
      id: 3,
      title: 'Tutorat mathématiques lycéens',
      association: 'Tutorat Solidaire',
      hours: 6,
      status: 'approved',
      date: '5 Nov 2025',
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        label: t('pending'), 
        variant: 'secondary' as const,
        icon: AlertCircle,
        color: 'text-yellow-600'
      },
      approved: { 
        label: t('approved'), 
        variant: 'default' as const,
        icon: CheckCircle2,
        color: 'text-green-600'
      },
      rejected: { 
        label: t('rejected'), 
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600'
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Objectif annuel */}
      <Card className="border-l-4 border-l-[#18534F]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#18534F]" />
                {t('annualGoal')}
              </CardTitle>
              <CardDescription className="mt-1">
                {t('annualGoalDescription', { hours: '50' })}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-[#FEEAA1]/20 text-[#D6955B] border-[#D6955B]/20">
              96% {t('completed')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">48h / 50h</span>
              <span className="text-muted-foreground">{t('remaining', { hours: '2' })}</span>
            </div>
            <Progress value={96} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {stat.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Missions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('recentRegistrations')}</CardTitle>
                  <CardDescription>{t('recentRegistrationsDescription')}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboard/registrations" className="gap-2">
                    {t('seeAll')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMissions.map((mission) => {
                  const statusConfig = getStatusConfig(mission.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div 
                      key={mission.id} 
                      className="flex items-start gap-4 p-4 rounded-lg border hover:border-[#18534F]/50 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg ${statusConfig.color === 'text-green-600' ? 'bg-green-50' : statusConfig.color === 'text-yellow-600' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-gray-900">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.association}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tMission('hours', { count: mission.hours })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {mission.date}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#18534F] to-[#226D68] text-white">
            <CardHeader>
              <CardTitle className="text-white">{t('discoverMissions')}</CardTitle>
              <CardDescription className="text-white/80">
                {t('discoverMissionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-[#18534F] hover:bg-white/90" 
                asChild
              >
                <a href="/dashboard/missions" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('exploreMissions')}
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/dashboard/points">
                  <Award className="w-4 h-4" />
                  {t('checkPoints')}
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/dashboard/settings">
                  <Users className="w-4 h-4" />
                  {t('manageProfile')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
  // TODO: Récupérer les vraies données depuis Supabase/Prisma
  const stats = [
    {
      label: 'Missions disponibles',
      value: '24',
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      trend: '+3 cette semaine',
    },
    {
      label: 'Mes inscriptions',
      value: '5',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      trend: '2 en attente',
    },
    {
      label: 'Heures validées',
      value: '48h',
      icon: <Clock className="w-6 h-6 text-secondary" />,
      trend: '+12h ce mois',
    },
    {
      label: 'Points acquis',
      value: '480',
      icon: <Award className="w-6 h-6 text-accent" />,
      trend: 'Top 15%',
    },
  ];

  const recentMissions = [
    {
      id: 1,
      title: 'Aide à l\'organisation du gala de l\'école',
      association: 'Bureau des Élèves',
      hours: 8,
      status: 'pending',
      date: '15 Nov 2025',
    },
    {
      id: 2,
      title: 'Distribution de repas aux sans-abris',
      association: 'Restos du Cœur INSA',
      hours: 4,
      status: 'approved',
      date: '10 Nov 2025',
    },
    {
      id: 3,
      title: 'Tutorat mathématiques lycéens',
      association: 'Tutorat Solidaire',
      hours: 6,
      status: 'approved',
      date: '5 Nov 2025',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Validée', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Refusée', class: 'bg-red-100 text-red-800' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue sur votre espace Fourmis ! 🐜
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Missions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mes dernières inscriptions</h2>
          <a href="/dashboard/registrations" className="text-primary hover:underline font-medium">
            Voir tout
          </a>
        </div>

        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentMissions.map((mission) => {
              const badge = getStatusBadge(mission.status);
              return (
                <div key={mission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {mission.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {mission.association}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {mission.hours}h
                        </span>
                        <span>{mission.date}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/missions"
            className="p-6 bg-white border-2 border-primary rounded-lg hover:shadow-lg transition-shadow"
          >
            <Briefcase className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Découvrir les missions
            </h3>
            <p className="text-sm text-gray-600">
              Parcourez les missions disponibles
            </p>
          </a>

          <a
            href="/dashboard/points"
            className="p-6 bg-white border-2 border-secondary rounded-lg hover:shadow-lg transition-shadow"
          >
            <Award className="w-8 h-8 text-secondary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Mes points
            </h3>
            <p className="text-sm text-gray-600">
              Consultez votre progression
            </p>
          </a>

          <a
            href="/dashboard/docs"
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
          >
            <Users className="w-8 h-8 text-gray-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Aide & Documentation
            </h3>
            <p className="text-sm text-gray-600">
              Besoin d'aide ? Consultez nos guides
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
