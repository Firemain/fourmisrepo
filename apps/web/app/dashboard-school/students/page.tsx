'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { 
  Search,
  Filter,
  Download,
  Mail,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  GraduationCap,
  TrendingUp,
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

export default function StudentsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const t = {
    fr: {
      title: 'Gestion des Étudiants',
      subtitle: 'Liste complète des étudiants inscrits',
      
      // Stats
      totalStudents: 'Total étudiants',
      activeStudents: 'Actifs',
      avgMissions: 'Missions moy.',
      avgHours: 'Heures moy.',
      
      // Filtres
      search: 'Rechercher un étudiant...',
      filterLevel: 'Filtrer par niveau',
      filterStatus: 'Filtrer par statut',
      allLevels: 'Tous les niveaux',
      allStatus: 'Tous les statuts',
      active: 'Actif',
      inactive: 'Inactif',
      
      // Actions
      exportCSV: 'Exporter CSV',
      sendEmail: 'Envoyer email groupé',
      
      // Table headers
      student: 'Étudiant',
      level: 'Niveau',
      email: 'Email',
      missions: 'Missions',
      hours: 'Heures',
      status: 'Statut',
      lastActivity: 'Dernière activité',
      actions: 'Actions',
      
      // Actions menu
      viewProfile: 'Voir le profil',
      editStudent: 'Modifier',
      sendMessage: 'Envoyer un message',
      deactivate: 'Désactiver',
      delete: 'Supprimer',
      
      // Pagination
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
      deactivate: 'Deactivate',
      delete: 'Delete',
      
      showing: 'Showing',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
    },
  };

  const text = t[locale];

  // Données de test
  const students = [
    { 
      id: '1', 
      firstName: 'Jean', 
      lastName: 'Dupont', 
      email: 'jean.dupont@example.com', 
      level: 'Master 1', 
      missions: 8, 
      hours: 45, 
      status: 'active',
      lastActivity: 'Il y a 2h',
      avatar: 'JD',
      color: '#18534F'
    },
    { 
      id: '2', 
      firstName: 'Marie', 
      lastName: 'Leblanc', 
      email: 'marie.leblanc@example.com', 
      level: 'Licence 3', 
      missions: 12, 
      hours: 68, 
      status: 'active',
      lastActivity: 'Il y a 1j',
      avatar: 'ML',
      color: '#226D68'
    },
    { 
      id: '3', 
      firstName: 'Thomas', 
      lastName: 'Chen', 
      email: 'thomas.chen@example.com', 
      level: 'Licence 1', 
      missions: 3, 
      hours: 12, 
      status: 'active',
      lastActivity: 'Il y a 3h',
      avatar: 'TC',
      color: '#D6955B'
    },
    { 
      id: '4', 
      firstName: 'Sophie', 
      lastName: 'Martin', 
      email: 'sophie.martin@example.com', 
      level: 'Master 2', 
      missions: 15, 
      hours: 92, 
      status: 'active',
      lastActivity: 'Il y a 5h',
      avatar: 'SM',
      color: '#18534F'
    },
    { 
      id: '5', 
      firstName: 'Lucas', 
      lastName: 'Bernard', 
      email: 'lucas.bernard@example.com', 
      level: 'Licence 2', 
      missions: 6, 
      hours: 34, 
      status: 'active',
      lastActivity: 'Il y a 2j',
      avatar: 'LB',
      color: '#226D68'
    },
    { 
      id: '6', 
      firstName: 'Emma', 
      lastName: 'Dubois', 
      email: 'emma.dubois@example.com', 
      level: 'Master 1', 
      missions: 10, 
      hours: 58, 
      status: 'active',
      lastActivity: 'Il y a 4h',
      avatar: 'ED',
      color: '#D6955B'
    },
    { 
      id: '7', 
      firstName: 'Alexandre', 
      lastName: 'Moreau', 
      email: 'alex.moreau@example.com', 
      level: 'Licence 3', 
      missions: 2, 
      hours: 8, 
      status: 'inactive',
      lastActivity: 'Il y a 2 semaines',
      avatar: 'AM',
      color: '#999999'
    },
    { 
      id: '8', 
      firstName: 'Chloé', 
      lastName: 'Petit', 
      email: 'chloe.petit@example.com', 
      level: 'Master 2', 
      missions: 18, 
      hours: 110, 
      status: 'active',
      lastActivity: 'Il y a 1h',
      avatar: 'CP',
      color: '#18534F'
    },
  ];

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-[#18534F]" />
          {text.title}
        </h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <GraduationCap className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.totalStudents}</p>
          <p className="text-3xl font-bold text-gray-900">1,245</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <UserCheck className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.activeStudents}</p>
          <p className="text-3xl font-bold text-gray-900">892</p>
          <p className="text-xs text-gray-500 mt-1">71.6%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Award className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.avgMissions}</p>
          <p className="text-3xl font-bold text-gray-900">3.4</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-[#ECF8F6] rounded-lg">
              <Clock className="w-6 h-6 text-[#D6955B]" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{text.avgHours}</p>
          <p className="text-3xl font-bold text-gray-900">14.2h</p>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Barre de recherche */}
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

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={text.filterLevel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text.allLevels}</SelectItem>
                <SelectItem value="L1">Licence 1</SelectItem>
                <SelectItem value="L2">Licence 2</SelectItem>
                <SelectItem value="L3">Licence 3</SelectItem>
                <SelectItem value="M1">Master 1</SelectItem>
                <SelectItem value="M2">Master 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={text.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text.allStatus}</SelectItem>
                <SelectItem value="active">{text.active}</SelectItem>
                <SelectItem value="inactive">{text.inactive}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {text.exportCSV}
            </Button>

            <Button className="gap-2 bg-[#18534F] hover:bg-[#226D68]">
              <Mail className="w-4 h-4" />
              {text.sendEmail}
            </Button>
          </div>
        </div>
      </div>

      {/* Tableau des étudiants */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.student}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.level}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.email}
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.missions}
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.hours}
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.status}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.lastActivity}
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {text.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow 
                key={student.id} 
                onClick={() => router.push(`/dashboard-school/students/${student.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: student.color }}
                    >
                      {student.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className="bg-[#ECF8F6] text-[#18534F] hover:bg-[#ECF8F6] border-0">
                    {student.level}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">
                  {student.email}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-gray-900">{student.missions}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-gray-900">{student.hours}h</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex justify-center">
                    {student.status === 'active' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 gap-1">
                        <UserCheck className="w-3 h-3" />
                        {text.active}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 gap-1">
                        <UserX className="w-3 h-3" />
                        {text.inactive}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">
                  {student.lastActivity}
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
                          router.push(`/dashboard-school/students/${student.id}`);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          {text.viewProfile}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="w-4 h-4 mr-2" />
                          {text.editStudent}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-4 h-4 mr-2" />
                          {text.sendMessage}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {text.showing} 1-8 {text.of} 1,245 {text.results}
          </p>
          <div className="flex gap-2">
            <Button variant="outline">
              {text.previous}
            </Button>
            <Button className="bg-[#18534F] hover:bg-[#226D68]">
              {text.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
