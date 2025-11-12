'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  Search,
  Download,
  Mail,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  UserCheck,
  GraduationCap,
  Award,
  Clock
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

type StudentData = {
  stats: {
    totalStudents: number;
    activeStudents: number;
    avgMissions: number;
    avgHours: number;
  };
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    level: string;
    levelCode: string;
    missions: number;
    hours: number;
    status: 'active' | 'inactive';
    createdAt: string;
  }>;
  levels: Array<{ value: string; label: string }>;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  filters: {
    search: string;
    level: string;
    status: string;
  };
};

export default function StudentsListClient({ data }: { data: StudentData }) {
  const { locale } = useLocale();
  const router = useRouter();

  const t = {
    fr: {
      title: 'Gestion des Étudiants',
      subtitle: 'Liste complète des étudiants inscrits',
      
      totalStudents: 'Total étudiants',
      activeStudents: 'Actifs',
      avgMissions: 'Missions moy.',
      avgHours: 'Heures moy.',
      
      search: 'Rechercher un étudiant...',
      filterLevel: 'Filtrer par niveau',
      filterStatus: 'Filtrer par statut',
      allLevels: 'Tous les niveaux',
      allStatus: 'Tous les statuts',
      active: 'Actif',
      inactive: 'Inactif',
      
      exportCSV: 'Exporter CSV',
      sendEmail: 'Envoyer email groupé',
      
      student: 'Étudiant',
      level: 'Niveau',
      email: 'Email',
      missions: 'Missions',
      hours: 'Heures',
      status: 'Statut',
      actions: 'Actions',
      
      viewProfile: 'Voir le profil',
      editStudent: 'Modifier',
      sendMessage: 'Envoyer un message',
      delete: 'Supprimer',
      
      showing: 'Affichage',
      of: 'sur',
      results: 'résultats',
      previous: 'Précédent',
      next: 'Suivant',
    },
    en: {
      title: 'Student Management',
      subtitle: 'Complete list of registered students',
      
      totalStudents: 'Total Students',
      activeStudents: 'Active',
      avgMissions: 'Avg. Missions',
      avgHours: 'Avg. Hours',
      
      search: 'Search for a student...',
      filterLevel: 'Filter by level',
      filterStatus: 'Filter by status',
      allLevels: 'All levels',
      allStatus: 'All statuses',
      active: 'Active',
      inactive: 'Inactive',
      
      exportCSV: 'Export CSV',
      sendEmail: 'Send bulk email',
      
      student: 'Student',
      level: 'Level',
      email: 'Email',
      missions: 'Missions',
      hours: 'Hours',
      status: 'Status',
      lastActivity: 'Last Activity',
      actions: 'Actions',
      
      viewProfile: 'View Profile',
      editStudent: 'Edit',
      sendMessage: 'Send Message',
      delete: 'Delete',
      
      showing: 'Showing',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
    },
  };

  const text = t[locale];

  // Gestion des filtres via URL
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    if (data.filters.level !== 'all') params.set('level', data.filters.level);
    if (data.filters.status !== 'all') params.set('status', data.filters.status);
    router.push(`/dashboard-school/students?${params.toString()}`);
  };

  const handleLevelChange = (value: string) => {
    const params = new URLSearchParams();
    if (data.filters.search) params.set('search', data.filters.search);
    if (value !== 'all') params.set('level', value);
    if (data.filters.status !== 'all') params.set('status', data.filters.status);
    router.push(`/dashboard-school/students?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams();
    if (data.filters.search) params.set('search', data.filters.search);
    if (data.filters.level !== 'all') params.set('level', data.filters.level);
    if (value !== 'all') params.set('status', value);
    router.push(`/dashboard-school/students?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (data.filters.search) params.set('search', data.filters.search);
    if (data.filters.level !== 'all') params.set('level', data.filters.level);
    if (data.filters.status !== 'all') params.set('status', data.filters.status);
    params.set('page', page.toString());
    router.push(`/dashboard-school/students?${params.toString()}`);
  };

  const handleViewProfile = (studentId: string) => {
    router.push(`/dashboard-school/students/${studentId}`);
  };

  // Fonction pour obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Fonction pour formater la date relative
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins}min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return `Il y a ${diffDays}j`;
    }
  };

  // Couleurs pour les avatars
  const avatarColors = [
    '#18534F',
    '#226D68',
    '#D6955B',
    '#FEEAA1',
  ];

  const getAvatarColor = (id: string) => {
    const index = parseInt(id.split('-')[0], 16) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
        <p className="text-gray-600 mt-2">{text.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalStudents}</p>
              <p className="text-3xl font-bold text-gray-900">{data.stats.totalStudents}</p>
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
              <p className="text-3xl font-bold text-gray-900">{data.stats.activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.avgMissions}</p>
              <p className="text-3xl font-bold text-gray-900">{data.stats.avgMissions.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.avgHours}</p>
              <p className="text-3xl font-bold text-gray-900">{data.stats.avgHours.toFixed(1)}h</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={text.search}
              defaultValue={data.filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Debounce la recherche
                const value = e.target.value;
                setTimeout(() => handleSearchChange(value), 500);
              }}
              className="pl-10"
            />
          </div>
          
          <Select value={data.filters.level} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={text.filterLevel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allLevels}</SelectItem>
              {data.levels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={data.filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={text.filterStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.allStatus}</SelectItem>
              <SelectItem value="active">{text.active}</SelectItem>
              <SelectItem value="inactive">{text.inactive}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{text.student}</TableHead>
              <TableHead>{text.level}</TableHead>
              <TableHead>{text.email}</TableHead>
              <TableHead className="text-center">{text.missions}</TableHead>
              <TableHead className="text-center">{text.hours}</TableHead>
              <TableHead className="text-center">{text.status}</TableHead>
              <TableHead className="text-right">{text.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.students.map((student) => (
              <TableRow
                key={student.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewProfile(student.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{student.firstName} {student.lastName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.level}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{student.email}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-medium">{student.missions}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{student.hours}h</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={student.status === 'active' ? 'default' : 'secondary'}
                    className={student.status === 'active' ? 'bg-primary' : ''}
                  >
                    {student.status === 'active' ? text.active : text.inactive}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{text.actions}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(student.id);
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        {text.viewProfile}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="w-4 h-4 mr-2" />
                        {text.editStudent}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {text.sendMessage}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {text.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            {text.showing} {((data.pagination.currentPage - 1) * data.pagination.itemsPerPage) + 1} - {Math.min(data.pagination.currentPage * data.pagination.itemsPerPage, data.pagination.totalItems)} {text.of} {data.pagination.totalItems} {text.results}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pagination.currentPage - 1)}
              disabled={data.pagination.currentPage === 1}
            >
              {text.previous}
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // N'afficher que les pages autour de la page actuelle
                  return Math.abs(page - data.pagination.currentPage) <= 2;
                })
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === data.pagination.currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={page === data.pagination.currentPage ? 'bg-primary' : ''}
                  >
                    {page}
                  </Button>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pagination.currentPage + 1)}
              disabled={data.pagination.currentPage === data.pagination.totalPages}
            >
              {text.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
